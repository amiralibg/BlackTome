import type { Choice } from '../types/game'
import { ChoiceButton } from './ChoiceButton'

type ChoiceListProps = {
  choices: Choice[]
  onSelect: (choice: Choice) => void
  compact?: boolean
}

export function ChoiceList({ choices, onSelect, compact = false }: ChoiceListProps) {
  if (compact) {
    return (
      <section className="rounded-[1.25rem] border border-stone-200/10 bg-[#0d0b12]/72 p-3 backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="font-serif-display text-lg text-stone-100">Paths</h2>
          <span className="text-[0.62rem] uppercase tracking-[0.2em] text-stone-500">{choices.length}</span>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {choices.map((choice, index) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onSelect(choice)}
              className="group min-h-16 rounded-2xl border border-stone-200/10 bg-stone-950/55 px-3 py-2 text-left transition hover:-translate-y-0.5 hover:border-crimson-200/45 hover:bg-crimson-950/25 focus:outline-none focus:ring-2 focus:ring-crimson-200/60"
            >
              <span className="mb-1 block text-[0.58rem] font-bold uppercase tracking-[0.22em] text-violet-200/60">{choice.tone ?? `Path ${index + 1}`}</span>
              <span className="line-clamp-2 text-sm font-semibold leading-5 text-stone-100">{choice.label}</span>
            </button>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-[1.75rem] border border-stone-200/10 bg-[#0d0b12]/72 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-serif-display text-2xl text-stone-100">Choose a thread</h2>
        <span className="text-xs uppercase tracking-[0.22em] text-stone-500">{choices.length} paths</span>
      </div>
      <div className="grid gap-3">
        {choices.map((choice, index) => (
          <ChoiceButton key={choice.id} choice={choice} index={index} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}
