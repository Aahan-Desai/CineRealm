"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    emoji: "✍️",
    number: "01",
    label: "Create",
    title: "Write Like a Director",
    description:
      "Build movies scene by scene. Define every character, every moment, every emotion. Your screenplay — your rules.",
  },
  {
    emoji: "🎬",
    number: "02",
    label: "Publish",
    title: "Share With the World",
    description:
      "Publish in one click. Reach an audience of readers, fans, and fellow creators who live for great storytelling.",
  },
  {
    emoji: "🌍",
    number: "03",
    label: "Explore",
    title: "Discover New Worlds",
    description:
      "Browse an infinite feed of cinematic stories. Like, follow, and get lost in genres you've never experienced.",
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="features-section">
      <div className="features-header" ref={ref}>
        <motion.span
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          Platform Features
        </motion.span>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Everything a filmmaker needs.
          <br />
          <span className="gradient-text">Nothing they don&apos;t.</span>
        </motion.h2>
      </div>

      <div className="features-grid">
        {features.map((feature, i) => (
          <FeatureCard key={feature.number} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      className="feature-card"
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      <div className="feature-top">
        <span className="feature-number">{feature.number}</span>
        <span className="feature-emoji">{feature.emoji}</span>
      </div>
      <div className="feature-label">{feature.label}</div>
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-desc">{feature.description}</p>
      <div className="feature-line" />
    </motion.div>
  );
}
