import type { Team } from '../types/team'
import type { AnswerRecord } from '../types/question'
import { QUESTIONS } from '../data/questions'
import { TEAMS } from '../data/teams'

/**
 * Relaxation priority: lower value = relax this one first.
 * Questions with higher tieBreakerStrength are kept longer.
 */
const RELAXATION_ORDER = [
  'colour_secondary',
  'brand_style',
  'stadium_vibe',
  'geo_vic_type',
  'culture_size',
  'success_recent',
  'culture_vibe',
  'success_appetite',
  'colour_primary',
  'mascot_type',
  'geo_state',
  'mascot_animal_class',
]

export interface RelaxationResult {
  remaining: Team[]
  relaxedAnswers: AnswerRecord[]
  message: string
}

/**
 * If filtering with all answers produces an empty set, relax the
 * least critical constraint(s) until at least one team survives.
 * Returns the updated remaining teams and a human-readable message.
 */
export function relaxConstraints(answers: AnswerRecord[]): RelaxationResult | null {
  for (const qId of RELAXATION_ORDER) {
    const idx = answers.findIndex(a => a.questionId === qId)
    if (idx === -1) continue

    // Try without this answer
    const relaxed = answers.filter((_, i) => i !== idx)
    let rem: Team[] = [...TEAMS]
    for (const ans of relaxed) {
      const q = QUESTIONS.find(q => q.id === ans.questionId)
      if (!q) continue
      const f = q.filter(rem, ans.answer, relaxed)
      if (f.length > 0) rem = f
    }

    if (rem.length > 0) {
      const removedQ = QUESTIONS.find(q => q.id === qId)
      const removedAns = answers[idx]
      const optLabel = removedAns.label.replace(/^[^\s]*\s+/, '')
      return {
        remaining: rem,
        relaxedAnswers: relaxed,
        message: `No exact club matched every preference, so we broadened your "${removedQ?.shortLabel ?? qId}" answer slightly (you chose "${optLabel}") to keep your recommendation strong.`,
      }
    }
  }

  // If all relaxations fail, just return all teams (shouldn't happen)
  return null
}
