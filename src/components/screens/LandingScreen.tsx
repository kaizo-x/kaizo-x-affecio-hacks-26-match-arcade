"use client";

import Link from "next/link";
import { Gamepad2, Lock, MessageSquareHeart, ShieldCheck, Sparkles, Tags, UserCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";

const PRIMARY_LINK =
  "inline-flex h-12 select-none items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose to-accent-purple px-6 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 active:scale-[0.97]";

const SECONDARY_LINK =
  "inline-flex h-12 select-none items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15 active:scale-[0.97]";

const FEATURES = [
  {
    icon: Gamepad2,
    title: "Arcade icebreakers",
    body: "Trivia Toss, Emoji Riddle and Two Truths One Lie play out in real time so neither person carries the chat alone.",
    tone: "rose" as const,
  },
  {
    icon: MessageSquareHeart,
    title: "Match to conversation",
    body: "Every match lands with a ready-to-send opener, so the first message never sits unanswered.",
    tone: "purple" as const,
  },
  {
    icon: ShieldCheck,
    title: "Safety-first controls",
    body: "Incognito browsing, profile pause, block unknown messages, reports and selfie verification — all one tap away.",
    tone: "emerald" as const,
  },
  {
    icon: Tags,
    title: "Vibe tag matching",
    body: "Pick three vibes and we surface people whose tags actually overlap with yours.",
    tone: "amber" as const,
  },
];

const TONES: Record<string, string> = {
  rose: "from-rose/25 to-transparent text-rose-soft",
  purple: "from-accent-purple/25 to-transparent text-accent-violet",
  emerald: "from-emerald-400/20 to-transparent text-emerald-300",
  amber: "from-amber-400/20 to-transparent text-amber-300",
};

export function LandingScreen() {
  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-5 py-10 text-center backdrop-blur-md sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-rose/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-accent-purple/20 blur-3xl" />

        <div className="relative mx-auto max-w-2xl">
          <Badge tone="purple" icon={Sparkles}>
            AFFECIO HACKS &apos;26 · Track 2: From Match to Conversation
          </Badge>

          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Match. Chat. <span className="gradient-text">Play.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            MatchArcade is the dating arcade where matches are won before the first message. Get matched, launch a
            two-player game, and let the conversation write itself.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className={PRIMARY_LINK}>
              <Gamepad2 className="h-4 w-4" />
              Create your player card
            </Link>
            <Link href="/login" className={SECONDARY_LINK}>
              <UserCheck className="h-4 w-4" />
              I already have an account
            </Link>
          </div>

          <p className="mt-4 text-[11px] text-muted">
            Strictly 18+ · Accounts are stored in your browser for this demo build.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-transform hover:-translate-y-1"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${TONES[feature.tone]}`} />
            <div className="relative">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-ink/60">
                <feature.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-3.5 text-base font-semibold text-white">{feature.title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{feature.body}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-ink-soft/70 p-5 backdrop-blur-md sm:p-7">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge tone="rose" icon={Lock}>
              Phase 2 preview
            </Badge>
            <h2 className="mt-3 text-xl font-semibold text-white">The arcade cabinets are being wired up</h2>
            <p className="mt-1.5 max-w-lg text-xs leading-relaxed text-muted">
              Phase 1 gives you the full match-to-conversation pipeline: profiles, onboarding, safety controls and the
              Break the Ice invite. Phase 2 drops playable rounds with live scoring and shared results.
            </p>
          </div>
          <ul className="grid w-full max-w-xs gap-2 text-xs text-muted">
            {["🎯 Trivia Toss — 2 min", "🧩 Emoji Riddle — 3 min", "🎭 Two Truths One Lie — 4 min"].map((game) => (
              <li
                key={game}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5"
              >
                <span className="text-white">{game.split("—")[0]}</span>
                <span className="text-[10px] uppercase tracking-wide text-muted">
                  {game.split("—")[1]?.trim()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
