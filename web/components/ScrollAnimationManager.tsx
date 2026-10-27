"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

export function ScrollAnimationManager() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Smooth scroll to top handler
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    // 1. Setup Scroll Progress & Header Dynamic Scrolled State
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docEl = document.documentElement;
          const totalHeight = docEl.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY || docEl.scrollTop;

          if (totalHeight > 0) {
            const pct = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
            setScrollProgress(pct);
            docEl.style.setProperty("--scroll-progress", `${pct}%`);
          }

          setShowScrollTop(currentScroll > 360);

          // Toggle .scrolled on navbar for luxury frosted glass compact effect
          const navbar = document.querySelector(".navbar") || document.querySelector("nav");
          if (navbar) {
            if (currentScroll > 45) {
              navbar.classList.add("scrolled");
            } else {
              navbar.classList.remove("scrolled");
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    // 2. High-Performance IntersectionObserver for Scroll Reveals
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px -40px 0px", // Trigger just before entering viewport
      threshold: [0.05, 0.15],
    };

    const handleIntersect: IntersectionObserverCallback = (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          // Optionally keep observing or unobserve once revealed
          obs.unobserve(entry.target);
        }
      });
    };

    const revealObserver = new IntersectionObserver(handleIntersect, observerOptions);

    // Selectable elements to automatically animate on scroll
    const autoRevealSelectors = [
      ".scroll-reveal",
      ".scroll-reveal-left",
      ".scroll-reveal-right",
      ".scroll-reveal-scale",
      "section",
      ".page-section",
      ".home-hero__content",
      ".home-hero__media",
      ".gallery-header",
      ".gallery-card",
      ".attraction-card",
      ".budget-tier-card",
      ".agent-card",
      ".agent-used-item-card",
      ".agreement-record-card",
      ".agreement-guarantee-lock-card",
      ".editorial-prefooter",
      ".wizard-panel",
      ".stepper-card",
      ".fx-ticker-card",
      ".account-card",
    ];

    const observeAllTargets = () => {
      const elements = document.querySelectorAll(autoRevealSelectors.join(", "));
      elements.forEach((el, index) => {
        if (!el.classList.contains("scroll-reveal") &&
            !el.classList.contains("scroll-reveal-left") &&
            !el.classList.contains("scroll-reveal-right") &&
            !el.classList.contains("scroll-reveal-scale")) {
          // If in a grid, add staggered delay class
          const parent = el.parentElement;
          if (parent && (parent.classList.contains("gallery-grid") ||
                         parent.classList.contains("attraction-grid") ||
                         parent.classList.contains("budget-tiers-grid") ||
                         parent.classList.contains("agents-grid") ||
                         parent.classList.contains("agents-used-list") ||
                         parent.classList.contains("agreements-list"))) {
            const childIdx = Array.from(parent.children).indexOf(el as Element);
            (el as HTMLElement).style.transitionDelay = `${(childIdx % 8) * 80}ms`;
          }
          el.classList.add("scroll-reveal");
        }
        if (!el.classList.contains("is-revealed")) {
          revealObserver.observe(el);
        }
      });
    };

    // Initial query
    observeAllTargets();

    // 3. MutationObserver to handle dynamically mounted steps and cards
    const mutationObserver = new MutationObserver(() => {
      observeAllTargets();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      revealObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* ── Fixed Glowing Scroll Progress Bar at the Very Top ── */}
      <div
        className="luxury-scroll-progress-line"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "3.5px",
          width: `${scrollProgress}%`,
          background: "linear-gradient(90deg, #652733 0%, #AD8958 50%, #2D5A43 100%)",
          zIndex: 100000,
          pointerEvents: "none",
          transition: "width 0.12s ease-out",
          boxShadow: "0 0 10px rgba(173, 137, 88, 0.6), 0 0 4px rgba(101, 39, 51, 0.4)",
        }}
        aria-hidden="true"
      />

      {/* ── Floating Luxury Back to Top Pill Button ── */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`luxury-scroll-top-btn ${showScrollTop ? "is-visible" : ""}`}
        aria-label="Scroll back to top of page"
        title="Return to top"
      >
        <ArrowUp size={14} className="scroll-arrow-icon" />
        <span className="scroll-top-label">Top</span>
      </button>
    </>
  );
}
