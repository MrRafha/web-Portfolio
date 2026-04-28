const projects = [
  {
    idx: "01",
    title: "Ultimate Tracker",
    desc: "Ferramenta gratuita para gestão de comunidades de Albion Online — membros, atividade e suporte contínuo.",
    stack: "Next · TS · Prisma · NeonDB",
    year: "Em produção",
    href: "https://www.ultimatetracker.xyz/",
  },
  {
    idx: "02",
    title: "Projeto IFala",
    desc: "Frontend e construção de interfaces — colaboração em equipe e desenvolvimento com propósito prático.",
    stack: "React · TypeScript · CSS",
    year: "Em produção",
    href: "https://ifala.cacor.ifpi.edu.br/",
  },
  {
    idx: "03",
    title: "Hello Kitty Water Reminder",
    desc: "App mobile temático com foco em engajamento, consistência visual e experiência do usuário.",
    stack: "Flutter · Dart · Mobile UI",
    year: "Em dev",
    href: "https://github.com/MrRafha/Hello-Kitty-Drink-Wather",
  },
  {
    idx: "04",
    title: "Automação para Discord",
    desc: "Bots e ferramentas para gestão de eventos, moderação e integração com APIs externas.",
    stack: "Python · SQLite · APIs",
    year: "Em dev",
    href: "https://github.com/MrRafha",
  },
];

export function ProjectsSection() {
  return (
    <>
      <style>{`
        .projects-list {
          margin-top: 48px;
          border-top: 1px solid var(--line-2);
        }
        .project-row {
          display: grid;
          grid-template-columns: 56px 1fr 200px 140px;
          align-items: center;
          gap: 24px;
          padding: 28px 4px;
          border-bottom: 1px solid var(--line-2);
          transition: background 220ms ease, padding-left 220ms ease, padding-right 220ms ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .project-row:hover {
          background: rgba(18,27,53,0.5);
          padding-left: 18px;
          padding-right: 18px;
        }
        @media (max-width: 800px) {
          .project-row { grid-template-columns: 40px 1fr; }
          .project-row .proj-stack,
          .project-row .proj-year { display: none; }
        }
        .proj-idx {
          font-family: var(--font-mono); color: var(--moon);
          font-size: 13px; letter-spacing: 0.08em;
        }
        .proj-title { font-size: 22px; font-weight: 500; letter-spacing: -0.01em; }
        .proj-title small {
          display: block; font-weight: 400; font-size: 14px;
          color: var(--ink-soft); margin-top: 4px; letter-spacing: 0;
        }
        .proj-stack { font-family: var(--font-mono); font-size: 12px; color: var(--ink-soft); }
        .proj-year {
          font-family: var(--font-mono); font-size: 13px;
          color: var(--ink-mute); text-align: right;
        }
        .proj-arrow {
          display: inline-block; margin-left: 10px;
          transition: transform 220ms ease, color 220ms ease;
        }
        .project-row:hover .proj-arrow {
          transform: translateX(4px); color: var(--moon);
        }
      `}</style>

      <section className="panel" id="projetos">
        <div className="shell">
          <div className="eyebrow reveal">03 — projetos selecionados</div>
          <h2 className="section-title reveal">Coisas que construí recentemente.</h2>
          <p className="section-lede reveal">
            Uma seleção de projetos que demonstram como penso em produto, código e detalhes.
          </p>

          <div className="projects-list">
            {projects.map((p) => (
              <a
                key={p.idx}
                className="project-row reveal"
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.title}
              >
                <span className="proj-idx">{p.idx} /</span>
                <span className="proj-title">
                  {p.title}
                  <small>{p.desc}</small>
                </span>
                <span className="proj-stack">{p.stack}</span>
                <span className="proj-year">
                  {p.year} <span className="proj-arrow">→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
