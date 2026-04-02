import type { Team } from '../types/team'
import type { Question, AnswerRecord } from '../types/question'
import { QUESTIONS } from '../data/questions'
import { isApplicable, isUseful, getOptions } from './filters'

/**
 * Select the best next question to ask given the current engine state.
 * Returns null if no useful question remains.
 */
export function selectNextQuestion(
  remaining: Team[],
  answers: AnswerRecord[],
  askedIds: string[],
  pathway: string
): Question | null {
  // Down to 2: go straight to head-to-head
  if (remaining.length === 2 && !askedIds.includes('final_choice')) {
    return QUESTIONS.find(q => q.id === 'final_choice') ?? null
  }

  // If the user asked to align with a social team, pick that question next
  if (
    answers.some(a => a.questionId === 'social_influence' && a.answer === 'yes_align') &&
    !askedIds.includes('social_team_pick')
  ) {
    const sq = QUESTIONS.find(q => q.id === 'social_team_pick')
    if (sq && isUseful(sq, remaining, answers)) return sq
  }

  // Offer social influence as a late-stage question (2–4 remaining, 2+ already answered)
  if (
    !askedIds.includes('social_influence') &&
    remaining.length <= 4 &&
    answers.length >= 2
  ) {
    const si = QUESTIONS.find(q => q.id === 'social_influence')
    if (si) return si
  }

  // Score all other applicable, useful, not-yet-asked questions
  const candidates = QUESTIONS.filter(q => {
    if (['final_choice', 'social_influence', 'social_team_pick'].includes(q.id)) return false
    if (askedIds.includes(q.id)) return false
    if (!isApplicable(q, answers)) return false
    if (!isUseful(q, remaining, answers)) return false
    return true
  })

  if (candidates.length === 0) return null

  // Score: pathway match bonus + priority + tieBreaker
  const scored = candidates.map(q => ({
    q,
    score: q.priority * 2 + q.tieBreakerStrength + (q.pathway === pathway ? 10 : 0),
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored[0].q
}

/**
 * Determine how many options of a given question would split the remaining
 * teams into different subsets — higher = more useful for disambiguation.
 */
export function splitScore(q: Question, teams: Team[], answers: AnswerRecord[]): number {
  const opts = getOptions(q, teams, answers)
  const active = opts.filter(o => !['none', 'any', 'no', 'no_preference'].includes(o.value))
  const resultSizes = active.map(o => q.filter(teams, o.value, answers).length)
  const nonZero = resultSizes.filter(s => s > 0 && s < teams.length)
  return nonZero.length
}
