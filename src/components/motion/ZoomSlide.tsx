"use client";

import { useEffect, useRef } from "react";

interface ZoomSlideProps {
  children: React.ReactNode;
  /**
   * Primeira seção: começa já visível, só anima na saída.
   */
  isFirst?: boolean;
  id?: string;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** Easing cúbico in-out para transições suaves */
function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Cada seção fica "presa" na tela (sticky) enquanto o scroll
 * avança dentro do container de 200vh.
 *
 * Entrada → zoom de 0.88 para 1 + fade in
 * Meio    → escala 1, totalmente visível
 * Saída   → zoom de 1 para 1.3 + fade out (a seção "explode" e some)
 */
export function ZoomSlide({ children, isFirst = false, id }: ZoomSlideProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Inicializa todas as seções como visíveis
    content.style.transform = "scale(1)";
    content.style.opacity = "1";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId = 0;
    let startY = 0;
    let endY = 1;
    let scrollable = 1;

    function recalcBounds() {
      // Usa offsetTop do próprio container para calcular posição
      // Isso funciona porque cada container h-[200vh] está posicionado sequencialmente
      const rect = container!.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const realTop = rect.top + scrollTop;

      const available = Math.max(container!.offsetHeight - window.innerHeight, 1);
      startY = realTop;
      scrollable = available;
      endY = startY + scrollable;

      // Debug: mostrar valores calculados
      if (id) {
        console.log(`[${id}] BOUNDS: startY=${startY}, scrollable=${scrollable}, endY=${endY}`);
      }
    }

    function update() {
      const progress = clamp((window.scrollY - startY) / scrollable, 0, 1);

      let scale: number;
      let opacity: number;

      // Todas as seções agora têm o mesmo comportamento:
      // Sempre visíveis, só fazem zoom out ao scrollar
      if (progress < 0.6) {
        scale = 1;
        opacity = 1;
      } else {
        const t = ease((progress - 0.6) / 0.4);
        scale = 1 + 0.3 * t;
        opacity = 1 - t;
      }

      // Debug: mostrar valores a cada frame (apenas se mudou significativamente)
      if (id && Math.random() < 0.1) { // 10% das vezes para não spammar
        console.log(`[${id}] scrollY=${window.scrollY.toFixed(0)}, progress=${progress.toFixed(2)}, scale=${scale.toFixed(2)}, opacity=${opacity.toFixed(2)}`);
      }

      content!.style.transform = `translateZ(0) scale(${scale})`;
      content!.style.opacity = `${opacity}`;
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    function onResize() {
      recalcBounds();
      onScroll();
    }

    recalcBounds();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update(); // estado inicial

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, [isFirst]);

  return (
    <div ref={containerRef} id={id} className="relative h-[200vh]">
      {/* A seção fica grudada no topo enquanto o scroll passa */}
      <div className="sticky top-0 z-10 min-h-screen overflow-visible bg-[#0a0a0f]">
        <div
          ref={contentRef}
          className="min-h-screen flex flex-col justify-center overflow-visible will-change-transform will-change-opacity"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
