"use client";

import React, { useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { StackSection } from "@/components/sections/StackSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Page() {
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stillRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const videoPausedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.play().catch(() => {});

    function onScroll() {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const bg = bgRef.current;
      const still = stillRef.current;
      const vid = videoRef.current;
      const nav = navRef.current;

      if (!bg || !still || !vid) return;

      // Video → Image crossfade (0–35% of vh)
      const tCross = Math.min(1, Math.max(0, y / (vh * 0.35)));
      const easedCross = 1 - Math.pow(1 - tCross, 2);
      still.style.opacity = easedCross.toFixed(3);
      vid.style.opacity = (1 - easedCross).toFixed(3);

      if (easedCross >= 0.999 && !videoPausedRef.current) {
        vid.pause();
        videoPausedRef.current = true;
      } else if (easedCross < 0.999 && videoPausedRef.current) {
        vid.play().catch(() => {});
        videoPausedRef.current = false;
      }

      // Dark tint over full first viewport
      const tTint = Math.min(1, Math.max(0, y / (vh * 0.9)));
      const easedTint = 1 - Math.pow(1 - tTint, 2);
      bg.style.setProperty("--tint", (easedTint * 0.72).toFixed(3));

      // Subtle stage transform
      const scale = (1 + 0.04 * (1 - easedTint)).toFixed(4);
      const blur = (easedTint * 1.5).toFixed(2);
      const sat = (1 - easedTint * 0.25).toFixed(3);
      bg.style.transform = `scale(${scale})`;
      bg.style.filter = `blur(${blur}px) saturate(${sat})`;

      if (nav) nav.classList.toggle("scrolled", y > 24);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Fixed background stage */}
      <div
        ref={bgRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          background: "var(--bg-deep)",
          willChange: "transform, filter",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-pixel.png"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            imageRendering: "pixelated",
            zIndex: 1,
            opacity: 1,
            transition: "opacity 220ms linear",
          }}
        >
          <source src="/mobile-swing.mp4" media="(max-width: 767px)" type="video/mp4" />
          <source src="/hero-swing.mp4" type="video/mp4" />
        </video>
        <picture
          ref={stillRef as React.RefObject<HTMLElement>}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "block",
            opacity: 0,
            transition: "opacity 220ms linear",
          }}
        >
          <source srcSet="/mobile.png" media="(max-width: 767px)" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-pixel.png"
            alt=""
            aria-hidden="true"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              imageRendering: "pixelated",
            }}
          />
        </picture>
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            pointerEvents: "none",
            background:
              "radial-gradient(120% 80% at 50% 0%, transparent 40%, rgba(0,0,0,0.45) 100%), linear-gradient(180deg, rgba(0,0,0,var(--tint,0)) 0%, rgba(0,0,0,var(--tint,0)) 100%)",
            transition: "background 80ms linear",
          }}
        />
      </div>

      <Navbar navRef={navRef} />

      <main id="main-content" style={{ position: "relative", zIndex: 1 }}>
        <HeroSection />
        <AboutSection />
        <StackSection />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}
