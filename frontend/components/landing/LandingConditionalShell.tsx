"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import StudioSidebar from "@/components/layout/StudioSidebar";

export default function LandingConditionalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    // Landing page: no Navbar/Sidebar — full bleed layout
    return <>{children}</>;
  }

  // App shell for authenticated routes
  return (
    <>
      <Navbar />
      <div className="flex">
        <StudioSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </>
  );
}
