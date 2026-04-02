import type { Question, AnswerRecord } from '../types/question'
import type { Team } from '../types/team'
import {
  COLOUR_PRIMARY_MAP,
  COLOUR_SECONDARY_MAP,
  STATE_MAP,
  MASCOT_CLASS_MAP,
  MASCOT_EMOJI,
  MASCOT_LABELS,
  CULTURE_VIBE_MAP,
} from './factorMaps'

/** Safely apply a filter — returns `teams` unchanged if result would be empty */
function safe(teams: Team[], filtered: Team[]): Team[] {
  return filtered.length > 0 ? filtered : teams
}

/** Filter teams using a map key, falling back gracefully */
function filterByMap(teams: Team[], map: Record<string, string[]>, key: string): Team[] {
  const ids = map[key] ?? []
  return safe(teams, teams.filter(t => ids.includes(t.id)))
}

export const QUESTIONS: Question[] = [
  // ─────────────────────────────────────────────
  // COLOURS
  // ─────────────────────────────────────────────
  {
    id: 'colour_primary',
    pathway: 'colours',
    label: "What's your favourite colour?",
    description: 'Pick the colour you feel most drawn to in a sports kit.',
    shortLabel: 'Fav colour',
    options: [
      { value: 'blue',   label: '🔵  Blue / Navy' },
      { value: 'red',    label: '🔴  Red' },
      { value: 'black',  label: '⚫  Black' },
      { value: 'gold',   label: '🟡  Gold / Yellow' },
      { value: 'white',  label: '⚪  White' },
      { value: 'purple', label: '🟣  Purple' },
      { value: 'brown',  label: '🟤  Brown' },
      { value: 'teal',   label: '🩵  Teal' },
      { value: 'orange', label: '🟠  Orange' },
      { value: 'maroon', label: '🍷  Maroon' },
    ],
    priority: 10,
    tieBreakerStrength: 8,
    filter: (teams, v) => filterByMap(teams, COLOUR_PRIMARY_MAP, v),
  },

  {
    id: 'colour_secondary',
    pathway: 'colours',
    label: 'Any second favourite colour?',
    description: 'A second colour often seals the deal.',
    shortLabel: 'Second colour',
    options: [
      { value: 'white',  label: '⚪  White' },
      { value: 'gold',   label: '🟡  Gold / Yellow' },
      { value: 'black',  label: '⚫  Black' },
      { value: 'red',    label: '🔴  Red' },
      { value: 'navy',   label: '🔵  Navy / Blue' },
      { value: 'none',   label: '🤷  No preference' },
    ],
    priority: 9,
    tieBreakerStrength: 7,
    filter: (teams, v) => {
      if (v === 'none') return teams
      return filterByMap(teams, COLOUR_SECONDARY_MAP, v)
    },
  },

  // ─────────────────────────────────────────────
  // MASCOT / IDENTITY
  // ─────────────────────────────────────────────
  {
    id: 'mascot_type',
    pathway: 'mascot',
    label: 'What kind of identity appeals to you?',
    description: 'Some teams have animal mascots; others have symbolic or power-based identities.',
    shortLabel: 'Identity type',
    options: [
      { value: 'animal',   label: '🦅  An animal mascot', subtitle: 'Eagles, Tigers, Cats, Dogs and more' },
      { value: 'symbolic', label: '⚡  A symbolic identity', subtitle: 'Blues, Bombers, SUNS, Power and more' },
    ],
    priority: 9,
    tieBreakerStrength: 8,
    filter: (teams, v) => safe(teams, teams.filter(t => t.identityType === v)),
  },

  {
    id: 'mascot_animal_class',
    pathway: 'mascot',
    label: 'Which animal resonates most?',
    description: 'Pick the animal identity that feels most like you.',
    shortLabel: 'Animal mascot',
    options: [],
    isDynamic: true,
    appliesWhen: (answers) => answers.some(a => a.questionId === 'mascot_type' && a.answer === 'animal'),
    getDynamicOptions: (teams: Team[]) => {
      const classes = [...new Set(teams.filter(t => t.identityType === 'animal').map(t => t.mascotClass))]
      return classes.map(c => ({
        value: c,
        label: `${MASCOT_EMOJI[c] ?? ''}  ${MASCOT_LABELS[c] ?? c}`,
        subtitle: teams.filter(t => t.mascotClass === c).map(t => t.name).join(' / '),
      }))
    },
    priority: 8,
    tieBreakerStrength: 9,
    filter: (teams, v) => filterByMap(teams, MASCOT_CLASS_MAP, v),
  },

  // ─────────────────────────────────────────────
  // GEOGRAPHY
  // ─────────────────────────────────────────────
  {
    id: 'geo_state',
    pathway: 'geography',
    label: 'Do you have a connection to a particular state?',
    description: 'Where you live — or love — can define your AFL allegiance.',
    shortLabel: 'State',
    options: [
      { value: 'VIC',  label: '🏙️  Victoria', subtitle: '10 clubs' },
      { value: 'SA',   label: '🌾  South Australia', subtitle: 'Adelaide Crows & Port Adelaide' },
      { value: 'WA',   label: '🌊  Western Australia', subtitle: 'Fremantle & West Coast' },
      { value: 'QLD',  label: '☀️  Queensland', subtitle: 'Brisbane Lions & Gold Coast SUNS' },
      { value: 'NSW',  label: '🌉  New South Wales', subtitle: 'Sydney Swans & GWS GIANTS' },
      { value: 'none', label: '🌏  No preference' },
    ],
    priority: 9,
    tieBreakerStrength: 7,
    filter: (teams, v) => {
      if (v === 'none') return teams
      return filterByMap(teams, STATE_MAP, v)
    },
  },

  {
    id: 'geo_vic_type',
    pathway: 'geography',
    label: 'Melbourne metro or regional Victoria?',
    description: 'Victoria has ten clubs — from inner-Melbourne powerhouses to the regional Geelong side.',
    shortLabel: 'VIC type',
    options: [
      { value: 'metro',    label: '🏙️  Melbourne inner-city clubs' },
      { value: 'regional', label: '🏘️  Regional Victoria (Geelong)' },
      { value: 'none',     label: '🤷  No preference' },
    ],
    priority: 7,
    tieBreakerStrength: 6,
    appliesWhen: (answers) => answers.some(a => a.questionId === 'geo_state' && a.answer === 'VIC'),
    filter: (teams, v) => {
      if (v === 'none') return teams
      return safe(teams, teams.filter(t => t.cityType === v))
    },
  },

  // ─────────────────────────────────────────────
  // SUCCESS
  // ─────────────────────────────────────────────
  {
    id: 'success_appetite',
    pathway: 'success',
    label: 'What kind of success story appeals to you?',
    description: "Your relationship with winning reveals a lot about which club suits you.",
    shortLabel: 'Success appetite',
    options: [
      { value: 'high',   label: '🏆  Genuine premiership contender', subtitle: 'I want to celebrate' },
      { value: 'medium', label: '📈  Competitive and building', subtitle: "Consistent finals football" },
      { value: 'low',    label: '💪  True underdog — I\'ll suffer', subtitle: 'Pain is part of the journey' },
      { value: 'any',    label: '🤷  It doesn\'t matter to me' },
    ],
    priority: 9,
    tieBreakerStrength: 7,
    filter: (teams, v) => {
      if (v === 'any') return teams
      return safe(teams, teams.filter(t => t.successTier === v))
    },
  },

  {
    id: 'success_recent',
    pathway: 'success',
    label: 'Does recent premiership success matter?',
    description: 'Some fans need a team with a flag in living memory.',
    shortLabel: 'Recent premiership',
    options: [
      { value: 'yes', label: '✅  Yes — I want recent winners' },
      { value: 'no',  label: '📖  No — history and legacy are enough' },
      { value: 'any', label: '🤷  Doesn\'t matter' },
    ],
    priority: 7,
    tieBreakerStrength: 6,
    filter: (teams, v) => {
      if (v !== 'yes') return teams
      return safe(teams, teams.filter(t => t.recentPremiership))
    },
  },

  // ─────────────────────────────────────────────
  // CULTURE
  // ─────────────────────────────────────────────
  {
    id: 'culture_size',
    pathway: 'culture',
    label: 'What size fanbase do you want to join?',
    description: "The scale and feel of a club's following shapes the whole experience.",
    shortLabel: 'Fanbase size',
    options: [
      { value: 'massive',    label: '🌍  Massive — millions worldwide', subtitle: 'Carlton, Essendon, Collingwood, Richmond' },
      { value: 'large',      label: '👥  Large — big passionate following', subtitle: 'Adelaide, Brisbane, Geelong, Sydney…' },
      { value: 'community',  label: '🏘️  Community-sized — tight and proud', subtitle: 'Bulldogs, North Melbourne, GWS, Gold Coast…' },
      { value: 'any',        label: '🤷  I don\'t mind' },
    ],
    priority: 8,
    tieBreakerStrength: 6,
    filter: (teams, v) => {
      if (v === 'any') return teams
      const check: Record<string, (t: Team) => boolean> = {
        massive:   (t) => t.fanbaseSize === 'giant',
        large:     (t) => t.fanbaseSize === 'giant' || t.fanbaseSize === 'large',
        community: (t) => t.fanbaseSize === 'medium' || t.fanbaseSize === 'small',
      }
      return safe(teams, teams.filter(check[v] ?? (() => true)))
    },
  },

  {
    id: 'culture_vibe',
    pathway: 'culture',
    label: 'What culture vibe are you after?',
    description: 'Different clubs carry very different energy.',
    shortLabel: 'Culture vibe',
    options: [
      { value: 'tribal',        label: '🔥  Loud, tribal and intense' },
      { value: 'long-suffering', label: '😤  Loyal and long-suffering' },
      { value: 'community',     label: '❤️  Family-friendly and community-driven' },
      { value: 'successful',    label: '🏅  Winners — regular celebration' },
      { value: 'underdog',      label: '🐶  Underdog — I love the battlers' },
    ],
    priority: 7,
    tieBreakerStrength: 7,
    filter: (teams, v) => filterByMap(teams, CULTURE_VIBE_MAP, v),
  },

  // ─────────────────────────────────────────────
  // TRADITION
  // ─────────────────────────────────────────────
  {
    id: 'brand_style',
    pathway: 'tradition',
    label: 'Traditional heritage or modern identity?',
    description: 'Some clubs date back to the 1800s. Others are fresh, modern brands.',
    shortLabel: 'Brand style',
    options: [
      { value: 'traditional', label: '🏛️  Heritage and tradition', subtitle: 'Carlton, Essendon, Hawthorn, Geelong…' },
      { value: 'modern',      label: '⚡  Modern and forward-thinking', subtitle: 'Brisbane, Fremantle, Gold Coast, GWS…' },
      { value: 'none',        label: '🤷  No preference' },
    ],
    priority: 8,
    tieBreakerStrength: 6,
    filter: (teams, v) => {
      if (v === 'none') return teams
      return safe(teams, teams.filter(t => t.brandStyle === v))
    },
  },

  // ─────────────────────────────────────────────
  // STADIUM / GAME-DAY VIBE
  // ─────────────────────────────────────────────
  {
    id: 'stadium_vibe',
    pathway: 'stadium',
    label: "What's your ideal game-day atmosphere?",
    description: 'AFL grounds range from the enormous MCG to intimate suburban ovals.',
    shortLabel: 'Stadium vibe',
    options: [
      { value: 'mcg',      label: '🏟️  MCG big-game energy', subtitle: '90,000 fans, the greatest ground on earth' },
      { value: 'suburban', label: '🏘️  Suburban heartland', subtitle: 'Local, gritty, unpretentious' },
      { value: 'fortress', label: '✈️  Interstate fortress', subtitle: 'Opponents dread visiting' },
      { value: 'coastal',  label: '🌊  Coastal and relaxed', subtitle: "Gold Coast's easy-going vibe" },
      { value: 'none',     label: '🤷  No preference' },
    ],
    priority: 7,
    tieBreakerStrength: 6,
    filter: (teams, v) => {
      if (v === 'none') return teams
      if (v === 'mcg')      return safe(teams, teams.filter(t => t.homeGroundType === 'mcg'))
      if (v === 'suburban') return safe(teams, teams.filter(t => t.homeGroundType === 'suburban'))
      return safe(teams, teams.filter(t => t.stadiumVibe.includes(v)))
    },
  },

  // ─────────────────────────────────────────────
  // SOCIAL
  // ─────────────────────────────────────────────
  {
    id: 'social_influence',
    pathway: 'social',
    label: 'Do close family or friends already support an AFL team?',
    description: 'Social connection can be a powerful tie-breaker.',
    shortLabel: 'Social',
    options: [
      { value: 'yes_align',    label: "✅  Yes — and I'd love to support the same team" },
      { value: 'yes_different', label: "🔄  Yes — but I want to make my own choice" },
      { value: 'no',           label: "🌱  No — I'm starting completely fresh" },
    ],
    priority: 5,
    tieBreakerStrength: 8,
    filter: (teams) => teams,  // gate only; filtering happens in social_team_pick
  },

  {
    id: 'social_team_pick',
    pathway: 'social',
    label: "Which team do they support?",
    description: "If that club is still in the mix, they'll get the deciding edge.",
    shortLabel: 'Social team',
    options: [],
    isDynamic: true,
    appliesWhen: (answers) =>
      answers.some(a => a.questionId === 'social_influence' && a.answer === 'yes_align'),
    getDynamicOptions: (teams: Team[]) =>
      teams.map(t => ({ value: t.id, label: t.name, subtitle: t.summary })),
    priority: 4,
    tieBreakerStrength: 9,
    filter: (teams, v) => safe(teams, teams.filter(t => t.id === v)),
  },

  // ─────────────────────────────────────────────
  // FINAL HEAD-TO-HEAD
  // ─────────────────────────────────────────────
  {
    id: 'final_choice',
    pathway: 'final',
    label: 'It comes down to these two. Which one feels right?',
    description: 'Go with your gut — this is your team.',
    shortLabel: 'Final choice',
    options: [],
    isDynamic: true,
    isHeadToHead: true,
    getDynamicOptions: (teams: Team[]) =>
      teams.slice(0, 2).map(t => ({
        value: t.id,
        label: t.name,
        subtitle: t.summary,
      })),
    priority: 1,
    tieBreakerStrength: 10,
    filter: (teams, v) => safe(teams, teams.filter(t => t.id === v)),
  },
] as (Question & { isHeadToHead?: boolean })[]
