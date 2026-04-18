"use client";

import { useState, useRef, useEffect } from "react";
import type { PanelId } from "@/lib/types";
import ThemeToggle from "@/components/ThemeToggle";

interface NavProps {
  activePanel: PanelId;
  onNav: (panel: PanelId) => void;
  onSetup: () => void;
  onSocial: () => void;
}

type DropdownKey = "content" | "connect";

const DROPDOWNS: {
  key: DropdownKey;
  label: string;
  items: { id: PanelId; label: string }[];
}[] = [
  {
    key: "content",
    label: "Content",
    items: [
      { id: "blog", label: "Writing" },
      { id: "youtube", label: "Videos" },
      { id: "projects", label: "Projects" },
    ],
  },
  {
    key: "connect",
    label: "Connect",
    items: [
      { id: "community", label: "Community" },
      { id: "newsletter", label: "Newsletter" },
      { id: "collab", label: "Collabs" },
      { id: "hire", label: "Hire Me" },
    ],
  },
];

const DRAWER_SECTIONS = [
  { head: "Standalone", items: [{ id: "about" as PanelId, label: "About" }] },
  {
    head: "Content",
    items: [
      { id: "blog" as PanelId, label: "Writing" },
      { id: "youtube" as PanelId, label: "Videos" },
      { id: "projects" as PanelId, label: "Projects" },
    ],
  },
  {
    head: "Connect",
    items: [
      { id: "community" as PanelId, label: "Community" },
      { id: "newsletter" as PanelId, label: "Newsletter" },
      { id: "collab" as PanelId, label: "Collabs" },
      { id: "hire" as PanelId, label: "Hire Me" },
    ],
  },
];

export default function Nav({
  activePanel,
  onNav,
  onSetup,
  onSocial,
}: NavProps) {
  const [openDd, setOpenDd] = useState<DropdownKey | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const ddRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        openDd &&
        ddRefs.current[openDd] &&
        !ddRefs.current[openDd]!.contains(e.target as Node)
      ) {
        setOpenDd(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openDd]);

  const isInGroup = (key: DropdownKey) =>
    DROPDOWNS.find((d) => d.key === key)?.items.some(
      (i) => i.id === activePanel,
    ) ?? false;

  const handleNav = (panel: PanelId) => {
    onNav(panel);
    setOpenDd(null);
    setDrawerOpen(false);
  };

  return (
    <>
      <nav id="main-nav">
        {/* Logo */}
        <button className="nav-logo" onClick={() => onNav(null)}>
          <i className="ri-earth-line" />
        </button>

        {/* Grouped pill strip */}
        <div className="nav-pills">
          {/* About */}
          <button
            className={`npill${activePanel === "about" ? " active" : ""}`}
            onClick={() => handleNav("about")}
          >
            About
          </button>

          {/* Dropdowns */}
          {DROPDOWNS.map((dd) => (
            <div
              key={dd.key}
              className={`dd-wrap${openDd === dd.key ? " open" : ""}`}
              ref={(el) => {
                ddRefs.current[dd.key] = el;
              }}
            >
              <button
                className={`dd-btn${isInGroup(dd.key) ? " has-active" : ""}${openDd === dd.key ? " open" : ""}`}
                onClick={() => setOpenDd(openDd === dd.key ? null : dd.key)}
              >
                {dd.label}
                <i className="ri-arrow-down-s-line dd-arr" />
              </button>
              <div className="dd-menu">
                {dd.items.map((item) => (
                  <button
                    key={item.id as string}
                    className={`dd-item${activePanel === item.id ? " active" : ""}`}
                    onClick={() => handleNav(item.id)}
                  >
                    <span className="dd-item-dot" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="nav-right">
          {/* <span className="n-live">
            <span className="live-dot" />
            Building
          </span> */}

          <button className="n-cta" onClick={onSocial}>
            <i className="ri-share-line" /> Connect
          </button>
          <ThemeToggle />
          <button
            className="nav-hamburger"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Menu"
          >
            <i className="ri-menu-line" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer${drawerOpen ? " open" : ""}`}>
        {DRAWER_SECTIONS.map((sec) => (
          <div key={sec.head} className="drawer-section">
            <div className="drawer-section-head">{sec.head}</div>
            {sec.items.map((item) => (
              <button
                key={item.id as string}
                className={`drawer-item${activePanel === item.id ? " active" : ""}${item.id === "hire" ? " hire" : ""}`}
                onClick={() => handleNav(item.id)}
              >
                <span className="di-dot" />
                {item.label}
              </button>
            ))}
          </div>
        ))}
        <button
          className="drawer-standalone"
          onClick={() => {
            onSetup();
            setDrawerOpen(false);
          }}
        >
          Connect
        </button>
      </div>
    </>
  );
}
