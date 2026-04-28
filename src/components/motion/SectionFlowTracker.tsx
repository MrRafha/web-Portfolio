"use client";

/**
 * SectionFlowTracker — Section state dispatcher
 *
 * Reads [data-flow-section] elements and dispatches "portfolio:section-signal"
 * events consumed by Navbar, SectionDots, and ProjectsSection.
 *
 * With the new ZoomSlide architecture, each section anchor is exactly 100vh tall.
 * The "active" section is whichever anchor contains the current scrollY midpoint.
 * Progress 0 = top of section, progress 1 = bottom.
 *
 * Snap behaviour: after SNAP_IDLE_MS without scroll, if progress > SNAP_THRESHOLD
 * we smooth-scroll to the next section; otherwise snap back to the current one.
 * Hero is excluded from snapping (it has internal scroll animations).
 */

import { useEffect } from "react";

type ScrollDirection = "down" | "up";

type SectionSignalDetail = {
  activeSection: string;
  nextSection: string | null;
  direction: ScrollDirection;
  /** 0 = section just entered viewport, 1 = section about to leave */
  progress: number;
};

const SECTION_SELECTOR = "[data-flow-section]";
/** Scroll idle time before snap fires (ms) */
const SNAP_IDLE_MS = 550;
/** Progress threshold to snap forward instead of back */
const SNAP_THRESHOLD = 0.52;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function getSectionKey(el: Element, index: number) {
  const key = el.getAttribute("data-flow-key");
  return key && key.trim().length > 0 ? key : `section-${index}`;
}

function isModalOpen() {
  return document.querySelector("[data-modal-open]") !== null;
}

export function SectionFlowTracker() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)
    );
    if (sections.length === 0) return;

    let lastScrollY = window.scrollY;
    let rafId = 0;
    let snapTimer = 0;
    let isSnapping = false;

    function emitSectionSignal(detail: SectionSignalDetail) {
      window.dispatchEvent(
        new CustomEvent<SectionSignalDetail>("portfolio:section-signal", { detail })
      );
    }

    function getActiveIndex(): {
      activeIndex: number;
      progress: number;
      direction: ScrollDirection;
    } {
      const direction: ScrollDirection =
        window.scrollY >= lastScrollY ? "down" : "up";

      // Each section is exactly 100vh — find which one contains scrollY
      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      let activeIndex = 0;
      for (let i = 0; i < sections.length; i++) {
        const top = sections[i].offsetTop;
        const bottom = top + sections[i].offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          activeIndex = i;
          break;
        }
        // Clamp to last section when scrollY exceeds all sections
        if (i === sections.length - 1) {
          activeIndex = i;
        }
      }

      const activeSection = sections[activeIndex];
      const sectionTop = activeSection.offsetTop;
      const sectionHeight = Math.max(activeSection.offsetHeight, 1);
      const progress = clamp((scrollY - sectionTop) / sectionHeight, 0, 1);

      return { activeIndex, progress, direction };
    }

    function snapToSection(index: number) {
      const target = sections[index];
      if (!target) return;
      isSnapping = true;
      window.scrollTo({ top: target.offsetTop, behavior: "smooth" });
      setTimeout(() => {
        isSnapping = false;
      }, 700);
    }

    function scheduleSnap(
      activeIndex: number,
      progress: number,
      direction: ScrollDirection,
      activeKey: string
    ) {
      clearTimeout(snapTimer);
      if (isModalOpen()) return;
      // Hero manages its own internal transitions
      if (activeKey === "hero") return;

      snapTimer = window.setTimeout(() => {
        if (isSnapping || isModalOpen()) return;

        if (
          direction === "down" &&
          progress >= SNAP_THRESHOLD &&
          activeIndex + 1 < sections.length
        ) {
          snapToSection(activeIndex + 1);
        } else {
          // Snap back to current section top
          snapToSection(activeIndex);
        }
      }, SNAP_IDLE_MS);
    }

    function updateFlowState() {
      const { activeIndex, progress, direction } = getActiveIndex();
      lastScrollY = window.scrollY;

      // Mark next section when we're more than 50% through the current one
      const nextIndex =
        direction === "down" && progress > 0.5 ? activeIndex + 1 : -1;
      const nextSection =
        nextIndex >= 0 && nextIndex < sections.length
          ? sections[nextIndex]
          : null;
      const activeSection = sections[activeIndex];

      // Apply data-flow-state to every section for CSS consumers
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
        nextSection: nextSection
          ? getSectionKey(nextSection, nextIndex)
          : null,
        direction,
        progress,
      });

      if (!isSnapping) {
        scheduleSnap(
          activeIndex,
          progress,
          direction,
          getSectionKey(activeSection, activeIndex)
        );
      }
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
      clearTimeout(snapTimer);
    };
  }, []);

  return null;
}
