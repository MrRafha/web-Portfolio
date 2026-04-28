export function AboutSection() {
  return (
    <>
      <style>{`
        .panel {
          padding: clamp(80px, 14vh, 160px) 0;
          position: relative;
        }
        .shell {
          width: var(--shell);
          margin: 0 auto;
        }
        .eyebrow {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--moon);
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }
        .eyebrow::before {
          content: "";
          width: 22px;
          height: 1px;
          background: var(--moon);
        }
        .about-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: clamp(32px, 6vw, 80px);
          align-items: start;
        }
        @media (max-width: 820px) {
          .about-grid { grid-template-columns: 1fr; }
        }
        .photo-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          border-radius: 4px;
          overflow: hidden;
          background:
            repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 8px, rgba(255,255,255,0.0) 8px 16px),
            linear-gradient(180deg, #1a2444, #0e1530);
          border: 1px solid var(--line-2);
          box-shadow: 0 24px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02) inset;
        }
        .photo-frame img.profile {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          z-index: 1;
        }
        .photo-label {
          position: absolute; inset: auto 0 0 0;
          padding: 14px 16px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--ink-mute);
          letter-spacing: 0.08em;
          background: linear-gradient(180deg, transparent, rgba(0,0,0,0.55));
          display: flex; justify-content: space-between; align-items: center;
          z-index: 2;
        }
        .photo-frame::before,
        .photo-frame::after,
        .photo-corners::before,
        .photo-corners::after {
          content: "";
          position: absolute; width: 14px; height: 14px;
          border: 1px solid var(--moon);
          opacity: 0.7;
          z-index: 2;
        }
        .photo-frame::before { top: 10px; left: 10px; border-right: 0; border-bottom: 0; }
        .photo-frame::after  { top: 10px; right: 10px; border-left: 0; border-bottom: 0; }
        .photo-corners::before { bottom: 10px; left: 10px; border-right: 0; border-top: 0; }
        .photo-corners::after  { bottom: 10px; right: 10px; border-left: 0; border-top: 0; }
        .name {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: clamp(40px, 6vw, 76px);
          letter-spacing: -0.025em;
          line-height: 1;
          margin: 0 0 14px;
        }
        .name .accent { color: var(--moon); }
        .role-line {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--ink-soft);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 28px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        .pulse-dot {
          width: 8px; height: 8px; border-radius: 999px;
          background: var(--leaf);
          box-shadow: 0 0 0 0 rgba(111,191,143,0.7);
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(111,191,143,0.5); }
          70%  { box-shadow: 0 0 0 10px rgba(111,191,143,0); }
          100% { box-shadow: 0 0 0 0 rgba(111,191,143,0); }
        }
        p.bio {
          color: var(--ink);
          font-size: 18px;
          margin: 0 0 18px;
          max-width: 56ch;
        }
        p.bio.dim { color: var(--ink-soft); font-size: 16px; }
        .meta-grid {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          font-family: var(--font-mono);
          font-size: 12px;
        }
        @media (max-width: 600px) { .meta-grid { grid-template-columns: 1fr 1fr; } }
        .meta-cell {
          border: 1px solid var(--line-2);
          background: rgba(13,20,40,0.4);
          padding: 14px 14px 12px;
          border-radius: 2px;
        }
        .meta-k { color: var(--ink-mute); letter-spacing: 0.1em; text-transform: uppercase; font-size: 10px; }
        .meta-v { color: var(--ink); margin-top: 4px; font-size: 14px; }

        /* reveal */
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 700ms ease, transform 700ms ease;
        }
        .reveal.in { opacity: 1; transform: none; }
      `}</style>

      <section className="panel" id="sobre">
        <div className="shell">
          <div className="about-grid">
            {/* Foto */}
            <div className="photo-frame reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="profile"
                src="https://avatars.githubusercontent.com/MrRafha?size=600"
                alt="Foto de perfil de Rafhael Hanry"
              />
              <div className="photo-corners" />
              <div className="photo-label">
                <span>rafhael.jpg</span>
                <span>@MrRafha</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <div className="eyebrow reveal">01 — sobre</div>
              <h1 className="name reveal">
                Olá, eu sou <span className="accent">Rafhael Hanry</span>.
              </h1>
              <div className="role-line reveal">
                <span className="pulse-dot" aria-hidden="true" />
                Desenvolvedor Frontend · Disponível para projetos
              </div>

              <p className="bio reveal">
                Interfaces que as pessoas entendem na primeira vez — do design ao deploy.
              </p>
              <p className="bio dim reveal">
                Sou estudante de ADS com foco em frontend e experiência de produto.
                Trabalho principalmente com React, Next.js, TypeScript, Prisma e Postgres,
                criando soluções para projetos reais, comunidades digitais e aplicações
                com base sólida para crescer.
              </p>

              <div className="meta-grid reveal">
                <div className="meta-cell">
                  <div className="meta-k">Localização</div>
                  <div className="meta-v">Brasil — Piauí</div>
                </div>
                <div className="meta-cell">
                  <div className="meta-k">Formato</div>
                  <div className="meta-v">Freela · CLT · PJ</div>
                </div>
                <div className="meta-cell">
                  <div className="meta-k">Resposta</div>
                  <div className="meta-v">&lt; 24h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
