"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { LessonButton } from "@/components/lesson/lesson-button"
import { LessonCard } from "@/components/lesson/lesson-card"
import { useFeedback } from "@/components/lesson/use-feedback"
import { feedbackVariants } from "@/components/lesson/variants"

// ── Color registry ────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  blue: "#5B7FFF",
  red: "#E8635A",
  green: "#4CAF82",
  purple: "#9B6FD6",
  yellow: "#F5A623",
  orange: "#F08040",
  pink: "#E87FA0",
  teal: "#3DC9B0",
}

interface ResolvedColor {
  hex: string
  label: string
}

function resolveColor(color: string): ResolvedColor {
  const lower: string = color.toLowerCase()
  return COLOR_MAP[lower]
    ? { hex: COLOR_MAP[lower], label: lower }
    : { hex: color, label: "color" }
}

function mixSwatch(
  hex: string,
  colorCount: number,
  whiteCount: number
): string {
  const total: number = colorCount + whiteCount
  if (total === 0) return hex
  const pct: number = Math.round((colorCount / total) * 100)
  return `color-mix(in srgb, ${hex} ${pct}%, white)`
}

// ── Types ─────────────────────────────────────────────────────
export type RatioBlanks = "left" | "right"

export interface RatioPickerProps {
  question: string
  /**
   * Color name ("blue", "red", "green", "purple", etc.) or any CSS hex string.
   * Drives dot color, mix swatch, and column label.
   */
  color: string
  /**
   * The complete correct ratio as [left, right].
   * Left = primary color count, right = white count.
   */
  ratio: [number, number]
  /** Which side the learner fills in */
  blank: RatioBlanks
  /** Number chips the learner can choose from */
  options: number[]
  explanation?: string
  onContinue?: () => void
}

// ── Component ─────────────────────────────────────────────────
export function RatioPicker({
  question,
  color,
  ratio,
  blank,
  options,
  explanation,
  onContinue,
}: RatioPickerProps): React.JSX.Element {
  const [selected, setSelected] = React.useState<number | null>(null)

  const { hex, label }: ResolvedColor = resolveColor(color)

  const correctValue: number = blank === "left" ? ratio[0] : ratio[1]
  const colorCount: number | null = blank === "left" ? selected : ratio[0]
  const whiteCount: number | null = blank === "right" ? selected : ratio[1]
  const bothKnown: boolean = colorCount !== null && whiteCount !== null
  const currentMix: string | null = bothKnown
    ? mixSwatch(hex, colorCount as number, whiteCount as number)
    : null

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
    setSelected(val)
  }

  function onCheck(): void {
    if (selected === null) return
    handleCheck(selected === correctValue)
  }

  function onReset(): void {
    setSelected(null)
    handleReset()
  }

  return (
    <LessonCard
      className={cn("max-w-xl", cardClassName)}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex flex-col gap-6">
        <p className="text-base font-medium text-lesson-ink">{question}</p>

        {/* ── Visual table ───────────────────────────────── */}
        <div className="overflow-hidden rounded-xl border border-lesson-ink bg-lesson-paper">
          {/* Dots row */}
          <div className="grid grid-cols-3 divide-x">
            {/* Color column */}
            <div className="flex flex-col items-center gap-3 p-4">
              <span className="text-xs font-semibold tracking-wide text-lesson-ink uppercase opacity-45">
                {label}
              </span>
              <div className="flex min-h-6 flex-wrap justify-center gap-1.5">
                {colorCount !== null ? (
                  Array.from(
                    { length: colorCount },
                    (_: unknown, i: number): React.JSX.Element => (
                      <div
                        key={i}
                        className="h-6 w-6 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: hex }}
                      />
                    )
                  )
                ) : (
                  <span className="text-lg font-medium text-lesson-ink opacity-25">
                    —
                  </span>
                )}
              </div>
            </div>

            {/* White column */}
            <div className="flex flex-col items-center gap-3 p-4">
              <span className="text-xs font-semibold tracking-wide text-lesson-ink uppercase opacity-45">
                white
              </span>
              <div className="flex min-h-6 flex-wrap justify-center gap-1.5">
                {whiteCount !== null ? (
                  Array.from(
                    { length: whiteCount },
                    (_: unknown, i: number): React.JSX.Element => (
                      <div
                        key={i}
                        className="h-6 w-6 flex-shrink-0 rounded-sm border border-lesson-ink/20 bg-white"
                      />
                    )
                  )
                ) : (
                  <span className="text-lg font-medium text-lesson-ink opacity-25">
                    —
                  </span>
                )}
              </div>
            </div>

            {/* Mix column */}
            <div className="flex flex-col items-center gap-3 p-4">
              <span className="text-xs font-semibold tracking-wide text-lesson-ink uppercase opacity-45">
                mix
              </span>
              <div className="flex min-h-6 items-center justify-center">
                {currentMix ? (
                  <div
                    className="h-9 w-9 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: currentMix }}
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed border-lesson-ink/20">
                    <span className="text-sm font-semibold text-lesson-ink opacity-30">
                      ?
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Count row */}
          <div className="grid grid-cols-3 divide-x border-t border-lesson-ink/10 text-center">
            <span className="py-2 text-sm font-bold text-lesson-ink">
              {colorCount ?? "—"}
            </span>
            <span className="py-2 text-sm font-bold text-lesson-ink">
              {whiteCount ?? "—"}
            </span>
            <div className="flex items-center justify-center py-2">
              {currentMix ? (
                <div
                  className="h-5 w-5 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: currentMix }}
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-lesson-ink/10" />
              )}
            </div>
          </div>
        </div>

        {/* ── Chips ──────────────────────────────────────── */}
        <div className="flex justify-center gap-3">
          {options.map((val: number): React.JSX.Element => {
            const isSelected: boolean = selected === val
            const isCorrectChip: boolean =
              checked && isCorrect && val === correctValue
            const isWrongChip: boolean =
              checked && !isCorrect && val === selected
            const isDimmed: boolean =
              checked && !isSelected && val !== correctValue

            return (
              <button
                key={val}
                onClick={(): void => onSelect(val)}
                disabled={checked}
                style={
                  isSelected && !checked
                    ? {
                        borderColor: "var(--lesson-accent)",
                        backgroundColor:
                          "color-mix(in srgb, var(--lesson-accent) 12%, white)",
                      }
                    : isCorrectChip
                      ? {
                          borderColor: "var(--lesson-success)",
                          backgroundColor:
                            "color-mix(in srgb, var(--lesson-success) 10%, white)",
                          color: "var(--lesson-success)",
                        }
                      : isWrongChip
                        ? {
                            borderColor: "var(--lesson-error)",
                            backgroundColor:
                              "color-mix(in srgb, var(--lesson-error) 10%, white)",
                            color: "var(--lesson-error)",
                          }
                        : isDimmed
                          ? { opacity: 0.3 }
                          : {}
                }
                className="h-11 w-11 rounded-lg border-2 border-lesson-ink bg-white text-base font-semibold text-lesson-ink transition-all duration-150 focus-visible:ring-2 focus-visible:ring-lesson-accent focus-visible:outline-none"
              >
                {val}
              </button>
            )
          })}
        </div>

        {/* ── Feedback ─────────────────────────────────────── */}
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
              <LessonButton onClick={onCheck} disabled={selected === null}>
                Check
              </LessonButton>
              {selected !== null && (
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
