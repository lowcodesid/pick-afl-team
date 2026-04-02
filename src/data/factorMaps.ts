/**
 * factorMaps.ts
 *
 * Centralised lookup tables used by the filtering engine.
 * Each map key is an option value; the value is an array of team IDs that match.
 */

/** Primary colour → matching team IDs */
export const COLOUR_PRIMARY_MAP: Record<string, string[]> = {
  navy:    ['adelaide', 'brisbane', 'carlton', 'geelong', 'melbourne', 'northmelbourne', 'westcoast'],
  blue:    ['carlton', 'geelong', 'northmelbourne', 'westcoast', 'westernbulldogs'],
  red:     ['adelaide', 'essendon', 'goldcoast', 'melbourne', 'northmelbourne', 'stkilda', 'sydney', 'westernbulldogs'],
  black:   ['collingwood', 'essendon', 'portadelaide', 'richmond', 'stkilda'],
  gold:    ['adelaide', 'brisbane', 'goldcoast', 'hawthorn', 'richmond', 'westcoast'],
  yellow:  ['hawthorn', 'richmond', 'westcoast'],
  white:   ['carlton', 'collingwood', 'fremantle', 'geelong', 'northmelbourne', 'portadelaide', 'stkilda', 'sydney', 'westernbulldogs'],
  purple:  ['fremantle'],
  brown:   ['hawthorn'],
  teal:    ['fremantle', 'portadelaide'],
  orange:  ['gws'],
  maroon:  ['brisbane'],
  grey:    ['gws'],
}

/** Secondary colour → matching team IDs */
export const COLOUR_SECONDARY_MAP: Record<string, string[]> = {
  white:  ['carlton', 'collingwood', 'fremantle', 'geelong', 'northmelbourne', 'portadelaide', 'stkilda', 'sydney', 'westernbulldogs'],
  gold:   ['adelaide', 'brisbane', 'hawthorn', 'westcoast'],
  yellow: ['hawthorn', 'richmond', 'westcoast'],
  black:  ['collingwood', 'essendon', 'portadelaide', 'richmond', 'stkilda'],
  red:    ['adelaide', 'essendon', 'goldcoast', 'melbourne', 'stkilda', 'westernbulldogs'],
  navy:   ['brisbane', 'geelong', 'melbourne'],
  blue:   ['northmelbourne', 'westernbulldogs'],
}

/** State → matching team IDs */
export const STATE_MAP: Record<string, string[]> = {
  VIC: ['carlton', 'collingwood', 'essendon', 'geelong', 'hawthorn', 'melbourne', 'northmelbourne', 'richmond', 'stkilda', 'westernbulldogs'],
  SA:  ['adelaide', 'portadelaide'],
  WA:  ['fremantle', 'westcoast'],
  QLD: ['brisbane', 'goldcoast'],
  NSW: ['gws', 'sydney'],
}

/** Animal mascot class → matching team IDs */
export const MASCOT_CLASS_MAP: Record<string, string[]> = {
  crow:     ['adelaide'],
  magpie:   ['collingwood'],
  hawk:     ['hawthorn'],
  swan:     ['sydney'],
  eagle:    ['westcoast'],
  cat:      ['geelong'],
  tiger:    ['richmond'],
  lion:     ['brisbane'],
  kangaroo: ['northmelbourne'],
  dog:      ['westernbulldogs'],
}

/** Mascot emoji decoration */
export const MASCOT_EMOJI: Record<string, string> = {
  crow: '🐦', magpie: '🐦‍⬛', hawk: '🦅', swan: '🦢', eagle: '🦅',
  cat: '🐱', tiger: '🐯', lion: '🦁', kangaroo: '🦘', dog: '🐶',
  symbolic: '⚡',
}

/** Friendly mascot labels */
export const MASCOT_LABELS: Record<string, string> = {
  crow: 'Crow', magpie: 'Magpie', hawk: 'Hawk', swan: 'Swan', eagle: 'Eagle',
  cat: 'Cat', tiger: 'Tiger', lion: 'Lion', kangaroo: 'Kangaroo', dog: 'Bulldog',
}

/** Culture vibe tag → matching team IDs */
export const CULTURE_VIBE_MAP: Record<string, string[]> = {
  tribal:        ['carlton', 'collingwood', 'essendon', 'portadelaide', 'richmond', 'westcoast'],
  'long-suffering': ['carlton', 'essendon', 'melbourne', 'northmelbourne', 'stkilda'],
  community:     ['adelaide', 'fremantle', 'geelong', 'goldcoast', 'gws', 'northmelbourne', 'stkilda', 'sydney', 'westernbulldogs'],
  successful:    ['brisbane', 'collingwood', 'geelong', 'hawthorn', 'melbourne', 'richmond', 'sydney', 'westcoast'],
  rising:        ['brisbane', 'fremantle', 'goldcoast', 'gws'],
  underdog:      ['goldcoast', 'gws', 'northmelbourne', 'stkilda', 'westernbulldogs'],
  passionate:    ['adelaide', 'collingwood', 'essendon', 'portadelaide', 'richmond', 'sydney'],
}
