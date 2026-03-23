"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 40));
  }, [scrollY]);

  return (
    <motion.nav
      className={`landing-nav ${scrolled ? "landing-nav-scrolled" : ""}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Link href="/" className="nav-logo">
        CineRealm
      </Link>

      <div className="nav-actions">
        <Link href="/feed" className="nav-link-ghost">
          Explore
        </Link>
        <Link href="/login" className="nav-link-ghost">
          Sign In
        </Link>
        <Link href="/signup" className="nav-btn-primary">
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
}
