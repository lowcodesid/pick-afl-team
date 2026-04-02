import type { Team } from '../types/team'
import type { AnswerRecord } from '../types/question'
import { QUESTIONS } from '../data/questions'

/**
 * Generate human-readable explanation bullets from the user's actual answers
 * and the engine's filtering logic. Bullets are tied to real data, not hardcoded.
 */
export function generateExplanation(
  winner: Team,
  runnerUp: Team | null,
  answers: AnswerRecord[]
): string[] {
  const bullets: string[] = []

  for (const ans of answers) {
    const q = QUESTIONS.find(q => q.id === ans.questionId)
    if (!q) continue

    // Strip emoji prefix for cleaner prose
    const cleanLabel = ans.label.replace(/^[^\p{L}]*\s*/u, '').trim()

    switch (ans.questionId) {
      case 'colour_primary':
        if (ans.answer !== 'none')
          bullets.push(`You gravitated toward ${cleanLabel.toLowerCase()} — a defining colour in ${winner.name}'s kit`)
        break

      case 'colour_secondary':
        if (ans.answer !== 'none')
          bullets.push(`Your preference for ${cleanLabel.toLowerCase()} as a second colour narrowed the field further`)
        break

      case 'mascot_type':
        bullets.push(
          ans.answer === 'animal'
            ? `You wanted an animal mascot — ${winner.name} brings you the ${winner.mascotLabel}`
            : `You preferred a symbolic identity — the ${winner.nickname} fits that exactly`
        )
        break

      case 'mascot_animal_class':
        bullets.push(`You chose the ${cleanLabel} — that points directly to ${winner.name}`)
        break

      case 'geo_state':
        if (ans.answer !== 'none')
          bullets.push(`Your ${cleanLabel} connection puts ${winner.name} right in the frame`)
        break

      case 'geo_vic_type':
        if (ans.answer !== 'none') {
          const label = ans.answer === 'metro' ? 'Melbourne metro clubs' : 'regional Victoria'
          bullets.push(`You preferred ${label} — ${winner.name} fits that profile`)
        }
        break

      case 'success_appetite':
        if (ans.answer !== 'any') {
          const map: Record<string, string> = {
            high:   'a genuine premiership contender',
            medium: 'a competitive, rising club',
            low:    'an underdog to believe in',
          }
          bullets.push(`You wanted ${map[ans.answer] ?? ans.answer} — ${winner.name} delivers that`)
        }
        break

      case 'success_recent':
        if (ans.answer === 'yes')
          bullets.push(
            winner.recentPremiership
              ? `Recent success matters to you — ${winner.name} are proven winners`
              : `You wanted recent success; ${winner.name} is the strongest remaining match`
          )
        break

      case 'culture_size':
        if (ans.answer !== 'any')
          bullets.push(`You wanted a ${cleanLabel.toLowerCase()} — ${winner.name}'s following matches that energy`)
        break

      case 'culture_vibe':
        bullets.push(`"${cleanLabel}" describes ${winner.name}'s culture exactly`)
        break

      case 'brand_style':
        if (ans.answer !== 'none')
          bullets.push(
            `You leaned ${ans.answer === 'traditional' ? 'toward heritage and tradition' : 'toward a modern identity'} — ${winner.name} is one of the AFL's most ${ans.answer} clubs`
          )
        break

      case 'stadium_vibe':
        if (ans.answer !== 'none')
          bullets.push(`Your game-day preference — ${cleanLabel.toLowerCase()} — is what ${winner.name} delivers`)
        break

      case 'social_team_pick':
        bullets.push(`Your social connection to ${winner.name} was the decisive tie-breaker`)
        break

      case 'final_choice':
        bullets.push(
          runnerUp
            ? `In the final head-to-head you chose ${winner.name} over ${runnerUp.name}`
            : `You made the final call — ${winner.name} it is`
        )
        break

      default:
        break
    }
  }

  if (bullets.length === 0)
    bullets.push(`${winner.name} best matched your overall profile across all the factors`)

  return bullets
}

/**
 * Generate a short sentence explaining why the winner beat the runner-up.
 */
export function generateRunnerUpDiff(winner: Team, runnerUp: Team, answers: AnswerRecord[]): string {
  // Find the most decisive answer that differentiates the two
  for (const ans of [...answers].reverse()) {
    const q = QUESTIONS.find(q => q.id === ans.questionId)
    if (!q) continue
    const winnerIn = q.filter([winner, runnerUp], ans.answer, answers).some(t => t.id === winner.id)
    const runnerIn = q.filter([winner, runnerUp], ans.answer, answers).some(t => t.id === runnerUp.id)
    if (winnerIn && !runnerIn) {
      const cleanLabel = ans.label.replace(/^[^\p{L}]*\s*/u, '').trim()
      return `${winner.name} better matched your "${q.shortLabel}" answer (${cleanLabel.toLowerCase()})`
    }
  }

  // Fallback: compare on success tier
  const tierOrder = { high: 3, medium: 2, low: 1 }
  if ((tierOrder[winner.successTier] ?? 0) > (tierOrder[runnerUp.successTier] ?? 0))
    return `${winner.name} has a stronger recent success record`

  if (winner.recentPremiership && !runnerUp.recentPremiership)
    return `${winner.name} has a more recent premiership`

  return `${winner.name} edged ${runnerUp.name} across the overall profile`
}

// Needed for dynamic import in filters.ts
export { QUESTIONS }
