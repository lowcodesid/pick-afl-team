import type { AnswerRecord, Question } from '../types/question'
import type { Team } from '../types/team'
import { PathwayCard } from '../components/PathwayCard'
import { QuestionCard } from '../components/QuestionCard'
import { ContextSummary } from '../components/ContextSummary'

interface PathwayDef {
  id: string
  emoji: string
  label: string
  desc: string
}

export const PATHWAYS: PathwayDef[] = [
  { id: 'colours',   emoji: '🎨', label: 'Colours',           desc: 'Start with your favourite colour' },
  { id: 'mascot',    emoji: '🦅', label: 'Mascot & Identity',  desc: 'Find a team that matches your spirit' },
  { id: 'geography', emoji: '📍', label: 'State / City',       desc: 'Support your local heroes' },
  { id: 'success',   emoji: '🏆', label: 'Success / Trophies', desc: 'How much do wins matter?' },
  { id: 'culture',   emoji: '📣', label: 'Fan Culture',         desc: 'Find your people in the stands' },
  { id: 'stadium',   emoji: '🏟️', label: 'Game-Day Vibe',      desc: 'Pick your ideal atmosphere' },
  { id: 'tradition', emoji: '⚡', label: 'Tradition vs Modern', desc: 'Heritage club or fresh identity?' },
  { id: 'surprise',  emoji: '🎲', label: 'Surprise Me',         desc: 'Let the selector decide' },
]

interface PathwayScreenProps {
  onSelect: (pathwayId: string) => void
}

export function PathwayScreen({ onSelect }: PathwayScreenProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-7">
        <h2
          className="font-display font-black italic tracking-tight leading-none mb-2"
          style={{ fontSize: 'clamp(28px, 5vw, 44px)' }}
        >
          How do you want to{' '}
          <span className="text-accent">start?</span>
        </h2>
        <p className="text-sub text-[15px]">
          Pick a starting pathway — the selector adapts from there.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {PATHWAYS.map((p, i) => (
          <PathwayCard
            key={p.id}
            id={p.id}
            emoji={p.emoji}
            label={p.label}
            desc={p.desc}
            style={{ animationDelay: `${i * 0.06}s` }}
            onClick={() => onSelect(p.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface QuestionScreenProps {
  question: Question
  remaining: Team[]
  answers: AnswerRecord[]
  pathway: string
  pivotMessage: string | null
  onAnswer: (value: string) => void
  onBack: () => void
  onRestart: () => void
}

export function QuestionScreen({
  question,
  remaining,
  answers,
  pathway,
  pivotMessage,
  onAnswer,
  onBack,
  onRestart,
}: QuestionScreenProps) {
  const pw = PATHWAYS.find((p) => p.id === pathway)
  const progress = Math.min(answers.length / 7, 1)

  return (
    <div className="max-w-[900px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 items-start">
        {/* Context sidebar */}
        <ContextSummary
          pathway={pathway}
          pathwayLabel={pw?.label ?? pathway}
          pathwayEmoji={pw?.emoji ?? ''}
          answers={answers}
          remainingCount={remaining.length}
          progress={progress}
        />

        {/* Question card */}
        <QuestionCard
          question={question}
          questionNumber={answers.length + 1}
          remaining={remaining}
          answers={answers}
          pivotMessage={pivotMessage}
          onAnswer={onAnswer}
          onBack={onBack}
          onRestart={onRestart}
        />
      </div>
    </div>
  )
}
