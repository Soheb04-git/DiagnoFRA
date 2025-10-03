"use client"
import { cn } from "@/lib/utils"

export function BackgroundGradient({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      <div
        aria-hidden="true"
        className={cn(
          // radial and conic mix, animated rotation
          "pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[120vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl",
          "animate-[spin_30s_linear_infinite]",
        )}
        style={{
          background: "conic-gradient(from 180deg at 50% 50%, hsl(210 80% 85%), hsl(200 90% 80%), hsl(210 80% 85%))",
        }}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[140vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl",
          "dark:opacity-70 dark:animate-[spin_40s_linear_infinite_reverse]",
        )}
        style={{
          background: "conic-gradient(from 0deg at 50% 50%, hsl(245 60% 25%), hsl(220 15% 20%), hsl(245 60% 25%))",
        }}
      />
    </div>
  )
}
