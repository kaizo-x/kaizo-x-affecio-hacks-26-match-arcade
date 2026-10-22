"use client";

import {
  Ban,
  EyeOff,
  Fingerprint,
  Flag,
  Ghost,
  MessageSquareOff,
  MoonStar,
  Radio,
  ShieldCheck,
  Unlock,
} from "lucide-react";
import { SafetyTipsBanner } from "@/components/safety/SafetyTipsBanner";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, VerificationBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Toggle } from "@/components/ui/Toggle";
import { useAuthStore } from "@/context/authStore";
import { useSafetyCenter } from "@/context/SafetyProvider";
import { useToast } from "@/context/ToastProvider";
import { MOCK_MATCHES } from "@/data/mockMatches";
import { getReportReason } from "@/data/safetyContent";
import { formatDate } from "@/lib/utils";

export interface SafetyDrawerProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Privacy & Safety centre: visibility controls, selfie verification, the
 * block-and-report entry point and the history of everything you flagged.
 */
export function SafetyDrawer({ open, onClose }: SafetyDrawerProps) {
  const user = useAuthStore((state) => state.user);
  const reports = useAuthStore((state) => state.reports);
  const updateSafety = useAuthStore((state) => state.updateSafety);
  const verifyWithSelfie = useAuthStore((state) => state.verifyWithSelfie);
  const unblockUser = useAuthStore((state) => state.unblockUser);
  const { openReport } = useSafetyCenter();
  const toast = useToast();

  if (!user) return null;

  const { safety, verification } = user;
  const isIncognito = safety.profileVisibility === "incognito";

  const blockedReports = reports.filter((report) => report.blocked);
  const reportedIds = new Set(reports.map((report) => report.targetId));
  const reportablePeople = MOCK_MATCHES.filter((profile) => !reportedIds.has(profile.id));

  const handleIncognito = async (value: boolean) => {
    await updateSafety({ profileVisibility: value ? "incognito" : "public" });
    toast.info(
      value ? "Incognito mode on" : "You're visible again",
      value
        ? "Only people you already matched with can find your profile."
        : "Your profile is discoverable to people who match your preferences."
    );
  };

  const handlePause = async (value: boolean) => {
    await updateSafety({ pauseProfile: value });
    toast.info(
      value ? "Profile paused" : "Profile resumed",
      value
        ? "You're hidden from discovery. Your matches and chats stay intact."
        : "You're back in the discovery deck."
    );
  };

  const handleVerify = async () => {
    if (verification === "verified") {
      toast.info("Already verified", "Your selfie badge is live on your profile.");
      return;
    }
    toast.info("Verifying with selfie", "Hold tight — this mock check takes a moment.");
    await verifyWithSelfie();
    toast.success("You're verified!", "The blue selfie badge now appears next to your name.");
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Privacy & Safety"
      subtitle="You decide who sees you, who can message you, and how we keep you safe."
    >
      <section className="space-y-3">
        <header className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <EyeOff className="h-4 w-4 text-rose-soft" />
            Profile visibility
          </h3>
          <Badge tone={isIncognito ? "purple" : "emerald"} icon={isIncognito ? Ghost : Radio}>
            {isIncognito ? "Incognito" : safety.pauseProfile ? "Paused" : "Discoverable"}
          </Badge>
        </header>

        <Toggle
          checked={isIncognito}
          onChange={handleIncognito}
          icon={Ghost}
          tone="purple"
          label="Incognito browsing"
          description="Browse and swipe privately. Your profile stops appearing in other people's decks."
        />
        <Toggle
          checked={safety.pauseProfile}
          onChange={handlePause}
          icon={MoonStar}
          label="Pause my profile"
          description="Take a break from dating without losing matches or conversations."
        />
        <Toggle
          checked={safety.blockUnknownMessages}
          onChange={(value) => updateSafety({ blockUnknownMessages: value })}
          icon={MessageSquareOff}
          label="Block messages from unknown people"
          description="Only people you matched with can start a conversation with you."
        />
        <Toggle
          checked={safety.showOnlineStatus}
          onChange={(value) => updateSafety({ showOnlineStatus: value })}
          icon={Radio}
          tone="emerald"
          label="Show when I'm online"
          description="Turn this off to appear offline while you keep chatting."
        />
        <Toggle
          checked={safety.shareDistance}
          onChange={(value) => updateSafety({ shareDistance: value })}
          icon={Fingerprint}
          tone="emerald"
          label="Share approximate distance"
          description="Shows a rounded distance instead of your exact location."
        />
      </section>

      <section className="space-y-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-4">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Match verification badge
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              A quick selfie pose proves you&apos;re the person in your photos. Verified profiles get 3x more replies.
            </p>
          </div>
          <VerificationBadge status={verification} />
        </header>
        <Button
          variant={verification === "verified" ? "secondary" : "primary"}
          icon={Fingerprint}
          loading={verification === "pending"}
          onClick={handleVerify}
          fullWidth
        >
          {verification === "verified"
            ? "Re-run verification"
            : verification === "pending"
              ? "Checking your selfie…"
              : "Verify with selfie"}
        </Button>
      </section>

      <SafetyTipsBanner defaultOpen />

      <section className="space-y-3">
        <header className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Flag className="h-4 w-4 text-rose-soft" />
            Block or report someone
          </h3>
          <Badge tone="glass">Confidential</Badge>
        </header>

        {reportablePeople.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-muted">
            Everyone in your matches has already been actioned. Nothing else needs your attention.
          </p>
        ) : (
          <ul className="space-y-2">
            {reportablePeople.map((profile) => (
              <li
                key={profile.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar
                    name={profile.name}
                    photoUrl={profile.photoUrl}
                    arcadeAvatarId={profile.arcadeAvatarId}
                    size="sm"
                    verified={profile.verification === "verified"}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {profile.name}, {profile.age}
                    </p>
                    <p className="truncate text-[11px] text-muted">
                      Matched {profile.matchPercent}% · {profile.city}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Flag}
                  onClick={() => openReport({ id: profile.id, name: profile.name })}
                >
                  Block / Report
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <header className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Ban className="h-4 w-4 text-rose-soft" />
            Blocked &amp; reported
          </h3>
          <Badge tone="glass">{blockedReports.length} blocked</Badge>
        </header>

        {reports.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-muted">
            Nothing here yet. If someone makes you uncomfortable, use the flag button on their profile — blocking and
            reporting takes two taps.
          </p>
        ) : (
          <ul className="space-y-2">
            {reports.map((report) => (
              <li
                key={report.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{report.targetName}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {getReportReason(report.reason)?.label ?? report.reason} · reported {formatDate(report.createdAt)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge tone={report.blocked ? "danger" : "glass"} icon={report.blocked ? Ban : Unlock}>
                      {report.blocked ? "Blocked" : "Not blocked"}
                    </Badge>
                    <Badge tone="purple">{report.status === "received" ? "Report received" : "Under review"}</Badge>
                  </div>
                </div>
                {report.blocked ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Unlock}
                    onClick={async () => {
                      await unblockUser(report.targetId);
                      toast.info(`${report.targetName} unblocked`);
                    }}
                  >
                    Unblock
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </Drawer>
  );
}
