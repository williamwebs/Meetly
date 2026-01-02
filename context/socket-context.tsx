"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { io, Socket } from "socket.io-client";
import { SocketUser } from "@/types";

interface ISocketContext {
  onlineUsers: SocketUser[] | null;
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
    if (!socket || !isConnected || !user) return;

    socket.emit("addNewUser", user);
    socket.on("getUsers", (response) => setOnlineUsers(response));
  }, [socket, isConnected, user]);

  return (
    <SocketContext.Provider
      value={{
        onlineUsers,
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
