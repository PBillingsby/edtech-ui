"use client"

import * as React from "react"

import { CoordinatePlane } from "@/components/lesson/coordinate-plane"

const steps = [
  {
    question: "Move the point 3 grid steps to the right.",
    startX: 0,
    startY: 0,
    correctX: 3,
    correctY: 0,
    explanation:
      "Moving right increases the x value. Starting at (0, 0) and moving 3 steps right lands at (3, 0).",
  },
  {
    question: "Move the point 4 steps up.",
    startX: 0,
    startY: 0,
    correctX: 0,
    correctY: 4,
    explanation:
      "Moving up increases the y value. Starting at (0, 0) and moving 4 steps up lands at (0, 4).",
  },
  {
    question: "Place the point at (5, 3).",
    startX: 0,
    startY: 0,
    correctX: 5,
    correctY: 3,
    explanation:
      "The x value tells you how far right, the y value tells you how far up. (5, 3) is 5 right and 3 up.",
  },
  {
    question: "Move the point 2 steps right and 3 steps down.",
    startX: 3,
    startY: 6,
    correctX: 5,
    correctY: 3,
    explanation:
      "Starting at (3, 6), moving 2 right adds 2 to x, moving 3 down subtracts 3 from y. That gives (5, 3).",
  },
]

export default function CoordinatePlanePlayground() {
  const [step, setStep] = React.useState<number>(0)
  const current = steps[step]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-lesson-paper p-8">
      {/* <div className="text-sm text-lesson-ink/40 font-mono">
        coordinate-plane · step {step + 1} of {steps.length}
      </div> */}

      <CoordinatePlane
        key={step}
        question={current.question}
        startX={current.startX}
        startY={current.startY}
        correctX={current.correctX}
        correctY={current.correctY}
        explanation={current.explanation}
        onContinue={(): void => setStep((s: number) => (s + 1) % steps.length)}
      />

      <div className="flex gap-2">
        {steps.map((_: (typeof steps)[number], i: number) => (
          <button
            key={i}
            onClick={(): void => setStep(i)}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === step ? "bg-lesson-ink" : "bg-lesson-ink/20"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
