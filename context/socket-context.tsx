"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { io, Socket } from "socket.io-client";
import { OngoingCall, Participants, PeerData, SocketUser } from "@/types";
import Peer, { SignalData } from "simple-peer";

interface ISocketContext {
  onlineUsers: SocketUser[] | null;
  ongoingCall: OngoingCall | null;
  localStream: MediaStream | null;
  handleCall: (user: SocketUser) => void;
  handleJoinCall: (ongoingCall: OngoingCall) => void;
  peer: PeerData | null;
  handleHangup: (data: {
    ongoingCall?: OngoingCall | null;
    isEmittingHangup?: boolean;
  }) => void;
  isCallEnded: boolean;
}

export const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = React.useState<SocketUser[] | null>(
    null
  );
  const [ongoingCall, setOngoingCall] = React.useState<OngoingCall | null>(
    null
  );
  const [localStream, setLocalStream] = React.useState<MediaStream | null>(
    null
  );
  const [peer, setPeer] = React.useState<PeerData | null>(null);
  const [isCallEnded, setIsCallEnded] = React.useState<boolean>(false);

  //   current user
  const currentSocketUser = onlineUsers?.find(
    (onlineUser) => onlineUser.userId === user?.id
  );

  //   get media stream
  const getMediaStream = React.useCallback(
    async (faceMode?: string) => {
      if (localStream) return;

      try {
        // get device
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        // get stream
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 360, ideal: 720, max: 1080 },
            frameRate: { min: 16, ideal: 30, max: 30 },
            facingMode: videoDevices.length > 0 ? faceMode : undefined,
          },
        });

        //   set local stream
        setLocalStream(stream);
        return stream;
      } catch (error) {
        console.error("Error getting stream");
        setLocalStream(null);
        return null;
      }
    },
    [localStream]
  );

  //    handlecall
  const handleCall = React.useCallback(
    async (user: SocketUser) => {
      setIsCallEnded(false);
      if (!socket || !currentSocketUser) return;

      // get media stream
      const stream = await getMediaStream();

      if (!stream) return;
      // get participants - caller & receiver
      const participants = {
        caller: currentSocketUser,
        receiver: user,
      };
      // set ongoing call state
      console.log("[CONTEXT]: starting ongoing call from caller");
      setOngoingCall({
        participants,
        isRinging: false, // since the current user is the caller
      });
      // emit call event passing the participants
      socket.emit("call", participants);
    },
    [socket, currentSocketUser, ongoingCall]
  );

  //   handle incoming call
  const onIncomingCall = React.useCallback(
    (participants: Participants) => {
      setOngoingCall({
        participants,
        isRinging: true,
      });
    },
    [socket, user, ongoingCall]
  );

  const createPeer = React.useCallback(
    (stream: MediaStream, initiator: boolean) => {
      // configure ice server
      const iceServers: RTCIceServer[] = [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
          ],
        },
      ];

      // create peer using simple-peer library
      const peer = new Peer({
        stream,
        initiator,
        trickle: true,
        config: { iceServers },
      });
      // emit stream event & setPeer state in peer.on("stream",(()=> {}))
      peer.on("stream", (stream) => {
        setPeer((prevPeer) => (prevPeer ? { ...prevPeer, stream } : prevPeer));
      });
      // listen for errors and close events ==> peer.on("error", console.error)
      peer.on("error", console.error);
      peer.on("close", () => {
        // hangup call ==>> handleHangUp
      });
      // create rtcpeerconnection
      const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;
      rtcPeerConnection.onconnectionstatechange = async () => {
        if (
          rtcPeerConnection.iceConnectionState === "disconnected" ||
          rtcPeerConnection.iceConnectionState === "failed"
        ) {
          // hang up
        }
      };
      // return peer
      return peer;
    },
    [ongoingCall, setPeer]
  );

  //   handle join call
  const handleJoinCall = React.useCallback(
    async (ongoingCall: OngoingCall) => {
      setIsCallEnded(false);
      // set isRinging to false
      setOngoingCall((prev) => (prev ? { ...prev, isRinging: false } : prev));
      // get localStream of the receiver
      const stream = await getMediaStream();
      // if !stream, hangup call
      if (!stream) {
        console.log("Could not get stream in handleJoinCall");
        handleHangup({
          ongoingCall: ongoingCall ? ongoingCall : undefined,
          isEmittingHangup: true,
        });
        return;
      }
      // create peer
      const newPeer = createPeer(stream, true);
      setPeer({
        peerConnection: newPeer,
        participantUser: ongoingCall.participants.caller,
        stream: undefined!,
      });
      // listen to signal from peer and send it to caller via socket - emit signal
      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall,
            isCaller: false,
          });
        }
      });
    },
    [socket, currentSocketUser]
  );

  //   handle hangup call
  const handleHangup = React.useCallback(
    (data: { ongoingCall?: OngoingCall | null; isEmittingHangup?: boolean }) => {
      if (socket && user && data?.ongoingCall && data?.isEmittingHangup) {
        socket.emit("hangup", {
          ongoingCall: data.ongoingCall,
          userHangingupId: user.id,
        });
      }

      setOngoingCall(null);
      setPeer(null);

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }

      setIsCallEnded(true);
    },
    [socket, user, localStream]
  );

  const completePeerConnection = React.useCallback(
    async (connectionData: {
      sdp: SignalData;
      ongoingCall: OngoingCall;
      isCaller: boolean;
    }) => {
      if (!localStream) return;

      if (peer) {
        peer.peerConnection.signal(connectionData.sdp);
        return;
      }

      // if no peer, create a peer
      const newPeer = createPeer(localStream, true);
      setPeer({
        peerConnection: newPeer,
        participantUser: connectionData.ongoingCall.participants.receiver,
        stream: undefined!,
      });

      newPeer.on("signal", async (data: SignalData) => {
        if (socket) {
          socket.emit("webrtcSignal", {
            sdp: data,
            ongoingCall,
            isCaller: true,
          });
        }
      });
    },
    [localStream, ongoingCall, peer, createPeer]
  );

  React.useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    // clean up function
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  React.useEffect(() => {
    if (!socket || socket === null) return;

    if (socket.connected) onConnect();

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    // event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // clean up function
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  React.useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("addNewUser", user);
    socket.on("getUsers", (response) => setOnlineUsers(response));

     // cleanup function
    return () => {
      socket.off("getUsers", (res) => {
        setOnlineUsers(res);
      });
    };
  }, [socket, isConnected, user]);

  //   call events
  React.useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("incomingCall", onIncomingCall);
    socket.on("webrtcSignal", completePeerConnection);
    socket.on("hangup", handleHangup);

    return () => {
      socket.off("incomingCall", onIncomingCall);
      socket.off("webrtcSignal", completePeerConnection);
      socket.off("hangup", handleHangup);
    };
  }, [socket, isConnected, user, onIncomingCall, completePeerConnection]);

  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isCallEnded) {
      timeout = setTimeout(() => {
        setIsCallEnded(false);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [isCallEnded]);

  return (
    <SocketContext.Provider
      value={{
        onlineUsers,
        ongoingCall,
        localStream,
        handleCall,
        handleJoinCall,
        peer,
        handleHangup, 
        isCallEnded
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = React.useContext(SocketContext);

  if (!context || context === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};