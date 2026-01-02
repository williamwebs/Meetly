"use client";

import React from "react";
import { SocketContextProvider } from "@/context/socket-context";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  return <SocketContextProvider>{children}</SocketContextProvider>;
};

export default SocketProvider;
