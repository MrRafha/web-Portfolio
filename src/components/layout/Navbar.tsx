import { profile } from "@/data/portfolio";

export function Navbar() {
  const navItems = [
    { label: "Sobre", href: "#sobre" },
    { label: "Projetos", href: "#projetos" },
    { label: "Stack", href: "#stack" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-indigo-300">Portfolio</p>
          <h1 className="mt-1 text-base font-semibold text-white">{profile.name}</h1>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
