import type { QuestionOption } from '../types/question'

interface Props {
  options: QuestionOption[]
  isHeadToHead?: boolean
  onSelect: (value: string) => void
}

export function AnswerGrid({ options, isHeadToHead, onSelect }: Props) {
  const isTwoOption = options.length === 2

  return (
    <div
      className={`grid gap-3 ${
        isTwoOption || isHeadToHead
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-1'
      }`}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className="
            group text-left px-4 py-3 rounded-lg
            bg-white/[0.03] border border-border
            transition-all duration-150
            hover:bg-[rgba(242,201,76,0.06)] hover:border-[rgba(242,201,76,0.45)] hover:translate-x-[3px]
            active:translate-x-[1px]
            flex flex-col gap-1
          "
        >
          <span className="text-[15px] font-semibold text-txt group-hover:text-white transition-colors leading-snug">
            {opt.label}
          </span>
          {opt.subtitle && (
            <span className="text-[12px] text-dim leading-snug">{opt.subtitle}</span>
          )}
        </button>
      ))}
    </div>
  )
}
