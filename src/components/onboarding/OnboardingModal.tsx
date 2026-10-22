"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Ghost, MessageSquareOff, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { AvatarPicker } from "@/components/onboarding/AvatarPicker";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toggle } from "@/components/ui/Toggle";
import { useAuthStore } from "@/context/authStore";
import { REQUIRED_VIBE_TAGS, VIBE_TAGS } from "@/data/profileOptions";
import { useToast } from "@/context/ToastProvider";
import { cn } from "@/lib/utils";
import type { ProfileVisibility } from "@/types";

const STEPS = [
  { id: "avatar", title: "Pick your look", subtitle: "Step 1 of 3" },
  { id: "vibe", title: "Your vibe & bio", subtitle: "Step 2 of 3" },
  { id: "safety", title: "Safety preferences", subtitle: "Step 3 of 3" },
];

const EDIT_STEPS = [
  { id: "avatar", title: "Update your look", subtitle: "Profile editor" },
  { id: "vibe", title: "Refresh your vibe", subtitle: "Profile editor" },
  { id: "safety", title: "Safety preferences", subtitle: "Profile editor" },
];

const MIN_BIO_LENGTH = 20;
const MAX_BIO_LENGTH = 300;

export interface OnboardingModalProps {
  open: boolean;
  mode?: "required" | "edit";
  onClose?: () => void;
}

export function OnboardingModal({ open, mode = "required", onClose }: OnboardingModalProps) {
  const user = useAuthStore((state) => state.user);
  const finishOnboarding = useAuthStore((state) => state.finishOnboarding);
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [arcadeAvatarId, setArcadeAvatarId] = useState("pixel-heart");
  const [bio, setBio] = useState("");
  const [vibeTagIds, setVibeTagIds] = useState<string[]>([]);
  const [profileVisibility, setProfileVisibility] = useState<ProfileVisibility>("public");
  const [pauseProfile, setPauseProfile] = useState(false);
  const [blockUnknownMessages, setBlockUnknownMessages] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [isSaving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setStep(0);
    setAvatarUrl(user.profile.avatarUrl);
    setArcadeAvatarId(user.profile.arcadeAvatarId);
    setBio(user.profile.bio);
    setVibeTagIds(user.profile.vibeTagIds);
    setProfileVisibility(user.safety.profileVisibility);
    setPauseProfile(user.safety.pauseProfile);
    setBlockUnknownMessages(user.safety.blockUnknownMessages);
    setShowOnlineStatus(user.safety.showOnlineStatus);
  }, [open, user]);

  const bioTooShort = bio.trim().length < MIN_BIO_LENGTH;
  const vibeCountMismatch = vibeTagIds.length !== REQUIRED_VIBE_TAGS;
  const steps = mode === "edit" ? EDIT_STEPS : STEPS;

  const canAdvance = useMemo(() => {
    if (step === 0) return true;
    if (step === 1) return !bioTooShort && !vibeCountMismatch;
    return true;
  }, [step, bioTooShort, vibeCountMismatch]);

  const toggleVibe = (id: string) => {
    setVibeTagIds((current) => {
      if (current.includes(id)) return current.filter((tagId) => tagId !== id);
      if (current.length >= REQUIRED_VIBE_TAGS) return current;
      return [...current, id];
    });
  };

  const handleFinish = async () => {
    setSaving(true);
    await finishOnboarding({
      profile: {
        avatarUrl,
        arcadeAvatarId,
        bio: bio.trim(),
        vibeTagIds,
      },
      safety: {
        profileVisibility,
        pauseProfile,
        blockUnknownMessages,
        showOnlineStatus,
      },
    });
    setSaving(false);
    if (mode === "edit") {
      toast.success("Profile updated", "Your changes are live on your card.");
      onClose?.();
      return;
    }
    toast.success("Profile ready 🎮", "Your deck is live. Time to break some ice.");
  };

  if (!user) return null;

  return (
    <Modal
      open={open}
      onClose={mode === "edit" ? () => onClose?.() : () => undefined}
      dismissible={mode === "edit"}
      size="lg"
      title={steps[step].title}
      description={steps[step].subtitle}
      headerAccessory={<Badge tone="purple" icon={Sparkles}>{user.name}</Badge>}
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            disabled={step === 0}
            onClick={() => setStep((value) => Math.max(0, value - 1))}
          >
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button
              iconRight={ArrowRight}
              disabled={!canAdvance}
              onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}
            >
              Continue
            </Button>
          ) : (
            <Button icon={Check} loading={isSaving} onClick={handleFinish}>
              {mode === "edit" ? "Save changes" : "Finish setup"}
            </Button>
          )}
        </div>
      }
    >
      <div className="mb-5 flex gap-2">
        {steps.map((item, index) => (
          <div key={item.id} className="flex-1">
            <div
              className={cn(
                "h-1.5 rounded-full transition-colors",
                index <= step ? "bg-gradient-to-r from-rose to-accent-purple" : "bg-white/10"
              )}
            />
            <p className={cn("mt-2 text-[11px] font-medium", index === step ? "text-white" : "text-muted")}>
              {item.title}
            </p>
          </div>
        ))}
      </div>

      <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
        {step === 0 ? (
          <AvatarPicker
            name={user.name}
            photoUrl={avatarUrl}
            arcadeAvatarId={arcadeAvatarId}
            onPhotoChange={setAvatarUrl}
            onArcadeChange={setArcadeAvatarId}
          />
        ) : null}

        {step === 1 ? (
          <div className="space-y-5">
            <div>
              <label htmlFor="onboarding-bio" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                Short bio
              </label>
              <textarea
                id="onboarding-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value.slice(0, MAX_BIO_LENGTH))}
                rows={4}
                placeholder="One line that gives people something to reply to — what are you obsessed with right now?"
                className={cn(
                  "w-full resize-none rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 backdrop-blur-md transition-colors focus:outline-none focus:ring-2",
                  bioTooShort && bio.length > 0
                    ? "border-rose/50 focus:ring-rose/40"
                    : "border-white/10 focus:border-accent-purple/60 focus:ring-accent-purple/40"
                )}
              />
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className={cn(bioTooShort && bio.length > 0 ? "text-rose-soft" : "text-muted")}>
                  {bioTooShort ? `Add at least ${MIN_BIO_LENGTH} characters` : "Nice — that's a conversation starter."}
                </span>
                <span className="text-muted">
                  {bio.length}/{MAX_BIO_LENGTH}
                </span>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Pick 3 vibe tags</p>
                <Badge tone={vibeCountMismatch ? "glass" : "rose"}>
                  {vibeTagIds.length}/{REQUIRED_VIBE_TAGS} selected
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {VIBE_TAGS.map((tag) => {
                  const isSelected = vibeTagIds.includes(tag.id);
                  const isLocked = !isSelected && vibeTagIds.length >= REQUIRED_VIBE_TAGS;
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleVibe(tag.id)}
                      disabled={isLocked}
                      aria-pressed={isSelected}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-all",
                        isSelected
                          ? "border-rose/70 bg-gradient-to-r from-rose/25 to-accent-purple/25 text-white"
                          : isLocked
                            ? "cursor-not-allowed border-white/5 bg-white/5 text-slate-600"
                            : "border-white/15 bg-white/5 text-muted hover:-translate-y-0.5 hover:border-white/35 hover:text-white"
                      )}
                    >
                      <span>{tag.emoji}</span>
                      {tag.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] text-muted">
                Vibe tags power our Phase 2 icebreaker games — matching tags unlock shared arcade challenges.
              </p>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              <p className="text-xs leading-relaxed text-muted">
                You can change all of this later from the Privacy &amp; Safety centre at any time.
              </p>
            </div>

            <Toggle
              checked={profileVisibility === "incognito"}
              onChange={(value) => setProfileVisibility(value ? "incognito" : "public")}
              icon={Ghost}
              tone="purple"
              label="Start in incognito mode"
              description="Browse quietly. Only people you like first will see you."
            />
            <Toggle
              checked={blockUnknownMessages}
              onChange={setBlockUnknownMessages}
              icon={MessageSquareOff}
              label="Block messages from unknown people"
              description="Recommended. Only matches can start a chat with you."
            />
            <Toggle
              checked={pauseProfile}
              onChange={setPauseProfile}
              icon={Radio}
              label="Pause my profile after setup"
              description="Set this if you'd rather activate your profile when you're ready."
            />
            <Toggle
              checked={showOnlineStatus}
              onChange={setShowOnlineStatus}
              icon={Radio}
              tone="emerald"
              label="Show when I'm online"
              description="Helps matches know when you're around to reply."
            />
          </div>
        ) : null}
      </motion.div>
    </Modal>
  );
}
