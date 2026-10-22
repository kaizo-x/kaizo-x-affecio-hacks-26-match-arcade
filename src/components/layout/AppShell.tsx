import type { ReactNode } from "react";
import { Header } from "@/components/Header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-ink">
      <div className="pointer-events-none fixed inset-0 bg-arcade-radial" aria-hidden />
      <div className="pointer-events-none fixed inset-0 arcade-grid opacity-40" aria-hidden />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-5xl flex-col">
        <Header />
        <main className="flex-1 px-4 pb-16 pt-6 sm:px-6 sm:pb-10">{children}</main>
        <footer className="border-t border-white/5 px-4 py-5 text-center text-[11px] text-muted sm:px-6">
          MatchArcade · AFFECIO HACKS &apos;26 · Track 2: From Match to Conversation
        </footer>
      </div>
    </div>
  );
}
