"use client";

import { Video } from "lucide-react";
import Container from "./container";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

const NavBar = () => {
  const { userId } = useAuth();

  return (
    <div className="sticky left-0 top-0 w-full py-1 z-10 bg-slate-900/10 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between gap-4 py-3 border-b border-white/10">
          <Link href={"/"} className="flex items-center gap-1.5">
            <Video size={28} className="text-emerald-400" />
            <span className="text-xl font-semibold font-mono">Meetly</span>
          </Link>

          <UserButton />

          {/* sign-in and sign-up buttons */}
          {!userId && (
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" className="cursor-pointer">
                <Link href={"/sign-in"}>Sign in</Link>
              </Button>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-black cursor-pointer"
                asChild
              >
                <Link href={"/sign-up"}>Sign in</Link>
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default NavBar;
