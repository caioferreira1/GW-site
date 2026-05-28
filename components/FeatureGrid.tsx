"use client";

import { useEffect, useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedCard } from "./AnimatedCard";

// ── Shared card shell ─────────────────────────────────────────────────────────

function FeatureCard({
  title,
  description,
  visual,
  delay = 0,
}: {
  title: string;
  description: string;
  visual: ReactNode;
  delay?: number;
}) {
  return (
    <AnimatedCard delay={delay} className="flex flex-col">
      <div className="px-7 pt-7 pb-4">
        <h4
          className="font-bold text-[20px] leading-snug mb-2.5"
          style={{ color: "#f0f0f0", letterSpacing: "-0.025em" }}
        >
          {title}
        </h4>
        <p className="text-[14px] leading-relaxed" style={{ color: "#6a6a6a" }}>
          {description}
        </p>
      </div>
      <div
        className="mx-6 mb-6 rounded-2xl overflow-hidden flex-1 flex items-stretch"
        style={{
          background: "#0a0a0a",
          border: "1px solid #1c1c1c",
          minHeight: "230px",
        }}
      >
        {visual}
      </div>
    </AnimatedCard>
  );
}

// ── Card 1: GEO ───────────────────────────────────────────────────────────────

function GEOVisual() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const timings = [4200, 3200, 3200];
    let t: ReturnType<typeof setTimeout>;
    const tick = (p: 0 | 1 | 2) => {
      t = setTimeout(() => {
        const next = ((p + 1) % 3) as 0 | 1 | 2;
        setPhase(next);
        tick(next);
      }, timings[p]);
    };
    tick(0);
    return () => clearTimeout(t);
  }, []);

  const isTraffic = phase >= 1;
  const showBreakdown = phase === 2;

  const chartLine =
    "M8,80 C50,78 90,72 130,58 C165,46 200,26 255,8";
  const chartArea = chartLine + " L255,90 L8,90 Z";

  return (
    <div className="w-full flex flex-col gap-3 p-4">
      {/* Step pill */}
      <div className="flex justify-center">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "#111", border: "1px solid #222" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
            style={{ background: !isTraffic ? "#22c55e" : "#2a2a2a" }}
          />
          <span
            className="text-[10px] font-semibold transition-colors duration-300"
            style={{ color: !isTraffic ? "#f0f0f0" : "#3a3a3a" }}
          >
            1. Get cited
          </span>
          <span style={{ color: "#2a2a2a", fontSize: "10px", margin: "0 1px" }}>→</span>
          <span
            className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
            style={{ background: isTraffic ? "#e85d3a" : "#2a2a2a" }}
          />
          <span
            className="text-[10px] font-semibold transition-colors duration-300"
            style={{ color: isTraffic ? "#f0f0f0" : "#3a3a3a" }}
          >
            2. Get traffic
          </span>
        </div>
      </div>

      {/* Panels */}
      <div className="relative flex-1" style={{ minHeight: "170px" }}>
        {/* Panel 0: Chat window */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: phase === 0 ? 1 : 0 }}
          transition={{ duration: 0.55 }}
        >
          <div
            className="w-full h-full rounded-xl overflow-hidden flex flex-col"
            style={{ background: "#111", border: "1px solid #1e1e1e" }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ background: "#141414", borderBottom: "1px solid #1e1e1e" }}
            >
              <span className="text-[11px] font-semibold" style={{ color: "#f0f0f0" }}>
                ChatGPT
              </span>
              <span className="text-[10px] ml-auto" style={{ color: "#3a3a3a" }}>
                chat.openai.com
              </span>
            </div>
            <div className="p-3 flex flex-col gap-2.5">
              <div
                className="self-end text-[11px] px-3 py-1.5 rounded-xl"
                style={{ background: "#1a1a1a", color: "#888", maxWidth: "85%" }}
              >
                Best Reddit lead gen tool for SaaS?
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: "#d0d0d0" }}>
                Based on Reddit discussions, the top pick is{" "}
                <span
                  className="font-bold"
                  style={{
                    color: "#e85d3a",
                    textDecoration: "underline",
                    textDecorationColor: "rgba(232,93,58,0.35)",
                  }}
                >
                  GroundWave
                </span>{" "}
                — founders in r/SaaS consistently recommend it.
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {["r/SaaS", "r/Entrepreneur", "r/startups"].map((s) => (
                  <span
                    key={s}
                    className="text-[9px] px-1.5 py-0.5 rounded"
                    style={{ background: "#1a1a1a", color: "#6a6a6a" }}
                  >
                    🔴 {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Panel 1+2: Traffic chart */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isTraffic ? 1 : 0 }}
          transition={{ duration: 0.55 }}
        >
          <div
            className="w-full h-full rounded-xl p-3 flex flex-col gap-2"
            style={{ background: "#111", border: "1px solid #1e1e1e" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
                <span className="text-[11px] font-semibold" style={{ color: "#f0f0f0" }}>
                  Traffic from LLMs
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[16px] font-bold" style={{ color: "#f0f0f0" }}>
                  2,847
                </span>
                <span className="text-[10px] font-bold" style={{ color: "#22c55e" }}>
                  ↗ +312%
                </span>
              </div>
            </div>
            <div className="flex-1 pt-1">
              <svg
                viewBox="0 0 263 90"
                style={{ width: "100%", display: "block", overflow: "visible" }}
              >
                <defs>
                  <linearGradient id="geoGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e85d3a" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#e85d3a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={chartArea} fill="url(#geoGrad2)" stroke="none" />
                <path
                  d={chartLine}
                  fill="none"
                  stroke="#e85d3a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <motion.div
              animate={{ opacity: showBreakdown ? 1 : 0, y: showBreakdown ? 0 : 4 }}
              transition={{ duration: 0.4 }}
              className="flex gap-3 text-[9px] font-semibold"
            >
              <span style={{ color: "#10a37f" }}>● ChatGPT 62%</span>
              <span style={{ color: "#e85d3a" }}>● Claude 23%</span>
              <span style={{ color: "#8b5cf6" }}>● Perplexity 15%</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Card 2: Subreddits ────────────────────────────────────────────────────────

function SubredditsVisual() {
  const posts = [
    { sub: "r/startups", text: "Looking for a CRM recommendation" },
    { sub: "r/SaaS", text: "Any alternatives to HubSpot?" },
    { sub: "r/marketing", text: "Best way to generate B2B leads?" },
    { sub: "r/Entrepreneur", text: "How do you find your first 100 users?" },
  ];

  const [visible, setVisible] = useState(0);
  const [matched, setMatched] = useState<Set<number>>(new Set());

  useEffect(() => {
    let mounted = true;
    const sleep = (ms: number) =>
      new Promise<void>((res) => setTimeout(res, ms));

    const run = async () => {
      while (mounted) {
        setVisible(0);
        setMatched(new Set());
        await sleep(500);
        for (let i = 0; i < posts.length; i++) {
          if (!mounted) return;
          setVisible(i + 1);
          await sleep(380);
          if (!mounted) return;
          setMatched((m) => new Set([...m, i]));
          await sleep(540);
        }
        await sleep(2000);
      }
    };

    run();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="w-full flex flex-col gap-2 p-4 justify-center">
      {posts.map((post, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={i < visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-center justify-between rounded-xl px-3 py-2.5"
          style={{ background: "#111", border: "1px solid #1e1e1e" }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className="text-[10px] font-bold flex-shrink-0"
              style={{ color: "#e85d3a" }}
            >
              {post.sub}
            </span>
            <span
              className="text-[10px] truncate"
              style={{ color: "#6a6a6a" }}
            >
              {post.text}
            </span>
          </div>
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={
              matched.has(i)
                ? { scale: 1, opacity: 1 }
                : { scale: 0, opacity: 0 }
            }
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="flex-shrink-0 ml-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(34,197,94,0.1)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            ✓ Match
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

// ── Card 3: Posts ─────────────────────────────────────────────────────────────

function PostsVisual() {
  const RESPONSE =
    "I had the same problem. Stopped pitching and started genuinely helping in threads. GroundWave helped me map the right subreddits — went from 0 to 100 customers in 6 months, all organic.";

  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"idle" | "typing" | "done">("idle");

  useEffect(() => {
    let mounted = true;
    const sleep = (ms: number) =>
      new Promise<void>((res) => setTimeout(res, ms));

    const run = async () => {
      while (mounted) {
        await sleep(700);
        if (!mounted) return;
        setPhase("typing");
        for (let i = 1; i <= RESPONSE.length; i++) {
          if (!mounted) return;
          setText(RESPONSE.slice(0, i));
          await sleep(26);
        }
        if (!mounted) return;
        setPhase("done");
        await sleep(2800);
        if (!mounted) return;
        setPhase("idle");
        setText("");
        await sleep(400);
      }
    };

    run();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="w-full flex flex-col gap-3 p-4">
      {/* Question */}
      <div
        className="rounded-xl p-3"
        style={{ background: "#111", border: "1px solid #1e1e1e" }}
      >
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[10px] font-bold" style={{ color: "#e85d3a" }}>
            r/SaaS
          </span>
          <span className="text-[9px]" style={{ color: "#3a3a3a" }}>
            · u/founderjourney
          </span>
        </div>
        <p className="text-[11px] font-semibold" style={{ color: "#f0f0f0" }}>
          How do you find paying customers without ads?
        </p>
      </div>

      {/* Response */}
      <div
        className="rounded-xl p-3 flex-1 relative overflow-hidden"
        style={{ background: "#0d140a", border: "1px solid #1a2612" }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <span
            className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
            style={{ background: phase === "typing" ? "#e85d3a" : "#2a2a2a" }}
          />
          <span className="text-[10px] font-mono" style={{ color: "#6a6a6a" }}>
            {phase === "done"
              ? "Ready to Post"
              : phase === "typing"
              ? "Writing..."
              : "Waiting"}
          </span>
        </div>
        <p
          className="text-[10px] leading-relaxed"
          style={{ color: "#aaa", minHeight: "60px" }}
        >
          {text}
          {phase === "typing" && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="inline-block w-[5px] h-[11px] ml-0.5 align-middle"
              style={{ background: "#e85d3a" }}
            />
          )}
        </p>
        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{ background: "#e85d3a", color: "#fff" }}
          >
            ✓ Ready to Post
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Card 4: Command ───────────────────────────────────────────────────────────

function CommandVisual() {
  const events = [
    "Found 14 opportunities",
    "Generated 8 comments",
    "Published 3 responses",
    "12 new visitors",
  ];

  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    let mounted = true;
    const sleep = (ms: number) =>
      new Promise<void>((res) => setTimeout(res, ms));

    const run = async () => {
      while (mounted) {
        setChecked(new Set());
        setShowBadge(false);
        await sleep(400);
        for (let i = 0; i < events.length; i++) {
          await sleep(680);
          if (!mounted) return;
          setChecked((c) => new Set([...c, i]));
        }
        await sleep(500);
        if (!mounted) return;
        setShowBadge(true);
        await sleep(2600);
      }
    };

    run();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="w-full flex flex-col justify-center gap-3 p-5">
      {events.map((ev, i) => (
        <div key={i} className="flex items-center gap-3">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{
              background: checked.has(i) ? "#e85d3a" : "#181818",
              border: checked.has(i) ? "none" : "1px solid #2a2a2a",
            }}
          >
            {checked.has(i) && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 18 }}
                className="text-white text-[10px] font-bold leading-none"
              >
                ✓
              </motion.span>
            )}
          </div>
          <span
            className="text-[12px] transition-colors duration-300"
            style={{ color: checked.has(i) ? "#f0f0f0" : "#3a3a3a" }}
          >
            {ev}
          </span>
        </div>
      ))}

      <motion.div
        initial={false}
        animate={showBadge ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mt-1 flex items-center gap-2 rounded-xl px-4 py-3"
        style={{ background: "#180e08", border: "1px solid #2e1a0e" }}
      >
        <span className="text-[14px] font-bold" style={{ color: "#e85d3a" }}>
          ↗ +28% visibility
        </span>
        <span className="text-[11px]" style={{ color: "#6a6a6a" }}>
          this week
        </span>
      </motion.div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function FeatureGrid() {
  const features = [
    {
      title: "Get Cited by ChatGPT, Claude & Perplexity",
      description:
        "Turn your website into a source AI assistants recommend. We get you into the threads LLMs trust.",
      visual: <GEOVisual />,
    },
    {
      title: "We Find the Right Subreddits and Posts For You",
      description:
        "Discover high-intent conversations where your audience is already asking for solutions.",
      visual: <SubredditsVisual />,
    },
    {
      title: "Posts and Comments Written For You",
      description:
        "Get contextual Reddit responses crafted to help, not spam. Review and post in one click.",
      visual: <PostsVisual />,
    },
    {
      title: "Your Daily Marketing Command Center",
      description:
        "Everything you need to execute your Reddit strategy in one place — no guesswork.",
      visual: <CommandVisual />,
    },
  ];

  return (
    <section
      className="w-full py-24 px-6"
      style={{ background: "#0a0a0a", borderTop: "1px solid #161616" }}
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
          <h2
            className="font-bold mx-auto"
            style={{
              fontSize: "clamp(28px, 4vw, 46px)",
              color: "#f0f0f0",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              maxWidth: "620px",
            }}
          >
            Everything you need to grow through{" "}
            <span style={{ color: "#e85d3a" }}>Reddit</span> and AI search.
          </h2>
        </motion.div>

        {/* 2×2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 0.09} />
          ))}
        </div>
      </div>
    </section>
  );
}
