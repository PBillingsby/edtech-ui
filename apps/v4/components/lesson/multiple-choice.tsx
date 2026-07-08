"use client"

import { Check, RotateCcw, X } from "lucide-react"
import * as React from "react"

import { LessonButton } from "@/components/lesson/lesson-button"
import { LessonCard } from "@/components/lesson/lesson-card"
import { useFeedback } from "@/components/lesson/use-feedback"
import {
  feedbackVariants,
  lessonMarkerVariants,
  lessonOptionVariants,
} from "@/components/lesson/variants"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────
export type OptionState = "idle" | "selected" | "correct" | "incorrect"

export interface LessonOption {
  id: string
  label: string
  correct: boolean
}

export interface LessonImage {
  src: string
  alt: string
}

export interface MultipleChoiceProps {
  prompt?: string
  question: string
  images?: LessonImage[]
  options: LessonOption[]
  explanation?: string
  onContinue?: () => void
}

// ── Component ─────────────────────────────────────────────────
export function MultipleChoice({
  prompt,
  question,
  images,
  options,
  explanation,
  onContinue,
}: MultipleChoiceProps): React.JSX.Element {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  const {
    checked,
    feedbackState,
    feedbackText,
    cardClassName,
    continueIntent,
    continueLabel,
    handleCheck,
    handleReset,
    toggleWhy,
    onAnimationEnd,
    handleContinue,
  } = useFeedback({ explanation, onContinue })

  function optionState(option: LessonOption): OptionState {
    if (checked && option.correct) return "correct"
    if (checked && option.id === selectedId) return "incorrect"
    if (!checked && option.id === selectedId) return "selected"
    return "idle"
  }

  function onCheck(): void {
    if (!selectedId) return
    const selected: LessonOption | undefined = options.find(
      (o: LessonOption) => o.id === selectedId
    )
    const correct: boolean = selected?.correct ?? false
    handleCheck(correct)
  }

  function onReset(): void {
    setSelectedId(null)
    handleReset()
  }

  return (
    <LessonCard
      className={cn("max-w-xl", cardClassName)}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex flex-col gap-6">
        {prompt && <p className="text-sm text-lesson-ink/70">{prompt}</p>}

        <p className="text-lg font-medium text-lesson-ink">{question}</p>

        {images && images.length > 0 && (
          <div
            className={cn(
              "grid gap-4",
              images.length > 1 ? "grid-cols-2" : "grid-cols-1"
            )}
          >
            {images.map((image: LessonImage, i: number) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-lesson border border-dashed border-lesson-ink/20 bg-lesson-paper p-4"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="max-h-32 object-contain"
                />
              </div>
            ))}
          </div>
        )}

        <div
          role="radiogroup"
          aria-label="Answer options"
          className="grid grid-cols-2 gap-3"
        >
          {options.map((option: LessonOption, i: number) => {
            const state: OptionState = optionState(option)
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={option.id === selectedId}
                disabled={checked}
                onClick={() => setSelectedId(option.id)}
                className={lessonOptionVariants({ state })}
              >
                <span className={lessonMarkerVariants({ state })}>
                  {state === "correct" ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : state === "incorrect" ? (
                    <X className="h-3.5 w-3.5" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>

        {/* ── Feedback — shared structure across all lesson components ── */}
        <div className="flex flex-col gap-3">
          <div
            className={cn(
              "border-t transition-colors duration-300",
              checked ? "border-lesson-ink/10" : "border-transparent"
            )}
          />

          <p className={feedbackVariants({ state: feedbackState })}>
            {feedbackText}
          </p>

          <div className="relative h-10">
            {/* Pre-check */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-between transition-opacity duration-200",
                checked ? "pointer-events-none opacity-0" : "opacity-100"
              )}
            >
              <LessonButton onClick={onCheck} disabled={!selectedId}>
                Check
              </LessonButton>
              {selectedId && (
                <LessonButton
                  intent="link"
                  onClick={onReset}
                  className="gap-1.5"
                >
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
              {explanation && (
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
      </div>
    </LessonCard>
  )
}
