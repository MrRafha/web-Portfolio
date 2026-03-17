import { profile } from "@/data/portfolio";
import { SectionTitle } from "@/components/sections/SectionTitle";

const contactOptions = [
  {
    title: "Email",
    description: "Para propostas, freelas e oportunidades de trabalho.",
    href: `mailto:${profile.email}`,
    label: profile.email,
    cta: "Enviar email",
  },
  {
    title: "LinkedIn",
    description: "Conexao profissional e networking de produto e frontend.",
    href: profile.linkedin,
    label: "Perfil no LinkedIn",
    cta: "Abrir LinkedIn",
  },
  {
    title: "GitHub",
    description: "Repositorios, projetos ativos e historico de evolucao.",
    href: profile.github,
    label: "Perfil no GitHub",
    cta: "Ver GitHub",
  },
];

export function ContactSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8 pb-14 sm:px-8 lg:px-10">
      <div className="rounded-[36px] border border-white/10 bg-gradient-to-r from-indigo-600/16 via-[#101018]/88 to-indigo-400/12 p-6 sm:p-8">
        <SectionTitle
          eyebrow="Contato"
          title="Vamos construir algo util juntos"
          description="Escolha o canal que fizer mais sentido para conversarmos sobre projeto, colaboracao ou oportunidade de trabalho."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {contactOptions.map((option) => (
            <article
              key={option.title}
              className="rounded-3xl border border-white/10 bg-[#0f0f18]/75 p-5 backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">{option.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{option.description}</p>
              <p className="mt-4 text-sm font-medium text-white">{option.label}</p>
              <a
                href={option.href}
                target={option.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={option.href.startsWith("mailto:") ? undefined : "noreferrer"}
                className="mt-5 inline-flex rounded-xl border border-indigo-400/25 bg-indigo-500/14 px-4 py-2 text-sm font-medium text-indigo-50 transition hover:bg-indigo-500/22"
              >
                {option.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
