import * as React from "react"

import { cn } from "@/lib/utils"

export function LessonCard({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-lesson-ink/15 bg-lesson-card p-6 text-lesson-ink shadow-sm",
        className
      )}
      {...props}
    />
  )
}
