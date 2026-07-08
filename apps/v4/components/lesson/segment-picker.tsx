"use client"

import { RotateCcw } from "lucide-react"
import * as React from "react"

import { LessonButton } from "@/components/lesson/lesson-button"
import { LessonCard } from "@/components/lesson/lesson-card"
import { useFeedback } from "@/components/lesson/use-feedback"
import { feedbackVariants } from "@/components/lesson/variants"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────
export interface SegmentDef {
  /** SVG path data string for this segment */
  path: string
}

export interface FractionProps {
  question: string
  /** All segments as SVG path definitions — one per fractional unit */
  segments: SegmentDef[]
  /** Fraction numerator — learner must color this many segments */
  numerator: number
  /** Fraction denominator — should equal segments.length */
  denominator: number
  /** SVG viewBox string, defaults to "0 0 300 300" */
  viewBox?: string
  explanation?: string
  onContinue?: () => void
}

// ── Component ─────────────────────────────────────────────────
export function Fraction({
  question,
  segments,
  numerator,
  denominator,
  viewBox = "0 0 300 300",
  explanation,
  onContinue,
}: FractionProps): React.JSX.Element {
  const correctCount: number = Math.round(
    (segments.length * numerator) / denominator
  )

  const [colored, setColored] = React.useState<Set<number>>(new Set())

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

  function toggleSegment(i: number): void {
    if (checked) return
    setColored((prev: Set<number>): Set<number> => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  function onCheck(): void {
    handleCheck(colored.size === correctCount)
  }

  function onReset(): void {
    setColored(new Set())
    handleReset()
  }

  const accentColor: string = !checked
    ? "var(--lesson-accent)"
    : isCorrect
      ? "var(--lesson-success)"
      : "var(--lesson-error)"

  return (
    <LessonCard
      className={cn("max-w-xl", cardClassName)}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex flex-col gap-6">
        <p className="text-base font-medium text-lesson-ink">{question}</p>

        <div className="flex justify-center">
          <svg
            viewBox={viewBox}
            width="224"
            height="224"
            className="flex-shrink-0 select-none"
            style={{ touchAction: "none" }}
          >
            {segments.map((seg: SegmentDef, i: number) => (
              <path
                key={i}
                d={seg.path}
                fill={colored.has(i) ? accentColor : "var(--lesson-ink)"}
                fillOpacity={colored.has(i) ? 0.85 : 0.18}
                stroke="white"
                strokeWidth={1.5}
                strokeLinejoin="round"
                style={{ cursor: checked ? "default" : "pointer" }}
                onClick={(): void => toggleSegment(i)}
              />
            ))}
          </svg>
        </div>

        <p className="h-4 text-center text-xs text-lesson-ink/40">
          {!checked &&
            (colored.size === 0
              ? "Tap segments to color them"
              : `${colored.size} of ${segments.length} colored`)}
        </p>

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
              <LessonButton onClick={onCheck} disabled={colored.size === 0}>
                Check
              </LessonButton>
              {colored.size > 0 && (
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

// ─────────────────────────────────────────────────────────────
// ── Shape helpers — generate SegmentDef[] for common shapes ──
// ─────────────────────────────────────────────────────────────

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

function pt(cx: number, cy: number, r: number, deg: number): [number, number] {
  return [cx + r * Math.cos(toRad(deg)), cy + r * Math.sin(toRad(deg))]
}

/**
 * Circle divided into n equal pie slices.
 * Starts at 12 o'clock (-90°).
 */
export function circleSegments(
  n: number,
  cx = 150,
  cy = 150,
  r = 128
): SegmentDef[] {
  const step = 360 / n
  return Array.from({ length: n }, (_: unknown, i: number): SegmentDef => {
    const start = -90 + i * step
    const end = -90 + (i + 1) * step
    const [x1, y1] = pt(cx, cy, r, start)
    const [x2, y2] = pt(cx, cy, r, end)
    const largeArc = step > 180 ? 1 : 0
    return {
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
    }
  })
}

/**
 * Regular hexagon divided into 6 equal triangles from center.
 * Pointed-top orientation.
 */
export function hexagonSegments(cx: number = 150, cy: number = 150, r: number = 128): SegmentDef[] {
  return Array.from({ length: 6 }, (_: unknown, i: number): SegmentDef => {
    const [x1, y1] = pt(cx, cy, r, -90 + i * 60)
    const [x2, y2] = pt(cx, cy, r, -90 + (i + 1) * 60)
    return { path: `M ${cx} ${cy} L ${x1} ${y1} L ${x2} ${y2} Z` }
  })
}

/**
 * Equilateral triangle divided into 4 equal smaller triangles
 * by connecting the midpoints of each side.
 */
export function triangleQuarterSegments(
  cx: number = 150,
  cy: number = 60,
  size: number = 220
): SegmentDef[] {
  // Outer vertices
  const top: [number, number] = [cx, cy]
  const bl: [number, number] = [cx - size / 2, cy + (size * Math.sqrt(3)) / 2]
  const br: [number, number] = [cx + size / 2, cy + (size * Math.sqrt(3)) / 2]

  // Midpoints
  const mTL: [number, number] = [(top[0] + bl[0]) / 2, (top[1] + bl[1]) / 2]
  const mTR: [number, number] = [(top[0] + br[0]) / 2, (top[1] + br[1]) / 2]
  const mB: [number, number] = [(bl[0] + br[0]) / 2, (bl[1] + br[1]) / 2]

  const tri = (...pts: [number, number][]): string =>
    `M ${pts.map(([x, y]) => `${x} ${y}`).join(" L ")} Z`

  return [
    { path: tri(top, mTL, mTR) }, // top triangle
    { path: tri(mTL, bl, mB) }, // bottom-left triangle
    { path: tri(mTR, mB, br) }, // bottom-right triangle
    { path: tri(mTL, mTR, mB) }, // center inverted triangle
  ]
}

/**
 * Rectangle divided into 6 equal-area segments:
 * 2 columns of rectangles on the left, 1 column with a diagonal cut on the right.
 * Each piece = 1/6 of the total area.
 *
 * Layout (300×300 viewBox, 3 equal columns of 100px):
 *   col 1 (0–100):   2 rectangles, split at y=150
 *   col 2 (100–200): 2 rectangles, split at y=150
 *   col 3 (200–300): 2 triangles, diagonal from (200,0) to (300,300)
 */
export function compositeSixthsSegments(
  x: number = 0,
  y: number = 0,
  w: number = 300,
  h: number = 300
): SegmentDef[] {
  const c1: number = x + w / 3 // x = 100
  const c2: number = x + (2 * w) / 3 // x = 200
  const r: number = y + h / 2 // y = 150  (row split for rect cols)
  const right: number = x + w // x = 300

  return [
    // Col 1 — rectangles
    { path: `M ${x}  ${y} L ${c1} ${y} L ${c1} ${r}     L ${x}  ${r}     Z` },
    { path: `M ${x}  ${r} L ${c1} ${r} L ${c1} ${y + h} L ${x}  ${y + h} Z` },
    // Col 2 — rectangles
    { path: `M ${c1} ${y} L ${c2} ${y} L ${c2} ${r}     L ${c1} ${r}     Z` },
    { path: `M ${c1} ${r} L ${c2} ${r} L ${c2} ${y + h} L ${c1} ${y + h} Z` },
    // Col 3 — diagonal triangles (diagonal from top-left to bottom-right of column)
    { path: `M ${c2} ${y}     L ${right} ${y}     L ${right} ${y + h} Z` },
    { path: `M ${c2} ${y}     L ${right} ${y + h} L ${c2}   ${y + h} Z` },
  ]
}
