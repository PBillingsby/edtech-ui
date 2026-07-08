import { type VariantProps } from "class-variance-authority"
import * as React from "react"

import { lessonButtonVariants } from "@/components/lesson/variants"
import { cn } from "@/lib/utils"

export interface LessonButtonProps
  extends React.ComponentProps<"button">,
  VariantProps<typeof lessonButtonVariants> { }

export function LessonButton({
  className,
  intent,
  ...props
}: LessonButtonProps): React.JSX.Element {
  return (
    <button
      className={cn(lessonButtonVariants({ intent, className }))}
      {...props}
    />
  )
}
