import * as React from "react"
import { cn } from "../../lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-sm)] bg-[var(--bg-surface-overlay)]",
        className
      )}
      aria-hidden="true"
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1400ms_infinite] bg-[linear-gradient(100deg,transparent_30%,rgba(52,245,197,0.08)_50%,transparent_70%)]" />
    </div>
  )
}

export { Skeleton }
