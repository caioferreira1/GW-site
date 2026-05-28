"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { StepCard } from "./StepCard";

// ── Step 1: Typing terminal ───────────────────────────────────────────────────

function TypingVisual() {
  const PROMPT = "> What does your product do?";
  const ANSWER = "A receipt scanner for freelancers and small agencies";
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"wait" | "type" | "pause" | "clear">("wait");

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    let iv: ReturnType<typeof setInterval>;

    const cycle = () => {
      setPhase("wait");
      t = setTimeout(() => {
        setPhase("type");
        let i = 0;
        iv = setInterval(() => {
          i++;
          setText(ANSWER.slice(0, i));
          if (i >= ANSWER.length) {
            clearInterval(iv);
            setPhase("pause");
            t = setTimeout(() => {
              setPhase("clear");
              setText("");
              t = setTimeout(cycle, 500);
            }, 2800);
          }
        }, 52);
      }, 1000);
    };

    cycle();
    return () => {
      clearTimeout(t);
      clearInterval(iv);
    };
  }, []);

  const showCursor = phase === "wait" || phase === "type";

  return (
    <div className="w-full h-full flex items-center justify-center p-5">
      <div
        className="w-full rounded-xl p-4"
        style={{ background: "#111111", border: "1px solid #1e1e1e" }}
      >
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#2a2a2a" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#2a2a2a" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#2a2a2a" }} />
        </div>

        {/* Prompt */}
        <p className="font-mono text-[11px] mb-2.5" style={{ color: "#6a6a6a" }}>
          {PROMPT}
        </p>

        {/* Answer + cursor */}
        <p
          className="font-mono text-[12px] leading-relaxed"
          style={{ color: "#f0f0f0", minHeight: "36px" }}
        >
          {text}
          {showCursor && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
              className="inline-block w-[7px] h-[13px] ml-0.5 align-middle"
              style={{ background: "#e85d3a" }}
            />
          )}
        </p>
      </div>
    </div>
  );
}

// ── Step 2: Plan cards ────────────────────────────────────────────────────────

function PlanVisual() {
  const cards = [
    { label: "ChatGPT", tag: "get cited", accent: true },
    { label: "r/SaaS", tag: "promo ok · Tue", accent: false },
  ];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = () => {
      setVisible(true);
      t = setTimeout(off, 3600);
    };
    const off = () => {
      setVisible(false);
      t = setTimeout(on, 700);
    };
    t = setTimeout(on, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-5 py-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, x: -14 }}
          animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -14 }}
          transition={{
            duration: 0.42,
            delay: visible ? i * 0.16 : 0,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="w-full flex items-center justify-between rounded-xl px-4 py-3"
          style={{
            background: "#141414",
            border: `1px solid ${card.accent ? "#2e1810" : "#1e1e1e"}`,
          }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: card.accent ? "#e85d3a" : "#3a3a3a" }}
            />
            <span
              className="font-semibold text-[13px]"
              style={{ color: card.accent ? "#e85d3a" : "#f0f0f0" }}
            >
              {card.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px]" style={{ color: "#6a6a6a" }}>
              {card.tag}
            </span>
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{
                delay: visible ? i * 0.16 + 0.28 : 0,
                type: "spring",
                stiffness: 320,
                damping: 18,
              }}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: "#e85d3a" }}
            >
              ✓
            </motion.span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Step 3: Bar chart ─────────────────────────────────────────────────────────

function TrackVisual() {
  const VALUES = [30, 38, 46, 60, 50, 95, 0];
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [heights, setHeights] = useState(VALUES.map(() => 0));

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const show = () => {
      setHeights(VALUES);
      t = setTimeout(hide, 3000);
    };
    const hide = () => {
      setHeights(VALUES.map(() => 0));
      t = setTimeout(show, 600);
    };
    t = setTimeout(show, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center gap-3 px-5 py-5">
      <p className="font-mono text-[10px]" style={{ color: "#6a6a6a" }}>
        / visitors this week
      </p>
      <div className="flex items-end gap-1.5" style={{ height: "80px" }}>
        {VALUES.map((_, i) => (
          <div key={i} className="flex-1 flex items-end h-full">
            <div
              className="w-full rounded-t"
              style={{
                height: `${heights[i]}%`,
                background: i >= 5 ? "#e85d3a" : "#252525",
                transition: `height 0.7s cubic-bezier(0.34,1.2,0.64,1) ${i * 55}ms`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {DAYS.map((d, i) => (
          <span
            key={d}
            className="text-[9px] font-mono"
            style={{ color: i >= 5 ? "#e85d3a" : "#3a3a3a" }}
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function HowItWorks() {
  const steps = [
    {
      num: 1,
      badge: "Describe",
      title: "Tell us about your product.",
      description:
        "A few sentences. Who it's for, what it does, and what's working so far.",
      visual: <TypingVisual />,
    },
    {
      num: 2,
      badge: "Get the Plan",
      title: "Get your action plan.",
      description:
        "Which subreddits to post in and how to get ChatGPT to mention you. Step by step.",
      visual: <PlanVisual />,
    },
    {
      num: 3,
      badge: "Post + Track",
      title: "Post it. See the results.",
      description:
        "Watch your traffic, your karma, and when ChatGPT starts mentioning you.",
      visual: <TrackVisual />,
      highlighted: true,
    },
  ];

  return (
    <section
      className="w-full py-24 px-6"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16"
        >
          <p
            className="font-mono text-[11px] tracking-[0.18em] uppercase mb-4"
            style={{ color: "#e85d3a" }}
          >
            HOW IT WORKS
          </p>
          <h2
            className="font-bold"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              color: "#f0f0f0",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Three steps.{" "}
            <span style={{ color: "#444444", fontWeight: 300 }}>
              Then you grow.
            </span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <StepCard key={step.num} {...step} delay={i * 0.11} />
          ))}
        </div>
      </div>
    </section>
  );
}
