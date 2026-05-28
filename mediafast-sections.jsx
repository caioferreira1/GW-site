import { useState, useEffect, useRef } from "react";

// ─── Three Steps Section ───────────────────────────────────────────────────────

function StepDescribe() {
  const [text, setText] = useState("");
  const full = "A receipt scanner for freelancers a";
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setText(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(iv);
    }, 60);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="step-mockup">
      <div className="mockup-card">
        <p className="mockup-label">&gt; what does your product do?</p>
        <p className="mockup-typing">
          {text}
          <span className="cursor" />
        </p>
      </div>
    </div>
  );
}

function StepGetPlan() {
  const items = [
    { label: "ChatGPT", tag: "get cited", accent: true },
    { label: "r/SaaS", tag: "promo ok · Tue", accent: false },
    { label: "r/Entrepreneur", tag: "stories only", accent: false },
  ];
  return (
    <div className="step-mockup">
      <div className="plan-list">
        {items.map((it, i) => (
          <div
            key={it.label}
            className="plan-row"
            style={{ animationDelay: `${i * 0.18}s` }}
          >
            <span className={`plan-name ${it.accent ? "orange" : ""}`}>
              {it.label}
            </span>
            <span className="plan-tag">{it.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepTrack() {
  const bars = [30, 38, 46, 60, 50, 95, 0];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [heights, setHeights] = useState(bars.map(() => 0));

  useEffect(() => {
    const t = setTimeout(() => setHeights(bars), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="step-mockup">
      <div className="chart-wrap">
        <p className="mockup-label">/ visitors this week</p>
        <div className="bars-row">
          {bars.map((h, i) => (
            <div key={i} className="bar-col">
              <div
                className={`bar ${i >= 5 ? "bar-orange" : "bar-gray"}`}
                style={{ height: `${heights[i]}%` }}
              />
            </div>
          ))}
        </div>
        <div className="bar-labels">
          {days.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThreeSteps() {
  const steps = [
    {
      num: 1,
      badge: "DESCRIBE",
      title: "Tell us about your product.",
      desc: "A few sentences. Who it's for, what it does, what's working so far.",
      component: <StepDescribe />,
    },
    {
      num: 2,
      badge: "GET THE PLAN",
      title: "Get your action plan.",
      desc: "Which subreddits to post in, and how to get ChatGPT to mention you. Step by step.",
      component: <StepGetPlan />,
    },
    {
      num: 3,
      badge: "POST + TRACK",
      title: "Post it. See the results.",
      desc: "Watch your traffic, your karma, and when ChatGPT starts mentioning you.",
      component: <StepTrack />,
      highlight: true,
    },
  ];

  return (
    <section className="section steps-section">
      <p className="section-eyebrow">HOW IT WORKS</p>
      <h2 className="section-title">Three steps. Then you grow.</h2>
      <div className="steps-grid">
        {steps.map((s) => (
          <div key={s.num} className="step-col">
            <div className="step-header">
              <div className={`step-num ${s.highlight ? "step-num-orange" : ""}`}>
                {s.num}
              </div>
              <span className={`step-badge ${s.highlight ? "badge-orange" : ""}`}>
                {s.badge}
              </span>
            </div>
            {s.component}
            <div className="step-text">
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Features Section ──────────────────────────────────────────────────────────

function GEOCard() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const durations = [3500, 2800, 2800];
    let timer;
    function schedule(p) {
      timer = setTimeout(() => {
        const next = (p + 1) % 3;
        setPhase(next);
        schedule(next);
      }, durations[p]);
    }
    schedule(0);
    return () => clearTimeout(timer);
  }, []);

  const isTraffic = phase >= 1;
  const isDetailed = phase === 2;
  const words = ["Based ","on ","real ","Reddit ","discussions, ","the ","top ","pick ","is "];
  const chartLine = "M10,78 C40,77 70,76 100,73 C130,70 150,60 180,45 C210,30 235,14 260,8";
  const chartArea = chartLine + " L260,88 L10,88 Z";
  const pts = [[10,78],[49,76],[88,74],[127,68],[167,52],[210,22],[260,8]];

  return (
    <div className="feat-card">
      <div className="feat-body">
        <h4 className="feat-title">Get Cited by ChatGPT, Claude & Perplexity</h4>
        <p className="feat-desc">
          Reddit is what AI tools read to answer questions. We give you a step-by-step
          plan to get cited in the threads LLMs trust, so when someone asks "what's the
          best tool for X?",{" "}
          <strong className="feat-strong">your product is the answer</strong>.
        </p>
      </div>
      <div className="feat-visual geo-visual">
        {/* Step indicator */}
        <div className="geo-steps">
          <div className={`geo-step${!isTraffic ? " active" : ""}`}>
            <span className="geo-dot geo-dot-cited" />
            <span className="geo-step-label">1. Get cited</span>
          </div>
          <span className="geo-arrow">→</span>
          <div className={`geo-step${isTraffic ? " active" : ""}`}>
            <span className="geo-dot geo-dot-traffic" />
            <span className="geo-step-label">2. Get traffic</span>
          </div>
        </div>

        {/* Animated panels */}
        <div className="geo-panels">
          {/* Panel 0 — ChatGPT chat window */}
          <div className={`geo-panel${phase === 0 ? " geo-panel-show" : ""}`}>
            <div className="chat-window">
              <div className="chat-bar">
                <div className="chat-dots">
                  <span style={{background:"#ff5f57"}}/>
                  <span style={{background:"#febc2e"}}/>
                  <span style={{background:"#28c840"}}/>
                </div>
                <span className="chat-app">ChatGPT</span>
                <span className="chat-url">chat.openai.com</span>
              </div>
              <div className="chat-body">
                <div className="chat-question">what's the best reddit marketing app for SaaS?</div>
                <div className="chat-answer">
                  <span className="chat-text">
                    {words.map((w, i) => (
                      <span key={i} className="fade-word" style={{animationDelay:`${i*0.08}s`}}>{w}</span>
                    ))}
                    <span className="highlight-word fade-word" style={{animationDelay:"0.8s"}}>MediaFast </span>
                    <span className="fade-word" style={{animationDelay:"0.9s"}}>— founders in r/SaaS and r/Entrepreneur consistently recommend it.</span>
                  </span>
                  <div className="chat-sources">
                    <span className="source-label">Sources</span>
                    {["r/SaaS","r/Entrepreneur","r/startups"].map(s => (
                      <span key={s} className="source-chip">🔴 {s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 1+2 — Traffic line chart */}
          <div className={`geo-panel${isTraffic ? " geo-panel-show" : ""}`}>
            <div className="traffic-card">
              <div className="tc-header">
                <div className="tc-left">
                  <span className="tc-live-dot" />
                  <span className="tc-label">Traffic from LLMs</span>
                </div>
                <div className="tc-right">
                  <span className="tc-num">2,847</span>
                  <span className="tc-pct">↗ +312%</span>
                  <span className="tc-period">last 7 days</span>
                </div>
              </div>

              <div className="tc-chart-wrap">
                <svg viewBox="0 0 275 88" style={{width:"100%",overflow:"visible",display:"block"}}>
                  <defs>
                    <linearGradient id="geoAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.18"/>
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.01"/>
                    </linearGradient>
                  </defs>
                  <path d={chartArea} fill="url(#geoAreaGrad)" stroke="none"/>
                  <path d={chartLine} fill="none" stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  {pts.map(([x,y],i) => (
                    <circle key={i} cx={x} cy={y} r={i===pts.length-1?4:2.5} fill="white" stroke="#f97316" strokeWidth="1.5"/>
                  ))}
                  {/* Today tooltip */}
                  <g>
                    <rect x="176" y="-44" width="76" height="40" rx="6" fill="white" stroke="#e8e8e8" strokeWidth="0.8"/>
                    <rect x="180" y="-39" width="14" height="14" rx="3" fill="#10a37f"/>
                    <text x="187" y="-29" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">G</text>
                    <text x="198" y="-34" fontSize="6.5" fill="#888">TODAY</text>
                    <text x="198" y="-23" fontSize="9" fontWeight="bold" fill="#111">+847 visits</text>
                    <text x="198" y="-12" fontSize="6.5" fill="#888">from ChatGPT</text>
                    <line x1="252" y1="-4" x2="260" y2="7" stroke="#d0d0d0" strokeWidth="0.8"/>
                  </g>
                </svg>
                <div className="tc-days">
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Today"].map(d => (
                    <span key={d} className={d==="Today"?"tc-day-today":""}>{d}</span>
                  ))}
                </div>
              </div>

              <div className={`tc-llm-badge${isDetailed?" tc-llm-badge-show":""}`}>
                ↗ +47 LLM mentions this month
              </div>
              <div className={`tc-breakdown${isDetailed?" tc-breakdown-show":""}`}>
                <span style={{color:"#10a37f"}}>● ChatGPT 62%</span>
                <span style={{color:"#c96442"}}>● Claude 23%</span>
                <span style={{color:"#6366f1"}}>● Perplexity 15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubredditsCard() {
  const subs = [
    { name: "r/SaaS", members: "1.2M" },
    { name: "r/Entrepreneur", members: "4.0M" },
    { name: "r/startups", members: "1.8M" },
  ];
  const threads = [
    { sub: "r/SaaS", votes: 247, text: '"What tools do you use for marketing?"' },
    { sub: "r/Entrepreneur", votes: 184, text: '"How do you find your first 100 users?"' },
  ];
  const [active, setActive] = useState(null);

  return (
    <div className="feat-card">
      <div className="feat-body">
        <h4 className="feat-title">We Find the Right Subreddits and Posts For You</h4>
        <p className="feat-desc">
          We pick the top subreddits where your customers actually hang out, plus the
          exact posts you should comment under. Based on real engagement data, not guesses.
        </p>
      </div>
      <div className="feat-visual">
        <div className="sub-list">
          {subs.map((s, i) => (
            <div
              key={s.name}
              className="sub-row"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="sub-left">
                <span className="sub-icon">🔴</span>
                <span className="sub-name">{s.name}</span>
                <span className="sub-members">{s.members}</span>
              </div>
              <div className="sub-check">✓</div>
            </div>
          ))}
          {threads.map((t, i) => (
            <div
              key={t.text}
              className="thread-row"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              style={{ animationDelay: `${0.4 + i * 0.15}s` }}
            >
              <div className="thread-meta">
                <span className="thread-sub">{t.sub}</span>
                <span className="thread-votes">↑ {t.votes}</span>
              </div>
              <span className="thread-text">{t.text}</span>
              <button className={`reply-btn ${active === i ? "reply-hover" : ""}`}>
                💬 Reply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PostsCard() {
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGenerated(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="feat-card">
      <div className="feat-body">
        <h4 className="feat-title">Posts and Comments Written for You</h4>
        <p className="feat-desc">
          Generate ready-to-post Reddit content with one click. Review, tweak, and hit
          post. Writer's block is history.
        </p>
      </div>
      <div className="feat-visual">
        <div className={`post-mockup ${generated ? "generated" : ""}`}>
          <div className="post-header">
            <span className="post-badge">🔴 r/SaaS</span>
            {generated && <span className="post-done">✓ Generated</span>}
          </div>
          <div className="post-title-text">
            How I went from 0 to 100 customers in 6 months
          </div>
          <div className="post-lines">
            <div className="post-line">Hey r/SaaS! Quick story for anyone struggling.</div>
            <div className="post-line">6 months ago: zero users, no audience, no clue.</div>
            <div className="post-line">Stopped pitching, started genuinely helping in threads.</div>
            <div className="post-line post-bold">
              Now: 100 paying customers, all from organic Reddit.
            </div>
          </div>
          <div className="post-actions">
            <button className="btn-regen">✦ Regenerate</button>
            <button className="btn-post">Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommandCard() {
  const days = ["Mon", "Tue", "Today", "Thu", "Fri"];
  const done = [true, false, false, false, false];
  const [completed, setCompleted] = useState([true, false, false, false, false]);

  useEffect(() => {
    const timers = days.map((_, i) =>
      setTimeout(() => {
        setCompleted((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * 600 + 400)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="feat-card">
      <div className="feat-body">
        <h4 className="feat-title">Your Daily Marketing Command Center</h4>
        <p className="feat-desc">
          Add your product, get a personalized playbook. Wake up to a clear plan with
          where to post, what to post, and when.{" "}
          <strong className="feat-strong">No AI slop</strong>, built on real strategies
          from founders who scaled on Reddit and AI search.
        </p>
      </div>
      <div className="feat-visual command-visual">
        <div className="command-card-inner">
          <div className="task-pill">
            <span className="task-time">⏰ Today · 2pm</span>
            <span className="task-badge-icp">best ICP fit</span>
          </div>
          <div className="task-desc">Comment on 3 threads</div>
          <div className="task-sub">in r/Entrepreneur · ~15 min</div>
        </div>
        <div className="day-track">
          {days.map((d, i) => (
            <div key={d} className="day-col">
              <div className={`day-dot ${completed[i] ? (i === 2 ? "day-dot-today" : "day-dot-done") : "day-dot-empty"}`}>
                {completed[i] && i !== 2 && <span>✓</span>}
              </div>
              <span className={`day-label ${i === 2 ? "day-today" : ""}`}>{d}</span>
            </div>
          ))}
        </div>
        <div className="live-badge">
          <span className="live-dot" />
          <span className="live-text">+12 live from r/SaaS post</span>
        </div>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="section features-section">
      <div className="features-intro">
        <p className="section-eyebrow-dark">YOU'VE BUILT SOMETHING GREAT.</p>
        <h2 className="section-title">Now it's time to market it.</h2>
        <p className="features-sub">
          Every day you wait, your competitors get the customers, the reviews, and the
          ChatGPT mentions that should be yours.
        </p>
      </div>
      <div className="features-grid">
        <GEOCard />
        <SubredditsCard />
        <PostsCard />
        <CommandCard />
      </div>
    </section>
  );
}

// ─── Root Export ───────────────────────────────────────────────────────────────

export default function MediaFastSections() {
  return (
    <>
      <style>{`
        /* ── Base ── */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #111; }

        .section { width: 100%; max-width: 1100px; margin: 0 auto; padding: 80px 24px; }

        /* ── Eyebrows & Titles ── */
        .section-eyebrow { font-family: monospace; font-size: 12px; letter-spacing: 0.15em; color: #888; text-transform: uppercase; text-align: center; margin-bottom: 12px; }
        .section-title { font-size: clamp(32px, 5vw, 52px); font-weight: 900; text-align: center; line-height: 1.1; margin-bottom: 48px; color: #111; }
        .section-eyebrow-dark { font-family: monospace; font-size: 12px; letter-spacing: 0.15em; color: #888; text-transform: uppercase; text-align: center; margin-bottom: 8px; }

        /* ── Steps Section ── */
        .steps-section .section-title { margin-bottom: 56px; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        @media (max-width: 768px) { .steps-grid { grid-template-columns: 1fr; } }

        .step-col { display: flex; flex-direction: column; gap: 16px; }
        .step-header { display: flex; align-items: center; gap: 12px; }
        .step-num { width: 36px; height: 36px; border-radius: 50%; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .step-num-orange { background: #f97316; }
        .step-badge { font-family: monospace; font-size: 11px; letter-spacing: 0.12em; color: #888; text-transform: uppercase; }
        .badge-orange { color: #f97316; }

        /* Step Mockup Container */
        .step-mockup { background: #f4f4f4; border-radius: 16px; padding: 24px; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .mockup-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 14px 16px; width: 100%; font-family: monospace; }
        .mockup-label { font-size: 12px; color: #999; margin-bottom: 6px; }
        .mockup-typing { font-size: 13px; color: #222; display: flex; align-items: center; }
        .cursor { display: inline-block; width: 7px; height: 14px; background: #f97316; margin-left: 2px; animation: blink 1s step-end infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* Plan rows */
        .plan-list { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .plan-row { background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; animation: slideIn 0.4s ease both; }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .plan-name { font-size: 12px; font-weight: 700; color: #111; }
        .plan-name.orange { color: #f97316; }
        .plan-tag { font-size: 11px; color: #888; }

        /* Chart bars */
        .chart-wrap { width: 100%; }
        .bars-row { display: flex; align-items: flex-end; gap: 6px; height: 100px; margin: 12px 0 6px; }
        .bar-col { flex: 1; display: flex; align-items: flex-end; height: 100%; }
        .bar { width: 100%; border-radius: 4px 4px 0 0; transition: height 0.6s cubic-bezier(0.34,1.56,0.64,1); }
        .bar-gray { background: #d1d5db; }
        .bar-orange { background: #f97316; }
        .bar-labels { display: flex; justify-content: space-between; }
        .bar-labels span { font-size: 10px; color: #aaa; font-family: monospace; }

        /* Step text */
        .step-text { }
        .step-title { font-size: 18px; font-weight: 800; color: #111; margin-bottom: 4px; }
        .step-desc { font-size: 14px; color: #666; line-height: 1.5; }

        /* ── Features Section ── */
        .features-section { padding: 80px 24px 40px; }
        .features-intro { text-align: center; margin-bottom: 40px; }
        .features-sub { font-size: 16px; color: #666; max-width: 580px; margin: 0 auto; }
        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        @media (max-width: 768px) { .features-grid { grid-template-columns: 1fr; } }

        /* Feature Cards */
        .feat-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; }
        .feat-body { padding: 28px 28px 20px; }
        .feat-title { font-size: 20px; font-weight: 800; color: #111; margin-bottom: 10px; line-height: 1.3; }
        .feat-desc { font-size: 14px; color: #666; line-height: 1.6; }
        .feat-strong { font-weight: 700; color: #111; }
        .feat-visual { background: #f9fafb; border-top: 1px solid #f0f0f0; padding: 20px; flex: 1; display: flex; align-items: center; justify-content: center; min-height: 220px; overflow: hidden; }

        /* GEO Card */
        .geo-visual { flex-direction: column; align-items: stretch; gap: 10px; }
        .geo-steps { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #e5e5e5; border-radius: 999px; padding: 6px 14px; width: fit-content; margin: 0 auto; }
        .geo-step { display: flex; align-items: center; gap: 4px; }
        .geo-dot { width: 8px; height: 8px; border-radius: 50%; background: #d1d5db; transition: background 0.5s ease; }
        .geo-dot-cited {}
        .geo-step.active .geo-dot-cited { background: #22c55e; }
        .geo-dot-traffic {}
        .geo-step.active .geo-dot-traffic { background: #f97316; }
        .geo-step-label { font-size: 10px; font-weight: 700; color: #888; transition: color 0.3s ease; }
        .geo-step.active .geo-step-label { color: #111; }
        .geo-arrow { font-size: 10px; color: #ccc; }

        /* GEO panels */
        .geo-panels { position: relative; width: 100%; flex: 1; min-height: 188px; }
        .geo-panel { position: absolute; inset: 0; opacity: 0; transition: opacity 0.7s ease; pointer-events: none; }
        .geo-panel-show { opacity: 1; pointer-events: auto; }

        /* Traffic card */
        .traffic-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 10px 12px 8px; width: 100%; display: flex; flex-direction: column; gap: 4px; }
        .tc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
        .tc-left { display: flex; align-items: center; gap: 5px; }
        .tc-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; }
        .tc-label { font-size: 11px; font-weight: 600; color: #333; }
        .tc-right { display: flex; align-items: baseline; gap: 5px; }
        .tc-num { font-size: 18px; font-weight: 800; color: #111; }
        .tc-pct { font-size: 10px; font-weight: 700; color: #22c55e; }
        .tc-period { font-size: 10px; color: #aaa; }
        .tc-chart-wrap { padding-top: 46px; }
        .tc-days { display: flex; justify-content: space-between; margin-top: 2px; }
        .tc-days span { font-size: 9px; color: #aaa; }
        .tc-days .tc-day-today { color: #f97316; font-weight: 700; }
        .tc-llm-badge { align-self: flex-start; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 999px; padding: 3px 10px; font-size: 9.5px; font-weight: 700; color: #ea580c; opacity: 0; transform: translateY(5px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .tc-llm-badge-show { opacity: 1; transform: translateY(0); }
        .tc-breakdown { display: flex; gap: 8px; justify-content: flex-end; opacity: 0; transform: translateY(3px); transition: opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s; }
        .tc-breakdown-show { opacity: 1; transform: translateY(0); }
        .tc-breakdown span { font-size: 9px; font-weight: 600; }

        .chat-window { background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden; width: 100%; }
        .chat-bar { background: #f9fafb; border-bottom: 1px solid #f0f0f0; padding: 6px 12px; display: flex; align-items: center; gap: 8px; }
        .chat-dots { display: flex; gap: 4px; }
        .chat-dots span { width: 8px; height: 8px; border-radius: 50%; background: #e5e5e5; }
        .chat-app { font-size: 11px; font-weight: 700; color: #111; }
        .chat-url { font-size: 10px; color: #aaa; margin-left: auto; }
        .chat-body { padding: 10px 12px; }
        .chat-question { background: #f3f4f6; border-radius: 12px 12px 4px 12px; padding: 8px 12px; font-size: 11px; color: #333; margin-bottom: 8px; width: fit-content; margin-left: auto; }
        .chat-answer { font-size: 11px; line-height: 1.6; color: #333; }
        .chat-text { display: block; margin-bottom: 8px; }
        .fade-word { opacity: 0; animation: fadeIn 0.3s ease forwards; }
        @keyframes fadeIn { to{opacity:1} }
        .highlight-word { font-weight: 700; text-decoration: underline; text-decoration-color: #fb923c; text-decoration-thickness: 2px; text-underline-offset: 2px; }
        .chat-sources { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .source-label { font-size: 10px; color: #aaa; }
        .source-chip { font-size: 10px; background: #f3f4f6; border-radius: 6px; padding: 2px 6px; color: #555; }

        /* Subreddits Card */
        .sub-list { display: flex; flex-direction: column; gap: 6px; width: 100%; }
        .sub-row { background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; animation: slideIn 0.4s ease both; }
        .sub-left { display: flex; align-items: center; gap: 6px; }
        .sub-icon { font-size: 12px; }
        .sub-name { font-size: 12px; font-weight: 700; color: #111; }
        .sub-members { font-size: 10px; color: #aaa; }
        .sub-check { width: 18px; height: 18px; border-radius: 50%; background: #22c55e; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; }
        .thread-row { background: #fff; border: 1px solid #fed7aa; border-radius: 10px; padding: 8px 12px; display: flex; align-items: center; gap: 8px; cursor: pointer; animation: slideIn 0.4s ease both; transition: background 0.2s; }
        .thread-row:hover { background: #fff7ed; }
        .thread-meta { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }
        .thread-sub { font-size: 10px; font-weight: 700; color: #f97316; }
        .thread-votes { font-size: 10px; color: #aaa; }
        .thread-text { font-size: 10px; color: #555; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .reply-btn { background: #f97316; color: #fff; border: none; border-radius: 999px; padding: 4px 10px; font-size: 10px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: transform 0.15s; flex-shrink: 0; }
        .reply-btn:hover, .reply-hover { transform: scale(1.05); }

        /* Posts Card */
        .post-mockup { background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 14px 16px; width: 100%; transition: box-shadow 0.3s; }
        .post-mockup.generated { box-shadow: 0 0 0 2px #22c55e; }
        .post-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .post-badge { background: #fff1ee; color: #f97316; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
        .post-done { font-size: 11px; color: #22c55e; font-weight: 600; }
        .post-title-text { font-size: 13px; font-weight: 800; color: #111; margin-bottom: 8px; line-height: 1.3; }
        .post-lines { display: flex; flex-direction: column; gap: 2px; margin-bottom: 10px; }
        .post-line { font-size: 10px; color: #666; }
        .post-bold { font-weight: 700; color: #111; }
        .post-actions { display: flex; gap: 8px; }
        .btn-regen { flex: 1; background: #f97316; color: #fff; border: none; border-radius: 8px; padding: 8px; font-size: 11px; font-weight: 700; cursor: pointer; }
        .btn-post { background: #111; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-size: 11px; font-weight: 700; cursor: pointer; }

        /* Command Card */
        .command-visual { flex-direction: column; align-items: stretch; gap: 12px; }
        .command-card-inner { background: #fff; border: 2px solid #fb923c; border-radius: 12px; padding: 12px 16px; }
        .task-pill { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .task-time { font-size: 11px; font-weight: 700; color: #f97316; }
        .task-badge-icp { background: #fff7ed; color: #f97316; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px; }
        .task-desc { font-size: 13px; font-weight: 800; color: #111; }
        .task-sub { font-size: 11px; color: #888; }
        .day-track { display: flex; justify-content: space-around; align-items: center; }
        .day-col { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .day-dot { width: 28px; height: 28px; border-radius: 50%; background: #e5e7eb; display: flex; align-items: center; justify-content: center; font-size: 12px; transition: background 0.4s, transform 0.3s; }
        .day-dot-done { background: #22c55e; color: #fff; transform: scale(1.1); }
        .day-dot-today { background: #e5e7eb; }
        .day-label { font-size: 10px; color: #aaa; }
        .day-today { color: #f97316; font-weight: 700; }
        .live-badge { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 6px 12px; display: flex; align-items: center; gap: 8px; }
        .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; animation: pulse 1.5s ease infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        .live-text { font-size: 11px; font-weight: 700; color: #16a34a; }
      `}</style>

      <ThreeSteps />
      <FeaturesSection />
    </>
  );
}
