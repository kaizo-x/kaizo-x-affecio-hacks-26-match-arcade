"use client";

import { useState } from "react";
import { Gamepad2, Lock, MessageCircle, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/context/ToastProvider";
import { getVibeTag } from "@/data/profileOptions";
import { cn } from "@/lib/utils";
import type { MatchProfile } from "@/types";

interface GamePreview {
  id: string;
  name: string;
  emoji: string;
  description: string;
  minutes: string;
}

const GAME_PREVIEWS: GamePreview[] = [
  {
    id: "trivia-toss",
    name: "Trivia Toss",
    emoji: "🎯",
    description: "60-second quickfire round. Answer together to unlock a bonus question.",
    minutes: "2 min",
  },
  {
    id: "emoji-riddle",
    name: "Emoji Riddle",
    emoji: "🧩",
    description: "Guess the movie from emoji clues — fastest guess sends the next one.",
    minutes: "3 min",
  },
  {
    id: "two-truths",
    name: "Two Truths One Lie",
    emoji: "🎭",
    description: "Swap three statements and let them spot the lie.",
    minutes: "4 min",
  },
];

export interface ArcadeLobbyModalProps {
  open: boolean;
  onClose: () => void;
  profile: MatchProfile;
  onSendOpener: (message: string) => void;
}

export function ArcadeLobbyModal({ open, onClose, profile, onSendOpener }: ArcadeLobbyModalProps) {
  const toast = useToast();
  const [customOpener, setCustomOpener] = useState("");

  const sharedTag = getVibeTag(profile.vibeTagIds[0]);
  const openers = [
    sharedTag
      ? `Okay, ${sharedTag.emoji} ${sharedTag.label} — defend that take. Best one right now, go.`
      : `Give me the one thing you could talk about for an hour straight.`,
    `Arcade challenge: I bring the 🎯 trivia, you bring the 🧩 riddles. Loser buys chai?`,
    `Two truths, one lie — I'll start: I've beaten every Tekken boss, I can't swim, I own 14 plants.`,
  ];

  const handleLockedGame = () => {
    toast.info("Phase 2 unlock", "The arcade cabinets are wired up and ship in Phase 2.");
  };

  const handleSend = (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) {
      toast.error("Nothing to send", "Pick an opener below or type your own.");
      return;
    }
    onSendOpener(trimmed);
    setCustomOpener("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={`Arcade lobby with ${profile.name}`}
      description="Break the ice before the small talk gets awkward."
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-2xl border border-accent-purple/25 bg-gradient-to-r from-accent-purple/12 via-white/5 to-rose/10 p-4">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-violet" />
          <p className="text-xs leading-relaxed text-muted">
            Games turn a match into a conversation. Both of you answer in the same round, so nobody has to carry the
            chat alone.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {GAME_PREVIEWS.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={handleLockedGame}
              className={cn(
                "flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-left transition-all",
                "hover:-translate-y-0.5 hover:border-accent-purple/40 hover:bg-white/10"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{game.emoji}</span>
                <Badge tone="purple" icon={Lock}>
                  Phase 2
                </Badge>
              </div>
              <p className="text-sm font-semibold text-white">{game.name}</p>
              <p className="text-[11px] leading-relaxed text-muted">{game.description}</p>
              <span className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted">
                <Gamepad2 className="h-3 w-3" />
                {game.minutes} · 2 players
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-2.5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
            <MessageCircle className="h-3.5 w-3.5" />
            Send an opener instead
          </p>
          {openers.map((opener) => (
            <button
              key={opener}
              type="button"
              onClick={() => handleSend(opener)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-left text-xs leading-relaxed text-white transition-all hover:-translate-y-0.5 hover:border-rose/40 hover:bg-rose/10"
            >
              {opener}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={customOpener}
            onChange={(event) => setCustomOpener(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSend(customOpener);
            }}
            placeholder="Write your own icebreaker…"
            aria-label="Custom icebreaker message"
            className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-slate-500 backdrop-blur-md transition-colors focus:border-accent-purple/60 focus:outline-none focus:ring-2 focus:ring-accent-purple/40"
          />
          <Button icon={Send} onClick={() => handleSend(customOpener)} className="sm:w-auto">
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
}
