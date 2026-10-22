"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Heart, RotateCcw, Send, Sparkles, Swords, Timer, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastProvider";
import { ARCADE_GAMES, HOT_TAKES, buildHotTakeChips, choiceCopy, resolvePartnerStance } from "@/data/arcadeContent";
import { cn } from "@/lib/utils";
import type { HotTakeChoice, HotTakeVerdict, OutcomeChip } from "@/types";

type Phase = "intro" | "playing" | "results";

const ROUND_SECONDS = ARCADE_GAMES[0].durationSeconds;
const PARTNER_THINK_MS = 550;

export interface HotTakeSwipeProps {
  partnerName: string;
  onComplete: (chips: OutcomeChip[]) => void;
}

/** 5 rapid opinions, both players answer, results turn into shareable chat chips. */
export function HotTakeSwipe({ partnerName, onComplete }: HotTakeSwipeProps) {
  const toast = useToast();
  const [phase, setPhase] = useState<Phase>("intro");
  const [verdicts, setVerdicts] = useState<HotTakeVerdict[]>([]);
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [partnerThinking, setPartnerThinking] = useState(false);
  const [chips, setChips] = useState<OutcomeChip[]>([]);
  const timeouts = useRef<number[]>([]);

  const after = useCallback((ms: number, run: () => void) => {
    const id = window.setTimeout(run, ms);
    timeouts.current.push(id);
  }, []);

  useEffect(() => () => timeouts.current.forEach((id) => window.clearTimeout(id)), []);

  const finish = useCallback(
    (finalVerdicts: HotTakeVerdict[]) => {
      const generated = buildHotTakeChips(finalVerdicts, partnerName);
      setVerdicts(finalVerdicts);
      setChips(generated);
      setPartnerThinking(false);
      setPhase("results");
    },
    [partnerName]
  );

  const start = () => {
    timeouts.current.forEach((id) => window.clearTimeout(id));
    setVerdicts([]);
    setIndex(0);
    setTimeLeft(ROUND_SECONDS);
    setPartnerThinking(false);
    setChips([]);
    setPhase("playing");
  };

  const choose = (choice: HotTakeChoice) => {
    if (phase !== "playing" || partnerThinking) return;
    const take = HOT_TAKES[index];
    if (!take) return;

    setPartnerThinking(true);
    const partner = resolvePartnerStance(take, partnerName);
    const verdict: HotTakeVerdict = { take, self: choice, partner, agreed: choice === partner };

    after(PARTNER_THINK_MS, () => {
      setVerdicts((current) => [...current, verdict]);
      setPartnerThinking(false);
      if (index + 1 >= HOT_TAKES.length) {
        finish([...verdicts, verdict]);
      } else {
        setIndex(index + 1);
      }
    });
  };

  // Countdown: when it hits zero the unanswered takes are filled in for you.
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      const answeredIds = new Set(verdicts.map((verdict) => verdict.take.id));
      const remainder = HOT_TAKES.filter((take) => !answeredIds.has(take.id)).map<HotTakeVerdict>((take) => {
        const self: HotTakeChoice = (take.id.length + take.prompt.length) % 2 === 0 ? "agree" : "disagree";
        const partner = resolvePartnerStance(take, partnerName);
        return { take, self, partner, agreed: self === partner };
      });
      toast.info("Time's up!", "We auto-answered the remaining takes so you still get results.");
      finish([...verdicts.filter((verdict) => answeredIds.has(verdict.take.id)), ...remainder]);
      return;
    }

    const id = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, timeLeft, verdicts, partnerName, toast, finish]);

  const agreements = verdicts.filter((verdict) => verdict.agreed).length;
  const clashes = verdicts.length - agreements;
  const currentTake = HOT_TAKES[index];
  const progress = Math.round(((index + (partnerThinking ? 1 : 0)) / HOT_TAKES.length) * 100);

  if (phase === "intro") {
    return (
      <div className="space-y-5">
        <div className="rounded-3xl border border-rose/25 bg-gradient-to-br from-rose/15 via-white/5 to-accent-purple/15 p-5">
          <span className="text-4xl">🔥</span>
          <h3 className="mt-3 text-lg font-semibold text-white">Hot Take Swipe with {partnerName}</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            {HOT_TAKES.length} spicy opinions, {ROUND_SECONDS} seconds. Swipe your honest answer and we reveal{" "}
            {partnerName}&apos;s pick straight after. Whatever you agree or clash on becomes your chat opener.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="rose" icon={Timer}>
              {ROUND_SECONDS}s round
            </Badge>
            <Badge tone="purple" icon={Users}>
              2 players
            </Badge>
            <Badge tone="emerald" icon={Sparkles}>
              {HOT_TAKES.length} takes
            </Badge>
          </div>
        </div>
        <Button size="lg" icon={Flame} onClick={start} fullWidth>
          Start rapid round
        </Button>
      </div>
    );
  }

  if (phase === "playing" && currentTake) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {HOT_TAKES.map((take, takeIndex) => (
              <span
                key={take.id}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  takeIndex < index ? "w-6 bg-rose" : takeIndex === index ? "w-9 bg-rose/70" : "w-6 bg-white/15"
                )}
              />
            ))}
          </div>
          <Badge tone={timeLeft <= 5 ? "danger" : "rose"} icon={Timer}>
            {timeLeft}s left
          </Badge>
        </div>

        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-rose to-accent-purple"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentTake.id}
            initial={{ opacity: 0, y: 24, rotate: -1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -24, rotate: 1.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md"
          >
            <p className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-muted">
              <Flame className="h-3 w-3 text-rose-soft" />
              Take {index + 1} of {HOT_TAKES.length}
            </p>
            <p className="mt-4 text-xl font-bold leading-snug text-white">“{currentTake.prompt}”</p>
            <p className="mt-3 text-xs text-muted">
              {partnerThinking ? `${partnerName} is answering…` : "Pick your honest answer"}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={partnerThinking}
            onClick={() => choose("agree")}
            className="flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-emerald-400/20 disabled:opacity-60"
          >
            <span className="text-2xl">{currentTake.agreeEmoji}</span>
            <span className="text-sm font-semibold text-white">{currentTake.agreeLabel}</span>
          </button>
          <button
            type="button"
            disabled={partnerThinking}
            onClick={() => choose("disagree")}
            className="flex items-center gap-3 rounded-2xl border border-rose/30 bg-rose/10 p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-rose/20 disabled:opacity-60"
          >
            <span className="text-2xl">{currentTake.disagreeEmoji}</span>
            <span className="text-sm font-semibold text-white">{currentTake.disagreeLabel}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <Heart className="h-3 w-3 text-rose" />
            {agreements} agreed so far
          </span>
          <span className="flex items-center gap-1.5">
            <Swords className="h-3 w-3 text-amber-300" />
            {clashes} clashes
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-rose/15 via-white/5 to-accent-purple/15 p-5 text-center">
        <p className="text-[11px] uppercase tracking-widest text-muted">Rapid round complete</p>
        <p className="mt-2 text-3xl font-bold text-white">
          {agreements}
          <span className="text-lg text-muted">/{verdicts.length} matched</span>
        </p>
        <p className="mt-1 text-xs text-muted">
          {agreements >= 3
            ? `You and ${partnerName} are dangerously aligned.`
            : `Plenty of playful clashes with ${partnerName} to argue about.`}
        </p>
      </div>

      <ul className="space-y-2">
        {verdicts.map((verdict) => (
          <li
            key={verdict.take.id}
            className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-xs font-medium text-white sm:max-w-[45%]">{verdict.take.prompt}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-ink/60 px-2.5 py-1 text-[11px] text-muted">
                You: {choiceCopy(verdict.take, verdict.self)}
              </span>
              <span className="rounded-full border border-white/10 bg-ink/60 px-2.5 py-1 text-[11px] text-muted">
                {partnerName}: {choiceCopy(verdict.take, verdict.partner)}
              </span>
              <Badge tone={verdict.agreed ? "emerald" : "amber"} icon={verdict.agreed ? Heart : Swords}>
                {verdict.agreed ? "Match" : "Clash"}
              </Badge>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Your icebreaker chips</p>
        {chips.map((chip) => (
          <div
            key={chip.id}
            className={cn(
              "rounded-2xl border p-3.5 text-xs leading-relaxed",
              chip.tone === "match"
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                : "border-amber-400/30 bg-amber-400/10 text-amber-100"
            )}
          >
            <p className="font-semibold text-white">{chip.label}</p>
            <p className="mt-1 opacity-80">{chip.message}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" icon={RotateCcw} onClick={start} className="sm:w-auto">
          Play again
        </Button>
        <Button icon={Send} onClick={() => onComplete(chips)} fullWidth className="sm:flex-1">
          Send to chat with {partnerName}
        </Button>
      </div>
    </div>
  );
}
