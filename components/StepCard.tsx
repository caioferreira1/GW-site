"use client";

import { ReactNode } from "react";
import { AnimatedCard } from "./AnimatedCard";

interface StepCardProps {
  num: number;
  badge: string;
  title: string;
  description: string;
  visual: ReactNode;
  highlighted?: boolean;
  delay?: number;
}

export function StepCard({
  num,
  badge,
  title,
  description,
  visual,
  highlighted = false,
  delay = 0,
}: StepCardProps) {
  return (
    <AnimatedCard delay={delay} className="flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 text-white"
          style={{
            background: highlighted ? "#e85d3a" : "#1c1c1c",
            border: highlighted ? "none" : "1px solid #2a2a2a",
          }}
        >
          {num}
        </div>
        <span
          className="font-mono text-[10px] tracking-[0.16em] uppercase font-semibold"
          style={{ color: highlighted ? "#e85d3a" : "#6a6a6a" }}
        >
          {badge}
        </span>
      </div>

      {/* Visual slot */}
      <div
        className="mx-5 rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          background: "#0a0a0a",
          border: "1px solid #1c1c1c",
          aspectRatio: "4 / 3",
        }}
      >
        {visual}
      </div>

      {/* Text */}
      <div className="px-6 py-5">
        <h3
          className="font-bold text-[17px] leading-snug mb-2"
          style={{ color: "#f0f0f0", letterSpacing: "-0.02em" }}
        >
          {title}
        </h3>
        <p
          className="text-[13px]"
          style={{ color: "#6a6a6a", lineHeight: "1.65" }}
        >
          {description}
        </p>
      </div>
    </AnimatedCard>
  );
}
