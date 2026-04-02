import type { Question, AnswerRecord } from '../types/question'
import type { Team } from '../types/team'
import { getOptions } from '../engine/selectorEngine'
import { AnswerGrid } from './AnswerGrid'

interface Props {
  question: Question
  questionNumber: number
  remaining: Team[]
  answers: AnswerRecord[]
  pivotMessage: string | null
  onAnswer: (value: string) => void
  onBack: () => void
  onRestart: () => void
}

export function QuestionCard({
  question,
  questionNumber,
  remaining,
  answers,
  pivotMessage,
  onAnswer,
  onBack,
  onRestart,
}: Props) {
  const options = getOptions(question, remaining, answers)
  const isHH = (question as Question & { isHeadToHead?: boolean }).isHeadToHead

  return (
    <section className="bg-card border border-border rounded-xl p-6 animate-scale-in">
      {/* Top nav */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="px-3 py-1.5 bg-transparent border border-border rounded text-dim text-[13px] transition-all hover:border-sub hover:text-txt"
        >
          ← Back
        </button>
        <button
          onClick={onRestart}
          className="ml-auto px-3 py-1.5 bg-transparent border border-border rounded text-dim text-[13px] transition-all hover:border-sub hover:text-txt"
        >
          Restart
        </button>
      </div>

      {/* Pivot hint */}
      {pivotMessage && (
        <div className="mb-4 px-4 py-2.5 bg-[rgba(242,201,76,0.05)] border-l-[3px] border-accent rounded-r text-[13px] text-sub italic">
          {pivotMessage}
        </div>
      )}

      {/* Question */}
      <p className="text-[11px] uppercase tracking-[2px] text-accent mb-2 font-semibold">
        Question {questionNumber}
      </p>
      <h2 className="font-display font-bold text-[clamp(22px,4vw,30px)] leading-tight mb-2">
        {question.label}
      </h2>
      <p className="text-[14px] text-sub leading-relaxed mb-6">{question.description}</p>

      <AnswerGrid options={options} isHeadToHead={isHH} onSelect={onAnswer} />
    </section>
  )
}
