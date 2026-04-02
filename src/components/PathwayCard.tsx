interface Props {
  id: string
  emoji: string
  label: string
  desc: string
  style?: React.CSSProperties
  onClick: () => void
}

export function PathwayCard({ emoji, label, desc, style, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={style}
      className="
        group text-left p-5 bg-card border border-border rounded-xl
        transition-all duration-200 cursor-pointer
        hover:bg-card2 hover:border-accent hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(242,201,76,0.08)]
        active:translate-y-0
        flex flex-col gap-2
        animate-fade-up
      "
    >
      <div className="text-3xl leading-none">{emoji}</div>
      <div className="font-display font-bold text-[17px] uppercase tracking-[0.5px] text-txt group-hover:text-accent transition-colors">
        {label}
      </div>
      <div className="text-[12px] text-dim leading-snug">{desc}</div>
    </button>
  )
}
