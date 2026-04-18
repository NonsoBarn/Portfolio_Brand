"use client";

import { useEffect, useRef, useState } from "react";
import type { PanelId } from "@/lib/types";
import { HERO_CARD_ROWS } from "@/lib/data";
// import { useHeroSocials } from "@/lib/hooks/useHeroSocials";
import { useGitHub } from "@/lib/hooks/useGitHub";

interface HeroProps {
  onNav: (panel: PanelId) => void;
}

export default function Hero({ onNav }: HeroProps) {
  // const HERO_CARD_SOCIALS = useHeroSocials();
  const { activityLevels, streak } = useGitHub();
  const cardRows = HERO_CARD_ROWS.map((r) =>
    r.k === "Streak" && streak !== null ? { ...r, v: `${streak} days` } : r,
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [cardClosed, setCardClosed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({
    ox: 0,
    oy: 0,
    startX: 0,
    startY: 0,
    el: null as HTMLElement | null,
  });

  // Canvas particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
    };
    const particles: Particle[] = [];
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        alpha: Math.random() * 0.12 + 0.02,
        size: Math.random() * 1.2 + 0.3,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,224,208,${p.alpha})`;
        ctx.fill();
      });
      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(232,224,208,${0.022 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Drag logic for floating card
  const onDragStart = (e: React.MouseEvent) => {
    const el = floatRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    drag.current = {
      ox: rect.left,
      oy: rect.top,
      startX: e.clientX,
      startY: e.clientY,
      el,
    };
    setDragging(true);
    el.style.right = "auto";
    el.style.transform = "none";

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - drag.current.startX;
      const dy = ev.clientY - drag.current.startY;
      el.style.left = `${drag.current.ox + dx}px`;
      el.style.top = `${drag.current.oy + dy}px`;
    };
    const onUp = () => {
      setDragging(false);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div id="hero-wrap">
      <div className="hero">
        <canvas id="hcv" ref={canvasRef} />
        <div className="hero-grid" />
        <div className="hero-bg-text">BUILDING</div>

        <div className="hero-body">
          <div className="hero-left">
            <div className="hero-kicker">
              <span className="hk-bar" />
              <span className="hk-t">Lagos, Nigeria · Engineer · Creator</span>
            </div>
            <h1 className="hero-h1">
              <span className="h1r">
                <span>Code.</span>
              </span>
              <span className="h1r">
                <span>Ship it.</span>
              </span>
              <span className="h1r">
                <span>Document.</span>
              </span>
            </h1>
          </div>

          <div className="hero-right">
            <span className="hero-flag">
              <span className="live-dot" />
              Online now · WAT
            </span>
            <p className="hero-desc">
              Nigerian software engineer building{" "}
              <strong>fullstack &amp; mobile products</strong> used by tens of
              thousands. Learning DevOps out loud, shipping from Lagos on her
              own terms.
            </p>
            <div className="hbtns">
              <button
                className="hbtn fill"
                onClick={() => {
                  onNav("newsletter");
                  document
                    .getElementById("panels")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Get The Build Log →
              </button>
              <button
                className="hbtn ghost-btn"
                onClick={() => {
                  onNav("blog");
                  document
                    .getElementById("panels")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Read &amp; watch
              </button>
            </div>
          </div>
        </div>

        {/* Floating profile card */}
        <div
          ref={floatRef}
          className={`hfloat${cardClosed ? " closed" : ""}${dragging ? " dragging" : ""}`}
        >
          <div className="hfc">
            <div className="hfc-drag" onMouseDown={onDragStart}>
              <div className="drag-grip">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="grip-dot" />
                ))}
              </div>
              <span className="hfc-drag-hint">drag</span>
              <button
                className="hfc-close-btn"
                onClick={() => setCardClosed(true)}
              >
                <i className="ri-close-line" />
              </button>
            </div>

            <div className="hfc-head">
              <div className="hfc-tr">
                <div className="hfc-av">
                  <i className="ri-earth-line" />
                </div>
                <span className="hfc-online">
                  <span className="live-dot" />
                  Online
                </span>
              </div>
              <div className="hfc-name">Nonso Barn</div>
              <div className="hfc-sub">@nonsobarn · Lagos, NG</div>
            </div>

            <div className="hfc-rows">
              {cardRows.map((r) => (
                <div key={r.k} className="hfcr">
                  <span className="k">{r.k}</span>
                  <span className={`v${r.cls ? ` ${r.cls}` : ""}`}>{r.v}</span>
                </div>
              ))}
            </div>

            <div className="hfc-ag">
              <div className="ag-lbl">Build activity · 26w</div>
              <div className="ag-grid">
                {activityLevels.map((lvl, i) => (
                  <div key={i} className={`agc${lvl > 0 ? ` l${lvl}` : ""}`} />
                ))}
              </div>
            </div>

            {/* <div className="hfc-socs">
              {HERO_CARD_SOCIALS.map((s) => (
                <a
                  key={s.p}
                  href="#"
                  className="hfcs"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="p">{s.p}</span>
                  <span className="n">{s.n}</span>
                </a>
              ))}
            </div> */}
          </div>
        </div>

        {/* Reopen button */}
        {cardClosed && (
          <button
            className="card-reopen show"
            onClick={() => setCardClosed(false)}
          >
            <span className="config-dot" />
            <span>Profile</span>
          </button>
        )}
      </div>
    </div>
  );
}
