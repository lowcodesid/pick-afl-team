export type State = 'VIC' | 'SA' | 'WA' | 'QLD' | 'NSW'
export type CityType = 'metro' | 'regional'
export type IdentityType = 'animal' | 'symbolic'
export type MascotClass =
  | 'crow'
  | 'magpie'
  | 'hawk'
  | 'swan'
  | 'eagle'
  | 'cat'
  | 'tiger'
  | 'lion'
  | 'kangaroo'
  | 'dog'
  | 'symbolic'
export type BrandStyle = 'traditional' | 'modern'
export type FanbaseSize = 'giant' | 'large' | 'medium' | 'small'
export type SuccessTier = 'high' | 'medium' | 'low'
export type HomeGroundType = 'mcg' | 'suburban' | 'regional_stronghold' | 'interstate_fortress'

export interface Team {
  id: string
  name: string
  nickname: string
  state: State
  region: string
  cityType: CityType
  colours: string[]          // ordered: primary first
  coloursPrimary: string[]
  coloursSecondary: string[]
  identityType: IdentityType
  mascotClass: MascotClass
  mascotLabel: string
  brandStyle: BrandStyle
  fanbaseSize: FanbaseSize
  successTier: SuccessTier
  recentPremiership: boolean
  recentSuccessLabel: string
  homeGroundType: HomeGroundType
  stadiumVibe: string[]
  cultureTags: string[]
  rivalryIntensity: 'high' | 'medium' | 'low'
  painTolerance: 'low' | 'medium' | 'high'
  familyFriendlyIdentity: boolean
  summary: string
  // UI
  uiColors: [string, string]   // gradient pair
  initials: string
}
