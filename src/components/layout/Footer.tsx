import { profile } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-6 pb-14 pt-8 sm:px-8 lg:px-10">
      <div className="rounded-[32px] border border-white/10 bg-[#11111a]/78 p-6 backdrop-blur">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-indigo-300">
              Contato
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Vamos transformar ideia em produto.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Espaco ideal para adicionar seus links finais, email profissional e
              canais principais. Esta secao ja esta pronta para producao e pode
              receber icones depois, sem alterar a base estrutural.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Email
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
