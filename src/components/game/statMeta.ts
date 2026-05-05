import type { StatKey } from '../../types/game'

export const statMeta = [
  { key: 'health', label: 'Health', shortLabel: 'HP', color: 'bg-crimson-300', bar: 'from-crimson-300 to-red-800' },
  { key: 'energy', label: 'Energy', shortLabel: 'EN', color: 'bg-violet-300', bar: 'from-violet-200 to-violet-800' },
  { key: 'sanity', label: 'Sanity', shortLabel: 'SN', color: 'bg-slate-200', bar: 'from-slate-200 to-slate-600' },
] as const satisfies ReadonlyArray<{
  key: StatKey
  label: string
  shortLabel: string
  color: string
  bar: string
}>
