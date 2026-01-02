"use client";

import { FaUserCircle } from "react-icons/fa";

type Props = {
  src?: string;
};

const Avatar = ({ src }: Props) => {
  if (!src) return <FaUserCircle size={40} className="text-gray-400" />;
  return (
    <img
      src={src}
      alt="Avatar"
      className="w-10 h-10 rounded-full object-cover"
      referrerPolicy="no-referrer"
    />
  );
};

export default Avatar;
