"use client";

import { useEffect, useRef } from "react";

interface ZoomOnScrollProps {
  children: React.ReactNode;
  id?: string;
}

/**
 * Efeito de zoom simples: seção sempre visível, faz zoom in ao scrollar para fora do viewport
 */
export function ZoomOnScroll({ children, id }: ZoomOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeitar preferência de redução de movimento
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId = 0;

    function update() {
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calcula o progresso baseado em quanto a seção saiu do viewport pelo topo
      // 0 = seção no viewport
      // 1 = seção completamente acima do viewport
      const progress = Math.max(0, Math.min(1, -rect.bottom / windowHeight + 1));

      if (progress > 0) {
        // Começa zoom quando a seção sai do viewport
        const scale = 1 + progress * 0.5; // 1.0 a 1.5
        const opacity = Math.max(0, 1 - progress * 1.5); // fade rápido

        el.style.transform = `scale(${scale.toFixed(3)})`;
        el.style.opacity = `${opacity.toFixed(3)}`;
      } else {
        // Seção no viewport = estado normal
        el.style.transform = "scale(1)";
        el.style.opacity = "1";
      }
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // Estado inicial

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className="will-change-transform will-change-opacity transition-none"
      style={{ transformOrigin: "center center" }}
    >
      {children}
    </div>
  );
}
