export type GenderIdentity = "woman" | "man" | "non-binary" | "other";

export type InterestedIn = "women" | "men" | "everyone";

export type VerificationStatus = "unverified" | "pending" | "verified";

export type ProfileVisibility = "public" | "incognito";

export interface VibeTag {
  id: string;
  label: string;
  emoji: string;
}

export interface ArcadeAvatar {
  id: string;
  label: string;
  emoji: string;
  gradient: string;
}

export interface SafetyPreferences {
  profileVisibility: ProfileVisibility;
  pauseProfile: boolean;
  blockUnknownMessages: boolean;
  showOnlineStatus: boolean;
  shareDistance: boolean;
}

export interface DatingProfile {
  avatarUrl: string | null;
  arcadeAvatarId: string;
  bio: string;
  vibeTagIds: string[];
  lookingFor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: GenderIdentity;
  interestedIn: InterestedIn;
  city: string;
  createdAt: string;
  onboardingComplete: boolean;
  verification: VerificationStatus;
  profile: DatingProfile;
  safety: SafetyPreferences;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: GenderIdentity;
  interestedIn: InterestedIn;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  ok: boolean;
  user?: User;
  error?: string;
}

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export type ReportReasonId =
  | "harassment"
  | "fake_profile"
  | "inappropriate_content"
  | "spam_or_scam"
  | "underage"
  | "other";

export interface ReportReason {
  id: ReportReasonId;
  label: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface ReportTarget {
  id: string;
  name: string;
}

export interface ReportDraft {
  reason: ReportReasonId | null;
  details: string;
  blockUser: boolean;
}

export interface ReportRecord {
  id: string;
  reporterId: string;
  targetId: string;
  targetName: string;
  reason: ReportReasonId;
  details: string;
  blocked: boolean;
  createdAt: string;
  status: "received" | "reviewing";
}

export interface MatchProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  distanceKm: number;
  bio: string;
  photoUrl: string;
  arcadeAvatarId: string;
  verification: VerificationStatus;
  vibeTagIds: string[];
  matchPercent: number;
}

export interface SafetyTip {
  id: string;
  title: string;
  body: string;
}
