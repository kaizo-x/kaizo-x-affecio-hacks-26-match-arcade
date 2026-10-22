"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ARCADE_AVATARS } from "@/data/profileOptions";
import { useToast } from "@/context/ToastProvider";
import { fileToAvatarDataUrl, ImageProcessingError } from "@/lib/image";
import { cn } from "@/lib/utils";

export interface AvatarPickerProps {
  name: string;
  photoUrl: string | null;
  arcadeAvatarId: string;
  onPhotoChange: (url: string | null) => void;
  onArcadeChange: (id: string) => void;
}

export function AvatarPicker({
  name,
  photoUrl,
  arcadeAvatarId,
  onPhotoChange,
  onArcadeChange,
}: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setProcessing] = useState(false);
  const toast = useToast();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setProcessing(true);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      onPhotoChange(dataUrl);
      toast.success("Photo added", "Looking good! You can swap it any time.");
    } catch (error) {
      const message =
        error instanceof ImageProcessingError ? error.message : "We couldn't process that image.";
      toast.error("Upload failed", message);
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar
            name={name || "New player"}
            arcadeAvatarId={arcadeAvatarId}
            photoUrl={photoUrl}
            size="xl"
            className="animate-float"
          />
          <span className="absolute -left-1 -top-1 rounded-full bg-gradient-to-r from-rose to-accent-purple px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
            Preview
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={isProcessing ? undefined : Camera}
            loading={isProcessing}
            onClick={() => inputRef.current?.click()}
          >
            {photoUrl ? "Replace photo" : "Upload photo"}
          </Button>
          {photoUrl ? (
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={() => {
                onPhotoChange(null);
                toast.info("Photo removed", "Pick an arcade avatar below instead.");
              }}
            >
              Remove
            </Button>
          ) : null}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        <p className="max-w-sm text-center text-xs leading-relaxed text-muted">
          Upload a clear face photo (up to 6 MB) or unlock an arcade avatar. Photos are resized locally in your browser.
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Arcade avatars</p>
          {isProcessing ? (
            <span className="flex items-center gap-1.5 text-[11px] text-muted">
              <Loader2 className="h-3 w-3 animate-spin" /> processing
            </span>
          ) : null}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {ARCADE_AVATARS.map((avatar) => {
            const isSelected = avatar.id === arcadeAvatarId && !photoUrl;
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => {
                  onArcadeChange(avatar.id);
                  onPhotoChange(null);
                }}
                aria-pressed={isSelected}
                title={avatar.label}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 transition-all",
                  isSelected
                    ? "border-rose/70 bg-rose/10 shadow-glow"
                    : "border-white/10 bg-white/5 hover:-translate-y-0.5 hover:border-white/25"
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-xl",
                    avatar.gradient
                  )}
                >
                  {avatar.emoji}
                </span>
                <span className="text-[10px] font-medium text-muted">{avatar.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
