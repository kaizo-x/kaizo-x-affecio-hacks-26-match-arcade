"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { SAFETY_TIPS } from "@/data/safetyContent";
import { cn } from "@/lib/utils";

export function SafetyTipsBanner({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [isOpen, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-2xl border border-accent-purple/25 bg-gradient-to-br from-accent-purple/12 via-white/5 to-rose/10 backdrop-blur-md">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-purple/20">
            <ShieldCheck className="h-4 w-4 text-accent-violet" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">Dating safety essentials</span>
            <span className="block text-xs text-muted">Five habits that keep every meet-up fun and safe.</span>
          </span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <ul className="space-y-3 border-t border-white/10 px-4 py-4">
              {SAFETY_TIPS.map((tip) => (
                <li key={tip.id} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose" />
                  <div>
                    <p className="text-sm font-medium text-white">{tip.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{tip.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
