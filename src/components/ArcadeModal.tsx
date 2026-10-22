"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Clock, Gamepad2, Sparkles, Trophy } from "lucide-react";
import { CoOpCanvas } from "@/components/CoOpCanvas";
import { HotTakeSwipe } from "@/components/HotTakeSwipe";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ARCADE_GAMES } from "@/data/arcadeContent";
import { cn } from "@/lib/utils";
import type { ArcadeGame, ArcadeGameId, MatchProfile, OutcomeChip } from "@/types";

const ACCENTS: Record<ArcadeGame["accent"], { card: string; icon: string; badge: string }> = {
  rose: {
    card: "hover:border-rose/50 hover:bg-rose/10",
    icon: "from-rose/30 to-rose/5",
    badge: "border-rose/40 bg-rose/15 text-rose-soft",
  },
  purple: {
    card: "hover:border-accent-purple/50 hover:bg-accent-purple/10",
    icon: "from-accent-purple/30 to-accent-purple/5",
    badge: "border-accent-purple/40 bg-accent-purple/15 text-accent-violet",
  },
  emerald: {
    card: "hover:border-emerald-400/50 hover:bg-emerald-400/10",
    icon: "from-emerald-400/30 to-emerald-400/5",
    badge: "border-emerald-400/40 bg-emerald-400/15 text-emerald-300",
  },
};

export interface ArcadeModalProps {
  open: boolean;
  onClose: () => void;
  partner: MatchProfile;
  /** Outcome chips produced by a finished round, ready to drop into the chat. */
  onChips: (chips: OutcomeChip[]) => void;
}

/** "Break the Ice 🎮" launcher: pick a mini-game, play it, send the result to chat. */
export function ArcadeModal({ open, onClose, partner, onChips }: ArcadeModalProps) {
  const [gameId, setGameId] = useState<ArcadeGameId | null>(null);

  useEffect(() => {
    if (!open) setGameId(null);
  }, [open]);

  const selectedGame = ARCADE_GAMES.find((game) => game.id === gameId) ?? null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={selectedGame ? `${selectedGame.emoji} ${selectedGame.name}` : `Arcade with ${partner.name}`}
      description={
        selectedGame
          ? `${selectedGame.durationSeconds} seconds · you and ${partner.name} play the same round`
          : "Pick a game. Whatever you produce becomes your first message."
      }
      headerAccessory={
        selectedGame ? (
          <Badge tone="purple" icon={Clock}>
            {selectedGame.durationSeconds}s
          </Badge>
        ) : (
          <Badge tone="rose" icon={Trophy}>
            2 games
          </Badge>
        )
      }
    >
      <AnimatePresence mode="wait">
        {selectedGame ? (
          <motion.div
            key={selectedGame.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            <button
              type="button"
              onClick={() => setGameId(null)}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted transition hover:text-white"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back to arcade
            </button>

            {selectedGame.id === "hot-take-swipe" ? (
              <HotTakeSwipe partnerName={partner.name} onComplete={onChips} />
            ) : (
              <CoOpCanvas partnerName={partner.name} onComplete={(chip) => onChips([chip])} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="picker"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.22 }}
            className="space-y-5"
          >
            <div className="flex items-start gap-3 rounded-2xl border border-accent-purple/25 bg-gradient-to-r from-accent-purple/12 via-white/5 to-rose/10 p-4">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-violet" />
              <p className="text-xs leading-relaxed text-muted">
                Small talk is optional here. Play a 15–30 second round with {partner.name} and we&apos;ll turn the result
                into a chat opener neither of you has to think about.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ARCADE_GAMES.map((game) => {
                const accent = ACCENTS[game.accent];
                return (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => setGameId(game.id)}
                    className={cn(
                      "flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:-translate-y-0.5",
                      accent.card
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl",
                        accent.icon
                      )}
                    >
                      {game.emoji}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{game.name}</span>
                      <span className="mt-1 block text-[11px] leading-relaxed text-muted">{game.tagline}</span>
                    </span>
                    <span className="mt-auto flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                          accent.badge
                        )}
                      >
                        <Clock className="h-3 w-3" />
                        {game.durationSeconds}s
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-muted">
                        <Gamepad2 className="h-3 w-3" />
                        {game.rounds} {game.rounds === 1 ? "round" : "rounds"}
                      </span>
                    </span>
                    <span className="text-[11px] leading-relaxed text-muted/90">{game.howToPlay}</span>
                  </button>
                );
              })}
            </div>

            <p className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-[11px] text-muted">
              <Trophy className="h-3.5 w-3.5 shrink-0 text-rose-soft" />
              No losing here — every round ends in a result you can send straight into the chat.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
