import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function Layout({ children }: Props) {
  return (
    <div className="min-h-full bg-bg text-txt font-body">
      {children}
    </div>
  )
}
