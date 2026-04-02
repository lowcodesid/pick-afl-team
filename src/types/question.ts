import type { Team } from './team'

export type Pathway =
  | 'colours'
  | 'mascot'
  | 'geography'
  | 'success'
  | 'culture'
  | 'tradition'
  | 'stadium'
  | 'social'
  | 'final'

export interface QuestionOption {
  value: string
  label: string
  subtitle?: string
}

export interface Question {
  id: string
  pathway: Pathway
  label: string
  description: string
  shortLabel: string
  /** Static options — used when isDynamic is false */
  options: QuestionOption[]
  /** Dynamic option generator — called with current remaining teams */
  isDynamic?: boolean
  getDynamicOptions?: (teams: Team[], answers: AnswerRecord[]) => QuestionOption[]
  /** Condition that must be true for question to be asked */
  appliesWhen?: (answers: AnswerRecord[]) => boolean
  /** Returns filtered teams based on this answer */
  filter: (teams: Team[], value: string, answers: AnswerRecord[]) => Team[]
  /** Higher = more important, asked sooner */
  priority: number
  /** How decisively this question can break a tie (1–10) */
  tieBreakerStrength: number
}

export interface AnswerRecord {
  questionId: string
  answer: string
  /** Human-readable version of the answer for display */
  label: string
}
