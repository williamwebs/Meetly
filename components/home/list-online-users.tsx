"use client";

import { Phone } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Avatar from "./avatar";

const mockUsers = [
  {
    id: 0,
    name: "John Doe",
    firstName: "John",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    status: "online",
  },
  { id: 1, name: "Sarah Johnson", status: "online" },
  { id: 2, name: "David Kim", status: "online" },
  { id: 3, name: "Amina Bello", status: "online" },
  { id: 4, name: "Lucas Meyer", status: "online" },
];

const ListOnlineUsers = () => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
      {mockUsers.map((user) => (
        <Card
          key={user.id}
          className="bg-white/5 border-white/10 backdrop-blur hover:bg-white/10 transition"
        >
          <CardContent className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar />
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-white">{user.name}</p>
                  <span className="text-xs text-emerald-400 -mt-1 inline-block">
                    ● Online
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Call
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ListOnlineUsers;
