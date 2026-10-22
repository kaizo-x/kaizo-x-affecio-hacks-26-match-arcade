import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Clock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationStatus } from "@/types";

export type BadgeTone = "rose" | "purple" | "emerald" | "amber" | "glass" | "danger";

const TONES: Record<BadgeTone, string> = {
  rose: "border-rose/40 bg-rose/15 text-rose-soft",
  purple: "border-accent-purple/40 bg-accent-purple/15 text-accent-violet",
  emerald: "border-emerald-400/40 bg-emerald-400/15 text-emerald-300",
  amber: "border-amber-400/40 bg-amber-400/15 text-amber-300",
  glass: "border-white/15 bg-white/5 text-muted",
  danger: "border-rose/50 bg-rose/20 text-rose-soft",
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: LucideIcon;
  className?: string;
}

export function Badge({ children, tone = "glass", icon: Icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md",
        TONES[tone],
        className
      )}
    >
      {Icon ? <Icon className="h-3 w-3" /> : null}
      {children}
    </span>
  );
}

export function VerificationBadge({ status, className }: { status: VerificationStatus; className?: string }) {
  if (status === "verified") {
    return (
      <Badge tone="emerald" icon={BadgeCheck} className={className}>
        Selfie verified
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge tone="amber" icon={Clock} className={className}>
        Verification pending
      </Badge>
    );
  }
  return (
    <Badge tone="glass" icon={ShieldAlert} className={className}>
      Not verified
    </Badge>
  );
}
