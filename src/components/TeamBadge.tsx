import type { Team } from '../types/team'

interface Props {
  team: Team
  size?: number
  className?: string
}

export function TeamBadge({ team, size = 56, className = '' }: Props) {
  const [c1, c2] = team.uiColors
  const fontSize = size < 50 ? 13 : size < 70 ? 16 : size < 90 ? 20 : 26
  const radius = Math.round(size * 0.14)

  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 select-none font-display font-black ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        fontSize,
        color: '#fff',
        letterSpacing: '-0.5px',
      }}
      aria-label={team.name}
    >
      {team.initials}
    </div>
  )
}
