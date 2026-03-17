export function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
      <div className="rounded-[36px] border border-white/10 bg-gradient-to-r from-indigo-600/16 via-[#11111a]/90 to-indigo-400/14 p-8 backdrop-blur">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-300">
              Proximo passo
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Estrutura pronta para crescer com GitHub API, paginas internas e deploy.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
              Esta segunda versao prioriza estrutura reutilizavel, legibilidade e
              facil manutencao. A base ja esta pronta para virar um projeto real
              em Next.js com dados dinamicos, animacoes leves e paginas
              detalhadas para cada case futuramente.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white">
              App Router ready
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white">
              Tailwind ready
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white">
              Escalavel
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
