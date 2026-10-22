"use client";

import { useState } from "react";
import { BadgeCheck, Flag, Gamepad2, Heart, MapPin, MessageCircle, Sparkles, X } from "lucide-react";
import { ArcadeModal } from "@/components/ArcadeModal";
import { ChatThread } from "@/components/ChatThread";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useSafetyCenter } from "@/context/SafetyProvider";
import { useToast } from "@/context/ToastProvider";
import { getVibeTag } from "@/data/profileOptions";
import { cn, formatDistance } from "@/lib/utils";
import type { MatchProfile, OutcomeChip } from "@/types";

type Decision = "liked" | "passed" | null;

export interface ProfileCardProps {
  profile: MatchProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const [decision, setDecision] = useState<Decision>(null);
  const [photoFailed, setPhotoFailed] = useState(false);
  const [isArcadeOpen, setArcadeOpen] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [chips, setChips] = useState<OutcomeChip[]>([]);
  const { openReport } = useSafetyCenter();
  const toast = useToast();

  const handleLike = () => {
    setDecision((current) => (current === "liked" ? null : "liked"));
    if (decision !== "liked") {
      toast.success(`You liked ${profile.name}`, `${profile.name} can now message you first.`);
    }
  };

  const handlePass = () => {
    setDecision((current) => (current === "passed" ? null : "passed"));
  };

  /** Fresh ids per round so identical chips stay tappable after a rematch. */
  const handleChips = (newChips: OutcomeChip[]) => {
    const stamped = newChips.map((chip, index) => ({ ...chip, id: `${chip.id}_${Date.now()}_${index}` }));
    setChips((current) => [...current, ...stamped]);
    setArcadeOpen(false);
    setChatOpen(true);
    toast.success(
      "Round finished! 🎮",
      `${stamped.length} icebreaker ${stamped.length === 1 ? "chip" : "chips"} added to your chat with ${profile.name}.`
    );
  };

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-soft/70 shadow-card backdrop-blur-md transition-colors hover:border-white/20">
      <div className="relative h-64 overflow-hidden sm:h-72">
        {photoFailed ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose/40 via-ink-soft to-accent-purple/40 text-6xl">
            💗
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.photoUrl}
            alt={profile.name}
            onError={() => setPhotoFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            {profile.verification === "verified" ? (
              <Badge tone="emerald" icon={BadgeCheck}>
                Selfie verified
              </Badge>
            ) : (
              <Badge tone="glass">Unverified</Badge>
            )}
            {decision === "liked" ? (
              <Badge tone="rose" icon={Heart}>
                You liked
              </Badge>
            ) : null}
            {decision === "passed" ? (
              <Badge tone="glass" icon={X}>
                Passed
              </Badge>
            ) : null}
            {chips.length > 0 ? (
              <Badge tone="purple" icon={Sparkles}>
                {chips.length} icebreaker {chips.length === 1 ? "chip" : "chips"}
              </Badge>
            ) : null}
          </div>
          <Badge tone="purple" icon={Sparkles}>
            {profile.matchPercent}% match
          </Badge>
        </div>

        <div className="absolute inset-x-4 bottom-3">
          <h3 className="text-xl font-bold text-white">
            {profile.name}, {profile.age}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
            <MapPin className="h-3.5 w-3.5" />
            {profile.city} · {formatDistance(profile.distanceKm)}
          </p>
        </div>
      </div>

      <div className="space-y-3.5 p-4">
        <div className="flex flex-wrap gap-1.5">
          {profile.vibeTagIds.map((tagId) => {
            const tag = getVibeTag(tagId);
            return (
              <span
                key={tagId}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-muted"
              >
                <span>{tag?.emoji ?? "✨"}</span>
                {tag?.label ?? tagId}
              </span>
            );
          })}
        </div>

        <p className="text-xs leading-relaxed text-muted">{profile.bio}</p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePass}
            aria-label={`Pass on ${profile.name}`}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all active:scale-95",
              decision === "passed"
                ? "border-white/30 bg-white/15 text-white"
                : "border-white/10 bg-white/5 text-muted hover:border-rose/40 hover:text-rose-soft"
            )}
          >
            <X className="h-4 w-4" />
          </button>

          <Button onClick={() => setArcadeOpen(true)} icon={Gamepad2} className="h-11 flex-1 animate-none" fullWidth>
            Break the Ice 🎮
          </Button>

          <button
            type="button"
            onClick={handleLike}
            aria-label={`Like ${profile.name}`}
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all active:scale-95",
              decision === "liked"
                ? "border-rose/60 bg-rose/25 text-rose-soft"
                : "border-white/10 bg-white/5 text-muted hover:border-rose/40 hover:text-rose-soft"
            )}
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-[11px] text-muted transition hover:bg-white/10 hover:text-white"
          >
            <MessageCircle className="h-3 w-3" />
            {chips.length > 0 ? `Open chat · ${chips.length} new` : `Chat with ${profile.name}`}
          </button>
          <button
            type="button"
            onClick={() => openReport({ id: profile.id, name: profile.name })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-[11px] text-muted transition hover:bg-rose/10 hover:text-rose-soft"
          >
            <Flag className="h-3 w-3" />
            Report or block
          </button>
        </div>
      </div>

      <ArcadeModal
        open={isArcadeOpen}
        onClose={() => setArcadeOpen(false)}
        partner={profile}
        onChips={handleChips}
      />

      <Modal
        open={isChatOpen}
        onClose={() => setChatOpen(false)}
        size="lg"
        title={`Chat with ${profile.name}`}
        description="Tap an icebreaker chip to send it instantly — or type your own."
      >
        <ChatThread partner={profile} chips={chips} />
      </Modal>
    </article>
  );
}
