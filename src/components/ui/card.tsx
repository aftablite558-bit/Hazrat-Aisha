import * as React from "react"
import { cn } from "../../lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass"
  clickable?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", clickable, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden w-full",
          variant === "default" 
            ? "bg-[var(--bg-surface-raised)] border border-[var(--border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-e1)] p-[var(--space-md)] sm:p-[var(--space-lg)]" 
            : "bg-[var(--glass-bg)] backdrop-blur-[var(--blur-glass)] backdrop-saturate-150 border border-[var(--glass-border)] rounded-[var(--radius-xl)]",
          clickable && "cursor-pointer transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] hover:-translate-y-[2px] hover:shadow-[var(--shadow-e3)] hover:border-[var(--border-strong)] active:scale-[0.99] focus-visible:outline-none focus-visible:shadow-[var(--glow-focus)]",
          !clickable && variant === "default" && "transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)]",
          className
        )}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {variant === "glass" && (
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(52,245,197,0.5)] to-transparent" />
        )}
        {props.children}
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-[var(--space-md)]", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-[var(--text-h4)] font-semibold leading-none tracking-tight text-[var(--text-primary)]",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-[var(--text-body-sm)] text-[var(--text-secondary)]", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-[var(--space-md)]", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
