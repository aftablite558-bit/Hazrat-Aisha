import React from 'react';
import { cn } from "../../lib/utils";

interface AppSkeletonProps {
  type?: 'dashboard' | 'table' | 'card' | 'form' | 'profile';
  className?: string;
}

export function AppSkeleton({ type = 'card', className = '' }: AppSkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800", className)} />
  );
}
