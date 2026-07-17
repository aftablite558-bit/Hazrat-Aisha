import * as React from "react";
import { cn } from "../../lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Spinner({ className, size = 18, ...props }: SpinnerProps) {
  const sizePx = typeof size === "number" ? size : size === "sm" ? 18 : size === "md" ? 24 : size === "lg" ? 32 : 40;
  
  return (
    <div 
      className={cn("noor-spinner relative inline-flex items-center justify-center text-current", className)} 
      style={{ width: sizePx, height: sizePx }}
      {...props}
    >
      <svg
        className="star absolute text-current"
        width={sizePx * 0.8}
        height={sizePx * 0.8}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <path d="m4.9 4.9 14.2 14.2" />
        <path d="m4.9 19.1 14.2-14.2" />
      </svg>
      <svg
        className="orbit absolute inset-0 text-current"
        width={sizePx}
        height={sizePx}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="2" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}
