"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";

const posters = [
  {
    src: "/poster-scifi.png",
    title: "Nebula Protocol",
    genre: "SCI-FI",
    year: "2024",
  },
  {
    src: "/poster-thriller.png",
    title: "City of Shadows",
    genre: "THRILLER",
    year: "2024",
  },
  {
    src: "/poster-fantasy.png",
    title: "Crown of Embers",
    genre: "FANTASY",
    year: "2024",
  },
];

function PosterCard({
  poster,
  index,
}: {
  poster: (typeof posters)[0];
  index: number;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const cardInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      className="poster-card"
      initial={{ opacity: 0, y: 60 }}
      animate={cardInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 1,
        delay: index * 0.18,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className="poster-img-wrap"
        style={{ y, scale }}
      >
        <Image
          src={poster.src}
          alt={poster.title}
          fill
          sizes="(max-width: 768px) 90vw, 30vw"
          className="poster-img"
          priority={index === 0}
        />
        {/* Gradient overlay */}
        <div className="poster-overlay" />
      </motion.div>

      {/* Info */}
      <div className="poster-info">
        <span className="poster-genre">{poster.genre}</span>
        <h3 className="poster-title">{poster.title}</h3>
        <span className="poster-year">{poster.year}</span>
      </div>
    </motion.div>
  );
}

export default function ShowcaseSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="showcase-section">
      <div className="showcase-header" ref={ref}>
        <motion.span
          className="section-label"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          Featured Stories
        </motion.span>
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Your vision,<br />
          <span className="gradient-text">on the big screen.</span>
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Explore the worlds that CineRealm creators have brought to life.
        </motion.p>
      </div>

      <div className="posters-grid">
        {posters.map((poster, i) => (
          <PosterCard key={poster.title} poster={poster} index={i} />
        ))}
      </div>
    </section>
  );
}
