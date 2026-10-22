"use client";

import { useState } from "react";
import { Gamepad2, Ghost, Heart, Pencil, ShieldCheck, Sparkles, Tags } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileCard } from "@/components/match/ProfileCard";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import { SafetyTipsBanner } from "@/components/safety/SafetyTipsBanner";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, VerificationBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/context/authStore";
import { useSafetyCenter } from "@/context/SafetyProvider";
import { ARCADE_GAMES } from "@/data/arcadeContent";
import { MOCK_MATCHES } from "@/data/mockMatches";
import { getVibeTag } from "@/data/profileOptions";

export function DashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const [isEditing, setEditing] = useState(false);
  const { openSafetyCenter } = useSafetyCenter();

  if (!user) return null;

  const isIncognito = user.safety.profileVisibility === "incognito";
  const vibeTags = user.profile.vibeTagIds
    .map((id) => getVibeTag(id))
    .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag));

  return (
    <>
      <AppShell>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                name={user.name}
                arcadeAvatarId={user.profile.arcadeAvatarId}
                photoUrl={user.profile.avatarUrl}
                size="lg"
                verified={user.verification === "verified"}
              />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted">Your player card</p>
                <h1 className="text-2xl font-bold text-white">
                  Hey {user.name} <span className="animate-pulse">👋</span>
                </h1>
                <div className="mt-2 flex flex-wrap gap-2">
                  <VerificationBadge status={user.verification} />
                  {isIncognito ? (
                    <Badge tone="purple" icon={Ghost}>
                      Incognito
                    </Badge>
                  ) : (
                    <Badge tone="emerald" icon={Sparkles}>
                      In the deck
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" icon={Pencil} onClick={() => setEditing(true)}>
                Edit profile
              </Button>
              <Button variant="secondary" icon={ShieldCheck} onClick={openSafetyCenter}>
                Privacy &amp; Safety
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-ink/50 p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted">
                <Heart className="h-3.5 w-3.5 text-rose" />
                New matches today
              </p>
              <p className="mt-1.5 text-2xl font-bold text-white">{MOCK_MATCHES.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink/50 p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted">
                <Tags className="h-3.5 w-3.5 text-accent-violet" />
                Your vibe tags
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {vibeTags.length > 0 ? (
                  vibeTags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[11px] text-muted"
                    >
                      {tag.emoji} {tag.label}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted">Add your 3 vibe tags in the profile editor.</span>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink/50 p-3.5">
              <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted">
                <Gamepad2 className="h-3.5 w-3.5 text-rose-soft" />
                Icebreakers available
              </p>
              <p className="mt-1.5 text-2xl font-bold text-white">
                {MOCK_MATCHES.length * 3}
                <span className="ml-1.5 text-xs font-normal text-muted">openers ready</span>
              </p>
            </div>
          </div>

          {user.profile.bio ? (
            <p className="mt-4 rounded-2xl border border-white/10 bg-ink/50 p-3.5 text-xs leading-relaxed text-muted">
              <span className="font-semibold text-white">Your bio: </span>
              {user.profile.bio}
            </p>
          ) : null}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Today&apos;s deck</h2>
              <p className="mt-0.5 text-xs text-muted">Two profiles who share your vibe tags.</p>
            </div>
            <Badge tone="rose">{MOCK_MATCHES.length} new</Badge>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {MOCK_MATCHES.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <SafetyTipsBanner />
        </section>

        <section className="mt-6 rounded-3xl border border-accent-purple/25 bg-gradient-to-br from-accent-purple/12 via-white/5 to-rose/10 p-5 backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge tone="emerald" icon={Gamepad2}>
                Playable now
              </Badge>
              <h2 className="mt-3 text-lg font-semibold text-white">Arcade cabinets in the lobby</h2>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-muted">
                Hit &quot;Break the Ice 🎮&quot; on any match card, play a quick round, and the result lands in your chat
                as a one-tap opener.
              </p>
            </div>
            <div className="grid w-full max-w-xs gap-2">
              {ARCADE_GAMES.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-ink/50 px-3.5 py-2.5 text-xs"
                >
                  <span className="flex items-center gap-2 text-white">
                    <span>{game.emoji}</span>
                    {game.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-muted">
                    {game.durationSeconds}s · {game.rounds} {game.rounds === 1 ? "round" : "rounds"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AppShell>

      <OnboardingModal open={!user.onboardingComplete} mode="required" />
      <OnboardingModal open={isEditing} mode="edit" onClose={() => setEditing(false)} />
    </>
  );
}
