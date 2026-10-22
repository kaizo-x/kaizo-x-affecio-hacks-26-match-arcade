import type { MatchProfile } from "@/types";

const PROMPT_RIYA =
  "portrait photograph of a smiling young woman with long dark hair, warm golden hour light, cozy neon cafe background, shallow depth of field, photorealistic, 85mm lens";
const PROMPT_KAI =
  "portrait photograph of a friendly young man with curly hair and round glasses, colorful retro arcade neon lights in background, cinematic lighting, photorealistic, 85mm lens";

export const MOCK_MATCHES: MatchProfile[] = [
  {
    id: "match_riya",
    name: "Riya",
    age: 24,
    city: "Pune",
    distanceKm: 3,
    bio: "Product designer by day, Tekken grinder by night. I will absolutely beat you at air hockey and then buy you chai.",
    photoUrl: `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
      PROMPT_RIYA
    )}&image_size=portrait_4_3`,
    arcadeAvatarId: "pixel-heart",
    verification: "verified",
    vibeTagIds: ["coffee", "gamer", "night-owl"],
    matchPercent: 92,
  },
  {
    id: "match_kai",
    name: "Kai",
    age: 27,
    city: "Bengaluru",
    distanceKm: 8,
    bio: "Street-food cartographer and playlist curator. Ask me about the best 2am momos, I have a spreadsheet.",
    photoUrl: `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
      PROMPT_KAI
    )}&image_size=portrait_4_3`,
    arcadeAvatarId: "joystick",
    verification: "unverified",
    vibeTagIds: ["foodie", "playlist", "retro-arcade"],
    matchPercent: 87,
  },
];
