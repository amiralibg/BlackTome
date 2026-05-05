export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050407]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(112,29,53,0.32),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(70,45,110,0.28),transparent_30%),linear-gradient(135deg,#050407_0%,#111016_52%,#070509_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-950/20 blur-3xl animate-slow-pulse" />
      <div className="absolute -bottom-24 left-0 h-72 w-[130%] bg-[radial-gradient(ellipse_at_center,rgba(180,181,191,0.12),transparent_62%)] blur-2xl animate-drift" />
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-stone-200/30 shadow-[0_0_16px_rgba(232,229,218,0.55)] animate-ember"
          style={{
            left: `${8 + ((index * 19) % 86)}%`,
            top: `${12 + ((index * 23) % 74)}%`,
            animationDelay: `${index * 0.45}s`,
            animationDuration: `${7 + (index % 5)}s`,
          }}
        />
      ))}
    </div>
  )
}
