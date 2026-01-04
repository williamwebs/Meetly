"use client";

import React from "react";
import { useSocket } from "@/context/socket-context";
import VideoContainer from "./video-container";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { MicIcon, MicOff, VideoIcon, VideoOff } from "lucide-react";

const VideoCall = () => {
  const { localStream, ongoingCall, peer, handleHangup, isCallEnded } =
    useSocket();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isMicOn, setIsMicOn] = React.useState<boolean>(false);
  const [isVidOn, setIsVidOn] = React.useState<boolean>(false);

  //   call timer
  const [elapsedSeconds, setElapsedSeconds] = React.useState<number>(0);
  const startTimeRef = React.useRef<number | null>(null);
  const intervalRef = React.useRef<number | null>(null);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  React.useEffect(() => {
    if (!peer) return;
    const hasRemoteStream = Boolean(peer && peer.stream);

    if (hasRemoteStream) {
      startTimeRef.current = Date.now();
      setElapsedSeconds(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        const start = startTimeRef.current || Date.now();
        setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (isCallEnded) {
        setElapsedSeconds(0);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [peer, isCallEnded]);

  React.useEffect(() => {
    if (localStream && ongoingCall) setIsOpen(true);

    setIsOpen(Boolean(localStream && ongoingCall));
  }, [localStream, ongoingCall]);

  React.useEffect(() => {
    if (isCallEnded) setIsOpen(false);
  }, [isCallEnded]);

  React.useEffect(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];
      setIsMicOn(audioTrack.enabled);
      setIsVidOn(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleCamera = React.useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVidOn(videoTrack.enabled);
    }
  }, [localStream]);

  const toggleMic = React.useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  }, [localStream]);

  const isOnCall = localStream && peer && ongoingCall ? true : false;

  if (isCallEnded)
    return <div className="text-center text-rose-500 mt-4">Call Ended</div>;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        className="bg-slate-900 border-white/10 text-white min-w-200"
      >
        <div className="relative">
          {localStream && (
            <VideoContainer
              stream={localStream}
              isLocalStream={true}
              isOnCall={isOnCall}
            />
          )}
          {peer && peer.stream && (
            <VideoContainer
              stream={peer.stream}
              isLocalStream={false}
              isOnCall={isOnCall}
            />
          )}

          {/* timer when there is a peer && peer.stream */}
          {peer && peer.stream && (
            <div className="px-4 py-0.5 border border-emerald-600 rounded-full min-w-20 bg-white/10 backdrop-blur text-emerald-500 absolute top-1 right-1 flex items-center justify-center">
             {formatTime(elapsedSeconds)}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center mt-4">
          <Button
            onClick={toggleMic}
            className="cursor-pointer h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black"
          >
            {isMicOn ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <MicIcon className="h-5 w-5" />
            )}
          </Button>
          <Button
            onClick={() => {
              handleHangup({
                ongoingCall: ongoingCall ? ongoingCall : undefined,
                isEmittingHangup: true,
              });
            }}
            className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 mx-4 cursor-pointer"
          >
            End call
          </Button>
          <Button
            onClick={toggleCamera}
            className="cursor-pointer h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black"
          >
            {isVidOn ? (
              <VideoOff className="h-5 w-5" />
            ) : (
              <VideoIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall;
