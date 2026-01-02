import { Users } from "lucide-react";
import { Button } from "../ui/button";
import Container from "../layout/container";
import ListOnlineUsers from "./list-online-users";

const HeroSection = () => {
  return (
    <div>
      <Container>
        <div className="py-16">
          <div className="flex flex-col gap-8">
            {/* header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Instant video calls,{" "}
                  <span className="text-emerald-400">zero friction</span>
                </h1>
                <p className="mt-3 text-white/70 max-w-xl">
                  See who’s online and start a 1‑on‑1 or group video call
                  instantly.
                </p>
              </div>

              {/* make this into a component with the dialog which displays all online users and 
              the ability to make a group call */}
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-black flex items-center gap-2"
              >
                <Users className="h-5 w-5" />
                Start group call
              </Button>
            </header>

            {/* list online users */}
            <ListOnlineUsers />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HeroSection;
