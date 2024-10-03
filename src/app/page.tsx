"use client";

import { Button } from "@/components/ui/button";
import { SpotifyLogo } from "@/svgs/SpotifyLogo";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const session = useSession();
  const router = useRouter();

  if (session && session.data?.user) {
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-[90vh]">
      <Button
        className="rounded-full bg-white text-gray-700 hover:text-white gap-2 shadow-md border border-green-100 outline-none shadow-green-300"
        size="default"
        onClick={() => signIn("spotify")}
      >
        <SpotifyLogo />
        <h2 className="font-semibold text-base">Connect with Spotify</h2>
      </Button>
    </div>
  );
}
