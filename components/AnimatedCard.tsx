"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className = "", delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 280, damping: 22 } }}
      className={`relative rounded-[24px] overflow-hidden ${className}`}
      style={{
        background: "#111111",
        border: "1px solid #222222",
        boxShadow: "0 4px 32px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4)",
      }}
    >
      {/* Dot grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: "radial-gradient(circle, #f0f0f0 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      {/* Accent radial glow top */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(232,93,58,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
