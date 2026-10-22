import type { ArcadeAvatar, InterestedIn, VibeTag } from "@/types";

export const VIBE_TAGS: VibeTag[] = [
  { id: "gamer", label: "Gamer", emoji: "🕹️" },
  { id: "coffee", label: "Coffee Lover", emoji: "☕" },
  { id: "night-owl", label: "Night Owl", emoji: "🌙" },
  { id: "bookworm", label: "Bookworm", emoji: "📚" },
  { id: "foodie", label: "Foodie", emoji: "🍜" },
  { id: "gym-rat", label: "Gym Rat", emoji: "🏋️" },
  { id: "playlist", label: "Playlist Curator", emoji: "🎧" },
  { id: "artist", label: "Artist", emoji: "🎨" },
  { id: "anime", label: "Anime Fan", emoji: "🍥" },
  { id: "traveler", label: "Traveller", emoji: "🧭" },
  { id: "plant-parent", label: "Plant Parent", emoji: "🪴" },
  { id: "pet-lover", label: "Pet Lover", emoji: "🐾" },
  { id: "retro-arcade", label: "Retro Arcade", emoji: "👾" },
  { id: "chai", label: "Chai Addict", emoji: "🫖" },
  { id: "cinema", label: "Cinephile", emoji: "🎬" },
  { id: "dance", label: "Dance Floor", emoji: "💃" },
];

export const REQUIRED_VIBE_TAGS = 3;

export function getVibeTag(id: string): VibeTag | undefined {
  return VIBE_TAGS.find((tag) => tag.id === id);
}

export function vibeTagLabels(ids: string[]): string[] {
  return ids.map((id) => getVibeTag(id)?.label ?? id);
}

export const ARCADE_AVATARS: ArcadeAvatar[] = [
  { id: "pixel-heart", label: "Pixel Heart", emoji: "💗", gradient: "from-rose to-accent-purple" },
  { id: "joystick", label: "Joystick", emoji: "🕹️", gradient: "from-accent-purple to-sky-500" },
  { id: "ghost", label: "Friendly Ghost", emoji: "👻", gradient: "from-indigo-400 to-accent-violet" },
  { id: "rocket", label: "Rocket", emoji: "🚀", gradient: "from-rose-soft to-amber-400" },
  { id: "cat", label: "Arcade Cat", emoji: "🐱", gradient: "from-amber-400 to-rose" },
  { id: "alien", label: "Space Alien", emoji: "👽", gradient: "from-emerald-400 to-sky-500" },
  { id: "unicorn", label: "Unicorn", emoji: "🦄", gradient: "from-fuchsia-400 to-rose-soft" },
  { id: "dice", label: "Lucky Dice", emoji: "🎲", gradient: "from-sky-400 to-accent-purple" },
];

export function getArcadeAvatar(id: string): ArcadeAvatar {
  return ARCADE_AVATARS.find((avatar) => avatar.id === id) ?? ARCADE_AVATARS[0];
}

export const GENDER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Prefer to self-describe" },
];

export const INTEREST_OPTIONS: Array<{ value: InterestedIn; label: string }> = [
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "everyone", label: "Everyone" },
];
