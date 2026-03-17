"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

type Variant = "default" | "children";

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Delay em ms antes de revelar (só no modo default) */
  delay?: number;
  /**
   * Stagger em ms entre cada filho direto.
   * Só funciona quando variant="children".
   */
  stagger?: number;
  /** "default" = wrapper único | "children" = cada filho animado individualmente */
  variant?: Variant;
  /** Se true, revela uma vez e nao volta a esconder */
  once?: boolean;
  className?: string;
}

const BASE_HIDDEN = "opacity-0 scale-[0.97]";
const BASE_VISIBLE =
  "opacity-100 scale-100 transition-[opacity,transform] ease-out duration-500";

function resolveReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Componente de reveal por scroll.
 * Zoom médio (0.92→1), zoom-out ao sair da viewport, reduced-motion safe.
 */
export function ScrollReveal({
  children,
  delay = 0,
  stagger = 0,
  variant = "default",
  once = true,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Lazy initializer: se reduced-motion preferido, começa já visível
  const [visible, setVisible] = useState<boolean>(() => resolveReducedMotion());

  useEffect(() => {
    // reduced-motion — já está visível pelo lazy initializer, nada a fazer
    if (visible && delay === 0) return;

    const el = ref.current;
    if (!el) return;

    let delayTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (delayTimer) clearTimeout(delayTimer);

        if (entry.isIntersecting) {
          if (delay) {
            delayTimer = setTimeout(() => setVisible(true), delay);
          } else {
            setVisible(true);
          }
          if (once) observer.disconnect();
        } else {
          if (!once) setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (delayTimer) clearTimeout(delayTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  // variant="children" — anima cada filho com delay escalonado
  if (variant === "children" && stagger > 0) {
    return (
      <div ref={ref} className={className}>
        {Children.map(children, (child, i) => {
          if (!isValidElement(child)) return child;
          return (
            <ChildReveal key={i} visible={visible} delay={delay + i * stagger}>
              {cloneElement(child as React.ReactElement)}
            </ChildReveal>
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={[
        BASE_VISIBLE,
        visible ? "" : BASE_HIDDEN,
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

/** Wrapper individual para cada filho em variant="children" */
function ChildReveal({
  children,
  visible,
  delay,
}: {
  children: React.ReactNode;
  visible: boolean;
  delay: number;
}) {
  // Lazy initializer: se reduced-motion preferido, começa já visível
  const [show, setShow] = useState<boolean>(() => resolveReducedMotion());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (visible) {
      timerRef.current = setTimeout(() => setShow(true), delay);
    } else {
      timerRef.current = setTimeout(() => setShow(false), 50);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, delay]);

  return (
    <div
      className={[BASE_VISIBLE, show ? "" : BASE_HIDDEN]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
