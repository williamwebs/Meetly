"use client";

import { cn } from "@/lib/utils";
import { FaUserCircle } from "react-icons/fa";

type Props = {
  src?: string;
  isOnCall?: boolean;
};

const Avatar = ({ src, isOnCall }: Props) => {
  if (!src)
    return (
      <FaUserCircle
        size={40}
        className={cn(
          "text-gray-400 rounded-full",
          isOnCall ? "border-2 border-emerald-500 breathe-emerald" : ""
        )}
      />
    );
  return (
    <img
      src={src}
      alt="Avatar"
      className={cn(
        "w-10 h-10 rounded-full object-cover",
        isOnCall ? "border-2 border-emerald-500 breathe-emerald" : ""
      )}
      referrerPolicy="no-referrer"
    />
  );
};

export default Avatar;
