type QuitGameModalProps = {
  open: boolean
  onClose: () => void
  onStartMenu: () => void
  onNewGame: () => void
}

export function QuitGameModal({ open, onClose, onStartMenu, onNewGame }: QuitGameModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/65 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="quit-title">
      <div className="w-full max-w-xl rounded-4xl border border-stone-200/12 bg-[#0a080e]/95 p-6 shadow-[0_26px_100px_rgba(0,0,0,0.55)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-crimson-200/70">Close the tome</p>
        <h2 id="quit-title" className="mt-2 font-serif-display text-4xl text-stone-100">Leave this journey?</h2>
        <p className="mt-3 leading-7 text-stone-400">
          Return to the start menu to keep your autosave, or begin a new journey and overwrite the current run.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <button type="button" onClick={onStartMenu} className="rounded-2xl border border-stone-200/15 bg-stone-950/60 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-200 transition hover:border-violet-200/40 hover:bg-violet-950/30 focus:outline-none focus:ring-2 focus:ring-violet-200/60">
            Start Menu
          </button>
          <button type="button" onClick={onNewGame} className="rounded-2xl border border-crimson-300/35 bg-crimson-950/40 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-crimson-100 transition hover:border-crimson-200/70 hover:bg-crimson-900/50 focus:outline-none focus:ring-2 focus:ring-crimson-200/70">
            New Game
          </button>
          <button type="button" onClick={onClose} className="rounded-2xl border border-stone-200/10 bg-white/3 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:border-stone-200/30 hover:bg-white/6 focus:outline-none focus:ring-2 focus:ring-stone-200/50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
