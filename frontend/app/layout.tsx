import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}