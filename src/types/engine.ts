import type { Team } from './team'
import type { AnswerRecord } from './question'

export type Screen = 'landing' | 'pathway' | 'question' | 'result'

export interface EngineState {
  screen: Screen
  pathway: string | null
  remaining: Team[]
  answers: AnswerRecord[]
  askedIds: string[]
  currentQuestionId: string | null
  result: ResultData | null
  relaxedMessage: string | null
  pivotMessage: string | null
}

export interface ResultData {
  winner: Team
  runnerUp: Team | null
  explanation: string[]
}
