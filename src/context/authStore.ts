"use client";

import { create } from "zustand";
import { createId } from "@/lib/utils";
import { authService } from "@/services";
import type {
  AuthResult,
  DatingProfile,
  LoginInput,
  RegisterInput,
  ReportReasonId,
  ReportRecord,
  SafetyPreferences,
  User,
  VerificationStatus,
} from "@/types";

export type AuthStatus = "loading" | "ready";

export interface ReportSubmission {
  targetId: string;
  targetName: string;
  reason: ReportReasonId;
  details: string;
  blockUser: boolean;
}

export interface OnboardingPayload {
  profile: Partial<DatingProfile>;
  safety: Partial<SafetyPreferences>;
}

interface AuthState {
  user: User | null;
  status: AuthStatus;
  busy: boolean;
  reports: ReportRecord[];
  hydrate: () => Promise<void>;
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

export const useAuthStore = create<AuthState>((set, get) => {
  const commit = async (next: User): Promise<void> => {
    set({ user: next });
    const saved = await authService.saveUser(next);
    set({ user: saved });
  };

  const refreshReports = async (userId: string): Promise<void> => {
    const reports = await authService.listReports(userId);
    set({ reports });
  };

  return {
    user: null,
    status: "loading",
    busy: false,
    reports: [],

    hydrate: async () => {
      const user = await authService.currentUser();
      set({ user, status: "ready" });
      if (user) await refreshReports(user.id);
    },

    register: async (input) => {
      set({ busy: true });
      try {
        const result = await authService.register(input);
        if (result.ok && result.user) {
          set({ user: result.user, reports: [] });
        }
        return result;
      } catch {
        return { ok: false, error: "Something went wrong while creating your account." };
      } finally {
        set({ busy: false });
      }
    },

    login: async (input) => {
      set({ busy: true });
      try {
        const result = await authService.login(input);
        if (result.ok && result.user) {
          set({ user: result.user });
          await refreshReports(result.user.id);
        }
        return result;
      } catch {
        return { ok: false, error: "Something went wrong while signing you in." };
      } finally {
        set({ busy: false });
      }
    },

    logout: async () => {
      set({ busy: true });
      try {
        await authService.logout();
        set({ user: null, reports: [] });
      } finally {
        set({ busy: false });
      }
    },

    updateProfile: async (patch) => {
      const current = get().user;
      if (!current) return;
      await commit({ ...current, profile: { ...current.profile, ...patch } });
    },

    updateSafety: async (patch) => {
      const current = get().user;
      if (!current) return;
      await commit({ ...current, safety: { ...current.safety, ...patch } });
    },

    finishOnboarding: async ({ profile, safety }) => {
      const current = get().user;
      if (!current) return;
      await commit({
        ...current,
        onboardingComplete: true,
        profile: { ...current.profile, ...profile },
        safety: { ...current.safety, ...safety },
      });
    },

    verifyWithSelfie: async () => {
      const current = get().user;
      if (!current || current.verification === "verified") return;
      const pending: VerificationStatus = "pending";
      await commit({ ...current, verification: pending });
      await new Promise((resolve) => setTimeout(resolve, 1800));
      const latest = get().user;
      if (latest) await commit({ ...latest, verification: "verified" });
    },

    reportUser: async ({ targetId, targetName, reason, details, blockUser }) => {
      const current = get().user;
      if (!current) return null;
      const record: ReportRecord = {
        id: createId("rpt"),
        reporterId: current.id,
        targetId,
        targetName,
        reason,
        details: details.trim(),
        blocked: blockUser,
        createdAt: new Date().toISOString(),
        status: "received",
      };
      const saved = await authService.saveReport(record);
      set({ reports: [saved, ...get().reports.filter((entry) => entry.id !== saved.id)] });
      return saved;
    },

    unblockUser: async (targetId) => {
      const current = get().user;
      if (!current) return;
      const affected = get().reports.filter((report) => report.targetId === targetId && report.blocked);
      const updated = await Promise.all(
        affected.map((report) => authService.saveReport({ ...report, blocked: false }))
      );
      const updatedById = new Map(updated.map((report) => [report.id, report]));
      set({
        reports: get().reports.map((report) => updatedById.get(report.id) ?? report),
      });
    },
  };
});

export function selectBlockedUsers(reports: ReportRecord[]): ReportRecord[] {
  return reports.filter((report) => report.blocked);
}
