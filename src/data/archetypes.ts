import type { CharacterArchetype, CharacterArchetypeId } from "../types/game";

import builderImage from "../assets/images/charachters/builder.png";
import wizardImage from "../assets/images/charachters/wizard.png";
import hunterImage from "../assets/images/charachters/hunter.png";
import occultistImage from "../assets/images/charachters/occultist.png";

export const characterArchetypes: CharacterArchetype[] = [
  {
    id: "builder",
    name: "Builder",
    tagline: "Stone, iron, and stubborn hands.",
    description:
      "Repairs broken wards, survives physical danger, and can craft tools from cursed ruins.",
    statBonus: { health: 10, energy: 4, sanity: -4 },
    startingItem: "Mason rune-hammer",
    image: builderImage,
  },
  {
    id: "wizard",
    name: "Wizard",
    tagline: "A scholar of unsafe stars.",
    description:
      "Reads arcane scripts, bends rituals, and pays for power with fragile sanity.",
    statBonus: { health: -6, energy: 8, sanity: 6 },
    startingItem: "Glass wand",
    image: wizardImage,
  },
  {
    id: "hunter",
    name: "Hunter",
    tagline: "Quiet feet, silver aim.",
    description:
      "Tracks monsters, avoids ambushes, and turns scarce supplies into lethal answers.",
    statBonus: { health: 4, energy: 10, sanity: -2 },
    startingItem: "Silvered bowstring",
    image: hunterImage,
  },
  {
    id: "occultist",
    name: "Occultist",
    tagline: "Knows which doors should stay hungry.",
    description:
      "Bargains with entities, identifies curses, and starts closer to the abyss.",
    statBonus: { health: -2, energy: 2, sanity: 10 },
    startingItem: "Red salt vial",
    image: occultistImage,
  },
];

export const archetypeThemes: Record<
  CharacterArchetypeId,
  {
    badge: string;
    ring: string;
    selectedCard: string;
    selectedCardShadow: string;
    hoverCard: string;
    previewGlow: string;
    previewBg: string;
    cta: string;
    ctaHover: string;
    accentText: string;
    softLabel: string;
  }
> = {
  builder: {
    badge: "border-amber-200/30 bg-amber-300/10 text-amber-100",
    ring: "focus:ring-amber-200/50",
    selectedCard: "border-amber-200/55 bg-amber-950/25",
    selectedCardShadow:
      "shadow-[0_0_0_1px_rgba(251,191,36,0.08),0_16px_40px_rgba(120,53,15,0.18)]",
    hoverCard:
      "hover:border-amber-200/35 hover:bg-amber-950/20 hover:shadow-[0_14px_36px_rgba(120,53,15,0.18)]",
    previewGlow: "bg-amber-700/20",
    previewBg:
      "bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.22),rgba(0,0,0,0.16)_52%,rgba(0,0,0,0.42))]",
    cta: "border-amber-300/35 bg-amber-950/45 text-amber-50",
    ctaHover: "hover:border-amber-200/70 hover:bg-amber-900/55",
    accentText: "text-amber-100",
    softLabel: "text-amber-200/60",
  },

  wizard: {
    badge: "border-violet-200/30 bg-violet-300/10 text-violet-100",
    ring: "focus:ring-violet-200/50",
    selectedCard: "border-violet-200/55 bg-violet-950/25",
    selectedCardShadow:
      "shadow-[0_0_0_1px_rgba(196,181,253,0.08),0_16px_40px_rgba(76,29,149,0.2)]",
    hoverCard:
      "hover:border-violet-200/35 hover:bg-violet-950/20 hover:shadow-[0_14px_36px_rgba(76,29,149,0.2)]",
    previewGlow: "bg-violet-700/20",
    previewBg:
      "bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.24),rgba(0,0,0,0.16)_52%,rgba(0,0,0,0.42))]",
    cta: "border-violet-300/35 bg-violet-950/45 text-violet-50",
    ctaHover: "hover:border-violet-200/70 hover:bg-violet-900/55",
    accentText: "text-violet-100",
    softLabel: "text-violet-200/60",
  },

  hunter: {
    badge: "border-emerald-200/30 bg-emerald-300/10 text-emerald-100",
    ring: "focus:ring-emerald-200/50",
    selectedCard: "border-emerald-200/55 bg-emerald-950/25",
    selectedCardShadow:
      "shadow-[0_0_0_1px_rgba(167,243,208,0.08),0_16px_40px_rgba(6,78,59,0.22)]",
    hoverCard:
      "hover:border-emerald-200/35 hover:bg-emerald-950/20 hover:shadow-[0_14px_36px_rgba(6,78,59,0.22)]",
    previewGlow: "bg-emerald-700/20",
    previewBg:
      "bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.22),rgba(0,0,0,0.16)_52%,rgba(0,0,0,0.42))]",
    cta: "border-emerald-300/35 bg-emerald-950/45 text-emerald-50",
    ctaHover: "hover:border-emerald-200/70 hover:bg-emerald-900/55",
    accentText: "text-emerald-100",
    softLabel: "text-emerald-200/60",
  },

  occultist: {
    badge: "border-fuchsia-200/30 bg-fuchsia-300/10 text-fuchsia-100",
    ring: "focus:ring-fuchsia-200/50",
    selectedCard: "border-fuchsia-200/55 bg-fuchsia-950/25",
    selectedCardShadow:
      "shadow-[0_0_0_1px_rgba(245,208,254,0.08),0_16px_40px_rgba(112,26,117,0.24)]",
    hoverCard:
      "hover:border-fuchsia-200/35 hover:bg-fuchsia-950/20 hover:shadow-[0_14px_36px_rgba(112,26,117,0.24)]",
    previewGlow: "bg-fuchsia-700/20",
    previewBg:
      "bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.22),rgba(0,0,0,0.16)_52%,rgba(0,0,0,0.42))]",
    cta: "border-fuchsia-300/35 bg-fuchsia-950/45 text-fuchsia-50",
    ctaHover: "hover:border-fuchsia-200/70 hover:bg-fuchsia-900/55",
    accentText: "text-fuchsia-100",
    softLabel: "text-fuchsia-200/60",
  },
};

export const defaultArchetype = characterArchetypes[0];

export function getArchetype(id: string) {
  return (
    characterArchetypes.find((archetype) => archetype.id === id) ??
    defaultArchetype
  );
}
