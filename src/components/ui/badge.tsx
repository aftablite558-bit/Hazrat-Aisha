import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "gold"
  className?: string
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[var(--bg-surface-overlay)] border-[var(--border-strong)] text-[var(--text-primary)]",
    success: "bg-[#10B9811F] border-[#10B9814D] text-[#10B981]",
    warning: "bg-[#F59E0B1F] border-[#F59E0B4D] text-[#F59E0B]",
    danger: "bg-[#EF44441F] border-[#EF44444D] text-[#EF4444]",
    info: "bg-[#38BDF81F] border-[#38BDF84D] text-[#38BDF8]",
    gold: "bg-[#D4AF371F] border-[#D4AF374D] text-[#D4AF37]",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[var(--radius-xs)] border px-2 py-0.5 text-[var(--text-caption)] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
