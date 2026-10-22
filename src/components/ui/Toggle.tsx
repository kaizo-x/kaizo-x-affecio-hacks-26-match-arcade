"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
  icon?: LucideIcon;
  tone?: "rose" | "purple" | "emerald";
  disabled?: boolean;
}

const TONES: Record<NonNullable<ToggleProps["tone"]>, string> = {
  rose: "bg-gradient-to-r from-rose to-rose-soft",
  purple: "bg-gradient-to-r from-accent-purple to-accent-violet",
  emerald: "bg-gradient-to-r from-emerald-500 to-teal-400",
};

export function Toggle({
  checked,
  onChange,
  label,
  description,
  icon: Icon,
  tone = "rose",
  disabled = false,
}: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md transition-colors hover:border-white/20">
      <div className="flex gap-3">
        {Icon ? (
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Icon className="h-4 w-4 text-rose-soft" />
          </span>
        ) : null}
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          {description ? <p className="mt-0.5 text-xs leading-relaxed text-muted">{description}</p> : null}
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full border border-white/10 transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          checked ? TONES[tone] : "bg-slate-700/60"
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow",
            checked ? "left-[26px]" : "left-[3px]"
          )}
          style={{ height: 18, width: 18 }}
        />
      </button>
    </div>
  );
}
