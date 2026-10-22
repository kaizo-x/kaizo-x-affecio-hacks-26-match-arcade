import type { ReportReason, SafetyTip } from "@/types";

export const REPORT_REASONS: ReportReason[] = [
  {
    id: "harassment",
    label: "Harassment or bullying",
    description: "Threatening, abusive or repeatedly unwanted messages.",
    severity: "high",
  },
  {
    id: "fake_profile",
    label: "Fake profile or impersonation",
    description: "Photos or identity that don't belong to this person.",
    severity: "high",
  },
  {
    id: "inappropriate_content",
    label: "Inappropriate content",
    description: "Explicit, violent or otherwise unsafe material.",
    severity: "high",
  },
  {
    id: "spam_or_scam",
    label: "Spam or scam",
    description: "Soliciting money, crypto pitches or external links.",
    severity: "medium",
  },
  {
    id: "underage",
    label: "Suspected underage user",
    description: "Someone who appears to be below 18.",
    severity: "high",
  },
  {
    id: "other",
    label: "Something else",
    description: "Tell us in your own words what went wrong.",
    severity: "low",
  },
];

export function getReportReason(id: string): ReportReason | undefined {
  return REPORT_REASONS.find((reason) => reason.id === id);
}

export const SAFETY_TIPS: SafetyTip[] = [
  {
    id: "meet-public",
    title: "Meet in public, stay in control",
    body: "Choose a busy cafe, arcade or mall for a first meet. Tell a friend where you're going and share your live location with them.",
  },
  {
    id: "video-first",
    title: "Video chat before you meet",
    body: "A short call confirms the person matches their photos and gives you a feel for the conversation before meeting offline.",
  },
  {
    id: "money",
    title: "Never send money",
    body: "MatchArcade will never ask for payments inside a chat. Any request for money, gift cards or crypto is a red flag — report it.",
  },
  {
    id: "personal-info",
    title: "Keep personal details close",
    body: "Don't share your home address, workplace, bank details or ID documents until trust is genuinely built.",
  },
  {
    id: "trust-gut",
    title: "Trust your gut and use the tools",
    body: "If something feels off, block and report in two taps. Our safety team reviews every report and you never have to explain yourself.",
  },
];
