import { mockAuthAdapter } from "@/services/mockAuthAdapter";
import type { AuthAdapter } from "@/services/authService";

/**
 * Single resolution point for the authentication backend. Point this at a
 * Firebase adapter to move from the offline mock to a hosted service.
 */
export function getAuthAdapter(): AuthAdapter {
  return mockAuthAdapter;
}

export const authService: AuthAdapter = getAuthAdapter();
