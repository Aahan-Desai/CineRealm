"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* Cinematic grain overlay */}
      <div className="hero-grain" />
      {/* Deep vignette */}
      <div className="hero-vignette" />

      {/* Background cinematic glow orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />

      <div className="hero-content">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-badge"
        >
          <span className="hero-badge-dot" />
          <span>The cinematic storytelling platform</span>
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="hero-title-wrap"
        >
          <h1 className="hero-title">
            <span className="hero-title-line">Direct Your</span>
            <span className="hero-title-gradient">Story.</span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.45 }}
          className="hero-tagline"
        >
          CineRealm is where imagination becomes cinema.
          <br />
          Write scenes. Define characters. Publish your world.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.65 }}
          className="hero-ctas"
        >
          <Link href="/signup" className="cta-primary">
            Start Creating
          </Link>
          <Link href="/feed" className="cta-secondary">
            Explore Stories
          </Link>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="hero-scroll-hint"
        >
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
          <span>Scroll to discover</span>
        </motion.div>
      </div>

      {/* Film strip bottom decoration */}
      <div className="film-strip">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="film-hole" />
        ))}
      </div>
    </section>
  );
}
