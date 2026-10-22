"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Ghost, LogIn, LogOut, MoonStar, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { AuthModal, type AuthMode } from "@/components/AuthModal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, VerificationBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useSafetyCenter } from "@/context/SafetyProvider";
import { useToast } from "@/context/ToastProvider";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { openSafetyCenter } = useSafetyCenter();
  const toast = useToast();
  const router = useRouter();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    toast.info("Signed out", "Your local session was cleared. See you soon!");
    router.push("/login");
  };

  const isIncognito = user?.safety.profileVisibility === "incognito";
  const isPaused = Boolean(user?.safety.pauseProfile);
  const statusLabel = isIncognito ? "Incognito" : isPaused ? "Paused" : "Active now";
  const StatusIcon = isIncognito ? Ghost : isPaused ? MoonStar : Radio;

  return (
    <header className="sticky top-0 z-[90] border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
            Match<span className="gradient-text">Arcade</span>{" "}
            <span className="inline-block transition-transform duration-300 group-hover:-rotate-12">🎮</span>
          </span>
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <Badge
              tone={isIncognito ? "purple" : isPaused ? "amber" : "emerald"}
              icon={StatusIcon}
              className="hidden sm:inline-flex"
            >
              <span className="relative mr-0.5 flex h-1.5 w-1.5">
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full rounded-full",
                    isIncognito || isPaused ? "bg-amber-300" : "animate-ping bg-emerald-400"
                  )}
                />
                <span
                  className={cn(
                    "relative inline-flex h-1.5 w-1.5 rounded-full",
                    isIncognito || isPaused ? "bg-amber-300" : "bg-emerald-400"
                  )}
                />
              </span>
              {statusLabel}
            </Badge>

            <Button variant="secondary" size="sm" icon={ShieldCheck} onClick={openSafetyCenter}>
              <span className="hidden sm:inline">Safety centre</span>
              <span className="sm:hidden">Safety</span>
            </Button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                aria-label="Open profile menu"
                className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-1 pr-2 transition hover:border-white/25"
              >
                <Avatar
                  name={user.name}
                  arcadeAvatarId={user.profile.arcadeAvatarId}
                  photoUrl={user.profile.avatarUrl}
                  size="xs"
                  verified={user.verification === "verified"}
                />
                <ChevronDown
                  className={cn("h-3.5 w-3.5 text-muted transition-transform", isMenuOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {isMenuOpen ? (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-ink-soft/95 p-2 shadow-card backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                        <Avatar
                          name={user.name}
                          arcadeAvatarId={user.profile.arcadeAvatarId}
                          photoUrl={user.profile.avatarUrl}
                          size="sm"
                          verified={user.verification === "verified"}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {user.name}, {user.age}
                          </p>
                          <p className="truncate text-[11px] text-muted">{user.email}</p>
                        </div>
                      </div>
                      <div className="px-1 py-2">
                        <VerificationBadge status={user.verification} />
                      </div>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          openSafetyCenter();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-white/10 hover:text-white"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Privacy &amp; Safety
                      </button>
                      <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted">
                        <Sparkles className="h-4 w-4" />
                        Arcade games unlock in Phase 2
                      </div>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-rose-soft transition hover:bg-rose/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  </>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAuthMode("login")}
              className="inline-flex h-9 items-center gap-1.5 rounded-2xl px-3.5 text-xs font-semibold text-muted transition hover:bg-white/10 hover:text-white"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("register")}
              className="inline-flex h-9 items-center gap-1.5 rounded-2xl bg-gradient-to-r from-rose to-accent-purple px-4 text-xs font-semibold text-white shadow-glow transition hover:brightness-110 active:scale-[0.97]"
            >
              Join the arcade
            </button>
          </nav>
        )}
      </div>

      <AuthModal
        open={authMode !== null}
        initialMode={authMode ?? "login"}
        onClose={() => setAuthMode(null)}
      />
    </header>
  );
}
