import type { Profile, Project, Stat, TechGroup } from "@/types/portfolio";

export const profile: Profile = {
  name: "Rafhael Hanry",
  role: "Desenvolvedor Frontend",
  headline:
    "Construo interfaces modernas e produtos web com foco em utilidade real, identidade visual e evolucao continua.",
  description:
    "Sou estudante de ADS com foco em frontend e experiencia de produto. Trabalho principalmente com React, Next.js, TypeScript, Prisma e NeonDB, criando solucoes para projetos reais, comunidades digitais e aplicacoes com base solida para crescer.",
  email: "Hanryrafhael@gmail.com",
  github: "https://github.com/MrRafha",
  linkedin: "https://www.linkedin.com/in/rafhael-hanry-1b998126b/",
};

export const stats: Stat[] = [
  { label: "Especialidade", value: "Frontend & Produto" },
  { label: "Base principal", value: "Next.js + TypeScript" },
  { label: "Banco de dados", value: "Prisma + NeonDB" },
  { label: "Perfil", value: "Web, Mobile e Bots" },
];

export const projects: Project[] = [
  {
    title: "Ultimate Tracker",
    category: "Projeto principal",
    description:
      "Plataforma voltada para organizacao, rastreamento e suporte a comunidades, com foco em usabilidade, clareza visual e visao de produto escalavel.",
    stack: ["Next.js", "TypeScript", "Prisma", "NeonDB", "Tailwind CSS"],
    highlights: ["Arquitetura modular", "Evolucao orientada por roadmap", "Base pronta para escala"],
    gallery: [
      {
        title: "Visao geral",
        caption: "Painel com foco em leitura rapida, status claros e navegacao objetiva.",
        image: "/projects/ultimate-tracker/01.png",
      },
      {
        title: "Fluxo de comunidade",
        caption: "Jornada pensada para suporte continuo e organizacao de informacoes.",
        image: "/projects/ultimate-tracker/02.png",
      },
      {
        title: "Escalabilidade",
        caption: "Estrutura preparada para novas features sem comprometer consistencia visual.",
        image: "/projects/ultimate-tracker/03.png",
      },
    ],
    href: "https://www.ultimatetracker.com",
    repo: "https://github.com/MrRafha",
    featured: true,
  },
  {
    title: "Projeto IFala",
    category: "Projeto colaborativo",
    description:
      "Projeto com foco em frontend e construcao de interfaces, destacando colaboracao em equipe, organizacao visual e desenvolvimento com proposito pratico.",
    stack: ["React", "TypeScript", "CSS", "Frontend"],
    highlights: ["Colaboracao em equipe", "Padrao visual consistente", "Entrega incremental"],
    gallery: [
      {
        title: "Interface principal",
        caption: "Tela principal com hierarquia visual e blocos de conteudo bem definidos.",
        image: "/projects/ifala/01.png",
      },
      {
        title: "Componente colaborativo",
        caption: "Componentes reutilizaveis para acelerar iteracoes e manutencao.",
        image: "/projects/ifala/02.png",
      },
      {
        title: "Experiencia final",
        caption: "Navegacao fluida com foco em produtividade e clareza para o usuario.",
        image: "/projects/ifala/03.png",
      },
    ],
    href: "https://ifala.cacor.ifpi.edu.br/",
    repo: "https://github.com/MrRafha",
  },
  {
    title: "Hello Kitty Water Reminder",
    category: "Aplicativo mobile",
    description:
      "Aplicacao mobile tematica com foco em engajamento, consistencia visual e experiencia do usuario, mostrando versatilidade alem do ecossistema web.",
    stack: ["Flutter", "Dart", "Mobile UI"],
    highlights: ["Design tematico", "Experiencia mobile", "Interacao recorrente"],
    gallery: [
      {
        title: "Tela inicial",
        caption: "Apresentacao visual marcante para reforcar identidade e carisma.",
        image: "/projects/hello-kitty/01.png",
      },
      {
        title: "Fluxo de lembrete",
        caption: "Interacoes simples e diretas para estimular uso diario.",
        image: "/projects/hello-kitty/02.png",
      },
      {
        title: "Componentes visuais",
        caption: "Biblioteca de elementos mobile com consistencia de estilo.",
        image: "/projects/hello-kitty/03.png",
      },
    ],
    repo: "https://github.com/MrRafha/Hello-Kitty-Drink-Wather",
  },
  {
    title: "Bots e ferramentas para comunidade",
    category: "Automacao",
    description:
      "Solucoes para organizacao de eventos, controle interno e automacoes uteis para grupos e servidores, com foco em confiabilidade e praticidade.",
    stack: ["Python", "Discord", "SQLite", "APIs"],
    highlights: ["Automacao util", "Confiabilidade operacional", "Suporte a comunidade"],
    gallery: [
      {
        title: "Painel de comandos",
        caption: "Fluxo de comandos para rotina de moderacao e gestao de eventos.",
        image: "/projects/bots/01.png",
      },
      {
        title: "Integracoes",
        caption: "Conexao com APIs e rotinas automatizadas para operacao continua.",
        image: "/projects/bots/02.png",
      },
      {
        title: "Monitoramento",
        caption: "Visibilidade de status e resposta rapida para operacoes do dia a dia.",
        image: "/projects/bots/03.png",
      },
    ],
    repo: "https://github.com/MrRafha",
  },
];

export const techGroups: TechGroup[] = [
  {
    title: "Frontend",
    summary: "Interfaces performaticas com foco em clareza, consistencia visual e experiencia de uso.",
    focus: "Produto e UI",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
  },
  {
    title: "Backend & Dados",
    summary: "Estruturas para autenticacao, modelagem e persistencia voltadas para evolucao continua.",
    focus: "Escalabilidade",
    items: ["Node.js", "Prisma", "NeonDB", "SQLite"],
  },
  {
    title: "Ferramentas",
    summary: "Fluxo de entrega com versionamento, deploy e empacotamento para ambientes reais.",
    focus: "Entrega continua",
    items: ["Git", "GitHub", "Docker", "Vercel"],
  },
  {
    title: "Extras",
    summary: "Base complementar para projetos mobile, automacao e logica em diferentes contextos.",
    focus: "Versatilidade",
    items: ["Flutter", "Java", "Python"],
  },
];
