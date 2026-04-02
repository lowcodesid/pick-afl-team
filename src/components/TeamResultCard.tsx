import type { Team } from '../types/team'
import { TeamBadge } from './TeamBadge'

interface Props {
  winner: Team
  explanation: string[]
  relaxedMessage: string | null
}

export function TeamResultCard({ winner, explanation, relaxedMessage }: Props) {
  const [c1, c2] = winner.uiColors

  return (
    <>
      {/* Winner hero */}
      <div
        className="rounded-xl overflow-hidden mb-5 animate-scale-in"
        style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)` }}
      >
        <div className="p-7 flex items-start gap-5">
          <TeamBadge team={winner} size={80} />
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-black italic text-[clamp(30px,6vw,52px)] leading-none tracking-tight">
              {winner.name}
            </h1>
            <p className="text-[13px] uppercase tracking-[3px] mt-1 opacity-75">
              {winner.nickname}
            </p>
            <p className="text-[14px] opacity-80 mt-3 leading-relaxed">{winner.summary}</p>
          </div>
        </div>
      </div>

      {/* Why this team */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <p className="text-[11px] uppercase tracking-[2px] text-dim font-semibold mb-4">
          Why this team
        </p>
        <div className="flex flex-col gap-1">
          {explanation.map((bullet, i) => (
            <div key={i} className="flex gap-3 py-2.5 border-b border-border last:border-0">
              <span className="text-accent text-[14px] mt-0.5 flex-shrink-0">→</span>
              <span className="text-[14px] text-sub leading-relaxed">{bullet}</span>
            </div>
          ))}

          {relaxedMessage && (
            <div className="flex gap-3 py-2.5 mt-1">
              <span className="text-[rgba(255,200,100,0.6)] text-[14px] mt-0.5 flex-shrink-0">~</span>
              <span className="text-[13px] italic text-[rgba(255,200,100,0.65)] leading-relaxed">
                {relaxedMessage}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
