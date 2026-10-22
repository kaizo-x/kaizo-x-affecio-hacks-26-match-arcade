import type { AuthResult, LoginInput, RegisterInput, ReportRecord, User } from "@/types";
import { createId } from "@/lib/utils";

/**
 * The whole app talks to authentication only through this interface.
 * Swapping the local mock for Firebase / Supabase means implementing these
 * same methods against that SDK and returning it from `getAuthAdapter()`.
 */
export interface AuthAdapter {
  register(input: RegisterInput): Promise<AuthResult>;
  login(input: LoginInput): Promise<AuthResult>;
  logout(): Promise<void>;
  currentUser(): Promise<User | null>;
  saveUser(user: User): Promise<User>;
  listReports(userId: string): Promise<ReportRecord[]>;
  saveReport(report: ReportRecord): Promise<ReportRecord>;
}

export function createDefaultUser(input: RegisterInput): User {
  return {
    id: createId("usr"),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    age: input.age,
    gender: input.gender,
    interestedIn: input.interestedIn,
    city: "Your city",
    createdAt: new Date().toISOString(),
    onboardingComplete: false,
    verification: "unverified",
    profile: {
      avatarUrl: null,
      arcadeAvatarId: "pixel-heart",
      bio: "",
      vibeTagIds: [],
      lookingFor: "Someone to break the ice with",
    },
    safety: {
      profileVisibility: "public",
      pauseProfile: false,
      blockUnknownMessages: true,
      showOnlineStatus: true,
      shareDistance: true,
    },
  };
}
