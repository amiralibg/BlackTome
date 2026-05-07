import type { GameOverState } from '../types/game'

type GameOverModalProps = {
  gameOver: GameOverState | null
  onNewGame: () => void
}

export function GameOverModal({ gameOver, onNewGame }: GameOverModalProps) {
  if (!gameOver) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <div className="w-full max-w-xl animate-scale-in rounded-4xl border border-crimson-300/25 bg-[#0a080e]/95 p-6 shadow-[0_26px_100px_rgba(0,0,0,0.65)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-crimson-200/70">Journey ended</p>
        <h2 id="game-over-title" className="mt-2 font-serif-display text-4xl text-stone-100">{gameOver.title}</h2>
        <p className="mt-3 leading-7 text-stone-400">{gameOver.message}</p>

        <button type="button" onClick={onNewGame} className="mt-7 w-full rounded-2xl border border-crimson-300/35 bg-crimson-950/45 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-crimson-100 transition hover:border-crimson-200/70 hover:bg-crimson-900/55 focus:outline-none focus:ring-2 focus:ring-crimson-200/70">
          Start Again
        </button>
      </div>
    </div>
  )
}
