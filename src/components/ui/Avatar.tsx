"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { getArcadeAvatar } from "@/data/profileOptions";
import { cn, initialsOf } from "@/lib/utils";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<AvatarSize, string> = {
  xs: "h-8 w-8 text-xs",
  sm: "h-10 w-10 text-lg",
  md: "h-14 w-14 text-2xl",
  lg: "h-20 w-20 text-3xl",
  xl: "h-32 w-32 text-5xl",
};

const CHECK_SIZES: Record<AvatarSize, string> = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6",
};

export interface AvatarProps {
  name: string;
  arcadeAvatarId: string;
  photoUrl?: string | null;
  size?: AvatarSize;
  verified?: boolean;
  className?: string;
}

export function Avatar({
  name,
  arcadeAvatarId,
  photoUrl,
  size = "md",
  verified = false,
  className,
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const arcadeAvatar = getArcadeAvatar(arcadeAvatarId);
  const showPhoto = Boolean(photoUrl) && !imageFailed;

  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br",
          arcadeAvatar.gradient,
          SIZES[size]
        )}
      >
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl ?? ""}
            alt={name}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center font-semibold text-white drop-shadow">
            {arcadeAvatar.emoji ?? initialsOf(name)}
          </span>
        )}
      </div>
      {verified ? (
        <span className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border border-ink bg-emerald-400 p-0.5 text-ink">
          <BadgeCheck className={CHECK_SIZES[size]} />
        </span>
      ) : null}
    </div>
  );
}
