"use client";

/**
 * SpaceBackground — Infinite space zoom effect using Canvas 2D + rAF
 *
 * Technique: Each star lives in a 3D coordinate space (x, y, z).
 * Every frame, z decreases (star moves toward viewer). When z <= 0,
 * the star resets to a large z (far away). This creates a seamless
 * infinite loop with zero visual discontinuity.
 *
 * Scroll sync: scrollY drives a velocity multiplier — faster scroll
 * = faster starfield. Uses a passive scroll listener that only writes
 * a ref, never triggering layout.
 *
 * Performance budget:
 *  - 1 canvas element, no DOM nodes per star
 *  - GPU compositing via `will-change: transform` on the wrapper
 *  - Reduced star count on pointer:coarse (mobile) devices
 *  - Full stop on prefers-reduced-motion
 *  - IntersectionObserver pauses rAF when off-screen
 */

import { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Star {
  /** X in [-SPREAD, +SPREAD] (world space) */
  x: number;
  /** Y in [-SPREAD, +SPREAD] (world space) */
  y: number;
  /** Z depth: starts at [1, MAX_Z], decreases toward 0 each frame */
  z: number;
  /** Stored initial z to compute opacity & size fade consistently */
  initialZ: number;
  /** Base radius in canvas pixels (before perspective division) */
  baseRadius: number;
}

interface Nebula {
  /** Normalised center X [0, 1] */
  cx: number;
  /** Normalised center Y [0, 1] */
  cy: number;
  /** Radius as fraction of min(width, height) */
  radiusFactor: number;
  /** RGBA color string */
  color: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Total number of stars — reduced on mobile */
const STAR_COUNT_DESKTOP = 220;
const STAR_COUNT_MOBILE = 110;

/** World-space spread on X and Y axes */
const SPREAD = 700;

/** Max Z depth — stars spawn here and move toward 0 */
const MAX_Z = 800;

/** Base speed (z units per frame at 60fps) */
const BASE_SPEED = 2.2;

/** How much extra velocity each 1px of scrollY contributes */
const SCROLL_VELOCITY_FACTOR = 0.012;

/** Max velocity cap so stars don't teleport at extreme scroll speed */
const MAX_VELOCITY = 18;

/** Canvas virtual focal length for perspective projection */
const FOCAL_LENGTH = 500;

/** Nebula definitions — static, no randomness needed */
const NEBULAE: Nebula[] = [
  { cx: 0.18, cy: 0.22, radiusFactor: 0.45, color: "rgba(88, 101, 242, 0.055)" },
  { cx: 0.80, cy: 0.70, radiusFactor: 0.38, color: "rgba(160, 168, 255, 0.040)" },
  { cx: 0.50, cy: 0.50, radiusFactor: 0.60, color: "rgba(88, 101, 242, 0.025)" },
];

// ---------------------------------------------------------------------------
// Seeded PRNG — Mulberry32
// Ensures identical star layout across renders (no flicker on HMR/StrictMode)
// ---------------------------------------------------------------------------

function mulberry32(seed: number): () => number {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Star generation — deterministic with fixed seed
// ---------------------------------------------------------------------------

function generateStars(count: number): Star[] {
  const rand = mulberry32(0xdeadbeef); // fixed seed → same stars every time
  const stars: Star[] = [];

  for (let i = 0; i < count; i++) {
    const z = rand() * MAX_Z + 1;
    stars.push({
      x: (rand() - 0.5) * 2 * SPREAD,
      y: (rand() - 0.5) * 2 * SPREAD,
      z,
      initialZ: z,
      // Larger stars are rarer — bias toward small radii
      baseRadius: 0.4 + rand() * rand() * 2.2,
    });
  }

  return stars;
}

// ---------------------------------------------------------------------------
// Perspective projection helper
// Maps a 3D (x, y, z) point to 2D canvas coordinates
// ---------------------------------------------------------------------------

function project(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number
): [screenX: number, screenY: number, scale: number] {
  const scale = FOCAL_LENGTH / z;
  return [cx + x * scale, cy + y * scale, scale];
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function isDarkMode() {
  const theme = document.documentElement.getAttribute("data-theme");
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    // Non-null assertion: guarded by the check above.
    // TypeScript loses the narrowing across nested closure boundaries,
    // so we use a typed local variable with explicit assertion.
    const canvas: HTMLCanvasElement = canvasRef.current;

    // Respect prefers-reduced-motion — render static starfield, no animation
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Detect mobile/touch device for lower star count
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const starCount = isCoarsePointer ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;

    // Show/hide canvas based on current theme
    function syncTheme() {
      if (!canvasRef.current) return;
      canvasRef.current.style.opacity = isDarkMode() ? "1" : "0";
    }
    syncTheme();
    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const rawCtx = canvas.getContext("2d", { alpha: true });
    if (!rawCtx) return;
    const ctx: CanvasRenderingContext2D = rawCtx;

    // Pixel ratio for sharp rendering on HiDPI screens
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Mutable state — never causes React re-renders
    const stars = generateStars(starCount);
    let rafId = 0;
    let lastTimestamp = 0;
    let scrollVelocity = 0; // smoothed scroll delta
    let rawScrollY = window.scrollY;
    let prevScrollY = window.scrollY;
    let isVisible = true;

    // -------------------------------------------------------------------------
    // Canvas sizing
    // -------------------------------------------------------------------------

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    }

    resize();

    // -------------------------------------------------------------------------
    // Scroll listener — passive, only writes a ref-like variable
    // -------------------------------------------------------------------------

    function onScroll() {
      rawScrollY = window.scrollY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    // -------------------------------------------------------------------------
    // Nebula rendering — drawn once per frame under the stars
    // Uses radial-gradient blobs to simulate gas cloud glow
    // -------------------------------------------------------------------------

    function drawNebulae(w: number, h: number) {
      const minDim = Math.min(w, h);
      for (const neb of NEBULAE) {
        const x = neb.cx * w;
        const y = neb.cy * h;
        const r = neb.radiusFactor * minDim;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, neb.color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 1.6, r, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // -------------------------------------------------------------------------
    // Core render loop
    // -------------------------------------------------------------------------

    function render(timestamp: number) {
      if (!isVisible) {
        rafId = requestAnimationFrame(render);
        return;
      }

      // Delta time in seconds — cap at 100ms to survive tab switch lag
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      // Smooth scroll velocity with exponential decay
      // This prevents stuttering when the user stops scrolling abruptly
      const rawDelta = rawScrollY - prevScrollY;
      prevScrollY = rawScrollY;
      // Exponential moving average — τ ≈ 6 frames
      scrollVelocity = scrollVelocity * 0.84 + rawDelta * 0.16;

      const extraSpeed = scrollVelocity * SCROLL_VELOCITY_FACTOR;
      const frameSpeed = Math.min(
        BASE_SPEED + Math.abs(extraSpeed),
        MAX_VELOCITY
      ) * (dt * 60); // normalize to 60fps so speed is frame-rate independent

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const cx = w / 2;
      const cy = h / 2;

      // Clear frame
      ctx.clearRect(0, 0, w, h);

      // Nebulae background glow
      drawNebulae(w, h);

      // Draw each star
      ctx.save();
      for (const star of stars) {
        // Advance Z toward viewer
        star.z -= frameSpeed;

        // Loop: when star passes the viewer (z <= 0), teleport to far end
        // This is the infinite loop mechanic — zero visual discontinuity
        // because the star was already tiny/invisible near z=0
        if (star.z <= 0) {
          const rand = mulberry32(
            (star.x * 7919 + star.y * 6301 + Date.now()) | 0
          );
          star.x = (rand() - 0.5) * 2 * SPREAD;
          star.y = (rand() - 0.5) * 2 * SPREAD;
          star.z = MAX_Z;
          star.initialZ = MAX_Z;
        }

        const [sx, sy, scale] = project(star.x, star.y, star.z, cx, cy);

        // Cull stars outside viewport (with 10px margin)
        if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue;

        // Progress from 0 (far) to 1 (close)
        const progress = 1 - star.z / star.initialZ;

        // Radius grows as star approaches
        const radius = Math.max(star.baseRadius * scale * 0.18, 0.5);

        // Opacity: fade in early, bright in middle, fade out at z close to 0
        // This prevents a hard pop when the star resets
        const fadeIn = Math.min(progress * 5, 1); // quick fade-in at distance
        const fadeOut = star.z < 60 ? star.z / 60 : 1; // gentle fade-out at close range
        const opacity = fadeIn * fadeOut;

        if (opacity <= 0.01) continue;

        // White-to-blue-white color temperature based on star size
        // Larger stars are slightly warmer (whiter), small stars cooler (blue-ish)
        const isBig = star.baseRadius > 1.8;
        const starColor = isBig
          ? `rgba(230, 235, 255, ${opacity})`
          : `rgba(180, 195, 255, ${opacity})`;

        // Draw star as filled circle
        // For larger stars, add a soft glow halo
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = starColor;
        ctx.fill();

        // Glow halo on bright, large, close stars only
        if (radius > 1.5 && opacity > 0.6) {
          const glowRadius = radius * 3;
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowRadius);
          glow.addColorStop(0, `rgba(180, 195, 255, ${opacity * 0.35})`);
          glow.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath();
          ctx.arc(sx, sy, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }
      }
      ctx.restore();

      rafId = requestAnimationFrame(render);
    }

    // -------------------------------------------------------------------------
    // Static render for reduced motion — one frame, no animation loop
    // -------------------------------------------------------------------------

    function renderStatic() {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);
      drawNebulae(w, h);

      for (const star of stars) {
        const [sx, sy] = project(star.x, star.y, star.z, cx, cy);
        if (sx < 0 || sx > w || sy < 0 || sy > h) continue;
        const opacity = (1 - star.z / MAX_Z) * 0.7 + 0.15;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(star.baseRadius * 0.5, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${opacity})`;
        ctx.fill();
      }
    }

    // -------------------------------------------------------------------------
    // IntersectionObserver — pause rAF when canvas is off-screen
    // (unlikely given it's fixed, but defensive for low-battery savings)
    // -------------------------------------------------------------------------

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // -------------------------------------------------------------------------
    // Resize handler — re-scales canvas and ctx transform
    // -------------------------------------------------------------------------

    function onResize() {
      // ctx.scale is cumulative — reset by re-getting context isn't possible,
      // so we set canvas size manually and re-apply scale.
      // canvas is guaranteed non-null here (checked at top of useEffect)
      const el = canvasRef.current;
      if (!el) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (reducedMotion) renderStatic();
    }

    window.addEventListener("resize", onResize);

    // -------------------------------------------------------------------------
    // Start
    // -------------------------------------------------------------------------

    if (reducedMotion) {
      renderStatic();
    } else {
      rafId = requestAnimationFrame(render);
    }

    // -------------------------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------------------------

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        // Fica atrás de todo o conteúdo. O slide-panel usa z-index: 10.
        // Valor negativo garante que nenhum elemento sem z-index explícito
        // cubra o canvas acidentalmente.
        zIndex: -1,
        pointerEvents: "none",
        // Deixa a GPU fazer a compositing — evita repaints durante o scroll
        willChange: "transform",
        // Canvas transparente — o background escuro (#020208) vem do CSS
        // do body/.slide-panel no dark mode, não do canvas
        background: "transparent",
        // Transição suave ao trocar de tema
        transition: "opacity 400ms ease",
      }}
    />
  );
}
