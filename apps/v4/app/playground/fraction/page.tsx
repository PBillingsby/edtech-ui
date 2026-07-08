"use client"

import * as React from "react"

import {
  circleSegments,
  compositeSixthsSegments,
  Fraction,
  hexagonSegments,
  triangleQuarterSegments
} from "@/components/lesson/fraction"

const steps = [
  {
    question: "Color 1/2 of the hexagon.",
    segments: hexagonSegments(),
    numerator: 1,
    denominator: 2,
    explanation: "1/2 of 6 segments is 3. Any 3 pieces you pick is correct.",
  },
  {
    question: "Color 1/2 of the circle.",
    segments: circleSegments(12),
    numerator: 1,
    denominator: 2,
    explanation: "1/2 of 4 segments is 2. Any 2 pieces you pick is correct.",
  },
  {
    question: "Color 1/2 of the circle.",
    segments: circleSegments(6),
    numerator: 1,
    denominator: 2,
    explanation: "1/2 of 6 segments is 3.",
  },
  {
    question: "Color 1/3 of the shape.",
    segments: compositeSixthsSegments(),
    numerator: 1,
    // 1/3 of 6 pieces = 2 pieces
    denominator: 3,
    explanation:
      "1/3 of 6 equal parts is 2 parts. The diagonal pieces count the same as the rectangular ones.",
  },
  {
    question: "Color 1/6 of the shape.",
    segments: compositeSixthsSegments(),
    numerator: 1,
    denominator: 6,
    explanation:
      "Each piece — whether a rectangle or a triangle — represents 1/6 of the whole.",
  },
  {
    question: "Color 1/4 of the triangle.",
    segments: triangleQuarterSegments(),
    numerator: 1,
    denominator: 4,
    explanation:
      "Connecting the midpoints divides the triangle into 4 equal smaller triangles.",
  },
]

export default function FractionPlayground() {
  const [step, setStep] = React.useState(0)
  const current = steps[step]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-lesson-paper p-8">
      {/* <div className="text-sm text-lesson-ink/40 font-mono">
        fraction · step {step + 1} of {steps.length}
      </div> */}

      <Fraction
        key={step}
        question={current.question}
        segments={current.segments}
        numerator={current.numerator}
        denominator={current.denominator}
        explanation={current.explanation}
        onContinue={() => setStep((s) => (s + 1) % steps.length)}
      />

      <div className="flex gap-2">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`h-2 w-2 rounded-full transition-colors ${i === step ? "bg-lesson-ink" : "bg-lesson-ink/20"
              }`}
          />
        ))}
      </div>
    </div>
  )
}
