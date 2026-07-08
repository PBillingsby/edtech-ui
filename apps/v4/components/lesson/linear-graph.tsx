"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { LessonButton } from "@/components/lesson/lesson-button"
import { LessonCard } from "@/components/lesson/lesson-card"
import { useFeedback } from "@/components/lesson/use-feedback"
import { feedbackVariants } from "@/components/lesson/variants"
import { Slider } from "@/registry/new-york-v4/ui/slider"

// ── SVG layout constants ──────────────────────────────────────
const PAD_LEFT: number = 48
const PAD_TOP: number = 20
const PAD_BOTTOM: number = 44
const GW: number = 220 // graph width in SVG units
const GH: number = 216 // graph height in SVG units
const BAR_GAP: number = 24
const BAR_W: number = 20
const BAR_LABEL_W: number = 36
const SVG_W: number = PAD_LEFT + GW + BAR_GAP + BAR_W + BAR_LABEL_W
const SVG_H: number = PAD_TOP + GH + PAD_BOTTOM
const BAR_X: number = PAD_LEFT + GW + BAR_GAP

// ── Coordinate helpers ────────────────────────────────────────
function gx(val: number, min: number, max: number): number {
  return ((val - min) / (max - min)) * GW
}

function gy(val: number, min: number, max: number): number {
  return GH - ((val - min) / (max - min)) * GH
}

// ── Math helpers ──────────────────────────────────────────────
interface LineCoefficients {
  slope: number
  intercept: number
}

function inferLine(pts: GraphPoint[]): LineCoefficients {
  const n: number = pts.length
  if (n < 2) return { slope: 0, intercept: pts[0]?.y ?? 0 }

  const sumX: number = pts.reduce((s: number, p: GraphPoint) => s + p.x, 0)
  const sumY: number = pts.reduce((s: number, p: GraphPoint) => s + p.y, 0)
  const sumXY: number = pts.reduce(
    (s: number, p: GraphPoint) => s + p.x * p.y,
    0
  )
  const sumX2: number = pts.reduce(
    (s: number, p: GraphPoint) => s + p.x * p.x,
    0
  )
  const denom: number = n * sumX2 - sumX * sumX

  if (denom === 0) return { slope: 0, intercept: sumY / n }

  const slope: number = (n * sumXY - sumX * sumY) / denom
  return { slope, intercept: (sumY - slope * sumX) / n }
}

function niceMax(val: number): number {
  const mag: number = Math.pow(10, Math.floor(Math.log10(val || 1)))
  return Math.ceil(val / mag) * mag
}

function niceStep(range: number, target: number = 6): number {
  const rough: number = range / target
  const mag: number = Math.pow(10, Math.floor(Math.log10(rough || 1)))
  const norm: number = rough / mag
  if (norm <= 1) return mag
  if (norm <= 2) return 2 * mag
  if (norm <= 5) return 5 * mag
  return 10 * mag
}

// ── Types ─────────────────────────────────────────────────────
export interface GraphPoint {
  x: number
  y: number
}

export interface LinearGraphQuestionProps {
  question: string
  xLabel: string
  yLabel: string
  /**
   * All data points defining the relationship.
   * Include the point at correctX — the component hides it until found.
   */
  data: GraphPoint[]
  /** The x value the learner must slide to */
  correctX: number
  explanation?: string
  onContinue?: () => void
}

// ── Component ─────────────────────────────────────────────────
export function LinearGraph({
  question,
  xLabel,
  yLabel,
  data,
  correctX,
  explanation,
  onContinue,
}: LinearGraphQuestionProps): React.JSX.Element {
  // ── Derived from data ──────────────────────────────────────
  const { slope, intercept }: LineCoefficients = inferLine(data)

  const xVals: number[] = data
    .map((p: GraphPoint) => p.x)
    .sort((a: number, b: number) => a - b)
  const xMin: number = xVals[0]
  const xMax: number = xVals[xVals.length - 1]
  const xStep: number = xVals.length > 1 ? xVals[1] - xVals[0] : 1

  const yMax: number = niceMax(Math.max(...data.map((p: GraphPoint) => p.y)))
  const yMin: number = 0
  const yStep: number = niceStep(yMax - yMin)

  const prevPts: GraphPoint[] = data.filter((p: GraphPoint) => p.x < correctX)
  const correctY: number = Math.round((slope * correctX + intercept) * 10) / 10

  // ── State ──────────────────────────────────────────────────
  const [xValue, setXValue] = React.useState<number>(xMin)

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

  // ── Derived from state ─────────────────────────────────────
  const yValue: number = Math.round((slope * xValue + intercept) * 10) / 10
  const fillPct: number = Math.max(
    0,
    Math.min(1, (yValue - yMin) / (yMax - yMin))
  )

  // Graph-specific wrong message overrides the generic hook text
  const graphFeedbackText: string =
    feedbackState === "incorrect"
      ? `At ${xLabel} = ${correctX}, ${yLabel} = ${correctY}.`
      : feedbackText

  const dotColor: string = !checked
    ? "var(--lesson-accent)"
    : isCorrect
      ? "var(--lesson-success)"
      : "var(--lesson-error)"

  function onCheck(): void {
    handleCheck(xValue === correctX)
  }

  function onReset(): void {
    setXValue(xMin)
    handleReset()
  }

  // ── Tick arrays ────────────────────────────────────────────
  const xTicks: number[] = []
  for (let v: number = xMin; v <= xMax; v += xStep) xTicks.push(v)

  const yTicks: number[] = []
  for (let v: number = yMin; v <= yMax; v += yStep) yTicks.push(v)

  // ── Bar fill geometry ──────────────────────────────────────
  const barFillH: number = GH * fillPct
  const barFillY: number = PAD_TOP + GH - barFillH

  return (
    <LessonCard
      className={cn("max-w-xl", cardClassName)}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex flex-col gap-6">
        <p className="text-base font-medium text-lesson-ink">{question}</p>

        {/* Graph + fill bar — both inside SVG so heights never fight CSS */}
        <div className="overflow-hidden rounded-xl bg-lesson-paper p-3">
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full select-none">
            <g transform={`translate(${PAD_LEFT}, ${PAD_TOP})`}>
              {/* Grid lines */}
              {xTicks.map((v: number) => (
                <line
                  key={`vg-${v}`}
                  x1={gx(v, xMin, xMax)}
                  y1={0}
                  x2={gx(v, xMin, xMax)}
                  y2={GH}
                  stroke="var(--lesson-ink)"
                  strokeOpacity={0.07}
                  strokeWidth={1}
                />
              ))}
              {yTicks.map((v: number) => (
                <line
                  key={`hg-${v}`}
                  x1={0}
                  y1={gy(v, yMin, yMax)}
                  x2={GW}
                  y2={gy(v, yMin, yMax)}
                  stroke="var(--lesson-ink)"
                  strokeOpacity={0.07}
                  strokeWidth={1}
                />
              ))}

              {/* Axes */}
              <line
                x1={0}
                y1={GH}
                x2={GW}
                y2={GH}
                stroke="var(--lesson-ink)"
                strokeOpacity={0.25}
                strokeWidth={1.5}
              />
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={GH}
                stroke="var(--lesson-ink)"
                strokeOpacity={0.25}
                strokeWidth={1.5}
              />

              {/* X tick labels */}
              {xTicks.map((v: number) => (
                <text
                  key={`xl-${v}`}
                  x={gx(v, xMin, xMax)}
                  y={GH + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--lesson-ink)"
                  fillOpacity={0.5}
                >
                  {v}
                </text>
              ))}

              {/* Y tick labels */}
              {yTicks
                .filter((v: number) => v > yMin)
                .map((v: number) => (
                  <text
                    key={`yl-${v}`}
                    x={-8}
                    y={gy(v, yMin, yMax) + 4}
                    textAnchor="end"
                    fontSize={10}
                    fill="var(--lesson-ink)"
                    fillOpacity={0.5}
                  >
                    {v}
                  </text>
                ))}

              {/* Axis name labels */}
              <text
                x={GW / 2}
                y={GH + 36}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="var(--lesson-ink)"
                fillOpacity={0.7}
              >
                {xLabel}
              </text>
              <text
                x={-(GH / 2)}
                y={-36}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="var(--lesson-ink)"
                fillOpacity={0.7}
                transform="rotate(-90)"
              >
                {yLabel}
              </text>

              {/* Previously answered points */}
              {prevPts.map((p: GraphPoint, i: number) => (
                <circle
                  key={i}
                  cx={gx(p.x, xMin, xMax)}
                  cy={gy(p.y, yMin, yMax)}
                  r={4}
                  fill="var(--lesson-success)"
                  fillOpacity={0.6}
                  stroke="white"
                  strokeWidth={1.5}
                />
              ))}

              {/* Crosshairs */}
              <line
                x1={0}
                y1={gy(yValue, yMin, yMax)}
                x2={gx(xValue, xMin, xMax)}
                y2={gy(yValue, yMin, yMax)}
                stroke={dotColor}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                strokeOpacity={0.7}
              />
              <line
                x1={gx(xValue, xMin, xMax)}
                y1={GH}
                x2={gx(xValue, xMin, xMax)}
                y2={gy(yValue, yMin, yMax)}
                stroke={dotColor}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                strokeOpacity={0.7}
              />

              {/* Active point */}
              <circle
                cx={gx(xValue, xMin, xMax)}
                cy={gy(yValue, yMin, yMax)}
                r={7}
                fill={dotColor}
                stroke="white"
                strokeWidth={2}
              />
            </g>

            {/* Fill bar track */}
            <rect
              x={BAR_X}
              y={PAD_TOP}
              width={BAR_W}
              height={GH}
              rx={6}
              fill="var(--lesson-ink)"
              fillOpacity={0.08}
            />

            {/* Fill bar fill */}
            <rect
              x={BAR_X}
              y={barFillY}
              width={BAR_W}
              height={barFillH}
              rx={6}
              fill={dotColor}
              fillOpacity={0.85}
            />

            {/* Y value label */}
            <text
              x={BAR_X + BAR_W / 2}
              y={Math.max(PAD_TOP + 10, barFillY - 5)}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill="var(--lesson-ink)"
              fillOpacity={0.8}
            >
              {yValue}
            </text>
          </svg>
        </div>

        {/* Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-lesson-ink/50">
            <span>{xMin}</span>
            <span className="font-medium text-lesson-ink/70">
              {xLabel} = {xValue}
            </span>
            <span>{xMax}</span>
          </div>
          <Slider
            min={xMin}
            max={xMax}
            step={xStep}
            value={[xValue]}
            disabled={checked}
            onValueChange={([v]: number[]) => setXValue(v)}
            className={cn(
              "[&_[data-slot=slider-thumb]]:size-6 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:shadow-md",
              "[&_[data-slot=slider-track]]:h-1.5 [&_[data-slot=slider-track]]:bg-lesson-ink/15",
              !checked &&
                "[&_[data-slot=slider-range]]:bg-lesson-accent/60 [&_[data-slot=slider-thumb]]:bg-lesson-accent",
              checked &&
                isCorrect &&
                "[&_[data-slot=slider-range]]:bg-lesson-success/40 [&_[data-slot=slider-thumb]]:bg-lesson-success",
              checked &&
                !isCorrect &&
                "[&_[data-slot=slider-range]]:bg-lesson-error/40 [&_[data-slot=slider-thumb]]:bg-lesson-error"
            )}
          />
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
            {graphFeedbackText}
          </p>

          <div className="relative h-10">
            {/* Pre-check */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-between transition-opacity duration-200",
                checked ? "pointer-events-none opacity-0" : "opacity-100"
              )}
            >
              <LessonButton onClick={onCheck}>Check</LessonButton>
              {xValue !== xMin && (
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
