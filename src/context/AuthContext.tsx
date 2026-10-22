"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore, type OnboardingPayload, type ReportSubmission } from "@/context/authStore";
import type {
  AuthResult,
  DatingProfile,
  LoginInput,
  RegisterInput,
  ReportRecord,
  SafetyPreferences,
  User,
} from "@/types";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  isBusy: boolean;
  reports: ReportRecord[];
  register: (input: RegisterInput) => Promise<AuthResult>;
  login: (input: LoginInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<DatingProfile>) => Promise<void>;
  updateSafety: (patch: Partial<SafetyPreferences>) => Promise<void>;
  finishOnboarding: (payload: OnboardingPayload) => Promise<void>;
  verifyWithSelfie: () => Promise<void>;
  reportUser: (submission: ReportSubmission) => Promise<ReportRecord | null>;
  unblockUser: (targetId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthSplash() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-ink text-muted">
      <div className="flex animate-fade-up flex-col items-center gap-3">
        <span className="text-2xl">🎮</span>
        <span className="flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading MatchArcade…
        </span>
      </div>
    </div>
  );
}

/**
 * Owns the mock session lifecycle: restores any stored session on boot, then
 * exposes login status, the current profile and the auth actions to the tree.
 */
export function AuthContextProvider({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status);
  const busy = useAuthStore((state) => state.busy);
  const user = useAuthStore((state) => state.user);
  const reports = useAuthStore((state) => state.reports);
  const hydrate = useAuthStore((state) => state.hydrate);
  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const updateSafety = useAuthStore((state) => state.updateSafety);
  const finishOnboarding = useAuthStore((state) => state.finishOnboarding);
  const verifyWithSelfie = useAuthStore((state) => state.verifyWithSelfie);
  const reportUser = useAuthStore((state) => state.reportUser);
  const unblockUser = useAuthStore((state) => state.unblockUser);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isHydrating: status === "loading",
      isBusy: busy,
      reports,
      register,
      login,
      logout,
      updateProfile,
      updateSafety,
      finishOnboarding,
      verifyWithSelfie,
      reportUser,
      unblockUser,
    }),
    [
      user,
      status,
      busy,
      reports,
      register,
      login,
      logout,
      updateProfile,
      updateSafety,
      finishOnboarding,
      verifyWithSelfie,
      reportUser,
      unblockUser,
    ]
  );

  if (status === "loading") return <AuthSplash />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthContextProvider");
  return context;
}

export function useCurrentUser(): User | null {
  return useAuth().user;
}

export function useAuthActions() {
  const { register, login, logout, isBusy } = useAuth();
  return { register, login, logout, busy: isBusy };
}
