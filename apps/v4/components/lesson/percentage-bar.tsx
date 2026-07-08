"use client"

import { RotateCcw } from "lucide-react"
import * as React from "react"

import { LessonButton } from "@/components/lesson/lesson-button"
import { LessonCard } from "@/components/lesson/lesson-card"
import { useFeedback } from "@/components/lesson/use-feedback"
import { feedbackVariants } from "@/components/lesson/variants"
import { cn } from "@/lib/utils"

// ── SVG layout ────────────────────────────────────────────────
const BAR_X: number = 44 // left edge of bars (room for 0% label)
const BAR_W: number = 260 // bar width in SVG units
const BAR_H: number = 28 // bar height
const VAL_GAP: number = 10 // gap between bar right edge and value label
const REF_Y: number = 20 // y of reference bar top
const INT_Y: number = REF_Y + BAR_H + 50 // y of interactive bar top
const HANDLE_R: number = 11 // handle circle radius
const SVG_W: number = BAR_X + BAR_W + 60
const SVG_H: number = INT_Y + BAR_H + HANDLE_R * 2 + 20

// ── Helpers ───────────────────────────────────────────────────
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function pxToPercent(rawPx: number): number {
  return clamp(Math.round((rawPx / BAR_W) * 100), 0, 100)
}

// ── Types ─────────────────────────────────────────────────────
export interface PercentageBarProps {
  question: string
  /** The total value represented by the full reference bar (e.g. 100, 20) */
  whole: number
  /** The target percentage the learner must drag to (e.g. 25, 75) */
  correctPercent: number
  /** Number of visual segment dividers in both bars. Defaults to 5. */
  segments?: number
  explanation?: string
  onContinue?: () => void
}

// ── Component ─────────────────────────────────────────────────
export function PercentageBar({
  question,
  whole,
  correctPercent,
  segments = 5,
  explanation,
  onContinue,
}: PercentageBarProps): React.JSX.Element {
  const correctValue: number = Math.round((correctPercent / 100) * whole)

  const [currentPercent, setCurrentPercent] = React.useState<number>(0)
  const svgRef = React.useRef<SVGSVGElement>(null)

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

  // ── Derived ───────────────────────────────────────────────
  const currentValue: number = Math.round((currentPercent / 100) * whole)
  const fillW: number = (currentPercent / 100) * BAR_W
  const handleX: number = BAR_X + fillW
  const handleY: number = INT_Y + BAR_H + HANDLE_R

  const fillColor: string = !checked
    ? "var(--lesson-accent)"
    : isCorrect
      ? "var(--lesson-success)"
      : "var(--lesson-error)"

  const segmentXs: number[] = Array.from(
    { length: segments - 1 },
    (_: unknown, i: number): number => BAR_X + ((i + 1) / segments) * BAR_W
  )

  // ── Handlers ─────────────────────────────────────────────
  function onCheck(): void {
    handleCheck(currentPercent === correctPercent)
  }

  function onReset(): void {
    setCurrentPercent(0)
    handleReset()
  }

  // Synchronous listener attachment — same pattern as LinearGraph
  function startDrag(): void {
    const svg: SVGSVGElement | null = svgRef.current
    if (!svg) return

    function onMove(e: PointerEvent): void {
      const rect: DOMRect = svg.getBoundingClientRect()
      const svgX: number =
        (e.clientX - rect.left) * (SVG_W / rect.width) - BAR_X
      setCurrentPercent(pxToPercent(svgX))
    }

    function onUp(e: PointerEvent): void {
      const rect: DOMRect = svg.getBoundingClientRect()
      const svgX: number =
        (e.clientX - rect.left) * (SVG_W / rect.width) - BAR_X
      setCurrentPercent(pxToPercent(svgX))
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  // Also allow clicking anywhere on the interactive bar to jump to that position
  function handleBarClick(e: React.MouseEvent<SVGRectElement>): void {
    if (checked) return
    const svg: SVGSVGElement | null = svgRef.current
    if (!svg) return
    const rect: DOMRect = svg.getBoundingClientRect()
    const svgX: number = (e.clientX - rect.left) * (SVG_W / rect.width) - BAR_X
    setCurrentPercent(pxToPercent(svgX))
  }

  return (
    <LessonCard
      className={cn("max-w-xl", cardClassName)}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex flex-col gap-6">
        <p className="text-base font-medium text-lesson-ink">{question}</p>

        <div className="overflow-hidden rounded-xl bg-lesson-paper p-4">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full select-none"
            style={{ touchAction: "none" }}
          >
            {/* ── Reference bar ──────────────────────────── */}
            <text
              x={BAR_X}
              y={REF_Y - 6}
              fontSize={10}
              fill="var(--lesson-ink)"
              fillOpacity={0.5}
              textAnchor="start"
            >
              0%
            </text>
            <text
              x={BAR_X + BAR_W}
              y={REF_Y - 6}
              fontSize={10}
              fill="var(--lesson-ink)"
              fillOpacity={0.5}
              textAnchor="end"
            >
              100%
            </text>

            {/* Background track */}
            <rect
              x={BAR_X}
              y={REF_Y}
              width={BAR_W}
              height={BAR_H}
              rx={4}
              fill="var(--lesson-ink)"
              fillOpacity={0.1}
            />
            {/* Full fill */}
            <rect
              x={BAR_X}
              y={REF_Y}
              width={BAR_W}
              height={BAR_H}
              rx={4}
              fill="var(--lesson-ink)"
              fillOpacity={0.22}
            />
            {/* Segment dividers */}
            {segmentXs.map((x: number, i: number) => (
              <line
                key={`rs-${i}`}
                x1={x}
                y1={REF_Y}
                x2={x}
                y2={REF_Y + BAR_H}
                stroke="var(--lesson-paper)"
                strokeOpacity={0.7}
                strokeWidth={1.5}
              />
            ))}
            {/* Value */}
            <text
              x={BAR_X + BAR_W + VAL_GAP}
              y={REF_Y + BAR_H / 2 + 4}
              fontSize={12}
              fontWeight={600}
              fill="var(--lesson-ink)"
              fillOpacity={0.75}
              textAnchor="start"
            >
              {whole}
            </text>

            {/* ── Interactive bar ─────────────────────────── */}
            <text
              x={BAR_X}
              y={INT_Y - 6}
              fontSize={10}
              fill="var(--lesson-ink)"
              fillOpacity={0.5}
              textAnchor="start"
            >
              0%
            </text>
            {/* Percentage label above handle — clamped so it never overflows */}
            {currentPercent > 0 && (
              <text
                x={clamp(handleX, BAR_X + 14, BAR_X + BAR_W - 4)}
                y={INT_Y - 6}
                fontSize={10}
                fontWeight={600}
                fill={fillColor}
                textAnchor="middle"
              >
                {currentPercent}%
              </text>
            )}

            {/* Background track — clickable to jump */}
            <rect
              x={BAR_X}
              y={INT_Y}
              width={BAR_W}
              height={BAR_H}
              rx={4}
              fill="var(--lesson-ink)"
              fillOpacity={0.07}
              style={{ cursor: checked ? "default" : "pointer" }}
              onClick={handleBarClick}
            />
            {/* Fill */}
            {fillW > 0 && (
              <rect
                x={BAR_X}
                y={INT_Y}
                width={fillW}
                height={BAR_H}
                rx={4}
                fill={fillColor}
                fillOpacity={0.8}
                style={{ pointerEvents: "none" }}
              />
            )}
            {/* Segment dividers */}
            {segmentXs.map((x: number, i: number) => (
              <line
                key={`is-${i}`}
                x1={x}
                y1={INT_Y}
                x2={x}
                y2={INT_Y + BAR_H}
                stroke="var(--lesson-paper)"
                strokeOpacity={0.5}
                strokeWidth={1.5}
              />
            ))}
            {/* Value to the right */}
            {currentPercent > 0 && (
              <text
                x={BAR_X + BAR_W + VAL_GAP}
                y={INT_Y + BAR_H / 2 + 4}
                fontSize={12}
                fontWeight={600}
                fill={fillColor}
                textAnchor="start"
              >
                {currentValue}
              </text>
            )}

            {/* ── Handle ─────────────────────────────────── */}
            {!checked ? (
              <circle
                cx={handleX}
                cy={handleY}
                r={HANDLE_R}
                fill={currentPercent > 0 ? fillColor : "var(--lesson-ink)"}
                fillOpacity={currentPercent > 0 ? 1 : 0.25}
                stroke="white"
                strokeWidth={2}
                style={{ cursor: "grab", touchAction: "none" }}
                onPointerDown={(
                  e: React.PointerEvent<SVGCircleElement>
                ): void => {
                  e.preventDefault()
                  startDrag()
                }}
              />
            ) : isCorrect ? (
              // Correct checkmark badge at handle position
              <g>
                <rect
                  x={handleX - 11}
                  y={handleY - 11}
                  width={22}
                  height={22}
                  rx={5}
                  fill="var(--lesson-success)"
                />
                <text
                  x={handleX}
                  y={handleY + 5}
                  fontSize={13}
                  textAnchor="middle"
                  fill="white"
                  fontWeight={700}
                >
                  ✓
                </text>
              </g>
            ) : null}
          </svg>
        </div>

        {/* Hint text */}
        {!checked && (
          <p className="text-center text-xs text-lesson-ink/40">
            {currentPercent === 0
              ? "Drag the handle or click the bar to fill it"
              : `${currentPercent}% of ${whole} = ${currentValue}`}
          </p>
        )}

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
              <LessonButton onClick={onCheck} disabled={currentPercent === 0}>
                Check
              </LessonButton>
              {currentPercent > 0 && (
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
