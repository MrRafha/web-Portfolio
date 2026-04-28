"use client";

import { RefObject } from "react";

interface NavbarProps {
  navRef: RefObject<HTMLElement | null>;
}

export function Navbar({ navRef }: NavbarProps) {
  return (
    <>
      <style>{`
        .nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px clamp(20px, 4vw, 48px);
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--ink);
          transition: background-color 240ms ease, backdrop-filter 240ms ease, border-color 240ms ease;
          border-bottom: 1px solid transparent;
        }
        .nav.scrolled {
          background: rgba(10, 16, 32, 0.55);
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          border-bottom-color: var(--line);
        }
        .nav .brand {
          display: inline-flex; align-items: center; gap: 10px;
          letter-spacing: 0.02em;
          text-decoration: none; color: inherit;
        }
        .nav .brand .dot {
          width: 8px; height: 8px; border-radius: 999px;
          background: var(--moon);
          box-shadow: 0 0 12px var(--moon);
          flex-shrink: 0;
        }
        .nav .brand b { font-weight: 600; }
        .nav .brand .soft { color: var(--ink-soft); }
        .nav ul {
          list-style: none; padding: 0; margin: 0;
          display: flex; gap: clamp(16px, 2.4vw, 32px);
        }
        .nav a.nav-link {
          color: var(--ink-soft);
          text-decoration: none;
          transition: color 160ms ease;
        }
        .nav a.nav-link:hover { color: var(--ink); }
        .nav a.nav-link .num { color: var(--moon); margin-right: 6px; }
        @media (max-width: 600px) {
          .nav ul { display: none; }
        }
      `}</style>
      <nav className="nav" ref={navRef as RefObject<HTMLElement>}>
        <a href="#hero" className="brand">
          <span className="dot" aria-hidden="true" />
          <b>rafhael</b><span className="soft">/hanry</span>
        </a>
        <ul>
          <li><a href="#sobre" className="nav-link"><span className="num">01</span>sobre</a></li>
          <li><a href="#stack" className="nav-link"><span className="num">02</span>stack</a></li>
          <li><a href="#projetos" className="nav-link"><span className="num">03</span>projetos</a></li>
          <li><a href="#contato" className="nav-link"><span className="num">04</span>contato</a></li>
        </ul>
      </nav>
    </>
  );
}
