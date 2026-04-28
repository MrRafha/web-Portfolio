export function HeroSection() {
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
          animation: drip 2.2s ease-in-out infinite;
        }
        @keyframes drip {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 0; }
          40%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          60%  { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }
      `}</style>
      <section className="hero" id="hero" aria-label="Início">
        <div className="hero-tagline">
          <span className="scroll-hint">
            <span>role para baixo</span>
            <span className="drip-arrow" aria-hidden="true" />
          </span>
        </div>
      </section>
    </>
  );
}
