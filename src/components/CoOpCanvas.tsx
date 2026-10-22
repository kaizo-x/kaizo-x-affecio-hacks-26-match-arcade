"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Eraser, Palette, RotateCcw, Send, Shuffle, Sparkles, Timer, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastProvider";
import { ARCADE_GAMES, CANVAS_PROMPTS, buildCanvasChip } from "@/data/arcadeContent";
import { cn } from "@/lib/utils";
import type { CanvasPrompt, OutcomeChip } from "@/types";

type Phase = "intro" | "playing" | "finished";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 400;
const ROUND_SECONDS = ARCADE_GAMES[1].durationSeconds;
const COLORS = ["#f43f5e", "#a855f7", "#38bdf8", "#34d399", "#fbbf24", "#ffffff"];
const BRUSH_SIZES = [
  { id: "thin", label: "Thin", width: 3 },
  { id: "medium", label: "Medium", width: 7 },
  { id: "thick", label: "Thick", width: 14 },
];
const PARTNER_COLOR = "#a855f7";
const PARTNER_STROKE_DELAYS = [7000, 16000, 24000];

export interface CoOpCanvasProps {
  partnerName: string;
  onComplete: (chip: OutcomeChip) => void;
}

/** Shared 30-second drawing board — both players paint on the same canvas. */
export function CoOpCanvas({ partnerName, onComplete }: CoOpCanvasProps) {
  const toast = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const partnerStrokesRef = useRef(0);
  const partnerTimers = useRef<number[]>([]);

  const [prompt, setPrompt] = useState<CanvasPrompt>(CANVAS_PROMPTS[0]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [color, setColor] = useState(COLORS[0]);
  const [brushWidth, setBrushWidth] = useState(BRUSH_SIZES[1].width);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [partnerStrokes, setPartnerStrokes] = useState(0);
  const [myStrokes, setMyStrokes] = useState(0);
  const [chip, setChip] = useState<OutcomeChip | null>(null);

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.lineCap = "round";
    context.lineJoin = "round";
    return context;
  }, []);

  const paintSegment = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }, strokeColor: string, width: number) => {
      const context = getContext();
      if (!context) return;
      context.strokeStyle = strokeColor;
      context.lineWidth = width;
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    },
    [getContext]
  );

  const toCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "playing") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawing.current = true;
    lastPoint.current = toCanvasPoint(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "playing" || !isDrawing.current || !lastPoint.current) return;
    const point = toCanvasPoint(event);
    paintSegment(lastPoint.current, point, color, brushWidth);
    lastPoint.current = point;
  };

  const handlePointerUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    lastPoint.current = null;
    setMyStrokes((value) => value + 1);
  };

  /** Mock multiplayer: the match keeps adding playful strokes while you draw. */
  const addPartnerStroke = useCallback(() => {
    const context = getContext();
    if (!context) return;

    const startX = 80 + Math.random() * (CANVAS_WIDTH - 160);
    const startY = 80 + Math.random() * (CANVAS_HEIGHT - 160);
    const width = 4 + Math.random() * 6;
    let previous = { x: startX, y: startY };

    for (let step = 0; step < 4; step += 1) {
      const next = {
        x: previous.x + (Math.random() - 0.5) * 150,
        y: previous.y + (Math.random() - 0.5) * 110,
      };
      paintSegment(previous, next, PARTNER_COLOR, width);
      previous = next;
    }

    partnerStrokesRef.current += 1;
    setPartnerStrokes(partnerStrokesRef.current);
    toast.info(`${partnerName} drew something`, "A purple squiggle just landed on your shared canvas.");
  }, [getContext, paintSegment, partnerName, toast]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = getContext();
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    partnerStrokesRef.current = 0;
    setPartnerStrokes(0);
    setMyStrokes(0);
  }, [getContext]);

  const finishRound = useCallback(() => {
    partnerTimers.current.forEach((id) => window.clearTimeout(id));
    partnerTimers.current = [];
    setChip(buildCanvasChip(prompt, partnerName, partnerStrokesRef.current));
    setPhase("finished");
  }, [partnerName, prompt]);

  // Round countdown.
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      finishRound();
      return;
    }
    const id = window.setTimeout(() => setTimeLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, timeLeft, finishRound]);

  // Partner stroke schedule.
  useEffect(() => {
    if (phase !== "playing") return;
    partnerTimers.current = PARTNER_STROKE_DELAYS.map((delay) => window.setTimeout(addPartnerStroke, delay));
    return () => {
      partnerTimers.current.forEach((id) => window.clearTimeout(id));
      partnerTimers.current = [];
    };
  }, [phase, addPartnerStroke]);

  useEffect(
    () => () => {
      partnerTimers.current.forEach((id) => window.clearTimeout(id));
    },
    []
  );

  const startRound = () => {
    clearCanvas();
    setChip(null);
    setTimeLeft(ROUND_SECONDS);
    setPhase("playing");
  };

  const shufflePrompt = () => {
    const options = CANVAS_PROMPTS.filter((option) => option.id !== prompt.id);
    setPrompt(options[Math.floor(Math.random() * options.length)]);
  };

  const progress = ((ROUND_SECONDS - timeLeft) / ROUND_SECONDS) * 100;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="text-lg">{prompt.emoji}</span>
            {prompt.subject}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">{prompt.hint}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="purple" icon={Users}>
            {partnerName} · {partnerStrokes} strokes
          </Badge>
          <Badge tone={phase === "playing" && timeLeft <= 5 ? "danger" : "rose"} icon={Timer}>
            {phase === "playing" ? `${timeLeft}s` : `${ROUND_SECONDS}s round`}
          </Badge>
        </div>
      </div>

      {phase === "playing" ? (
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-accent-purple to-rose"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-deep/70">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={cn("h-auto w-full touch-none", phase === "playing" ? "cursor-crosshair" : "cursor-not-allowed")}
        />
        {phase !== "playing" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink-deep/80 px-6 text-center backdrop-blur-sm">
            {phase === "intro" ? (
              <>
                <span className="text-3xl">{prompt.emoji}</span>
                <p className="text-sm font-semibold text-white">{prompt.subject}</p>
                <p className="max-w-xs text-xs leading-relaxed text-muted">
                  You both paint on this board for {ROUND_SECONDS} seconds. {partnerName} will jump in with their own
                  strokes — chaos encouraged.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button icon={Sparkles} onClick={startRound}>
                    Start {ROUND_SECONDS}s round
                  </Button>
                  <Button variant="secondary" icon={Shuffle} onClick={shufflePrompt}>
                    New prompt
                  </Button>
                </div>
              </>
            ) : (
              <>
                <span className="text-3xl">🏁</span>
                <p className="text-sm font-semibold text-white">Time&apos;s up!</p>
                <p className="max-w-xs text-xs text-muted">
                  You made {myStrokes} strokes, {partnerName} added {partnerStrokes}. That is now a memory.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="secondary" icon={RotateCcw} onClick={startRound}>
                    Draw again
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>

      {phase === "playing" ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted">
              <Palette className="h-3.5 w-3.5" />
              Colours
            </span>
            <div className="flex items-center gap-2">
              {COLORS.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  aria-label={`Use colour ${swatch}`}
                  aria-pressed={color === swatch}
                  onClick={() => setColor(swatch)}
                  style={{ backgroundColor: swatch }}
                  className={cn(
                    "h-7 w-7 rounded-full border-2 transition-transform",
                    color === swatch ? "scale-110 border-white" : "border-white/20 hover:scale-105"
                  )}
                />
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {BRUSH_SIZES.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  aria-pressed={brushWidth === size.width}
                  onClick={() => setBrushWidth(size.width)}
                  className={cn(
                    "rounded-xl border px-2.5 py-1 text-[11px] transition",
                    brushWidth === size.width
                      ? "border-rose/60 bg-rose/15 text-white"
                      : "border-white/10 bg-white/5 text-muted hover:text-white"
                  )}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="secondary" icon={Eraser} onClick={clearCanvas} className="sm:w-auto">
              Clear board
            </Button>
            <Button variant="outline" icon={CheckCircle2} onClick={finishRound} fullWidth className="sm:flex-1">
              Finish now
            </Button>
          </div>
        </>
      ) : null}

      {phase === "finished" && chip ? (
        <div className="space-y-3">
          <div className="rounded-2xl border border-accent-purple/30 bg-accent-purple/10 p-3.5 text-xs leading-relaxed text-white">
            <p className="font-semibold">{chip.label}</p>
            <p className="mt-1 text-muted">{chip.message}</p>
          </div>
          <Button icon={Send} onClick={() => onComplete(chip)} fullWidth>
            Send to chat with {partnerName}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
