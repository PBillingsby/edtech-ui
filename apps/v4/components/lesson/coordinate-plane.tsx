"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { LessonButton } from "@/components/lesson/lesson-button"
import { LessonCard } from "@/components/lesson/lesson-card"
import { useFeedback } from "@/components/lesson/use-feedback"
import { feedbackVariants } from "@/components/lesson/variants"

// ── SVG layout ────────────────────────────────────────────────
const PAD_LEFT: number = 36
const PAD_RIGHT: number = 16
const PAD_TOP: number = 20
const PAD_BOTTOM: number = 32
const GW: number = 240
const GH: number = 240
const SVG_W: number = PAD_LEFT + GW + PAD_RIGHT
const SVG_H: number = PAD_TOP + GH + PAD_BOTTOM

// ── Coordinate conversion ─────────────────────────────────────
function toSvgX(val: number, xMin: number, xMax: number): number {
  return ((val - xMin) / (xMax - xMin)) * GW
}

function toSvgY(val: number, yMin: number, yMax: number): number {
  return GH - ((val - yMin) / (yMax - yMin)) * GH
}

function toGridX(svgX: number, xMin: number, xMax: number): number {
  return Math.round((svgX / GW) * (xMax - xMin) + xMin)
}

function toGridY(svgY: number, yMin: number, yMax: number): number {
  return Math.round(yMax - (svgY / GH) * (yMax - yMin))
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

// ── Types ─────────────────────────────────────────────────────
export interface CoordinatePlaneProps {
  question: string
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  /** Starting position of the draggable point */
  startX?: number
  startY?: number
  /** Target position the learner must drag to */
  correctX: number
  correctY: number
  explanation?: string
  onContinue?: () => void
}

// ── Component ─────────────────────────────────────────────────
export function CoordinatePlane({
  question,
  xMin = 0,
  xMax = 8,
  yMin = 0,
  yMax = 8,
  startX = 0,
  startY = 0,
  correctX,
  correctY,
  explanation,
  onContinue,
}: CoordinatePlaneProps): React.JSX.Element {
  const [pointX, setPointX] = React.useState<number>(startX)
  const [pointY, setPointY] = React.useState<number>(startY)
  const svgRef = React.useRef<SVGSVGElement>(null)

  const hasMoved: boolean = pointX !== startX || pointY !== startY

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

  // ── Handlers ─────────────────────────────────────────────
  function onCheck(): void {
    handleCheck(pointX === correctX && pointY === correctY)
  }

  function onReset(): void {
    setPointX(startX)
    setPointY(startY)
    handleReset()
  }

  function startDrag(): void {
    const svg: SVGSVGElement | null = svgRef.current
    if (!svg || checked) return

    function getGridPos(e: PointerEvent): { x: number; y: number } {
      const rect: DOMRect = svg.getBoundingClientRect()
      const rawX: number =
        (e.clientX - rect.left) * (SVG_W / rect.width) - PAD_LEFT
      const rawY: number =
        (e.clientY - rect.top) * (SVG_H / rect.height) - PAD_TOP
      return {
        x: clamp(toGridX(rawX, xMin, xMax), xMin, xMax),
        y: clamp(toGridY(rawY, yMin, yMax), yMin, yMax),
      }
    }

    function onMove(e: PointerEvent): void {
      const pos: { x: number; y: number } = getGridPos(e)
      setPointX(pos.x)
      setPointY(pos.y)
    }

    function onUp(e: PointerEvent): void {
      const pos: { x: number; y: number } = getGridPos(e)
      setPointX(pos.x)
      setPointY(pos.y)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  // ── Derived ───────────────────────────────────────────────
  const dotColor: string = !checked
    ? "var(--lesson-accent)"
    : isCorrect
      ? "var(--lesson-success)"
      : "var(--lesson-error)"

  const cx: number = toSvgX(pointX, xMin, xMax)
  const cy: number = toSvgY(pointY, yMin, yMax)

  const xTicks: number[] = []
  for (let v: number = xMin; v <= xMax; v++) xTicks.push(v)

  const yTicks: number[] = []
  for (let v: number = yMin; v <= yMax; v++) yTicks.push(v)

  // Only show every other label if the range is large
  const xRange: number = xMax - xMin
  const yRange: number = yMax - yMin
  const showXTick = (v: number): boolean => xRange <= 8 || v % 2 === 0
  const showYTick = (v: number): boolean => yRange <= 8 || v % 2 === 0

  return (
    <LessonCard
      className={cn("max-w-xl", cardClassName)}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex flex-col gap-6">
        <p className="text-base font-medium text-lesson-ink">{question}</p>

        <div className="overflow-hidden rounded-xl bg-lesson-paper p-3">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full select-none"
            style={{ touchAction: "none" }}
          >
            <g transform={`translate(${PAD_LEFT}, ${PAD_TOP})`}>
              {/* ── Grid lines ───────────────────────────── */}
              {xTicks.map((v: number) => (
                <line
                  key={`vg-${v}`}
                  x1={toSvgX(v, xMin, xMax)}
                  y1={0}
                  x2={toSvgX(v, xMin, xMax)}
                  y2={GH}
                  stroke="var(--lesson-ink)"
                  strokeOpacity={v === 0 ? 0.3 : 0.07}
                  strokeWidth={v === 0 ? 1.5 : 1}
                />
              ))}
              {yTicks.map((v: number) => (
                <line
                  key={`hg-${v}`}
                  x1={0}
                  y1={toSvgY(v, yMin, yMax)}
                  x2={GW}
                  y2={toSvgY(v, yMin, yMax)}
                  stroke="var(--lesson-ink)"
                  strokeOpacity={v === 0 ? 0.3 : 0.07}
                  strokeWidth={v === 0 ? 1.5 : 1}
                />
              ))}

              {/* ── Tick labels ──────────────────────────── */}
              {xTicks.filter(showXTick).map((v: number) => (
                <text
                  key={`xl-${v}`}
                  x={toSvgX(v, xMin, xMax)}
                  y={GH + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--lesson-ink)"
                  fillOpacity={0.5}
                >
                  {v}
                </text>
              ))}
              {yTicks.filter(showYTick).map((v: number) => (
                <text
                  key={`yl-${v}`}
                  x={-8}
                  y={toSvgY(v, yMin, yMax) + 4}
                  textAnchor="end"
                  fontSize={10}
                  fill="var(--lesson-ink)"
                  fillOpacity={0.5}
                >
                  {v}
                </text>
              ))}

              {/* ── Crosshairs ───────────────────────────── */}
              <line
                x1={0}
                y1={cy}
                x2={cx}
                y2={cy}
                stroke={dotColor}
                strokeWidth={1}
                strokeDasharray="3 3"
                strokeOpacity={0.45}
              />
              <line
                x1={cx}
                y1={GH}
                x2={cx}
                y2={cy}
                stroke={dotColor}
                strokeWidth={1}
                strokeDasharray="3 3"
                strokeOpacity={0.45}
              />

              {/* ── Coordinate label ─────────────────────── */}
              <text
                x={cx}
                y={Math.max(14, cy - 14)}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill={dotColor}
              >
                ({pointX}, {pointY})
              </text>

              {/* ── Draggable point ──────────────────────── */}
              {!checked ? (
                <circle
                  cx={cx}
                  cy={cy}
                  r={9}
                  fill={dotColor}
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
                <g>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={11}
                    fill="var(--lesson-success)"
                    stroke="white"
                    strokeWidth={2}
                  />
                  <text
                    x={cx}
                    y={cy + 5}
                    fontSize={13}
                    textAnchor="middle"
                    fill="white"
                    fontWeight={700}
                  >
                    ✓
                  </text>
                </g>
              ) : (
                <circle
                  cx={cx}
                  cy={cy}
                  r={9}
                  fill="var(--lesson-error)"
                  stroke="white"
                  strokeWidth={2}
                />
              )}
            </g>
          </svg>
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
              <LessonButton onClick={onCheck} disabled={!hasMoved}>
                Check
              </LessonButton>
              {hasMoved && (
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
