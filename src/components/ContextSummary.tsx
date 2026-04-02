import type { AnswerRecord } from '../types/question'
import { QUESTIONS } from '../data/questions'
import { ProgressBar } from './ProgressBar'

interface Props {
  pathway: string | null
  pathwayLabel: string
  pathwayEmoji: string
  answers: AnswerRecord[]
  remainingCount: number
  progress: number
}

export function ContextSummary({
  pathwayLabel,
  pathwayEmoji,
  answers,
  remainingCount,
  progress,
}: Props) {
  return (
    <aside className="bg-card border border-border rounded-xl p-4 sticky top-4">
      <p className="text-[11px] uppercase tracking-[2px] text-dim font-semibold mb-3">
        Your choices
      </p>

      {/* Pathway row */}
      <div className="flex flex-col gap-1 py-3 border-b border-border">
        <span className="text-[11px] uppercase tracking-[1px] text-dim">Starting with</span>
        <span className="text-sm font-semibold text-txt">
          {pathwayEmoji} {pathwayLabel}
        </span>
      </div>

      {/* Answer rows */}
      {answers.map((ans) => {
        const q = QUESTIONS.find(q => q.id === ans.questionId)
        const cleanLabel = ans.label.replace(/^[^\p{L}]*\s*/u, '').trim()
        return (
          <div key={ans.questionId} className="flex flex-col gap-1 py-3 border-b border-border">
            <span className="text-[11px] uppercase tracking-[1px] text-dim">
              {q?.shortLabel ?? ans.questionId}
            </span>
            <span className="text-[13px] font-semibold text-txt leading-snug">{cleanLabel}</span>
          </div>
        )
      })}

      {/* Remaining badge */}
      <div className="mt-3 p-3 bg-[rgba(242,201,76,0.06)] border border-[rgba(242,201,76,0.15)] rounded-lg text-center">
        <div className="font-display font-black text-accent text-3xl leading-none">
          {remainingCount}
        </div>
        <div className="text-[11px] uppercase tracking-[1px] text-sub mt-1">
          {remainingCount === 1 ? 'Club left' : 'Clubs in play'}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <ProgressBar progress={progress} />
      </div>
    </aside>
  )
}
