import { SectionTitle } from "@/components/sections/SectionTitle";

export function AboutSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] border border-white/10 bg-[#11111a]/75 p-6 backdrop-blur">
          <SectionTitle eyebrow="Sobre" title="Portfolio com identidade de produto" />
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#11111a]/75 p-6 backdrop-blur">
          <p className="text-base leading-7 text-slate-300">
            Esta landing page foi pensada para apresentar nao apenas tecnologias,
            mas tambem a forma como eu construo projetos. Meu foco esta em
            interfaces modernas, ferramentas uteis para comunidades digitais e
            aplicacoes com base solida para evoluir com o tempo.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-300">
            A estetica visual foi refinada para uma paleta escura com acentos em
            indigo, inspirada no UltimateTracker. O resultado fica mais coerente,
            com contraste limpo e foco maior no conteudo.
          </p>
        </div>
      </div>
    </section>
  );
}
