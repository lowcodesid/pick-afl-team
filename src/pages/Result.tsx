import type { ResultData } from '../types/engine'
import { TeamResultCard } from '../components/TeamResultCard'
import { RunnerUpCard } from '../components/RunnerUpCard'

interface Props {
  result: ResultData & { runnerUpDiff?: string | null }
  relaxedMessage: string | null
  onRestart: () => void
  onChangePathway: () => void
}

export function ResultScreen({ result, relaxedMessage, onRestart, onChangePathway }: Props) {
  const { winner, runnerUp, explanation } = result

  return (
    <div className="max-w-[680px] mx-auto px-4 py-8 animate-fade-in">
      <p className="text-[13px] uppercase tracking-[3px] text-dim mb-4 animate-fade-up">
        Your AFL team is
      </p>

      <TeamResultCard
        winner={winner}
        explanation={explanation}
        relaxedMessage={relaxedMessage}
      />

      {runnerUp && (
        <RunnerUpCard
          runnerUp={runnerUp}
          diff={result.runnerUpDiff ?? null}
        />
      )}

      {/* CTA row */}
      <div
        className="flex flex-wrap gap-3 animate-fade-up"
        style={{ animationDelay: '0.3s' }}
      >
        <button
          onClick={onRestart}
          className="
            flex-1 py-3.5 bg-accent text-bg
            font-display font-bold text-[18px] uppercase tracking-[1px] rounded
            transition-all duration-200
            hover:bg-[#ffe066] hover:-translate-y-[1px]
            active:translate-y-0
          "
        >
          Try Again
        </button>
        <button
          onClick={onChangePathway}
          className="
            flex-1 py-3.5 bg-transparent text-sub border border-border
            font-display font-bold text-[18px] uppercase tracking-[1px] rounded
            transition-all duration-200
            hover:border-sub hover:text-txt
          "
        >
          Change Pathway
        </button>
      </div>
    </div>
  )
}
