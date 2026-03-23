"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    step: "01",
    icon: "✍️",
    title: "Create",
    description: "Give your movie a name, a logline, and a genre. Start adding scenes and characters.",
  },
  {
    step: "02",
    icon: "🎞",
    title: "Publish",
    description: "When your story is ready, hit publish. Your film goes live instantly for the world to see.",
  },
  {
    step: "03",
    icon: "✨",
    title: "Engage",
    description: "Readers like, comment, and follow. Build your audience. Build your filmography.",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="how-section">
      <div className="how-header" ref={ref}>
        <motion.span
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          How It Works
        </motion.span>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Three steps to<br />
          <span className="gradient-text">your premiere.</span>
        </motion.h2>
      </div>

      <div className="how-steps">
        {steps.map((step, i) => (
          <HowStep key={step.step} step={step} index={i} total={steps.length} />
        ))}
      </div>
    </section>
  );
}

function HowStep({
  step,
  index,
  total,
}: {
  step: (typeof steps)[0];
  index: number;
  total: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div className="how-step-wrap">
      <motion.div
        ref={ref}
        className="how-step"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 1,
          delay: index * 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="how-step-icon">{step.icon}</div>
        <div className="how-step-number">{step.step}</div>
        <h3 className="how-step-title">{step.title}</h3>
        <p className="how-step-desc">{step.description}</p>
      </motion.div>

      {index < total - 1 && (
        <motion.div
          className="how-connector"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{
            duration: 0.8,
            delay: index * 0.2 + 0.5,
            ease: "easeOut",
          }}
        />
      )}
    </div>
  );
}
