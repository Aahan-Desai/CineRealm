import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import LandingConditionalShell from "@/components/landing/LandingConditionalShell";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "CineRealm — Direct Your Story",
  description:
    "CineRealm is the cinematic storytelling platform where you create movies, write scenes, define characters, and publish your world.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <LandingConditionalShell>{children}</LandingConditionalShell>
      </body>
    </html>
  );
}