import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"
import { Spinner } from "./spinner"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "primary" | "secondary" | "gold" | "ghost" | "glass" | "danger" | "link"
  size?: "sm" | "md" | "lg" | "xl" | "icon"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, isLoading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const variants = {
      primary: "bg-[var(--color-primary)] text-[#04120D] hover:bg-[var(--color-primary-hover)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-glow)] focus-visible:shadow-[var(--glow-focus)]",
      secondary: "bg-transparent border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-overlay)] focus-visible:shadow-[var(--glow-focus)]",
      gold: "bg-[linear-gradient(135deg,#96732A,#D4AF37_50%,#F3DA8F)] text-[#2A1F05] hover:brightness-110 hover:-translate-y-[1px] hover:shadow-[var(--shadow-gold)] focus-visible:shadow-[var(--glow-focus)]",
      ghost: "bg-transparent border-transparent text-[var(--text-primary)] hover:bg-[var(--bg-surface-overlay)] focus-visible:shadow-[var(--glow-focus)]",
      glass: "glass text-[var(--text-primary)] hover:bg-[var(--bg-surface-overlay)] focus-visible:shadow-[var(--glow-focus)]",
      danger: "bg-transparent border border-[var(--color-danger-500)] text-[var(--color-danger-500)] hover:bg-[var(--color-danger-500)] hover:text-white focus-visible:shadow-[var(--glow-focus)]",
      link: "bg-transparent border-transparent text-[var(--color-primary)] hover:underline underline-offset-4 focus-visible:shadow-[var(--glow-focus)] p-0 h-auto",
    }
    
    const sizes = {
      sm: "h-[var(--size-btn-sm)] px-[14px] text-[var(--text-body-sm)] font-semibold",
      md: "h-[var(--size-btn-md)] px-[18px] text-[var(--text-body)] font-semibold",
      lg: "h-[var(--size-btn-lg)] px-[24px] text-[var(--text-body)] font-semibold",
      xl: "h-[var(--size-btn-xl)] px-[32px] text-[var(--text-body-lg)] font-semibold",
      icon: "h-[var(--size-btn-md)] w-[var(--size-btn-md)] p-0",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-buttons,9999px)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)] active:scale-[0.98] focus-visible:outline-none disabled:pointer-events-none disabled:bg-[var(--color-obsidian-700)] disabled:text-[var(--text-disabled)] disabled:border-transparent disabled:shadow-none disabled:transform-none",
          variants[variant],
          variant !== 'link' && sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <Spinner size={size === 'sm' ? 16 : size === 'xl' ? 24 : 18} className="text-current" />
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }
