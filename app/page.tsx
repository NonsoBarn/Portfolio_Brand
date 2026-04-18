"use client";

import { useState, useCallback, useEffect } from "react";
import type { PanelId } from "@/lib/types";

import Loader from "@/components/Loader";
import CustomCursor from "@/components/CustomCursor";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SetupModal from "@/components/SetupModal";
import SocialModal from "@/components/SocialModal";

import AboutPanel from "@/components/panels/AboutPanel";
import BlogPanel from "@/components/panels/BlogPanel";
import YouTubePanel from "@/components/panels/YouTubePanel";
import ProjectsPanel from "@/components/panels/ProjectsPanel";
import ShopPanel from "@/components/panels/ShopPanel";
import CommunityPanel from "@/components/panels/CommunityPanel";
import CollabPanel from "@/components/panels/CollabPanel";
import NewsletterPanel from "@/components/panels/NewsletterPanel";
import HirePanel from "@/components/panels/HirePanel";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelId>("about");
  const [setupOpen, setSetupOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);

  const handleLoaded = useCallback(() => {
    const el = document.getElementById("loader");
    if (el) {
      el.classList.add("out");
      setTimeout(() => el.remove(), 900);
    }
    setLoaded(true);
  }, []);

  const handleNav = useCallback((panel: PanelId) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }, []);

  // Close panel on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActivePanel(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <Loader onDone={handleLoaded} />
      <CustomCursor />

      {loaded && (
        <>
          <Hero onNav={handleNav} />

          <Nav
            activePanel={activePanel}
            onNav={handleNav}
            onSetup={() => setSetupOpen(true)}
            onSocial={() => setSocialOpen(true)}
          />

          {/* Panels — normal page flow below sticky nav */}
          <div id="panels">
            <AboutPanel open={activePanel === "about"} onClose={() => setActivePanel(null)} onNav={handleNav} />
            <BlogPanel open={activePanel === "blog"} onClose={() => setActivePanel(null)} onNav={handleNav} />
            <NewsletterPanel open={activePanel === "newsletter"} onClose={() => setActivePanel(null)} onNav={handleNav} />
            <YouTubePanel open={activePanel === "youtube"} onClose={() => setActivePanel(null)} onNav={handleNav} />
            <ProjectsPanel open={activePanel === "projects"} onClose={() => setActivePanel(null)} onNav={handleNav} />
            <ShopPanel open={activePanel === "shop"} onClose={() => setActivePanel(null)} onNav={handleNav} />
            <CollabPanel open={activePanel === "collab"} onClose={() => setActivePanel(null)} onNav={handleNav} />
            <CommunityPanel open={activePanel === "community"} onClose={() => setActivePanel(null)} onNav={handleNav} />
            <HirePanel open={activePanel === "hire"} onClose={() => setActivePanel(null)} onNav={handleNav} />
          </div>

          {/* Footer — sticky to viewport bottom */}
          <Footer />

          {/* Config button */}
          {/* <button className="config-btn" onClick={() => setSetupOpen(true)}>
            <span className="config-dot" />
            Setup
          </button> */}

          <SetupModal open={setupOpen} onClose={() => setSetupOpen(false)} />
          <SocialModal open={socialOpen} onClose={() => setSocialOpen(false)} />
        </>
      )}
    </>
  );
}
