type LoadingOverlayProps = {
  visible: boolean
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-6 backdrop-blur-sm" role="status" aria-live="polite">
      <div className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-crimson-300/20 bg-[#09070c]/90 p-8 text-center shadow-[0_0_90px_rgba(127,29,29,0.25)]">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-stone-200/50 to-transparent" />
        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full border border-violet-300/20 bg-violet-950/20 shadow-[inset_0_0_24px_rgba(167,139,250,0.14)] animate-rune-pulse">
          <span className="text-3xl text-crimson-200">*</span>
        </div>
        <p className="font-serif-display text-2xl text-stone-100">The tome is writing</p>
        <div className="mt-3 flex justify-center gap-2" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="h-2 w-2 rounded-full bg-crimson-200 animate-writing-dot" style={{ animationDelay: `${dot * 0.18}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
