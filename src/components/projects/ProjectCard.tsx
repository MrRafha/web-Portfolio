import type { Project } from "@/types/portfolio";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className={`flex h-full flex-col rounded-[32px] border p-6 backdrop-blur transition duration-200 hover:-translate-y-1 ${
        project.featured
          ? "border-indigo-500/30 bg-gradient-to-b from-indigo-500/12 via-[#11111a]/85 to-white/5"
          : "border-white/10 bg-gradient-to-b from-white/8 to-white/5"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-indigo-300">{project.category}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{project.title}</h3>
        </div>
        {project.featured ? (
          <span className="rounded-full border border-indigo-400/25 bg-indigo-500/12 px-3 py-1 text-xs font-medium text-indigo-100">
            Principal
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-300">{project.description}</p>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5">
        {project.stack.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 pt-1">
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Ver projeto
          </a>
        ) : null}
        {project.repo ? (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5"
          >
            Repositorio
          </a>
        ) : null}
      </div>
    </article>
  );
}
