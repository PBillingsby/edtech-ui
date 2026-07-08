"use client"

import { RotateCcw } from "lucide-react"
import * as React from "react"

import { LessonButton } from "@/components/lesson/lesson-button"
import { LessonCard } from "@/components/lesson/lesson-card"
import { useFeedback } from "@/components/lesson/use-feedback"
import { feedbackVariants } from "@/components/lesson/variants"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────
export type TileSign = "+" | "-"

export interface TileCounterProps {
  question: string
  /** The counter tiles shown to the learner, e.g. ["+", "+", "-"]. Read-only. */
  tiles: readonly TileSign[]
  /** Numeric answer chips the learner chooses from. */
  options: number[]
  /** The correct total value. */
  answer: number
  explanation?: string
  onContinue?: () => void
}

// ── Component ─────────────────────────────────────────────────
export function TileCounter({
  question,
  tiles,
  options,
  answer,
  explanation,
  onContinue,
}: TileCounterProps): React.JSX.Element {
  const [placed, setPlaced] = React.useState<number | null>(null)

  const {
    checked,
    isCorrect,
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

  function onSelect(val: number): void {
    if (checked) return
    setPlaced(val)
  }

  function clearSlot(): void {
    if (checked) return
    setPlaced(null)
  }

  function onCheck(): void {
    if (placed === null) return
    handleCheck(placed === answer)
  }

  function onReset(): void {
    setPlaced(null)
    handleReset()
  }

  const slotClasses: string = !checked
    ? placed !== null
      ? "border-solid border-lesson-ink"
      : "border-dashed border-lesson-ink/25"
    : isCorrect
      ? "border-solid border-lesson-success bg-lesson-success/10"
      : "border-solid border-lesson-error bg-lesson-error/10"

  return (
    <LessonCard
      className={cn("max-w-xl", cardClassName)}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex flex-col gap-6">
        <p className="text-base font-medium text-lesson-ink">{question}</p>

        {/* Tile stimulus (read-only) */}
        <div className="mx-auto flex max-w-44 flex-wrap justify-center gap-2.5 rounded-xl bg-lesson-ink/5 p-3.5">
          {tiles.map(
            (t: TileSign, i: number): React.JSX.Element => (
              <div
                key={i}
                aria-hidden="true"
                className={cn(
                  "grid size-11 place-items-center rounded-lg text-2xl font-bold text-white",
                  t === "+" ? "bg-lesson-ink" : "bg-lesson-error"
                )}
              >
                {t}
              </div>
            )
          )}
        </div>

        {/* Single answer slot */}
        <button
          type="button"
          onClick={clearSlot}
          disabled={checked || placed === null}
          aria-label={
            placed !== null
              ? `Answer ${placed}, tap to clear`
              : "Empty answer slot"
          }
          className={cn(
            "grid h-20 place-items-center rounded-xl border-2 transition-colors",
            slotClasses
          )}
        >
          {placed !== null ? (
            <span className="text-3xl font-bold text-lesson-ink">{placed}</span>
          ) : (
            <span className="size-6 rounded-md border-2 border-dashed border-lesson-ink/30" />
          )}
        </button>

        {/* Answer chip tray */}
        <div className="flex justify-center gap-3 rounded-xl bg-lesson-ink/5 p-3.5">
          {options.map((opt: number): React.JSX.Element => {
            const isUsed: boolean = placed === opt
            return (
              <button
                key={opt}
                type="button"
                onClick={(): void => onSelect(opt)}
                disabled={checked || isUsed}
                className={cn(
                  "size-12 rounded-lg border-2 border-lesson-ink/30 bg-lesson-card text-xl font-bold text-lesson-ink transition-opacity focus-visible:ring-2 focus-visible:ring-lesson-accent focus-visible:outline-none",
                  isUsed && "opacity-25"
                )}
              >
                {opt}
              </button>
            )
          })}
        </div>

        {/* ── Feedback — same structure as every other lesson component ── */}
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
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-between transition-opacity duration-200",
                checked ? "pointer-events-none opacity-0" : "opacity-100"
              )}
            >
              <LessonButton onClick={onCheck} disabled={placed === null}>
                Check
              </LessonButton>
              {placed !== null && (
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