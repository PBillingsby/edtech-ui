"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { LessonButton } from "@/components/lesson/lesson-button"
import { type UseFeedbackReturn } from "@/components/lesson/use-feedback"
import { feedbackVariants } from "@/components/lesson/variants"

// ── Types ─────────────────────────────────────────────────────
export interface LessonFooterProps {
  /**
   * The full return value from useFeedback.
   * The footer reads all presentation state (message, intent, labels) from here,
   * so the two are a matched pair — like Form + react-hook-form.
   */
  feedback: UseFeedbackReturn
  /** Submit the current answer. */
  onCheck: () => void
  /** Clear the in-progress answer (pre-check "Start over"). */
  onReset: () => void
  /** Whether Check is enabled. Defaults to true. */
  canCheck?: boolean
  /** Whether the pre-check "Start over" control is shown. Defaults to false. */
  canReset?: boolean
  /** Whether an explanation exists, controlling the post-check "Why?" button. */
  hasExplanation?: boolean
  /** Optional per-component override of the feedback message (e.g. a graph hint). */
  feedbackText?: string
}

// ── Component ─────────────────────────────────────────────────
export function LessonFooter({
  feedback,
  onCheck,
  onReset,
  canCheck = true,
  canReset = false,
  hasExplanation = false,
  feedbackText,
}: LessonFooterProps): React.JSX.Element {
  const {
    checked,
    feedbackState,
    feedbackText: hookFeedbackText,
    continueIntent,
    continueLabel,
    toggleWhy,
    handleContinue,
  } = feedback

  const message: string = feedbackText ?? hookFeedbackText

  return (
    <div data-slot="lesson-footer" className="flex flex-col gap-3">
      {/* Divider — fades in once the answer is checked */}
      <div
        data-slot="lesson-footer-divider"
        className={cn(
          "border-t transition-colors duration-300",
          checked ? "border-lesson-ink/10" : "border-transparent"
        )}
      />

      {/* Feedback message */}
      <p
        data-slot="lesson-footer-message"
        className={feedbackVariants({ state: feedbackState })}
      >
        {message}
      </p>

      {/* Controls — pre-check and post-check layers cross-fade in place */}
      <div data-slot="lesson-footer-controls" className="relative h-10">
        {/* Pre-check */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-between transition-opacity duration-200",
            checked ? "pointer-events-none opacity-0" : "opacity-100"
          )}
        >
          <LessonButton onClick={onCheck} disabled={!canCheck}>
            Check
          </LessonButton>
          {canReset && (
            <LessonButton intent="link" onClick={onReset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Start over
            </LessonButton>
          )}
        </div>

        {/* Post-check */}
        <div
          className={cn(
            "absolute inset-0 flex items-center gap-2 transition-opacity duration-200",
            !checked ? "pointer-events-none opacity-0" : "opacity-100"
          )}
        >
          {hasExplanation && (
            <LessonButton intent="outline" onClick={toggleWhy}>
              Why?
            </LessonButton>
          )}
          <LessonButton intent={continueIntent} onClick={handleContinue}>
            {continueLabel}
          </LessonButton>
        </div>
      </div>
    </div>
  )
}
