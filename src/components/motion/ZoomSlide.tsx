"use client";

/**
 * ZoomSlide — Zoom-through space transition system
 *
 * Architecture: Each <section id="..."> stays in the DOM as a real 100vh anchor
 * so hash links (#sobre, #projetos, etc.) work natively. The visible content
 * panels are rendered as `position: fixed, inset: 0` and driven by a single
 * scroll-stage manager that reads scrollY and distributes per-panel progress.
 *
 * Exit:  current panel  → scale(1 → 1.08), opacity(1 → 0)  — flies toward viewer
 * Enter: next panel     → scale(0.85 → 1), opacity(0 → 1)   — emerges from depth
 *
 * Both transforms are centered in the viewport — no vertical movement visible.
 *
 * Compatible with:
 *  - Horizontal carousel inside ProjectsSection (internal scroll, not captured)
 *  - Hash anchor navigation (#sobre, #projetos, …)
 *  - prefers-reduced-motion
 *  - Mobile touch scroll
 *  - SpaceBackground canvas (fixed, z-index: -1)
 *  - [data-modal-open] guard to suppress scroll during image modals
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PanelState = "idle" | "entering" | "visible" | "exiting" | "gone";

type PanelEntry = {
  id: string;
  anchorEl: HTMLElement;
  setState: (s: PanelState) => void;
  setProgress: (p: number) => void;
};

// ─── Context shared between ScrollStageManager and each ZoomSlide ─────────────

type StageContextValue = {
  register: (entry: PanelEntry) => () => void;
};

const StageContext = createContext<StageContextValue | null>(null);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** Cubic ease-out: smooth deceleration */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Cubic ease-in: smooth acceleration */
function easeIn(t: number): number {
  return Math.pow(t, 3);
}

function isModalOpen() {
  return document.querySelector("[data-modal-open]") !== null;
}

// ─── ScrollStageManager ───────────────────────────────────────────────────────
// Reads scrollY once per rAF and distributes state/progress to every panel.
// Lives as a singleton so all panels share one scroll listener.

type ManagerProps = {
  children: React.ReactNode;
};

export function ScrollStageManager({ children }: ManagerProps) {
  const panelsRef = useRef<PanelEntry[]>([]);

  const register = useCallback((entry: PanelEntry) => {
    panelsRef.current.push(entry);
    // Sort by DOM order each time a new panel registers
    panelsRef.current.sort((a, b) => {
      const aTop = a.anchorEl.getBoundingClientRect().top;
      const bTop = b.anchorEl.getBoundingClientRect().top;
      return aTop - bTop;
    });

    return () => {
      panelsRef.current = panelsRef.current.filter((p) => p.id !== entry.id);
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;

    function update() {
      if (isModalOpen()) return;

      const panels = panelsRef.current;
      if (panels.length === 0) return;

      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      panels.forEach((panel, i) => {
        const anchorTop = panel.anchorEl.offsetTop;
        const anchorBottom = anchorTop + panel.anchorEl.offsetHeight; // = anchorTop + vh

        // How far scrollY has travelled inside this panel's 100vh window
        const localScroll = scrollY - anchorTop; // negative = before, 0 = top, vh = fully scrolled
        const raw = localScroll / vh; // 0 → 1

        if (reducedMotion) {
          // In reduced-motion mode just snap visibility
          if (raw >= -0.5 && raw < 0.5) {
            panel.setState("visible");
            panel.setProgress(0);
          } else {
            panel.setState(raw < -0.5 ? "idle" : "gone");
            panel.setProgress(0);
          }
          return;
        }

        const isLast = i === panels.length - 1;

        if (raw < -1) {
          // Far above — completely hidden, not yet approaching
          panel.setState("idle");
          panel.setProgress(0);
          return;
        }

        if (raw > 1.5) {
          // Far below — completely gone
          panel.setState("gone");
          panel.setProgress(0);
          return;
        }

        // ENTERING phase: raw ∈ [-0.5, 0]
        // Starts exactly when the previous section begins exiting (raw_prev = 0.5).
        // Since sections are each 100vh apart: raw_B = raw_A - 1,
        // so when A is at 0.5, B is at -0.5 → perfect sync.
        if (raw < 0) {
          if (raw < -0.5) {
            panel.setState("idle");
            panel.setProgress(0);
          } else {
            // t: 0 (far, scale=0.85, opacity=0) → 1 (arrived, scale=1, opacity=1)
            const t = clamp((raw + 0.5) / 0.5, 0, 1);
            panel.setState("entering");
            panel.setProgress(easeOut(t));
          }
          return;
        }

        // VISIBLE phase: raw ∈ [0, 0.5] — stable, fully on screen
        if (raw <= 0.5) {
          panel.setState("visible");
          panel.setProgress(0);
          return;
        }

        // Last section never exits
        if (isLast) {
          panel.setState("visible");
          panel.setProgress(0);
          return;
        }

        // EXITING phase: raw ∈ [0.5, 1] — zoom out + fade
        // Mirrors entering: t goes 0→1 as section flies toward viewer
        const t = clamp((raw - 0.5) / 0.5, 0, 1);
        panel.setState("exiting");
        panel.setProgress(easeIn(t));
      });
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <StageContext.Provider value={{ register }}>
      {children}
    </StageContext.Provider>
  );
}

// ─── ZoomSlide ────────────────────────────────────────────────────────────────

type ZoomSlideProps = {
  children: React.ReactNode;
  /**
   * Matches the parent <section id="..."> so this panel is linked to its anchor.
   * Required — must equal the id of the wrapping section element.
   */
  sectionId: string;
  isLast?: boolean;
  noExitAnimation?: boolean;
  /** @deprecated kept for backwards-compat — use sectionId instead */
  id?: string;
  /** @deprecated kept for backwards-compat */
  isFirst?: boolean;
};

export function ZoomSlide({
  children,
  sectionId,
  isLast = false,
  noExitAnimation = false,
}: ZoomSlideProps) {
  const ctx = useContext(StageContext);
  const panelRef = useRef<HTMLDivElement>(null);

  // Initialise to "visible" for the section that's already in view on first paint
  // (avoids 1-frame flicker where the first panel is invisible before the manager fires).
  // On the server it defaults to "idle"; on the client we hydrate immediately.
  const [state, setState] = useState<PanelState>(() => {
    if (typeof window === "undefined") return "idle";
    const anchor = document.getElementById(sectionId);
    if (!anchor) return "idle";
    const anchorTop = anchor.offsetTop;
    const vh = window.innerHeight;
    const raw = (window.scrollY - anchorTop) / vh;
    // If this section's window contains the current scroll position → start visible
    if (raw >= 0 && raw <= 0.5) return "visible";
    return "idle";
  });
  const [progress, setProgress] = useState(0);

  // Stable refs to avoid re-registering on every render
  const setStateRef = useRef(setState);
  const setProgressRef = useRef(setProgress);
  setStateRef.current = setState;
  setProgressRef.current = setProgress;

  useLayoutEffect(() => {
    if (!ctx) return;

    // The anchor is the <section id="sectionId"> element — look upward from panel
    const anchor = document.getElementById(sectionId);
    if (!anchor) {
      console.warn(`[ZoomSlide] No <section id="${sectionId}"> found in DOM.`);
      return;
    }

    const unregister = ctx.register({
      id: sectionId,
      anchorEl: anchor,
      setState: (s) => setStateRef.current(s),
      setProgress: (p) => setProgressRef.current(p),
    });

    return unregister;
  }, [ctx, sectionId]);

  // ── Reduced-motion detection (stable ref, evaluated once on mount) ─────────
  const reducedMotionRef = useRef(false);
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);
  // During SSR and on first render before effect runs, default false (no motion suppressed).
  // The effect runs synchronously in useLayoutEffect order so by the first paint
  // the correct value is set.
  const reducedMotion = reducedMotionRef.current;

  let scale = 1;
  let opacity = 1;
  let pointerEvents: React.CSSProperties["pointerEvents"] = "auto";
  let visibility: React.CSSProperties["visibility"] = "visible";
  let zIndex = 10;

  if (!reducedMotion) {
    switch (state) {
      case "idle":
        // Panel not yet approaching — keep fully hidden, below the stack
        scale = 0.85;
        opacity = 0;
        pointerEvents = "none";
        visibility = "hidden";
        zIndex = 8;
        break;

      case "entering":
        // Emerge do fundo: scale 0.5 → 1, opacity 0 → 1
        scale = 0.5 + 0.5 * progress;
        opacity = progress;
        pointerEvents = "none";
        zIndex = 9;
        break;

      case "visible":
        scale = 1;
        opacity = 1;
        zIndex = 10;
        break;

      case "exiting":
        if (noExitAnimation) {
          scale = 1;
          opacity = 1 - progress;
        } else {
          // Voa para dentro da tela: scale 1 → 2.5, opacity 1 → 0
          scale = 1 + 1.5 * progress;
          opacity = 1 - progress;
        }
        pointerEvents = "none";
        zIndex = 11;
        break;

      case "gone":
        scale = 1.08;
        opacity = 0;
        pointerEvents = "none";
        visibility = "hidden";
        zIndex = 8;
        break;
    }
  }

  // For "gone" and "idle" panels: skip layout work entirely
  const isRendered = state !== "idle" && state !== "gone";

  return (
    <div
      ref={panelRef}
      className="zoom-slide-panel"
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        // The slide-panel class handles background (transparent in dark, solid in light)
        visibility,
        pointerEvents,
        willChange: isRendered ? "transform, opacity" : "auto",
        transform: `scale(${scale.toFixed(5)})`,
        opacity: opacity.toFixed(5),
        // Smooth the enter/exit curves — JS drives the values, CSS provides
        // an imperceptibly short transition to smooth sub-rAF jitter only.
        // Keep this at 0ms; the math already produces smooth curves.
        transition: "none",
      }}
      // Expose state for debugging
      data-zoom-state={state}
      data-zoom-section={sectionId}
    >
      {/*
        slide-panel: transparent in dark mode (SpaceBackground shows through),
        solid var(--background) in light mode.
        See globals.css "SLIDE PANEL" section.
      */}
      <div className="slide-panel" style={{ position: "absolute", inset: 0 }} />

      {/* Actual section content */}
      <div
        className="relative z-10 min-h-screen flex flex-col justify-center overflow-visible"
        style={{ overscrollBehavior: "contain" }}
      >
        {children}
      </div>
    </div>
  );
}
