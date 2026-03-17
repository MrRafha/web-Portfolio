"use client";

import { profile, projects } from "@/data/portfolio";
import Image from "next/image";
import { useEffect, useState } from "react";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function HeroSection() {
  const [progress, setProgress] = useState(0);
  const featuredProject = projects.find((project) => project.featured) ?? projects[0];

  useEffect(() => {
    let rafId = 0;
    let lastProgress = -1;

    function applyProgress() {
      const maxRange = window.innerHeight * 0.65;
      const raw = clamp(window.scrollY / maxRange, 0, 1);
      const next = easeOutCubic(raw);
      if (Math.abs(next - lastProgress) > 0.008) {
        lastProgress = next;
        setProgress(next);
      }
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(applyProgress);
    }

    applyProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const firstStateOpacity = 1 - progress;
  const secondStateOpacity = progress;

  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-6rem] top-[-4rem] h-72 w-72 rounded-full bg-indigo-500/22 blur-3xl" />
        <div className="absolute right-[-4rem] top-[4rem] h-80 w-80 rounded-full bg-indigo-300/14 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-[20%] h-72 w-72 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,101,242,0.16),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_28%)]" />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-6 py-8 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-100">
            <span className="h-2 w-2 rounded-full bg-indigo-300" />
            {profile.role} com foco em produto
          </div>

          <div className="relative mt-6 min-h-[10rem] sm:min-h-[12rem] lg:min-h-[13rem]">
            <h2
              className="max-w-3xl text-4xl font-semibold leading-[1.1] text-white transition-all duration-500 sm:text-5xl lg:text-[4rem]"
              style={{
                opacity: firstStateOpacity,
                transform: `translateY(${(progress * -14).toFixed(1)}px)`,
              }}
            >
              Construo interfaces modernas e produtos digitais com foco em utilidade real.
            </h2>

            <p
              className="absolute inset-0 max-w-2xl text-base leading-8 text-slate-200 transition-all duration-500 sm:text-lg"
              style={{
                opacity: secondStateOpacity,
                transform: `translateY(${((1 - progress) * 14).toFixed(1)}px)`,
              }}
            >
              {profile.description}
            </p>
          </div>
        </div>

        <div className="relative lg:pt-2">
          <div className="relative h-[28rem] sm:h-[32rem] md:h-[34rem] max-h-[80vh] sm:max-h-[85vh] lg:max-h-none">
            <article
              className="absolute inset-0 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-[#101018]/90 to-indigo-500/12 p-5 shadow-2xl backdrop-blur-xl transition-all duration-500"
              style={{
                opacity: secondStateOpacity,
                transform: `translateY(${(progress * -10).toFixed(1)}px)`,
                pointerEvents: secondStateOpacity > 0.5 ? "auto" : "none",
              }}
            >
              <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-indigo-300">Perfil</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{profile.name}</h3>
                </div>
                <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-200">
                  GitHub
                </span>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-4 flex flex-col h-[calc(100%-120px)] sm:h-[calc(100%-140px)]">
                <div className="relative w-full flex-1 overflow-hidden rounded-[16px]">
                  <Image
                    src="https://github.com/MrRafha.png?size=500"
                    alt="Foto de perfil do GitHub"
                    className="h-full w-full rounded-[16px] object-cover"
                    width={500}
                    height={500}
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3 hidden sm:grid">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Área</p>
                    <p className="mt-1 text-sm font-medium text-white">Frontend & Produto</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Stack</p>
                    <p className="mt-1 text-sm font-medium text-white">React + Next</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Especialidade</p>
                    <p className="mt-1 text-sm font-medium text-white">Interfaces modernas</p>
                  </div>
                </div>
              </div>
            </article>

            <article
              className="absolute inset-0 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-[#101018]/90 to-indigo-500/12 p-5 shadow-2xl backdrop-blur-xl transition-all duration-500 flex flex-col"
              style={{
                opacity: firstStateOpacity,
                transform: `translateY(${((1 - progress) * 10).toFixed(1)}px)`,
                pointerEvents: firstStateOpacity > 0.5 ? "auto" : "none",
              }}
            >
              <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-indigo-300">Destaque</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{featuredProject.title}</h3>
                </div>
                <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-200">
                  Em evolucao
                </span>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 flex-1 overflow-y-auto">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-indigo-500/20 bg-slate-900 p-4">
                    <p className="text-sm font-medium text-white">Visao de produto</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{featuredProject.description}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Stack base</p>
                      <p className="mt-2 text-sm font-medium text-white">{featuredProject.stack.slice(0, 4).join(", ")}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Direcao</p>
                      <p className="mt-2 text-sm font-medium text-white">Utilidade real com identidade forte</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
