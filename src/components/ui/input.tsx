import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: "sm" | "md" | "lg"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize = "md", ...props }, ref) => {
    
    const sizes = {
      sm: "h-[36px]",
      md: "h-[var(--size-input-md)]",
      lg: "h-[var(--size-input-lg)]"
    }

    return (
      <input
        type={type}
        className={cn(
          "flex w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[var(--radius-sm)] px-[var(--space-md)] py-2 text-[var(--text-body)] font-normal text-[var(--text-primary)] transition-all duration-[var(--duration-fast)]",
          "hover:border-[var(--border-strong)]",
          "focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_rgba(52,245,197,0.18)] focus:outline-none",
          "aria-[invalid=true]:border-[var(--color-danger-500)] aria-[invalid=true]:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
          "disabled:cursor-not-allowed disabled:bg-[var(--bg-surface-overlay)] disabled:text-[var(--text-disabled)]",
          "placeholder:text-[var(--text-tertiary)]",
          sizes[inputSize],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
