import type { Choice } from '../types/game'

type ChoiceButtonProps = {
  choice: Choice
  index: number
  onSelect: (choice: Choice) => void
}

export function ChoiceButton({ choice, index, onSelect }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(choice)}
      className="group relative w-full overflow-hidden rounded-2xl border border-stone-200/12 bg-stone-950/55 px-4 py-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 animate-choice-in hover:-translate-y-0.5 hover:border-crimson-200/45 hover:bg-crimson-950/25 focus:outline-none focus:ring-2 focus:ring-crimson-200/60"
      style={{ animationDelay: `${index * 95}ms`, animationFillMode: 'both' }}
    >
      <span className="absolute inset-y-3 left-0 w-px bg-gradient-to-b from-transparent via-crimson-200/70 to-transparent opacity-0 transition group-hover:opacity-100" />
      <span className="mb-2 block text-[0.65rem] font-bold uppercase tracking-[0.28em] text-violet-200/60">{choice.tone ?? `Choice ${index + 1}`}</span>
      <span className="block text-sm font-semibold leading-6 text-stone-100 sm:text-base">{choice.label}</span>
    </button>
  )
}
