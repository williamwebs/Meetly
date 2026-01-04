"use client";

import React from "react";
import { useSocket } from "@/context/socket-context";
import VideoContainer from "./video-container";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { MicIcon, MicOff, VideoIcon, VideoOff } from "lucide-react";

const VideoCall = () => {
  const { localStream, ongoingCall, peer } = useSocket();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isMicOn, setIsMicOn] = React.useState<boolean>(false);
  const [isVidOn, setIsVidOn] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (localStream && ongoingCall) setIsOpen(true);
  }, [localStream, ongoingCall]);

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
          <Button className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 mx-4 cursor-pointer">
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
