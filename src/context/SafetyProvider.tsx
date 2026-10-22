"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useAuthStore } from "@/context/authStore";
import { SafetyDrawer } from "@/components/SafetyDrawer";
import { ReportModal } from "@/components/safety/ReportModal";
import type { ReportTarget } from "@/types";

interface SafetyContextValue {
  openSafetyCenter: () => void;
  closeSafetyCenter: () => void;
  openReport: (target: ReportTarget) => void;
  isSafetyCenterOpen: boolean;
}

const SafetyContext = createContext<SafetyContextValue | null>(null);

export function SafetyProvider({ children }: { children: ReactNode }) {
  const [isSafetyCenterOpen, setSafetyCenterOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const user = useAuthStore((state) => state.user);

  const openSafetyCenter = useCallback(() => setSafetyCenterOpen(true), []);
  const closeSafetyCenter = useCallback(() => setSafetyCenterOpen(false), []);
  const openReport = useCallback((target: ReportTarget) => setReportTarget(target), []);
  const closeReport = useCallback(() => setReportTarget(null), []);

  const value = useMemo<SafetyContextValue>(
    () => ({ openSafetyCenter, closeSafetyCenter, openReport, isSafetyCenterOpen }),
    [openSafetyCenter, closeSafetyCenter, openReport, isSafetyCenterOpen]
  );

  return (
    <SafetyContext.Provider value={value}>
      {children}
      {user ? (
        <>
          <SafetyDrawer open={isSafetyCenterOpen} onClose={closeSafetyCenter} />
          <ReportModal open={Boolean(reportTarget)} target={reportTarget} onClose={closeReport} />
        </>
      ) : null}
    </SafetyContext.Provider>
  );
}

export function useSafetyCenter(): SafetyContextValue {
  const context = useContext(SafetyContext);
  if (!context) throw new Error("useSafetyCenter must be used inside a SafetyProvider");
  return context;
}
