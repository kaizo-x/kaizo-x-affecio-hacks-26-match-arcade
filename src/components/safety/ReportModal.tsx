"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Ban, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/context/authStore";
import { useToast } from "@/context/ToastProvider";
import { REPORT_REASONS } from "@/data/safetyContent";
import { cn } from "@/lib/utils";
import type { ReportReasonId, ReportTarget } from "@/types";

const SEVERITY_TONE: Record<string, string> = {
  high: "text-rose-soft",
  medium: "text-amber-300",
  low: "text-muted",
};

export interface ReportModalProps {
  open: boolean;
  target: ReportTarget | null;
  onClose: () => void;
}

export function ReportModal({ open, target, onClose }: ReportModalProps) {
  const [reason, setReason] = useState<ReportReasonId | null>(null);
  const [details, setDetails] = useState("");
  const [blockUser, setBlockUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reportUser = useAuthStore((state) => state.reportUser);
  const toast = useToast();

  useEffect(() => {
    if (open) {
      setReason(null);
      setDetails("");
      setBlockUser(true);
      setError(null);
      setSubmitting(false);
    }
  }, [open, target?.id]);

  const handleSubmit = async () => {
    if (!target) return;
    if (!reason) {
      setError("Choose a reason so our safety team can review this faster.");
      return;
    }
    setSubmitting(true);
    const record = await reportUser({
      targetId: target.id,
      targetName: target.name,
      reason,
      details,
      blockUser,
    });
    setSubmitting(false);

    if (!record) {
      toast.error("Report failed", "Please sign in again and retry.");
      return;
    }

    toast.success(
      `Report sent about ${target.name}`,
      blockUser ? "They have been blocked and can no longer message you." : "Our safety team will review it shortly."
    );
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={`Report ${target?.name ?? "user"}`}
      description="Reports are confidential — the person is never told who flagged them."
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} fullWidth className="sm:w-auto">
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            loading={submitting}
            icon={AlertTriangle}
            fullWidth
            className="sm:w-auto"
          >
            Submit report
          </Button>
        </div>
      }
    >
      <fieldset className="space-y-2">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          What went wrong?
        </legend>
        {REPORT_REASONS.map((option) => {
          const isSelected = reason === option.id;
          return (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
                isSelected
                  ? "border-rose/60 bg-rose/10"
                  : "border-white/10 bg-white/5 hover:border-white/25"
              )}
            >
              <input
                type="radio"
                name="report-reason"
                value={option.id}
                checked={isSelected}
                onChange={() => {
                  setReason(option.id);
                  setError(null);
                }}
                className="mt-1 h-4 w-4 accent-rose"
              />
              <span className="flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white">{option.label}</span>
                  <span className={cn("text-[10px] font-semibold uppercase tracking-wide", SEVERITY_TONE[option.severity])}>
                    {option.severity} priority
                  </span>
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">{option.description}</span>
              </span>
            </label>
          );
        })}
      </fieldset>

      <div className="mt-5">
        <label htmlFor="report-details" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          Anything else we should know? (optional)
        </label>
        <textarea
          id="report-details"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Add context such as chat snippets, timing or the behaviour you saw."
          className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 backdrop-blur-md transition-colors focus:border-accent-purple/60 focus:outline-none focus:ring-2 focus:ring-accent-purple/40"
        />
        <p className="mt-1 text-right text-[11px] text-muted">{details.length}/500</p>
      </div>

      <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
        <input
          type="checkbox"
          checked={blockUser}
          onChange={(event) => setBlockUser(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-rose"
        />
        <span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-white">
            <Ban className="h-3.5 w-3.5" />
            Block this person as well
          </span>
          <span className="mt-0.5 block text-xs text-muted">
            They won&apos;t be able to message you or see your profile.
          </span>
        </span>
      </label>

      {error ? (
        <p className="mt-4 flex items-center gap-2 rounded-2xl border border-rose/40 bg-rose/10 px-3.5 py-2.5 text-xs font-medium text-rose-soft">
          <AlertTriangle className="h-3.5 w-3.5" />
          {error}
        </p>
      ) : (
        <p className="mt-4 flex items-start gap-2 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Serious reports are escalated to our trust &amp; safety team within 24 hours. You can review everything you
          flagged from the Privacy &amp; Safety centre.
        </p>
      )}

      <p className="mt-3 flex items-center gap-2 text-[11px] text-emerald-300">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Your identity stays hidden from the reported user.
      </p>
    </Modal>
  );
}
