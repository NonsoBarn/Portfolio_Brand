"use client";

import { useEffect, useRef } from "react";

interface LoaderProps {
  onDone: () => void;
}

const STEPS = [
  "initializing build...",
  "importing identity...",
  "loading experience...",
  "mounting panels...",
  "ready.",
];

export default function Loader({ onDone }: LoaderProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const msgRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let pct = 0;
    let stepIdx = 0;
    const interval = setInterval(() => {
      pct += Math.random() * 12 + 4;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        setTimeout(onDone, 400);
      }
      if (barRef.current) barRef.current.style.width = `${pct}%`;
      if (pctRef.current) pctRef.current.textContent = `${Math.floor(pct)}%`;

      const newStep = Math.min(
        Math.floor((pct / 100) * STEPS.length),
        STEPS.length - 1,
      );
      if (newStep !== stepIdx) {
        stepIdx = newStep;
        if (msgRef.current) msgRef.current.textContent = STEPS[stepIdx];
      }
    }, 80);

    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div id="loader">
      <p className="ld-pre">{`// Nonso Barn`}</p>
      <div className="ld-logo">
        <i className="ri-earth-line" />
      </div>
      <div className="ld-track">
        <div className="ld-bar" ref={barRef} />
      </div>
      <div className="ld-info">
        <span ref={msgRef}>{STEPS[0]}</span>
        <span ref={pctRef}>0%</span>
      </div>
      <p className="ld-pre">{`© ${new Date().getFullYear()}`}</p>
    </div>
  );
}
