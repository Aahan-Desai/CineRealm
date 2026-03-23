"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const lines = [
  "Every great movie",
  "starts with an idea.",
  "",
  "A single moment.",
  "A single character.",
  "A single choice.",
  "",
  "What's yours?",
];

export default function StorySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section className="story-section" ref={ref}>
      <div className="story-inner">
        <div className="story-lines">
          {lines.map((line, i) =>
            line === "" ? (
              <div key={i} className="story-gap" />
            ) : (
              <motion.p
                key={i}
                className="story-line"
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.12,
                }}
              >
                {line}
              </motion.p>
            )
          )}
        </div>

        <motion.div
          className="story-cue"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
        />
      </div>
    </section>
  );
}
