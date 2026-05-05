import type { PlayerStatsModel } from '../types/game'
import { statMeta } from './game/statMeta'

type PlayerStatsProps = {
  player: PlayerStatsModel
}

export function PlayerStats({ player }: PlayerStatsProps) {
  return (
    <aside className="animate-fade-up rounded-xl border border-stone-200/8 bg-[#0d0b12]/80 p-4 shadow-[0_12px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-crimson-200/60">Bound Reader</p>
      <h2 className="mt-1.5 font-serif-display text-2xl text-stone-100">{player.name}</h2>
      <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-violet-200/50">{player.archetypeName}</p>
      <div className="mt-5 grid gap-3.5">
        {statMeta.map((stat) => {
          const value = player[stat.key]
          return (
            <div key={stat.key}>
              <div className="mb-1.5 flex items-center justify-between text-[0.65rem] uppercase tracking-wider text-stone-400">
                <span>{stat.label}</span>
                <span>{value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-stone-900 shadow-[inset_0_0_8px_rgba(0,0,0,0.7)]">
                <div className={`h-full rounded-full bg-gradient-to-r ${stat.color} shadow-[0_0_12px_rgba(220,38,38,0.15)] transition-all duration-700`} style={{ width: `${value}%` }} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-5 border-t border-stone-200/8 pt-4">
        <p className="mb-2.5 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500">Inventory</p>
        <div className="flex flex-wrap gap-2">
          {player.inventory.map((item) => (
            <span key={item} className="rounded-full border border-stone-200/8 bg-white/[0.03] px-2.5 py-1 text-xs text-stone-300">{item}</span>
          ))}
        </div>
      </div>
    </aside>
  )
}
