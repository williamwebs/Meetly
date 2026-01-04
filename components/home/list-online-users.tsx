"use client";

import { Phone } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Avatar from "./avatar";
import { useSocket } from "@/context/socket-context";
import { useUser } from "@clerk/nextjs";

const ListOnlineUsers = () => {
  const { user } = useUser();
  const { onlineUsers, handleCall } = useSocket();

  if (onlineUsers?.length === 0) {
    return (
      <div className="text-white/70 text-center mt-8 border">
        No user is online
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
      {onlineUsers &&
        onlineUsers.map((onlineUser) => {
          if (onlineUser.profile.id === user?.id) return;

          return (
            <Card
              key={onlineUser.userId}
              className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition"
            >
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar src={onlineUser.profile.imageUrl} />
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-white">
                        {onlineUser.profile.fullName}
                      </p>
                      <span className="text-xs text-emerald-400 -mt-1 inline-block">
                        ● Online
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleCall(onlineUser)}
                  variant="outline"
                  className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};

export default ListOnlineUsers;
