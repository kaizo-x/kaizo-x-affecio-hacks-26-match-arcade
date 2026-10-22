"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: "right" | "left";
}

export function Drawer({ open, onClose, title, subtitle, children, footer, side = "right" }: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const offset = side === "right" ? { x: "100%" } : { x: "-100%" };

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className={cn("fixed inset-0 z-[125] flex", side === "right" ? "justify-end" : "justify-start")}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink-deep/80 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, ...offset }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, ...offset }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="relative flex h-full w-full max-w-xl flex-col border-white/10 bg-ink-soft/95 shadow-card backdrop-blur-xl sm:border-l"
          >
            <header className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                {subtitle ? <p className="mt-1 text-xs text-muted">{subtitle}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="rounded-xl p-2 text-muted transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">{children}</div>
            {footer ? <div className="border-t border-white/10 px-5 py-4">{footer}</div> : null}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
