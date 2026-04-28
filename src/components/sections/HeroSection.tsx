"use client";

import { useEffect, useRef } from "react";

export function HeroSection() {
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = arrowRef.current;
    if (!el) return;

    let lastTime = 0;
    let count = 0;

    function onIteration(e: AnimationEvent) {
      const now = e.timeStamp;
      const delta = lastTime ? now - lastTime : null;
      count++;
      console.log(
        `[drip] iteração #${count} | duração real: ${delta ? delta.toFixed(1) + "ms" : "—"} | esperado: 2200ms | browser: ${navigator.userAgent.includes("Firefox") ? "Firefox" : "outro"}`
      );
      if (delta && delta < 1000) {
        console.warn(`[drip] ⚠ tick muito rápido (${delta.toFixed(0)}ms) — possível bug de transform-origin no Firefox`);
      }
      lastTime = now;
    }

    el.addEventListener("animationiteration", onIteration);
    return () => el.removeEventListener("animationiteration", onIteration);
  }, []);

  return (
    <>
      <style>{`
        .hero {
          height: 100vh;
          display: grid;
          place-items: end center;
          padding-bottom: 64px;
          position: relative;
        }
        .hero-tagline {
          text-align: center;
          color: rgba(255,255,255,0.72);
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-shadow: 0 2px 16px rgba(0,0,0,0.6);
        }
        .scroll-hint {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          opacity: 0.85;
        }
        .drip-arrow {
          width: 1px;
          height: 36px;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.9));
          /* transform-origin fixo — mudar origem dentro dos keyframes causa restart no Firefox */
          transform-origin: top center;
          animation: drip 2.2s ease-in-out infinite;
        }
        @keyframes drip {
          0%   { transform: scaleY(0) translateY(0);    opacity: 0; }
          40%  { transform: scaleY(1) translateY(0);    opacity: 1; }
          60%  { transform: scaleY(1) translateY(0);    opacity: 1; }
          100% { transform: scaleY(0) translateY(100%); opacity: 0; }
        }

        /* debug: loga no console a velocidade do tick da animação */
      `}</style>
      <section className="hero" id="hero" aria-label="Início">
        <div className="hero-tagline">
          <span className="scroll-hint">
            <span>role para baixo</span>
            <span ref={arrowRef} className="drip-arrow" aria-hidden="true" />
          </span>
        </div>
      </section>
    </>
  );
}
