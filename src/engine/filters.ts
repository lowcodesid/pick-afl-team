import type { Team } from '../types/team'
import type { Question, AnswerRecord } from '../types/question'
import { QUESTIONS } from '../data/questions'
import { TEAMS } from '../data/teams'

/** Resolve dynamic options for a question */
export function getOptions(q: Question, teams: Team[], answers: AnswerRecord[]) {
  if (q.isDynamic && q.getDynamicOptions) return q.getDynamicOptions(teams, answers)
  return q.options
}

/** Check whether the question's appliesWhen condition is met */
export function isApplicable(q: Question, answers: AnswerRecord[]): boolean {
  if (q.appliesWhen) return q.appliesWhen(answers)
  return true
}

/**
 * A question is "useful" if at least one of its non-trivial option values
 * would actually reduce the remaining team count (without eliminating everyone).
 */
export function isUseful(q: Question, teams: Team[], answers: AnswerRecord[]): boolean {
  const opts = getOptions(q, teams, answers)
  const active = opts.filter(o => !['none', 'any', 'no', 'no_preference'].includes(o.value))
  if (active.length === 0) return false
  return active.some(o => {
    const filtered = q.filter(teams, o.value, answers)
    return filtered.length > 0 && filtered.length < teams.length
  })
}

/**
 * Replay all recorded answers against the full team list to produce
 * the correct remaining set. Used by the back-button logic.
 */
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
