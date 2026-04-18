"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    const initial = stored ?? "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme" title={theme === "dark" ? "Switch to light" : "Switch to dark"}>
      <i className={theme === "dark" ? "ri-sun-line" : "ri-moon-line"} style={{ fontSize: "14px" }} />
    </button>
  );
}
