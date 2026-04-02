interface Props {
  progress: number  // 0–1
}

export function ProgressBar({ progress }: Props) {
  return (
    <div className="h-[3px] bg-border rounded-full overflow-hidden">
      <div
        className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
      />
    </div>
  )
}
