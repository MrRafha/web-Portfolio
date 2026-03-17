"use client";

import { useEffect } from "react";

type ScrollDirection = "down" | "up";

type SectionSignalDetail = {
  activeSection: string;
  nextSection: string | null;
  direction: ScrollDirection;
  progress: number;
};

const SECTION_SELECTOR = "[data-flow-section]";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function getSectionKey(el: Element, index: number) {
  const key = el.getAttribute("data-flow-key");
  return key && key.trim().length > 0 ? key : `section-${index}`;
}

export function SectionFlowTracker() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(SECTION_SELECTOR));
    if (sections.length === 0) return;

    let lastScrollY = window.scrollY;
    let rafId = 0;

    function emitSectionSignal(detail: SectionSignalDetail) {
      window.dispatchEvent(new CustomEvent<SectionSignalDetail>("portfolio:section-signal", { detail }));
    }

    function updateFlowState() {
      const centerY = window.scrollY + window.innerHeight * 0.5;
      const direction: ScrollDirection = window.scrollY >= lastScrollY ? "down" : "up";
      lastScrollY = window.scrollY;

      let activeIndex = 0;
      for (let i = 0; i < sections.length; i += 1) {
        const section = sections[i];
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (centerY >= top && centerY < bottom) {
          activeIndex = i;
          break;
        }
      }

      const activeSection = sections[activeIndex];
      const activeTop = activeSection.offsetTop;
      const activeHeight = Math.max(activeSection.offsetHeight, 1);
      const progress = clamp((centerY - activeTop) / activeHeight, 0, 1);

      const nextIndex = direction === "down" && progress > 0.68 ? activeIndex + 1 : -1;
      const nextSection = nextIndex >= 0 && nextIndex < sections.length ? sections[nextIndex] : null;

      sections.forEach((section, index) => {
        const state =
          index === activeIndex
            ? "active"
            : index === nextIndex
              ? "next"
              : index < activeIndex
                ? "past"
                : "upcoming";
        section.dataset.flowState = state;
      });

      emitSectionSignal({
        activeSection: getSectionKey(activeSection, activeIndex),
        nextSection: nextSection ? getSectionKey(nextSection, nextIndex) : null,
        direction,
        progress,
      });
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateFlowState);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateFlowState();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
