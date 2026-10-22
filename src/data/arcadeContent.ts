import { getVibeTag } from "@/data/profileOptions";
import type {
  ArcadeGame,
  CanvasPrompt,
  ChatMessage,
  HotTake,
  HotTakeChoice,
  HotTakeVerdict,
  MatchProfile,
  OutcomeChip,
  OutcomeTone,
} from "@/types";

export const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: "hot-take-swipe",
    name: "Hot Take Swipe",
    emoji: "🔥",
    tagline: "5 opinions, 15 seconds, zero small talk.",
    howToPlay: "Swipe agree or disagree on 5 spicy opinions. We compare your answers with theirs instantly.",
    durationSeconds: 15,
    rounds: 5,
    accent: "rose",
  },
  {
    id: "co-op-canvas",
    name: "Co-Op Canvas",
    emoji: "🎨",
    tagline: "One shared canvas, 30 chaotic seconds.",
    howToPlay: "You both draw on the same board. Nobody wins, the drawing is the joke.",
    durationSeconds: 30,
    rounds: 1,
    accent: "purple",
  },
];

export const HOT_TAKES: HotTake[] = [
  {
    id: "pineapple",
    prompt: "Pineapple belongs on pizza.",
    agreeLabel: "Absolutely, sweet + savoury wins",
    disagreeLabel: "Never. That's a crime scene",
    agreeEmoji: "🍍",
    disagreeEmoji: "🚫",
    partnerStance: "agree",
  },
  {
    id: "texting",
    prompt: "Texting always beats phone calls.",
    agreeLabel: "Text me or nothing",
    disagreeLabel: "Calls are faster and warmer",
    agreeEmoji: "💬",
    disagreeEmoji: "📞",
    partnerStance: "agree",
  },
  {
    id: "cereal",
    prompt: "Cereal is basically cold soup.",
    agreeLabel: "Structurally, yes it is",
    disagreeLabel: "Do not disrespect breakfast",
    agreeEmoji: "🥣",
    disagreeEmoji: "🥛",
    partnerStance: "disagree",
  },
  {
    id: "spoilers",
    prompt: "Spoilers are fair game a week after release.",
    agreeLabel: "A week is generous",
    disagreeLabel: "Spoilers are a betrayal",
    agreeEmoji: "📺",
    disagreeEmoji: "🤐",
    partnerStance: "disagree",
  },
  {
    id: "seats",
    prompt: "Window seats on flights are non-negotiable.",
    agreeLabel: "Window or I'm not boarding",
    disagreeLabel: "Aisle, I need to stretch",
    agreeEmoji: "🪟",
    disagreeEmoji: "🚶",
    partnerStance: "agree",
  },
];

export const CANVAS_PROMPTS: CanvasPrompt[] = [
  {
    id: "cat",
    subject: "Draw a cat together in 30s",
    emoji: "🐱",
    hint: "One cat. Four legs… allegedly.",
    completionChip: "🎨 You drew a chaotic 6-legged cat!",
  },
  {
    id: "pizza",
    subject: "Draw your dream pizza in 30s",
    emoji: "🍕",
    hint: "Extra toppings are strongly encouraged.",
    completionChip: "🍕 You drew a pizza with three toppings too many!",
  },
  {
    id: "alien",
    subject: "Draw an alien drinking chai in 30s",
    emoji: "👽",
    hint: "Extra limbs are part of the charm.",
    completionChip: "👽 You drew an alien holding five chai cups at once!",
  },
];

/** Deterministic hash so mock partner behaviour stays stable per match + round. */
function hash(input: string): number {
  let value = 0;
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) % 100_000;
  }
  return value;
}

/** The other player's answer, nudged per match so different people disagree differently. */
export function resolvePartnerStance(take: HotTake, partnerName: string): HotTakeChoice {
  const flipped = hash(`${partnerName}:${take.id}`) % 4 === 0;
  if (!flipped) return take.partnerStance;
  return take.partnerStance === "agree" ? "disagree" : "agree";
}

export function choiceCopy(take: HotTake, choice: HotTakeChoice): string {
  const emoji = choice === "agree" ? take.agreeEmoji : take.disagreeEmoji;
  const label = choice === "agree" ? take.agreeLabel : take.disagreeLabel;
  return `${emoji} ${label}`;
}

function shorten(text: string, max = 42): string {
  if (text.length <= max) return text.replace(/\.$/, "");
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Turns the swipe results into the two outcome chips dropped into the chat:
 * one shared match, one playful clash.
 */
export function buildHotTakeChips(verdicts: HotTakeVerdict[], partnerName: string): OutcomeChip[] {
  const agreements = verdicts.filter((verdict) => verdict.agreed);
  const clashes = verdicts.filter((verdict) => !verdict.agreed);
  const chips: OutcomeChip[] = [];

  if (agreements.length > 0) {
    const best = agreements[0];
    chips.push({
      id: `chip_hot_match_${best.take.id}`,
      gameId: "hot-take-swipe",
      emoji: "🔥",
      tone: "match",
      label: `You both agreed: ${shorten(best.take.prompt)}`,
      message: `🔥 You both agreed — "${best.take.prompt}" We matched on ${agreements.length}/${verdicts.length} hot takes, are you always this right?`,
    });
  } else {
    chips.push({
      id: "chip_hot_match_none",
      gameId: "hot-take-swipe",
      emoji: "😅",
      tone: "match",
      label: "Zero agreements, maximum chaos",
      message: `😅 Not a single agreement out of ${verdicts.length} hot takes. That's either a disaster or the best first date story.`,
    });
  }

  if (clashes.length > 0) {
    const clash = clashes[0];
    chips.push({
      id: `chip_hot_clash_${clash.take.id}`,
      gameId: "hot-take-swipe",
      emoji: "⚔️",
      tone: "clash",
      label: `Playful clash: ${shorten(clash.take.prompt)}`,
      message: `⚔️ We clash on "${clash.take.prompt}" — I said ${choiceCopy(clash.take, clash.self)}, ${partnerName} said ${choiceCopy(
        clash.take,
        clash.partner
      )}. Defend your side 😄`,
    });
  } else {
    chips.push({
      id: "chip_hot_clash_none",
      gameId: "hot-take-swipe",
      emoji: "🧠",
      tone: "clash",
      label: "Certified identical twins",
      message: `🧠 We agreed on all ${verdicts.length} takes. Slightly terrifying, mostly excellent.`,
    });
  }

  return chips;
}

/** Builds the shared-canvas outcome chip once the 30s round ends. */
export function buildCanvasChip(
  prompt: CanvasPrompt,
  partnerName: string,
  partnerStrokes: number
): OutcomeChip {
  return {
    id: `chip_canvas_${prompt.id}`,
    gameId: "co-op-canvas",
    emoji: prompt.emoji,
    tone: "canvas",
    label: prompt.completionChip,
    message: `${prompt.completionChip} ${partnerName} threw in ${partnerStrokes} ${
      partnerStrokes === 1 ? "stroke" : "strokes"
    } to help. Rematch in 30 seconds?`,
  };
}

/** Fallback chips so a brand new match still has tappable openers. */
export function buildStarterChips(profile: MatchProfile): OutcomeChip[] {
  const tag = getVibeTag(profile.vibeTagIds[0]);

  return [
    {
      id: `chip_starter_game_${profile.id}`,
      gameId: "hot-take-swipe",
      emoji: "🎮",
      tone: "match",
      label: "Challenge to Hot Take Swipe",
      message: `🎮 Rapid round? 5 hot takes, 15 seconds. First disagreement decides who buys chai.`,
    },
    {
      id: `chip_starter_vibe_${profile.id}`,
      gameId: "co-op-canvas",
      emoji: "🔥",
      tone: "clash",
      label: tag ? `Hot take about ${tag.label}` : "Unsolicited hot take",
      message: tag
        ? `🔥 Hot take: ${tag.emoji} ${tag.label} people are the best kind of chaos. Agree or fight me.`
        : `🔥 Hot take: people who hate mornings are secretly the most fun. Agree or fight me.`,
    },
    {
      id: `chip_starter_bio_${profile.id}`,
      gameId: "co-op-canvas",
      emoji: "👋",
      tone: "canvas",
      label: "Ask about their bio",
      message: `👋 Your bio mentioned "${shorten(profile.bio, 58)}" — I need the full story behind that.`,
    },
  ];
}

/** Partner replies used right after an outcome chip lands in the chat. */
export const CHIP_REPLIES: Record<OutcomeTone, string[]> = {
  match: [
    "Okay we're literally the same person 😭",
    "That's a green flag and I'm not being dramatic.",
    "Same wavelength confirmed ✅ Rematch?",
  ],
  clash: [
    "Nope, absolutely not 😤 …but I respect the confidence.",
    "This is the most wrong thing I've read today. Go on.",
    "Agree to disagree — loser buys chai.",
  ],
  canvas: [
    "This is going straight on my story 📸",
    "Six legs?! Art has no rules I guess 😂",
    "Okay Picasso, I'm drawing next round.",
  ],
};

export const GENERIC_REPLIES: string[] = [
  "Ha! Okay, that's a good one 😄",
  "Tell me more, I'm invested now.",
  "Adding that to the list of things I like about you.",
  "Deal. Loser of the next arcade round buys chai?",
];

export function pickReply(pool: string[], seed: string): string {
  return pool[hash(seed) % pool.length];
}

export function createChatMessage(author: ChatMessage["author"], text: string, chipId?: string): ChatMessage {
  return {
    id: `msg_${author}_${Date.now()}_${Math.round(Math.random() * 10_000)}`,
    author,
    text,
    sentAt: new Date().toISOString(),
    chipId,
  };
}
