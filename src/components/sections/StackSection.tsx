export function StackSection() {
  const items = [
    { cat: "FRONTEND · UI", glyph: "01", title: "React & Next.js", desc: "Interfaces performáticas com clareza, consistência visual e foco em uso real." },
    { cat: "LINGUAGEM",     glyph: "02", title: "TypeScript",       desc: "Tipos como ferramenta de design — aplicação tipada de ponta a ponta." },
    { cat: "ESTILO",        glyph: "03", title: "Tailwind & shadcn/ui", desc: "Sistemas de componentes consistentes, acessíveis e fáceis de evoluir." },
    { cat: "DADOS",         glyph: "04", title: "Prisma · NeonDB",  desc: "Modelagem, autenticação e persistência prontas para escalar." },
    { cat: "BACK-END",      glyph: "05", title: "Node.js & APIs",   desc: "APIs REST e camadas de serviço pensadas para evolução contínua." },
    { cat: "ENTREGA",       glyph: "06", title: "Vercel · Docker",  desc: "Versionamento, deploy e empacotamento para ambientes reais." },
    { cat: "FERRAMENTAS",   glyph: "07", title: "Git & GitHub",     desc: "Fluxo de trabalho versionado, com PRs, revisão e CI integrados." },
    { cat: "EXTRAS",        glyph: "08", title: "Flutter · Java · Python", desc: "Base complementar para mobile, automação e bots de comunidade." },
  ];

  return (
    <>
      <style>{`
        h2.section-title {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: clamp(32px, 4.6vw, 56px);
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 0 0 18px;
        }
        .section-lede {
          color: var(--ink-soft);
          max-width: 60ch;
          font-size: 17px;
        }
        .stack-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--line);
          border: 1px solid var(--line);
          margin-top: 48px;
        }
        @media (max-width: 900px) { .stack-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .stack-grid { grid-template-columns: 1fr; } }
        .stack-cell {
          background: rgba(13,20,40,0.55);
          padding: 24px 22px;
          min-height: 150px;
          display: flex; flex-direction: column; justify-content: space-between;
          transition: background 200ms ease;
        }
        .stack-cell:hover { background: rgba(18,27,53,0.85); }
        .stack-cell-top {
          display: flex; justify-content: space-between; align-items: center;
          font-family: var(--font-mono); font-size: 11px; color: var(--ink-mute);
          letter-spacing: 0.1em;
        }
        .stack-glyph {
          width: 22px; height: 22px; border: 1px solid var(--line-2);
          display: grid; place-items: center;
          color: var(--moon); font-family: var(--font-mono); font-size: 11px;
        }
        .stack-cell h3 {
          font-size: 22px; font-weight: 500; letter-spacing: -0.01em;
          margin: 18px 0 6px; color: var(--ink);
        }
        .stack-cell p {
          margin: 0; color: var(--ink-soft); font-size: 14px;
        }
      `}</style>

      <section className="panel" id="stack">
        <div className="shell">
          <div className="eyebrow reveal">02 — stack</div>
          <h2 className="section-title reveal">Ferramentas com as quais construo todos os dias.</h2>
          <p className="section-lede reveal">
            Escolho a tecnologia certa para o problema, mas tenho preferências.
            Estas são as ferramentas que conheço a fundo.
          </p>

          <div className="stack-grid">
            {items.map((item) => (
              <div className="stack-cell reveal" key={item.glyph}>
                <div className="stack-cell-top">
                  <span>{item.cat}</span>
                  <span className="stack-glyph">{item.glyph}</span>
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
