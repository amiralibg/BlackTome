import type { HistoryEntry } from '../types/game'

type HistoryLogProps = {
  history: HistoryEntry[]
  isOpen: boolean
  onToggle: () => void
}

export function HistoryLog({ history, isOpen, onToggle }: HistoryLogProps) {
  return (
    <section className="animate-fade-up rounded-xl border border-stone-200/8 bg-black/35 backdrop-blur-xl [animation-delay:100ms] [animation-fill-mode:both]">
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.02] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-crimson-200/40">
        <span className="font-serif-display text-xl text-stone-100">Session log</span>
        <span className="text-[0.65rem] uppercase tracking-wider text-stone-500">{isOpen ? 'Collapse' : 'Expand'}</span>
      </button>
      {isOpen && (
        <div className="max-h-72 space-y-2.5 overflow-y-auto border-t border-stone-200/8 px-4 py-3 scrollbar-thin">
          {history.length === 0 ? (
            <p className="text-sm text-stone-500">No ink has dried yet.</p>
          ) : history.slice().reverse().map((entry) => (
            <article key={entry.id} className="rounded-xl border border-stone-200/6 bg-stone-950/40 p-2.5">
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <span className="text-[0.6rem] font-bold uppercase tracking-wider text-crimson-200/50">{entry.type}</span>
                <time className="text-[0.6rem] text-stone-600">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
              </div>
              <p className="line-clamp-4 text-sm leading-relaxed text-stone-400">{entry.text}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
