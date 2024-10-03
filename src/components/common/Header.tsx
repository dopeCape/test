"use client";

import { SpotifyLogo } from "@/svgs/SpotifyLogo";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

const Header = () => {
  const session = useSession() as any;
  return (
    <nav
      className={`flex items-center ${
        session.data?.user ? "justify-between" : "justify-center"
      } px-4 py-5 border-b border-gray-300`}
    >
      <div className="flex items-center gap-4">
        {session.data?.user && <SpotifyLogo />}
        <h1 className="font-semibold text-xl font-mono text-gray-700">
          {session.data?.user ? "Spotify POC" : "Welcome to Spotify POC"}
        </h1>
      </div>
      {session.data?.user && (
        <div className="flex items-center gap-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={session.data?.user?.image} alt="User Image" />
            <AvatarFallback>{session.data?.user?.name[0]}</AvatarFallback>
          </Avatar>

          <HoverCard>
            <HoverCardTrigger className="hover:underline underline-offset-4 text-gray-700 font-medium">
              {session.data?.user?.name}
            </HoverCardTrigger>
            <HoverCardContent
              className="flex flex-col gap-2 mt-2"
              align="center"
            >
              <p className="text-xs font-medium font-mono">
                Email: {session.data?.user?.email}
              </p>
            </HoverCardContent>
          </HoverCard>

          <Button
            size="default"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-full bg-white text-gray-700 font-medium hover:text-white gap-2 shadow-md border border-green-100 outline-none shadow-green-300"
          >
            Sign out
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Header;
