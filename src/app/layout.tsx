import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import AuthSessionProvider from "@/components/AuthSessionProvider";
import { getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]/authOptions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify POC",
  description: "A proof of concept for the Spotify API",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <AuthSessionProvider session={session}>
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </AuthSessionProvider>
    </html>
  );
}
