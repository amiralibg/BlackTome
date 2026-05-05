import type { CharacterArchetype } from '../types/game'

export const characterArchetypes: CharacterArchetype[] = [
  {
    id: 'builder',
    name: 'Builder',
    tagline: 'Stone, iron, and stubborn hands.',
    description: 'Repairs broken wards, survives physical danger, and can craft tools from cursed ruins.',
    statBonus: { health: 10, energy: 4, sanity: -4 },
    startingItem: 'Mason rune-hammer',
  },
  {
    id: 'wizard',
    name: 'Wizard',
    tagline: 'A scholar of unsafe stars.',
    description: 'Reads arcane scripts, bends rituals, and pays for power with fragile sanity.',
    statBonus: { health: -6, energy: 8, sanity: 6 },
    startingItem: 'Glass wand',
  },
  {
    id: 'hunter',
    name: 'Hunter',
    tagline: 'Quiet feet, silver aim.',
    description: 'Tracks monsters, avoids ambushes, and turns scarce supplies into lethal answers.',
    statBonus: { health: 4, energy: 10, sanity: -2 },
    startingItem: 'Silvered bowstring',
  },
  {
    id: 'occultist',
    name: 'Occultist',
    tagline: 'Knows which doors should stay hungry.',
    description: 'Bargains with entities, identifies curses, and starts closer to the abyss.',
    statBonus: { health: -2, energy: 2, sanity: 10 },
    startingItem: 'Red salt vial',
  },
]

export const defaultArchetype = characterArchetypes[0]

export function getArchetype(id: string) {
  return characterArchetypes.find((archetype) => archetype.id === id) ?? defaultArchetype
}
