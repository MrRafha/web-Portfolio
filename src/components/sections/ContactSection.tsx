export function ContactSection() {
  return (
    <>
      <style>{`
        .contact-section { text-align: left; }
        .contact-section h2 {
          font-size: clamp(48px, 8vw, 110px);
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin: 18px 0 28px;
          font-weight: 600;
        }
        .contact-out { color: var(--moon); }
        .contact-links {
          display: flex; flex-wrap: wrap; gap: 14px;
          margin-top: 16px;
        }
        .btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 22px;
          border: 1px solid var(--line-2);
          background: rgba(13,20,40,0.4);
          color: var(--ink);
          text-decoration: none;
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 0.06em;
          transition: background 200ms ease, border-color 200ms ease, transform 200ms ease;
          border-radius: 2px;
        }
        .btn:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-1px);
        }
        .btn.primary { background: var(--moon); color: #1a1408; border-color: var(--moon); }
        .btn.primary:hover { background: #fff5d8; }
        .btn-glyph { font-size: 14px; }
        footer.foot {
          border-top: 1px solid var(--line);
          padding: 28px 0 36px;
          margin-top: 60px;
          color: var(--ink-mute);
          font-family: var(--font-mono);
          font-size: 12px;
          display: flex; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
        }
      `}</style>

      <section className="panel contact-section" id="contato">
        <div className="shell">
          <div className="eyebrow reveal">04 — contato</div>
          <h2 className="reveal">
            Vamos construir<br />
            algo <span className="contact-out">útil</span> juntos.
          </h2>
          <p className="section-lede reveal">
            Estou disponível para freela, colaboração ou oportunidade CLT/PJ.
            Se você precisa de uma interface sólida, um produto funcional ou
            quer tirar uma ideia do papel — vamos conversar.
          </p>
          <div className="contact-links reveal">
            <a className="btn primary" href="mailto:Hanryrafhael@gmail.com">
              <span className="btn-glyph">✉</span> Hanryrafhael@gmail.com
            </a>
            <a className="btn" href="https://github.com/MrRafha" target="_blank" rel="noopener noreferrer">
              <span className="btn-glyph">↗</span> GitHub
            </a>
            <a className="btn" href="https://www.linkedin.com/in/rafhael-hanry-1b998126b/" target="_blank" rel="noopener noreferrer">
              <span className="btn-glyph">↗</span> LinkedIn
            </a>
          </div>

          <footer className="foot">
            <span>© 2026 Rafhael Hanry — disponível para freela · CLT · PJ · resposta &lt; 24h.</span>
            <span>v1.0 · portfólio</span>
          </footer>
        </div>
      </section>
    </>
  );
}
