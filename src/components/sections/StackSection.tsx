import { SectionTitle } from "@/components/sections/SectionTitle";
import { techGroups } from "@/data/portfolio";

export function StackSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <SectionTitle
        eyebrow="Stack"
        title="Base tecnica completa"
        description="Uma organizacao clara das tecnologias que sustentam meus projetos atuais e a direcao que quero fortalecer no meu portfolio."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-12">
        {techGroups.map((group) => (
          <div
            key={group.title}
            className="rounded-[32px] border border-white/10 bg-gradient-to-b from-indigo-500/10 via-[#101018]/85 to-white/5 p-6 backdrop-blur md:col-span-1 xl:col-span-6"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold text-white">{group.title}</h3>
              <span className="rounded-full border border-indigo-400/25 bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-100">
                {group.focus}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-300">{group.summary}</p>

            <div className="mt-5 h-px w-full bg-white/10" />

            <div className="mt-5 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-100"
                >
                  {item}
                </span>
              ))}
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.16em] text-slate-400">Competencias ativas</p>
          </div>
        ))}
      </div>
    </section>
  );
}
