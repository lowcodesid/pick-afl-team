import type { Team } from '../types/team'
import type { AnswerRecord, Question } from '../types/question'
import type { ResultData } from '../types/engine'
import { TEAMS } from '../data/teams'
import { QUESTIONS } from '../data/questions'
import { getOptions, isApplicable, isUseful } from './filters'
import { selectNextQuestion } from './nextQuestion'
import { relaxConstraints } from './relaxation'
import { generateExplanation, generateRunnerUpDiff } from './explanation'

export { getOptions }

/**
 * Deterministically resolve the winner and runner-up from a list of candidates.
 * Sorted by success tier → recent premiership → fanbase size.
 */
export function resolveWinner(teams: Team[]): Team[] {
  const tierOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
  const sizeOrder: Record<string, number> = { giant: 4, large: 3, medium: 2, small: 1 }
  return [...teams].sort((a, b) => {
    const td = (tierOrder[b.successTier] ?? 0) - (tierOrder[a.successTier] ?? 0)
    if (td !== 0) return td
    if (a.recentPremiership !== b.recentPremiership) return b.recentPremiership ? 1 : -1
    return (sizeOrder[b.fanbaseSize] ?? 0) - (sizeOrder[a.fanbaseSize] ?? 0)
  })
}

/** Replay all recorded answers against the full team list */
export function replayFilters(answers: AnswerRecord[]): Team[] {
  let remaining: Team[] = [...TEAMS]
  for (const ans of answers) {
    const q = QUESTIONS.find(q => q.id === ans.questionId)
    if (!q) continue
    const filtered = q.filter(remaining, ans.answer, answers)
    if (filtered.length > 0) remaining = filtered
  }
  return remaining
}

export interface HandleAnswerResult {
  newRemaining: Team[]
  newAnswers: AnswerRecord[]
  newAskedIds: string[]
  relaxedMessage: string | null
  result: ResultData | null
  nextQuestion: Question | null
  pivotMessage: string | null
}

/**
 * Core engine step: process one user answer and return new state.
 */
export function handleAnswer(
  currentQuestion: Question,
  answerValue: string,
  remaining: Team[],
  answers: AnswerRecord[],
  askedIds: string[],
  pathway: string
): HandleAnswerResult {
  // Build the option label for display
  const opts = getOptions(currentQuestion, remaining, answers)
  const opt = opts.find(o => o.value === answerValue)
  const label = opt?.label ?? answerValue

  const newAnswer: AnswerRecord = {
    questionId: currentQuestion.id,
    answer: answerValue,
    label,
  }
  const newAnswers = [...answers, newAnswer]
  const newAskedIds = [...askedIds, currentQuestion.id]

  // Apply the filter
  let filtered = currentQuestion.filter(remaining, answerValue, answers)
  let relaxedMessage: string | null = null

  // Soft relaxation: if filter eliminates everything, try relaxing an earlier constraint
  if (filtered.length === 0) {
    const relaxResult = relaxConstraints(newAnswers)
    if (relaxResult) {
      filtered = relaxResult.remaining
      relaxedMessage = relaxResult.message
      // NOTE: we keep newAnswers as-is (the answer is still recorded) but
      // the remaining set is the relaxed one.
    } else {
      filtered = remaining // ultimate fallback
    }
  }

  const newRemaining = filtered.length > 0 ? filtered : remaining

  // === Resolved to one team ===
  if (newRemaining.length === 1) {
    const winner = newRemaining[0]
    const candidates = resolveWinner(remaining.filter(t => t.id !== winner.id))
    const runnerUp = candidates[0] ?? null
    const explanation = generateExplanation(winner, runnerUp, newAnswers)
    const runnerUpDiff = runnerUp ? generateRunnerUpDiff(winner, runnerUp, newAnswers) : null
    return {
      newRemaining,
      newAnswers,
      newAskedIds,
      relaxedMessage,
      result: { winner, runnerUp, explanation, runnerUpDiff } as ResultData & { runnerUpDiff: string | null },
      nextQuestion: null,
      pivotMessage: null,
    }
  }

  // === Select next question ===
  const nextQ = selectNextQuestion(newRemaining, newAnswers, newAskedIds, pathway)

  // If no more questions, resolve deterministically
  if (!nextQ) {
    const sorted = resolveWinner(newRemaining)
    const winner = sorted[0]
    const runnerUp = sorted[1] ?? null
    const explanation = generateExplanation(winner, runnerUp, newAnswers)
    const runnerUpDiff = runnerUp ? generateRunnerUpDiff(winner, runnerUp, newAnswers) : null
    return {
      newRemaining,
      newAnswers,
      newAskedIds,
      relaxedMessage,
      result: { winner, runnerUp, explanation, runnerUpDiff } as ResultData & { runnerUpDiff: string | null },
      nextQuestion: null,
      pivotMessage: null,
    }
  }

  // Pivot message if we're switching pathway families
  const currentPathway = currentQuestion.pathway
  const nextPathway = nextQ.pathway
  const nonPivotPathways = ['social', 'final']
  const pivotMessage =
    nextPathway !== currentPathway && !nonPivotPathways.includes(nextPathway)
      ? 'A few clubs still fit your choices — let\'s narrow it down from a different angle.'
      : null

  return {
    newRemaining,
    newAnswers,
    newAskedIds,
    relaxedMessage,
    result: null,
    nextQuestion: nextQ,
    pivotMessage,
  }
}

/** Pathway ID → first question ID */
export const PATHWAY_FIRST_Q: Record<string, string> = {
  colours:   'colour_primary',
  mascot:    'mascot_type',
  geography: 'geo_state',
  success:   'success_appetite',
  culture:   'culture_size',
  stadium:   'stadium_vibe',
  tradition: 'brand_style',
  surprise:  'success_appetite',   // engine picks freely from here
}

export { QUESTIONS, TEAMS, selectNextQuestion, generateExplanation }
