"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type ShellMode = "home" | "login" | "signup";

type TaskflowShellProps = {
  mode: ShellMode;
  children: ReactNode;
};

const featureItems = [
  {
    title: "Smart task capture",
    description:
      "Add tasks in seconds with natural language, priorities, and labels detected automatically.",
    icon: "◌",
    iconClass: "bg-violet-500/15 text-violet-200",
  },
  {
    title: "Kanban & list views",
    description:
      "Switch between board and list mode instantly and keep work organized your way.",
    icon: "☰",
    iconClass: "bg-emerald-500/15 text-emerald-200",
  },
  {
    title: "Focus timer & streaks",
    description:
      "Stay in flow with built-in focus sessions that help you work with less friction.",
    icon: "◔",
    iconClass: "bg-rose-500/15 text-rose-200",
  },
];

function LogoMark() {
  return (
    <div className="grid h-16 w-16 grid-cols-2 gap-1.5 rounded-2xl bg-gradient-to-br from-indigo-400 via-sky-400 to-emerald-500 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
      <span className="rounded-sm bg-white/90" />
      <span className="rounded-sm bg-white/55" />
      <span className="rounded-sm bg-white/55" />
      <span className="rounded-sm bg-white/35" />
    </div>
  );
}

export function TaskflowShell({ mode, children }: TaskflowShellProps) {
  const desktopGridClass =
    mode === "login"
      ? "xl:grid-cols-[7fr_3fr]"
      : "xl:grid-cols-[1.05fr_0.95fr]";

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#0f1017] p-2.5 text-[#f4f0e8] sm:p-3 md:p-4">
      <section className={`relative mx-auto grid h-full overflow-hidden rounded-[24px] border border-white/12 shadow-[0_32px_120px_rgba(0,0,0,0.45)] ${desktopGridClass}`}>
        <div className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(120,100,255,0.22),_transparent_32%),linear-gradient(180deg,_#16142b_0%,_#121225_55%,_#121528_100%)] px-5 py-6 sm:px-8 sm:py-8 xl:flex xl:flex-col xl:px-12 xl:py-10">
          <div className="absolute -left-24 top-[-6rem] h-72 w-72 rounded-full bg-[#302e6e]/55 blur-3xl" />
          <div className="absolute bottom-[-7rem] left-[-3rem] h-72 w-72 rounded-full bg-[#143d55]/70 blur-3xl" />
          <div className="absolute right-[-7rem] top-[-4rem] h-96 w-96 rounded-full bg-[#2d2b74]/55 blur-3xl" />

          <div className="relative flex h-full min-h-0 flex-col justify-between gap-8 lg:gap-10">
            <div>
              <div className="flex items-center gap-4 lg:gap-5">
                <LogoMark />
                <div>
                  <p className="text-[0.8rem] uppercase tracking-[0.45em] text-emerald-300/90">
                    Your productivity OS
                  </p>
                  <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#fffaf0] sm:text-4xl lg:text-5xl">
                    TaskFlow
                  </h1>
                </div>
              </div>

              <div className="mt-10 max-w-2xl lg:mt-12">
                <p className="text-sm uppercase tracking-[0.42em] text-white/35">
                  Work smarter, not harder.
                </p>
                <h2 className="mt-4 font-serif text-4xl font-semibold leading-[0.95] tracking-tight text-[#fffaf0] sm:text-5xl lg:text-6xl xl:text-7xl">
                  Work smarter,
                  <span className="mt-2 block text-[#b3a5ff] italic">
                    not harder.
                  </span>
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
                  TaskFlow brings your tasks, deadlines, and team into one calm
                  space so you spend less time managing and more time doing.
                </p>
              </div>

              <div className="mt-10 space-y-4 lg:mt-12 lg:space-y-6">
                {featureItems.map((feature) => (
                  <div key={feature.title} className="flex gap-4 sm:gap-5">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl ring-1 ring-inset ring-white/8 lg:h-16 lg:w-16 lg:text-2xl ${feature.iconClass}`}
                    >
                      {feature.icon}
                    </div>
                    <div className="max-w-xl">
                      <h3 className="text-xl font-semibold text-[#f8f4ec] lg:text-2xl">
                        {feature.title}
                      </h3>
                      <p className="mt-1.5 text-base leading-7 text-white/52 lg:text-lg lg:leading-8">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-3 text-white/45 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-base font-medium text-white/38 lg:text-lg">
                Created by Faraz Ghani
              </p>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2.5 text-xs uppercase tracking-[0.3em] text-emerald-200/90 backdrop-blur lg:text-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_8px_rgba(52,211,153,0.18)]" />
                10 active users
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-0 items-stretch bg-[#2d2c29] px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8 xl:px-12 xl:py-10">
          <div className="flex w-full flex-col justify-center overflow-hidden">
            {mode === "home" ? (
              <div className="mx-auto flex w-full max-w-xl flex-col justify-center">
                <div className="mb-5 flex items-center gap-3 xl:hidden">
                  <LogoMark />
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.36em] text-emerald-300/90">
                      TaskFlow
                    </p>
                    <p className="mt-1 text-sm text-[#c7beb1]">
                      Sign in or create an account
                    </p>
                  </div>
                </div>
                <p className="hidden text-2xl font-semibold tracking-tight text-[#f5efe7] xl:block xl:text-5xl">
                  Welcome back
                </p>
                <p className="mt-2 hidden text-lg leading-8 text-[#d0c9c0] xl:block sm:text-xl">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-[#6b5cff] transition-colors hover:text-[#8a7cff]"
                  >
                    Sign up free
                  </Link>
                </p>

                <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4 xl:mt-7">
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center rounded-2xl border border-white/16 bg-[#393733] px-5 py-3 text-base font-medium text-white transition-transform hover:-translate-y-0.5 hover:border-white/22 hover:bg-[#403d39] sm:px-6 sm:py-4 sm:text-2xl"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="flex w-full items-center justify-center rounded-2xl border border-white/14 bg-transparent px-5 py-3 text-base font-medium text-[#f4efe8] transition-colors hover:border-white/22 hover:bg-white/6 sm:px-6 sm:py-4 sm:text-2xl"
                  >
                    Sign up
                  </Link>
                </div>

                <div className="mt-6 hidden border-t border-white/10 pt-6 xl:block sm:mt-10 sm:pt-8">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-3xl font-semibold text-[#f5efe7] sm:text-4xl">
                        10
                      </p>
                      <p className="mt-1 text-base text-[#c8c0b6] sm:text-lg">
                        Active users
                      </p>
                    </div>
                    <div>
                      <p className="text-3xl font-semibold text-[#f5efe7] sm:text-4xl">
                        98%
                      </p>
                      <p className="mt-1 text-base text-[#c8c0b6] sm:text-lg">
                        Satisfaction
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-md sm:max-w-lg xl:max-w-lg">
                <div className="mb-5 flex items-center gap-3 xl:hidden">
                  <LogoMark />
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.36em] text-emerald-300/90">
                      TaskFlow
                    </p>
                    <p className="mt-1 text-sm text-[#c7beb1]">
                      {mode === "login" ? "Sign in to continue" : "Create your account"}
                    </p>
                  </div>
                </div>
                {children}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
