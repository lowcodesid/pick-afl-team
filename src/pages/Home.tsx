import { TEAMS } from '../data/teams'

interface Props {
  onStart: () => void
}

export function Home({ onStart }: Props) {
  return (
    <div
      className="
        flex flex-col items-center justify-center min-h-full text-center
        px-5 py-16
        bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(242,201,76,0.08)_0%,transparent_70%)]
        animate-fade-in
      "
    >
      {/* Title */}
      <h1
        className="font-display font-black italic leading-[0.9] tracking-[-2px] mb-4 animate-fade-up"
        style={{
          fontSize: 'clamp(52px, 11vw, 104px)',
          animationDelay: '0.05s',
        }}
      >
        FIND MY
        <br />
        <span className="text-accent">AFL TEAM</span>
      </h1>

      <p
        className="text-[clamp(15px,2vw,18px)] text-sub max-w-[420px] leading-relaxed mb-10 animate-fade-up"
        style={{ animationDelay: '0.15s' }}
      >
        Answer a few smart questions. Get your one team.
        <br />
        Pure logic — no randomness.
      </p>

      <button
        onClick={onStart}
        className="
          animate-fade-up
          px-10 py-4 bg-accent text-bg
          font-display font-bold text-[22px] uppercase tracking-[1px]
          rounded transition-all duration-200
          hover:bg-[#ffe066] hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(242,201,76,0.28)]
          active:translate-y-0
        "
        style={{ animationDelay: '0.25s' }}
      >
        Start the selector →
      </button>

      {/* Team dots */}
      <div
        className="mt-14 flex flex-wrap gap-2 justify-center max-w-[560px] opacity-35 animate-fade-up"
        style={{ animationDelay: '0.45s' }}
      >
        {TEAMS.map((t) => (
          <div
            key={t.id}
            className="w-3 h-3 rounded-full"
            style={{ background: t.uiColors[0] }}
            title={t.name}
          />
        ))}
      </div>

      <p className="mt-6 text-[12px] text-dim animate-fade-up" style={{ animationDelay: '0.55s' }}>
        All 18 AFL clubs · Deterministic rules · Works offline
      </p>
    </div>
  )
}
