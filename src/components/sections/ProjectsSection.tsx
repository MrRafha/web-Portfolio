"use client";

import { useEffect, useRef, useState } from "react";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { projects } from "@/data/portfolio";

type ScrollDirection = "down" | "up";

type SectionSignalDetail = {
  activeSection: string;
  nextSection: string | null;
  direction: ScrollDirection;
  progress: number;
};

export function ProjectsSection() {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    function onSectionSignal(event: Event) {
      const customEvent = event as CustomEvent<SectionSignalDetail>;
      const detail = customEvent.detail;
      if (!detail) return;

      if (detail.activeSection === "projetos") {
        setIsInView(true);
        return;
      }

      if (detail.activeSection === "stack" || detail.activeSection === "contato") {
        setIsInView(false);
      }
    }

    window.addEventListener("portfolio:section-signal", onSectionSignal as EventListener);

    return () => {
      window.removeEventListener("portfolio:section-signal", onSectionSignal as EventListener);
    };
  }, []);

  return (
    <section data-flow-key="projetos" data-flow-section className="w-full px-6 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-300">Projetos</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Alguns projetos</h2>
        </div>

        <div className="mt-12 relative">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "thin",
            }}
          >
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="flex-shrink-0 w-full snap-start md:w-150 lg:w-180"
                style={{
                  minWidth: "min(100%, 900px)",
                }}
                aria-label={project.title}
              >
                <ProjectShowcase
                  project={project}
                  index={index}
                  isActive={isInView}
                  flowProgress={0}
                  isCarousel={true}
                />
              </div>
            ))}
          </div>

          {/* Botões flutuantes */}
          <button
            type="button"
            onClick={() => scroll("left")}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20 hover:border-white/40 z-10"
            aria-label="Scroll projetos para esquerda"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => scroll("right")}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20 hover:border-white/40 z-10"
            aria-label="Scroll projetos para direita"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Botões para mobile */}
          <div className="mt-4 flex lg:hidden justify-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="rounded-lg border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20 hover:border-white/40"
              aria-label="Scroll projetos para esquerda"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="rounded-lg border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20 hover:border-white/40"
              aria-label="Scroll projetos para direita"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  const element = containerRef.current?.children[index] as HTMLElement;
                  element?.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "center",
                  });
                }}
                className="h-2 rounded-full transition bg-white/30 hover:bg-white/50 w-2"
                aria-label={`Ir para projeto ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
