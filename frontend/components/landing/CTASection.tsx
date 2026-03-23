"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="cta-section" ref={ref}>
      {/* Background orbs */}
      <div className="cta-orb cta-orb-1" />
      <div className="cta-orb cta-orb-2" />
      <div className="cta-grain" />

      <div className="cta-content">
        <motion.span
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          Join CineRealm
        </motion.span>

        <motion.h2
          className="cta-title"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Start creating<br />
          your movie.
        </motion.h2>

        <motion.p
          className="cta-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          You don&apos;t just write stories here.<br />
          You direct them.
        </motion.p>

        <motion.div
          className="cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/signup" className="cta-primary cta-primary-lg">
            Create Your First Movie
          </Link>
          <Link href="/login" className="cta-ghost">
            Sign In
          </Link>
        </motion.div>

        <motion.p
          className="cta-fine"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Free forever · No credit card required
        </motion.p>
      </div>
    </section>
  );
}
