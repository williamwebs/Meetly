import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import SocketProvider from "@/providers/socket-provider";

const inter = Inter({ subsets: ["latin"] });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meetly",
  description:
    "Meetly is an instant video calling platform that lets you start 1-on-1 or group video calls with zero friction. See who’s online and connect in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} ${geistMono.variable} antialiased`}
        >
          <SocketProvider>
            <main className="flex flex-col min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-white relative">
              <NavBar />
              {children}
            </main>
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
