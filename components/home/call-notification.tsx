"use client";

import React from "react";
import { useSocket } from "@/context/socket-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Phone, PhoneOff } from "lucide-react";

const CallNotification = () => {
  const { ongoingCall, handleJoinCall, handleHangup } = useSocket();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const startRingtone = React.useCallback(() => {
    if (!ongoingCall || !ongoingCall.isRinging) return;

    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/ringtone.mp3");
      audioRef.current.loop = true;
    }

    // navigator.vibrate([200, 100, 200]);

    audioRef.current
      .play()
      .catch((error) => console.error("Ringtone play blocked:", error));
  }, [ongoingCall]);

  const stopRingtone = React.useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  React.useEffect(() => {
    if (ongoingCall?.isRinging) {
      startRingtone();
      setIsOpen(true);
    } else {
      stopRingtone();
      setIsOpen(false);
    }

    return () => {
      stopRingtone();
    };
  }, [ongoingCall, startRingtone, stopRingtone]);

  React.useEffect(() => {
    const unlock = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio("/sounds/ringtone.mp3");
        audioRef.current.loop = true;
      }
      audioRef.current.play().catch(() => {});
      document.removeEventListener("click", unlock);
    };
    document.addEventListener("click", unlock, { once: true });
    return () => document.removeEventListener("click", unlock);
  }, []);

  if (!ongoingCall?.isRinging) return;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        className="bg-slate-900 border-white/10 text-white max-w-sm"
      >
        <DialogHeader>
          <DialogTitle>Incoming call</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-6">
          <img
            src={ongoingCall.participants.caller.profile.imageUrl}
            alt={
              ongoingCall.participants.caller.profile.fullName?.split(" ")[0]
            }
            className="h-20 w-20 rounded-full border border-white/20"
          />
          <div className="text-center">
            <p className="text-lg font-semibold">
              {ongoingCall.participants.caller.profile.fullName}
            </p>
            <p className="text-sm text-white/60">is calling you…</p>
          </div>

          <div className="flex gap-6 mt-4">
            <Button
              onClick={() => handleJoinCall(ongoingCall)}
              className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black"
            >
              <Phone className="h-5 w-5" />
            </Button>

            <Button
              onClick={() => {
                stopRingtone();
                handleHangup({
                  ongoingCall: ongoingCall ? ongoingCall : undefined,
                  isEmittingHangup: true,
                });
                setIsOpen(false);
              }}
              className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 text-white"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallNotification;
