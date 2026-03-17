"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollFadeProps {
  children: React.ReactNode;
  id?: string;
}

/**
 * Componente de fade + scale leve ao scrollar.
 * Conteúdo SEMPRE visível por padrão (opacity: 1).
 * Anima apenas quando IntersectionObserver detecta entrada no viewport.
 */
export function ScrollFade({ children, id }: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1); // Visível por padrão
  const [scale, setScale] = useState(1); // Escala normal

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeitar preferência de redução de movimento
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // Mantém estado padrão (visível, sem animação)
    }

    let rafId = 0;
    let scrollListener: (() => void) | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Começar animação quando entrar no viewport
          function update() {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const elementCenter = rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenter - elementCenter);
            const maxDistance = window.innerHeight;

            // Fade in quando chegar perto do centro
            const fadeProgress = Math.max(0, 1 - distance / (maxDistance * 0.6));
            setOpacity(fadeProgress);
            setScale(0.95 + fadeProgress * 0.05); // 0.95 a 1.0
          }

          scrollListener = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(update);
          };

          window.addEventListener("scroll", scrollListener, { passive: true });
          update(); // Executa imediatamente ao entrar
        } else {
          // Quando sai do viewport, remove listener para performance
          if (scrollListener) {
            window.removeEventListener("scroll", scrollListener);
            scrollListener = null;
          }
        }
      },
      { threshold: 0.1, rootMargin: "100px" } // Trigger 100px antes de entrar
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (scrollListener) {
        window.removeEventListener("scroll", scrollListener);
      }
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      style={{
        opacity,
        transform: `scale(${scale})`,
        transition: "none",
      }}
      className="transition-opacity transform will-change-transform"
    >
      {children}
    </div>
  );
}
