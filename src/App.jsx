import { useState, useEffect, useRef } from "react";

/* ── TYPING HOOK ── */
function useTyping(words, speed = 75, pause = 1800) {
  const [text, setText] = useState("");
  const [wIdx, setWIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = words[wIdx];
    const t = setTimeout(() => {
      if (!del) {
        setText(cur.slice(0, cIdx + 1));
        if (cIdx + 1 === cur.length) setTimeout(() => setDel(true), pause);
        else setCIdx(c => c + 1);
      } else {
        setText(cur.slice(0, cIdx - 1));
        if (cIdx - 1 === 0) { setDel(false); setWIdx(w => (w + 1) % words.length); setCIdx(0); }
        else setCIdx(c => c - 1);
      }
    }, del ? 38 : speed);
    return () => clearTimeout(t);
  }, [cIdx, del, wIdx, words, speed, pause]);
  return text;
}

/* ── INVIEW HOOK ── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, vis];
}

/* ── PARTICLE CANVAS ── */
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let id;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 75 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.2 + .3, o: Math.random() * .4 + .1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,179,237,${p.o})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 115) {
          ctx.beginPath(); ctx.strokeStyle = `rgba(99,179,237,${.1 * (1 - d / 115)})`;
          ctx.lineWidth = .5; ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: .65 }} />;
}

/* ── SKILLS with devicon logos ── */
const SKILLS = [
  {
    cat: "Languages", color: "#f59e0b",
    items: [
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    ],
  },
  {
    cat: "Frontend", color: "#3b82f6",
    items: [
      { name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
      { name: "Bootstrap", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
      { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
    ],
  },
  {
    cat: "Backend", color: "#10b981",
    items: [
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
      { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
    ],
  },
  {
    cat: "Database", color: "#8b5cf6",
    items: [
      { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
    ],
  },
  {
    cat: "Tools", color: "#ec4899",
    items: [
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
      { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
      { name: "Postman", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
      { name: "Cloudinary", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudinary/cloudinary-original.svg" },
    ],
  },
];

/* ── PROJECTS (6) with images ── */
const PROJECTS = [
  {
    title: "PixGram", sub: "Instagram Clone",
    desc: "Full-featured social media with Cloudinary image uploads, real-time feed, likes, comments, follow system & JWT auth.",
    tags: ["React", "Node.js", "MongoDB", "Cloudinary", "JWT"],
    color: "#e1306c", grad: "linear-gradient(135deg,#e1306c,#833ab4)", icon: "📸", num: "01",
    gh: "https://github.com/amitsgupta11", demo: "https://github.com/amitsgupta11",
    img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80",
  },
  {
    title: "TradeDesk", sub: "Zerodha Clone",
    desc: "Stock trading platform with live price simulation, portfolio tracker, order book, P&L dashboard & WebSocket data.",
    tags: ["React", "Express", "MongoDB", "Chart.js", "WebSocket"],
    color: "#0ea5e9", grad: "linear-gradient(135deg,#0ea5e9,#6366f1)", icon: "📈", num: "02",
    gh: "https://github.com/amitsgupta11", demo: "https://github.com/amitsgupta11",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
  },
  {
    title: "SafeSpeak", sub: "Abusive Word Detector",
    desc: "NLP-powered content moderation using OpenAI API to detect & classify toxic language in real-time with analytics.",
    tags: ["Python", "Django", "OpenAI API", "NLP", "React"],
    color: "#f59e0b", grad: "linear-gradient(135deg,#f59e0b,#ef4444)", icon: "🛡", num: "03",
    gh: "https://github.com/amitsgupta11", demo: "https://github.com/amitsgupta11",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
  },
  {
    title: "ChatFlow", sub: "Real-Time Chat App",
    desc: "WhatsApp-style messaging with Socket.io, group rooms, online presence indicators, message history & emoji support.",
    tags: ["React", "Socket.io", "Node.js", "MongoDB", "JWT"],
    color: "#10b981", grad: "linear-gradient(135deg,#10b981,#0ea5e9)", icon: "💬", num: "04",
    gh: "https://github.com/amitsgupta11", demo: "https://github.com/amitsgupta11",
    img: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600&q=80",
  },
  {
    title: "ShopNest", sub: "E-Commerce Website",
    desc: "Full-stack e-commerce platform with product catalog, cart, Stripe payments, admin dashboard & order management.",
    tags: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
    color: "#a78bfa", grad: "linear-gradient(135deg,#a78bfa,#ec4899)", icon: "🛒", num: "05",
    gh: "https://github.com/amitsgupta11", demo: "https://github.com/amitsgupta11",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
  },
  {
    title: "SkyWatch", sub: "Weather App",
    desc: "Real-time weather dashboard using OpenWeatherMap API with 7-day forecast, location search, charts & dark mode.",
    tags: ["React", "OpenWeather API", "Chart.js", "Geolocation"],
    color: "#38bdf8", grad: "linear-gradient(135deg,#38bdf8,#34d399)", icon: "🌤", num: "06",
    gh: "https://github.com/amitsgupta11", demo: "https://github.com/amitsgupta11",
    img: "wather-img.png",
  },
];

/* ── SECTION LABEL ── */
function SLabel({ children }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ width: 28, height: 1, background: "linear-gradient(90deg,transparent,#63b3ed)", display: "inline-block" }} />
      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: "#63b3ed", letterSpacing: ".12em", textTransform: "uppercase" }}>{children}</span>
      <span style={{ width: 28, height: 1, background: "linear-gradient(270deg,transparent,#63b3ed)", display: "inline-block" }} />
    </div>
  );
}

/* ── NAVBAR ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const btnBase = { background: "none", border: "none", color: "rgba(255,255,255,.62)", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "8px 14px", borderRadius: 8, transition: "all .2s", letterSpacing: ".02em" };
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: "0 5%", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(4,6,20,.92)" : "transparent", backdropFilter: scrolled ? "blur(24px)" : "none", borderBottom: scrolled ? "1px solid rgba(99,179,237,.1)" : "none", transition: "all .5s ease" }}>
      <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}>
        <span style={{ background: "linear-gradient(135deg,#63b3ed,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Amit</span>
        <span style={{ color: "rgba(255,255,255,.2)", fontSize: 17 }}>/</span>
        <span style={{ color: "rgba(255,255,255,.4)", fontSize: 13, fontWeight: 500, letterSpacing: ".06em" }}>dev</span>
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {["About", "Skills", "Projects", "Education", "Contact"].map(l => (
          <button key={l} style={btnBase} onClick={() => go(l.toLowerCase())}
            onMouseEnter={e => { e.target.style.color = "#fff"; e.target.style.background = "rgba(255,255,255,.07)"; }}
            onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,.62)"; e.target.style.background = "none"; }}
          >{l}</button>
        ))}
        {/* <a href="mailto:amitsgupta18@gmail.com" style={{ marginLeft: 10, background: "linear-gradient(135deg,#2b6cb0,#6d28d9)", color: "#fff", padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 20px rgba(109,40,217,.32)", transition: "all .2s", display: "inline-block" }}
          onMouseEnter={e => { e.target.style.opacity = ".88"; e.target.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; }}
        >Hire Me ✦</a> */}
      </div>
    </nav>
  );
}

/* ── HERO (SPLIT LAYOUT WITH PHOTO) ── */
function Hero() {
  const typed = useTyping(["Full Stack Developer", "MERN Stack Engineer", "Django Developer", "Problem Solver"]);
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 5% 40px", position: "relative", overflow: "hidden" }}>
      {/* Ambient glows */}
      {[
        { top: "5%", left: "-5%", w: 520, h: 520, c: "rgba(49,130,206,.14)", blur: 100 },
        { bottom: "10%", right: "-5%", w: 420, h: 420, c: "rgba(109,40,217,.11)", blur: 90 },
        { top: "55%", left: "40%", w: 320, h: 320, c: "rgba(244,114,182,.07)", blur: 80 },
      ].map((g, i) => (
        <div key={i} style={{ position: "absolute", borderRadius: "50%", pointerEvents: "none", width: g.w, height: g.h, top: g.top, left: g.left, right: g.right, bottom: g.bottom, background: `radial-gradient(circle,${g.c} 0%,transparent 70%)`, filter: `blur(${g.blur}px)` }} />
      ))}

      {/* Content: Left text + Right photo */}
      <div style={{ maxWidth: 1140, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 420px", gap: 60, alignItems: "center", position: "relative", zIndex: 1 }}>

        {/* LEFT */}
        <div>
          {/* Status badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(16,185,129,.08)", border: "1px solid rgba(16,185,129,.25)", borderRadius: 100, padding: "7px 18px", marginBottom: 28, fontSize: 11, color: "#6ee7b7", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", animation: "fadeUp .6s ease both" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981", display: "inline-block", animation: "glow 2s infinite" }} />
            Open to Opportunities
          </div>

          {/* Name */}
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(42px,6vw,76px)", lineHeight: 1.06, letterSpacing: "-.03em", margin: "0 0 8px", animation: "fadeUp .6s .1s ease both" }}>
            <span style={{ color: "#fff" }}>Amit </span>
            <span style={{ background: "linear-gradient(135deg,#63b3ed 0%,#a78bfa 55%,#f472b6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Gupta</span>
          </h1>

          {/* Typed */}
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(16px,2.5vw,28px)", fontWeight: 600, color: "rgba(255,255,255,.7)", marginBottom: 22, minHeight: "1.5em", letterSpacing: "-.01em", animation: "fadeUp .6s .2s ease both" }}>
            <span style={{ color: "#63b3ed" }}>&lt;</span>
            {typed}
            <span style={{ display: "inline-block", width: 2, height: ".9em", background: "#a78bfa", marginLeft: 2, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
            <span style={{ color: "#63b3ed" }}> /&gt;</span>
          </div>

          {/* Tagline */}
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(14px,1.5vw,16px)", color: "rgba(255,255,255,.42)", maxWidth: 480, lineHeight: 1.85, marginBottom: 40, animation: "fadeUp .6s .3s ease both" }}>
            Building scalable web applications with <span style={{ color: "#63b3ed", fontWeight: 600 }}>MERN</span> &amp; <span style={{ color: "#a78bfa", fontWeight: 600 }}>Django</span>. Passionate about clean architecture, performance &amp; great UX.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 44, animation: "fadeUp .6s .4s ease both" }}>
            <button onClick={() => go("projects")} style={{ background: "linear-gradient(135deg,#2b6cb0,#6d28d9)", color: "#fff", border: "none", padding: "13px 26px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 6px 28px rgba(109,40,217,.35)", transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(109,40,217,.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(109,40,217,.35)"; }}
            >View Projects →</button>
            <a href="#" style={{ background: "rgba(255,255,255,.05)", color: "#fff", border: "1px solid rgba(255,255,255,.14)", padding: "13px 26px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans',sans-serif", display: "inline-flex", alignItems: "center", gap: 7, transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
            ><a href="AmitResume.pdf" class="btn" download>↓Download Resume</a> </a>
            <button onClick={() => go("contact")} style={{ background: "transparent", color: "#a78bfa", border: "1px solid rgba(167,139,250,.38)", padding: "13px 26px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .25s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(167,139,250,.09)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
            >Contact Me</button>
          </div>

          {/* Socials */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", animation: "fadeUp .6s .5s ease both" }}>
            {[
              { label: "GitHub", href: "https://github.com/amitsgupta11", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" /></svg> },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/amit-gupta-760a03299", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" /></svg> },
              { label: "Email", href: "mailto:amitsgupta18@gmail.com", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
            ].map(s => (
              <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : "_self"} rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,.42)", textDecoration: "none", fontSize: 13, fontWeight: 600, padding: "8px 13px", borderRadius: 10, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", transition: "all .2s", fontFamily: "'DM Sans',sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,.22)"; e.currentTarget.style.background = "rgba(255,255,255,.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.42)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; e.currentTarget.style.background = "rgba(255,255,255,.03)"; }}
              >{s.icon}{s.label}</a>
            ))}
          </div>
        </div>

        {/* RIGHT — Photo */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", animation: "fadeUp .6s .3s ease both" }}>
          <div style={{ position: "relative" }}>
            {/* Rotating gradient ring */}
            <div style={{ position: "absolute", inset: -3, borderRadius: 32, background: "linear-gradient(135deg,#63b3ed,#a78bfa,#f472b6,#63b3ed)", backgroundSize: "300% 300%", animation: "gradRing 4s linear infinite", zIndex: 0 }} />

            {/* Photo container */}
            <div style={{ width: 340, height: 380, borderRadius: 30, overflow: "hidden", position: "relative", zIndex: 1, background: "linear-gradient(160deg,rgba(49,130,206,.18),rgba(109,40,217,.12))", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              {/* Placeholder for photo — replace <img> tag with your actual photo */}
              {/* 
                TO ADD YOUR PHOTO:
                Replace the div below with: <img src="/your-photo.jpg" alt="Amit Gupta" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                Place your photo in the /public folder of your React project
              */}
              <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <div style={{ width: 110, height: 110, borderRadius: "50%", background: "linear-gradient(135deg,rgba(99,179,237,.3),rgba(167,139,250,.3))", border: "2px dashed rgba(99,179,237,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="rgba(99,179,237,0.6)"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(99,179,237,.7)", fontWeight: 600, margin: "0 0 4px" }}><img src="/photo.jpeg" alt="Amit Gupta" style={{width:"100%", height:"100%", objectFit:"cover", objectPosition:"top"}}  /></p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,.3)", margin: 0 }}>Replace with &lt;img src="/photo.jpg" /&gt;</p>
                </div>
              </div>
            </div>

            {/* Floating info cards */}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, color: "rgba(255,255,255,.18)", fontSize: 10, fontFamily: "'DM Sans',sans-serif", letterSpacing: ".15em", textTransform: "uppercase", zIndex: 2 }}>
        scroll
        <div style={{ width: 1, height: 38, background: "linear-gradient(to bottom,rgba(99,179,237,.5),transparent)", animation: "scrollPulse 2.2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

/* ── ABOUT ── */
function About() {
  const [ref, vis] = useInView();
  return (
    <section id="about" ref={ref} style={{ padding: "100px 5%", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(46px)", transition: "opacity .8s ease, transform .8s ease" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SLabel>About Me</SLabel>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,4vw,46px)", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-.025em" }}>The Person Behind the Code</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 60, alignItems: "center" }}>
          {/* Visual side — Photo */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <div style={{ position: "absolute", inset: -3, borderRadius: 30, background: "linear-gradient(135deg,#63b3ed,#a78bfa,#f472b6,#63b3ed)", backgroundSize: "300% 300%", animation: "gradRing 4s linear infinite", zIndex: 0 }} />
                <div style={{ width: 240, height: 270, borderRadius: 28, overflow: "hidden", position: "relative", zIndex: 1, background: "linear-gradient(160deg,rgba(49,130,206,.18),rgba(109,40,217,.12))", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
                  {/*
                    ADD YOUR PHOTO:
                    1. Put your photo in /public/photo.jpg
                    2. Replace this div with:
                    <img src="/photo.jpg" alt="Amit Gupta" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} />
                  */}
                   <img src="/photo.jpeg" alt="Amit Gupta" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(99,179,237,.5)", fontWeight: 500 }}>Add photo.jpg to /public</span>
                </div>
              </div>
              <div style={{ marginTop: 18 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", marginBottom: 8 }}>Amit Gupta</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(99,179,237,.1)", border: "1px solid rgba(99,179,237,.25)", borderRadius: 100, padding: "6px 16px", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#63b3ed", fontWeight: 600 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", display: "inline-block" }} />
                  Full Stack Developer
                </div>
              </div>
            </div>
          </div>
          {/* Text */}
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "rgba(255,255,255,.65)", lineHeight: 1.9, marginBottom: 20 }}>
              I'm a <span style={{ color: "#63b3ed", fontWeight: 700 }}>Full-Stack Developer</span> proficient in MERN stack and Django, with experience building production-level applications that solve real problems at scale.
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "rgba(255,255,255,.46)", lineHeight: 1.9, marginBottom: 32 }}>
              Strong foundation in <span style={{ color: "#a78bfa", fontWeight: 600 }}>DSA using Java</span>, passionate about clean code, scalable architecture, and beautiful user experiences. Pursuing B.Tech in Computer Science at BBDU, Lucknow.
            </p>
            {/* Quick facts */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "🎓", label: "B.Tech CS — BBDU, Lucknow" },
                { icon: "💼", label: "Open to Full-time & Freelance roles" },
                { icon: "📍", label: "Based in Lucknow, UP — Remote friendly" },
                { icon: "⚡", label: "Loves clean code & scalable systems" },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "rgba(255,255,255,.55)", fontWeight: 500 }}>
                  <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SKILLS ── */
function Skills() {
  const [ref, vis] = useInView();
  return (
    <section id="skills" ref={ref} style={{ padding: "100px 5%", position: "relative", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(46px)", transition: "opacity .8s ease, transform .8s ease" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.018)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SLabel>Tech Arsenal</SLabel>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,4vw,46px)", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-.025em" }}>Skills & Technologies</h2>
        </div>
        {SKILLS.map(cat => (
          <div key={cat.cat} style={{ marginBottom: 40 }}>
            {/* Category header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, boxShadow: `0 0 12px ${cat.color}` }} />
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, color: cat.color, letterSpacing: ".1em", textTransform: "uppercase" }}>{cat.cat}</span>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${cat.color}30,transparent)` }} />
            </div>
            {/* Icon grid */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {cat.items.map(sk => (
                <div key={sk.name} style={{
                  background: "rgba(255,255,255,.04)", border: `1px solid rgba(255,255,255,.08)`,
                  borderRadius: 16, padding: "18px 20px", minWidth: 90,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  transition: "all .3s cubic-bezier(.4,0,.2,1)", cursor: "default",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + "55"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 12px 36px ${cat.color}18`; e.currentTarget.style.background = cat.color + "0e"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}
                >
                  <img
                    src={sk.icon} alt={sk.name}
                    style={{ width: 42, height: 42, objectFit: "contain" }}
                    onError={e => { e.target.style.display = "none"; }}
                  />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.75)", textAlign: "center", whiteSpace: "nowrap" }}>{sk.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── PROJECT CARD with image ── */
function ProjectCard({ p }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: "rgba(255,255,255,.03)",
        border: `1px solid ${hov ? p.color + "48" : "rgba(255,255,255,.07)"}`,
        borderRadius: 22, overflow: "hidden", display: "flex", flexDirection: "column",
        transition: "all .4s cubic-bezier(.4,0,.2,1)",
        transform: hov ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hov ? `0 24px 60px ${p.color}1a` : "none",
        cursor: "default",
      }}
    >
      {/* Project image banner */}
      <div style={{ position: "relative", height: 180, overflow: "hidden", flexShrink: 0 }}>
        <img src={p.img} alt={p.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s ease", transform: hov ? "scale(1.06)" : "scale(1)" }}
        />
        {/* Overlay gradient */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 30%, rgba(4,6,19,.95) 100%)` }} />
        {/* Color top accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: p.grad, opacity: hov ? 1 : 0.6, transition: "opacity .4s" }} />
        {/* Num badge */}
        <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(4,6,19,.7)", backdropFilter: "blur(8px)", border: `1px solid ${p.color}40`, borderRadius: 8, padding: "4px 10px", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 12, color: p.color }}>{p.num}</div>
        {/* Icon */}
        <div style={{ position: "absolute", bottom: 14, left: 16, width: 44, height: 44, borderRadius: 12, background: `${p.color}20`, border: `1px solid ${p.color}40`, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{p.icon}</div>
      </div>

      {/* Card body */}
      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{p.title}</h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: p.color, fontWeight: 700, margin: 0, letterSpacing: ".07em", textTransform: "uppercase" }}>{p.sub}</p>
            </div>
            {/* GitHub icon */}
            <a href={p.gh} target="_blank" rel="noreferrer"
              style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.5)", textDecoration: "none", fontSize: 11, fontWeight: 800, fontFamily: "'DM Sans',sans-serif", transition: "all .2s", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.14)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.06)"; e.currentTarget.style.color = "rgba(255,255,255,.5)"; }}
            >GH</a>
          </div>
        </div>

        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,.48)", lineHeight: 1.75, margin: 0, flex: 1 }}>{p.desc}</p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {p.tags.map(t => (
            <span key={t} style={{ background: `${p.color}0e`, border: `1px solid ${p.color}22`, color: "rgba(255,255,255,.58)", padding: "3px 9px", borderRadius: 6, fontSize: 10, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, letterSpacing: ".04em" }}>{t}</span>
          ))}
        </div>

        {/* View Project button */}
        <a href={p.demo} target="_blank" rel="noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            background: hov ? p.grad : "rgba(255,255,255,.05)",
            border: `1px solid ${hov ? "transparent" : "rgba(255,255,255,.1)"}`,
            color: "#fff", textDecoration: "none",
            padding: "10px 18px", borderRadius: 10,
            fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
            transition: "all .3s",
            boxShadow: hov ? `0 6px 20px ${p.color}35` : "none",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = p.grad; e.currentTarget.style.boxShadow = `0 6px 20px ${p.color}45`; e.currentTarget.style.borderColor = "transparent"; }}
          onMouseLeave={e => {
            e.currentTarget.style.background = hov ? p.grad : "rgba(255,255,255,.05)";
            e.currentTarget.style.boxShadow = hov ? `0 6px 20px ${p.color}35` : "none";
            e.currentTarget.style.borderColor = hov ? "transparent" : "rgba(255,255,255,.1)";
          }}
        >
          View Project →
        </a>
      </div>
    </div>
  );
}

/* ── PROJECTS ── */
function Projects() {
  const [ref, vis] = useInView();
  return (
    <section id="projects" ref={ref} style={{ padding: "100px 5%", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(46px)", transition: "opacity .8s ease, transform .8s ease" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SLabel>Featured Work</SLabel>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,4vw,46px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: "-.025em" }}>Projects I've Built</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,.36)", margin: 0 }}>6 production-level apps built with modern tech stacks</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
          {PROJECTS.map(p => <ProjectCard key={p.title} p={p} />)}
        </div>
      </div>
    </section>
  );
}

/* ── EDUCATION (SGPA only here) ── */
function Education() {
  const [ref, vis] = useInView();
  return (
    <section id="education" ref={ref} style={{ padding: "100px 5%", position: "relative", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(46px)", transition: "opacity .8s ease, transform .8s ease" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.018)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1080, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SLabel>Qualifications</SLabel>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,4vw,46px)", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-.025em" }}>Education & Certifications</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>

          {/* Education card — SGPA only here */}
          <div style={{ background: "linear-gradient(135deg,rgba(49,130,206,.09),rgba(109,40,217,.06))", border: "1px solid rgba(99,179,237,.18)", borderRadius: 24, padding: 36, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -36, right: -36, width: 140, height: 140, borderRadius: "50%", background: "rgba(99,179,237,.07)" }} />
            <div style={{ position: "absolute", bottom: -28, left: -28, width: 110, height: 110, borderRadius: "50%", background: "rgba(109,40,217,.07)" }} />
            <div style={{ fontSize: 44, marginBottom: 18, position: "relative", zIndex: 1 }}>🎓</div>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", margin: "0 0 8px", position: "relative", zIndex: 1 }}>B.Tech — Computer Science</h3>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#63b3ed", fontWeight: 600, margin: "0 0 5px", position: "relative", zIndex: 1 }}>Babu Banarasi Das University</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,.38)", margin: "0 0 28px", position: "relative", zIndex: 1 }}>Lucknow, Uttar Pradesh</p>

            {/* SGPA — only here */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg,#2b6cb0,#6d28d9)", borderRadius: 16, padding: "14px 22px", boxShadow: "0 8px 28px rgba(109,40,217,.35)", position: "relative", zIndex: 1 }}>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 32, color: "#fff", lineHeight: 1 }}>9.1</div>
              </div>
              <div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "rgba(255,255,255,.85)", fontWeight: 700, letterSpacing: ".05em" }}>SGPA</div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "rgba(255,255,255,.5)" }}>Outstanding 🏆</div>
              </div>
            </div>
          </div>

          {/* Certs + code snippet */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.28)", letterSpacing: ".12em", textTransform: "uppercase", margin: "0 0 2px" }}>Certifications</p>
            {[
              { title: "DSA with Java", org: "Self-Certified", icon: "☕", color: "#f59e0b" },
              { title: "MERN Stack Development", org: "Apna College", icon: "⚛", color: "#3b82f6" },
            ].map(c => (
              <div key={c.title} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, transition: "all .3s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${c.color}40`; e.currentTarget.style.transform = "translateX(8px)"; e.currentTarget.style.background = `${c.color}07`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.background = "rgba(255,255,255,.03)"; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${c.color}18`, border: `1px solid ${c.color}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: c.color, fontWeight: 600 }}>{c.org}</div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${c.color}18`, border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: c.color, fontSize: 13, fontWeight: 800, flexShrink: 0 }}>✓</div>
              </div>
            ))}
            {/* Code snippet */}
            <div style={{ background: "rgba(0,0,0,.35)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: "18px 20px", fontFamily: "'Courier New',monospace", fontSize: 12, lineHeight: 1.75, flex: 1 }}>
              <span style={{ color: "#8b5cf6" }}>const </span><span style={{ color: "#63b3ed" }}>amit</span><span style={{ color: "rgba(255,255,255,.4)" }}> = {"{"}</span><br />
              <span style={{ paddingLeft: 16 }}><span style={{ color: "rgba(255,255,255,.35)" }}>role: </span><span style={{ color: "#f59e0b" }}>"Full Stack Dev"</span><span style={{ color: "rgba(255,255,255,.3)" }}>,</span></span><br />
              <span style={{ paddingLeft: 16 }}><span style={{ color: "rgba(255,255,255,.35)" }}>passion: </span><span style={{ color: "#10b981" }}>"Clean Code"</span><span style={{ color: "rgba(255,255,255,.3)" }}>,</span></span><br />
              <span style={{ paddingLeft: 16 }}><span style={{ color: "rgba(255,255,255,.35)" }}>available: </span><span style={{ color: "#f472b6" }}>true</span></span><br />
              <span style={{ color: "rgba(255,255,255,.4)" }}>{"}"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function Contact() {
  const [ref, vis] = useInView();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const inp = { width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "13px 15px", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: "none", transition: "border-color .2s", boxSizing: "border-box" };
  const submit = () => {
    const s = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const b = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:amitsgupta18@gmail.com?subject=${s}&body=${b}`;
    setSent(true); setTimeout(() => setSent(false), 4000);
  };
  return (
    <section id="contact" ref={ref} style={{ padding: "100px 5%", maxWidth: 800, margin: "0 auto", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(46px)", transition: "opacity .8s ease, transform .8s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <SLabel>Get In Touch</SLabel>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(26px,4vw,46px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: "-.025em" }}>Let's Build Something</h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "rgba(255,255,255,.38)", margin: 0 }}>Have an Opportunity? Let’s Talk</p>
      </div>
      <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 26, padding: 42, boxShadow: "0 0 80px rgba(49,130,206,.06)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          {[{ l: "Your Name", k: "name", t: "text", ph: "John Doe" }, { l: "Email", k: "email", t: "email", ph: "john@company.com" }].map(f => (
            <div key={f.k}>
              <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.38)", marginBottom: 8, letterSpacing: ".07em", textTransform: "uppercase" }}>{f.l}</label>
              <input style={inp} type={f.t} placeholder={f.ph} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                onFocus={e => e.target.style.borderColor = "rgba(99,179,237,.5)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.1)"} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.38)", marginBottom: 8, letterSpacing: ".07em", textTransform: "uppercase" }}>Message</label>
          <textarea style={{ ...inp, height: 130, resize: "vertical", display: "block" }} placeholder="Tell me about your project, role, or idea..."
            value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            onFocus={e => e.target.style.borderColor = "rgba(99,179,237,.5)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.1)"} />
        </div>
        <button onClick={submit} style={{ width: "100%", background: sent ? "linear-gradient(135deg,#0f6e56,#10b981)" : "linear-gradient(135deg,#2b6cb0,#6d28d9)", color: "#fff", border: "none", padding: "15px 28px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 6px 28px rgba(109,40,217,.35)", transition: "all .25s" }}
          onMouseEnter={e => { e.target.style.opacity = ".9"; e.target.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; }}
        >{sent ? "✓ Opening Mail Client..." : "Send Message ✦"}</button>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.06)", flexWrap: "wrap" }}>
          {[
            { l: "amitsgupta18@gmail.com", href: "mailto:amitsgupta18@gmail.com", ic: "✉", c: "#f59e0b" },
            { l: "LinkedIn", href: "https://www.linkedin.com/in/amit-gupta-760a03299", ic: "in", c: "#3b82f6" },
            { l: "GitHub", href: "https://github.com/amitsgupta11", ic: "{}", c: "#a78bfa" },
            { l: "LeetCode", href: "https://leetcode.com/u/_amit8517gupta/", ic: "LC", c: "#a78bfa" },
          ].map(lk => (
            <a key={lk.l} href={lk.href} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,.4)", textDecoration: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = lk.c} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.4)"}
            >
              <span style={{ width: 30, height: 30, borderRadius: 9, background: `${lk.c}15`, border: `1px solid ${lk.c}25`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: lk.c, fontFamily: "monospace" }}>{lk.ic}</span>
              {lk.l}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── APP ── */
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;border:none;outline:none}
        *:not(input):not(textarea):not(button):not(a){border:unset}
        html{scroll-behavior:smooth}
        body{background:#040613;color:#fff;overflow-x:hidden;min-height:100vh;border:none!important}
        #root{border:none!important;outline:none!important}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#040613}
        ::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#3182ce,#6d28d9);border-radius:3px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes glow{0%,100%{box-shadow:0 0 8px #10b981}50%{box-shadow:0 0 20px #10b981}}
        @keyframes gradRing{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes scrollPulse{0%,100%{opacity:.3;transform:scaleY(.6)}50%{opacity:1;transform:scaleY(1)}}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,.22)!important}
        @media(max-width:900px){
          .hero-grid{grid-template-columns:1fr!important}
          .hero-photo{display:none!important}
        }
        @media(max-width:700px){
          .about-inner-grid{grid-template-columns:1fr!important}
          .edu-grid{grid-template-columns:1fr!important}
          .contact-2col{grid-template-columns:1fr!important}
        }
      `}</style>
      <div style={{ background: "#040613", minHeight: "100vh" }}>
        <Particles />
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Contact />
        <footer style={{ borderTop: "1px solid rgba(255,255,255,.06)", padding: "24px 5%", textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,.22)" }}>
          Designed &amp; Built by{" "}
          <span style={{ background: "linear-gradient(135deg,#63b3ed,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Amit Gupta</span>
          {" "}· Built with React · <span style={{ color: "#f472b6" }}>♥</span>
        </footer>
      </div>
    </>
  );
}
