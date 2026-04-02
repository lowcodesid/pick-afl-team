import type { Team } from '../types/team'
import { TeamBadge } from './TeamBadge'

interface Props {
  runnerUp: Team
  diff: string | null
}

export function RunnerUpCard({ runnerUp, diff }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-5 flex items-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[11px] uppercase tracking-[2px] text-dim mb-1">Runner-up</span>
        <span className="font-display font-bold italic text-[18px] text-txt">{runnerUp.name}</span>
        {diff && (
          <span className="text-[12px] text-dim mt-1 leading-snug">{diff}</span>
        )}
      </div>
      <TeamBadge team={runnerUp} size={48} />
    </div>
  )
}
