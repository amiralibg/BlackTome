import { useEffect, useMemo, useRef, useState } from 'react'
import type { PlayerStatsModel, StatKey } from '../../types/game'
import { statMeta } from './statMeta'

type StatChange = {
  key: StatKey
  label: string
  delta: number
}

function getChangedStats(previousPlayer: PlayerStatsModel | null, player: PlayerStatsModel) {
  if (!previousPlayer) return []

  const changes: StatChange[] = []

  statMeta.forEach((stat) => {
    const before = previousPlayer[stat.key]
    const after = player[stat.key]
    if (before !== after) {
      changes.push({ key: stat.key, label: stat.label, delta: after - before })
    }
  })

  return changes
}

type MobileResourceBarProps = {
  player: PlayerStatsModel
  onOpen: () => void
}

export function MobileResourceBar({ player, onOpen }: MobileResourceBarProps) {
  const previousPlayerRef = useRef<PlayerStatsModel | null>(null)
  const [changedStats, setChangedStats] = useState<StatChange[]>([])

  useEffect(() => {
    const changes = getChangedStats(previousPlayerRef.current, player)
    previousPlayerRef.current = player

    if (changes.length === 0) return

    const showTimeoutId = window.setTimeout(() => setChangedStats(changes), 0)
    const hideTimeoutId = window.setTimeout(() => setChangedStats([]), 3200)
    return () => {
      window.clearTimeout(showTimeoutId)
      window.clearTimeout(hideTimeoutId)
    }
  }, [player])

  const alertText = useMemo(() => {
    if (changedStats.length === 0) return 'Resources'
    return changedStats.map((change) => `${change.label} ${change.delta > 0 ? '+' : ''}${change.delta}`).join(' · ')
  }, [changedStats])

  return (
    <div className="sticky top-2 z-30 -mx-1 lg:hidden">
      <button
        type="button"
        onClick={onOpen}
        className={`w-full rounded-2xl border px-3 py-2.5 text-left shadow-[0_14px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 active:scale-[0.98] ${
          changedStats.length > 0
            ? 'animate-resource-alert border-crimson-200/45 bg-crimson-950/45'
            : 'border-stone-200/10 bg-[#07050a]/92'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-crimson-200/60">Bound Reader</p>
            <p className="mt-0.5 max-w-36 truncate font-serif-display text-base text-stone-100">{player.name}</p>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            {statMeta.map((stat) => (
              <div key={stat.key} className="min-w-12">
                <div className="mb-1 flex items-center justify-between gap-1 text-[0.58rem] font-bold uppercase tracking-wider text-stone-400">
                  <span>{stat.shortLabel}</span>
                  <span>{player[stat.key]}</span>
                </div>
                <div className="h-1 rounded-full bg-stone-900">
                  <div className={`h-full rounded-full ${stat.color} transition-all duration-700`} style={{ width: `${player[stat.key]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`mt-2 overflow-hidden text-xs transition-all duration-300 ${changedStats.length > 0 ? 'max-h-6 opacity-100' : 'max-h-0 opacity-0'}`}>
          <span className="text-crimson-100">{alertText}</span>
        </div>
      </button>
    </div>
  )
}

type MobileResourcesSheetProps = {
  player: PlayerStatsModel
  isOpen: boolean
  onClose: () => void
}

export function MobileResourcesSheet({ player, isOpen, onClose }: MobileResourcesSheetProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 animate-fade-in bg-black/70 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close resources" onClick={onClose} className="absolute inset-0 h-full w-full cursor-default" />
      <div className="absolute inset-x-0 bottom-0 max-h-[82svh] animate-slide-up overflow-y-auto rounded-t-3xl border-t border-stone-200/10 bg-[#08060b] shadow-[0_-20px_80px_rgba(0,0,0,0.8)]">
        <div className="sticky top-0 z-10 border-b border-stone-200/6 bg-[#08060b]/98 px-4 pb-3 pt-3 backdrop-blur-xl">
          <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-stone-700" />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-crimson-200/50">Resources</p>
              <h2 className="mt-0.5 font-serif-display text-xl text-stone-100">{player.name}</h2>
              <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-violet-200/50">{player.archetypeName}</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-full border border-stone-200/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-stone-300 active:bg-stone-900/30">
              Close
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4 pb-6">
          <div className="grid gap-3">
            {statMeta.map((stat) => (
              <div key={stat.key} className="rounded-2xl border border-stone-200/8 bg-stone-950/50 p-3">
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wider text-stone-400">
                  <span>{stat.label}</span>
                  <span>{player[stat.key]}%</span>
                </div>
                <div className="h-2 rounded-full bg-stone-900 shadow-[inset_0_0_8px_rgba(0,0,0,0.7)]">
                  <div className={`h-full rounded-full bg-linear-to-r ${stat.bar} shadow-[0_0_12px_rgba(220,38,38,0.15)] transition-all duration-700`} style={{ width: `${player[stat.key]}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-stone-200/8 bg-stone-950/50 p-3">
            <p className="mb-2.5 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500">Inventory</p>
            <div className="flex flex-wrap gap-2">
              {player.inventory.map((item) => (
                <span key={item} className="rounded-full border border-stone-200/8 bg-white/3 px-2.5 py-1 text-xs text-stone-300">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
