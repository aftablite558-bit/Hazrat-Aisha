import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "primary" | "secondary" | "gold" | "ghost" | "glass" | "danger" | "link" | "outline"
  size?: "sm" | "md" | "lg" | "xl" | "icon"
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, isLoading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const variants = {
      primary: "relative bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 backdrop-blur-xl text-zinc-900 dark:text-white shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-black/10 dark:hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:opacity-0 hover:before:opacity-100 overflow-hidden",
      secondary: "relative bg-black/5 dark:bg-zinc-900/40 border border-transparent backdrop-blur-lg text-zinc-800 dark:text-zinc-200 hover:bg-black/10 dark:hover:bg-zinc-800/60 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 overflow-hidden",
      gold: "relative bg-amber-500/80 border border-amber-400/50 backdrop-blur-xl text-white shadow-[0_4px_16px_rgba(245,158,11,0.2)] hover:bg-amber-500 hover:shadow-[0_8px_32px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 overflow-hidden",
      ghost: "hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-300 active:scale-[0.98] transition-all duration-300",
      glass: "bg-white/10 backdrop-blur-xl border border-white/20 text-zinc-900 dark:text-white hover:bg-white/20 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300",
      danger: "relative bg-red-500/80 border border-red-400/50 backdrop-blur-xl text-white shadow-[0_4px_16px_rgba(239,68,68,0.2)] hover:bg-red-500 hover:shadow-[0_8px_32px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 overflow-hidden",
      outline: "border border-zinc-200/50 dark:border-zinc-700/50 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-zinc-900 dark:text-white backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300",
      link: "text-zinc-900 dark:text-zinc-50 underline-offset-4 hover:underline transition-all duration-300",
    }
    
    const sizes = {
      sm: "h-8 px-4 text-xs rounded-full",
      md: "h-10 px-6 py-2 rounded-full",
      lg: "h-12 px-8 text-base rounded-full",
      xl: "h-14 px-10 text-lg rounded-full",
      icon: "h-10 w-10 rounded-full",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 font-['Poppins',_sans-serif]",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button }
