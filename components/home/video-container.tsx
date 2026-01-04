"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface VideoContainerProps {
  stream: MediaStream | null;
  isLocalStream: boolean;
  isOnCall: boolean;
}

const VideoContainer = ({
  stream,
  isLocalStream,
  isOnCall,
}: VideoContainerProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      className={cn(
        "rounded border w-200",
        isLocalStream &&
          isOnCall &&
          "w-24 md:w-50 h-auto absolute border-purple-500 border-2"
      )}
      autoPlay
      playsInline
      muted={isLocalStream}
    />
  );
};

export default VideoContainer;
