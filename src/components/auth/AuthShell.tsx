import type { ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";

export interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-ink px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-arcade-radial" aria-hidden />
      <div className="pointer-events-none absolute inset-0 arcade-grid opacity-40" aria-hidden />

      <div className="relative w-full max-w-5xl">
        <div className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-card backdrop-blur-md sm:p-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-between gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-rose to-accent-purple text-xl shadow-glow">
                🎮
              </span>
              <span>
                <span className="block text-base font-bold text-white">
                  Match<span className="gradient-text">Arcade</span>
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-muted">
                  from match to conversation
                </span>
              </span>
            </Link>

            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-soft">{eyebrow}</p>
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">{title}</h1>
              <p className="max-w-md text-sm leading-relaxed text-muted">{subtitle}</p>

              <ul className="space-y-2.5 text-sm text-muted">
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Incognito mode, blocking and selfie verification built in
                </li>
                <li className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-accent-violet" />
                  Break the ice with arcade mini-games instead of small talk
                </li>
              </ul>
            </div>

            <p className="text-[11px] leading-relaxed text-muted">
              Phase 1 build · accounts are stored locally in this browser for the AFFECIO HACKS &apos;26 demo.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-ink-soft/70 p-5 backdrop-blur-md sm:p-6">
            <div className="animate-fade-up">{children}</div>
            <div className="mt-5 border-t border-white/10 pt-4 text-center text-xs text-muted">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
