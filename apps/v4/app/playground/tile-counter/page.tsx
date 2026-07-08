"use client"

import * as React from "react"

import { TileCounter } from "@/components/lesson/tile-counter"

const steps = [
  {
    question:
      "Each positive tile has a value of 1. What is the total value shown?",
    tiles: ["+", "+", "+"] as const,
    cancels: false,
    options: [0, 1, 2, 3],
    answer: 3,
    explanation: "Three positive tiles, each worth 1, add up to 3.",
  },
  {
    question:
      "Each negative tile cancels one positive tile. What is the total value shown?",
    tiles: ["+", "-", "+", "-", "+"] as const,
    cancels: true,
    options: [1, 2, 3, 5],
    answer: 1,
    explanation:
      "Three positives and two negatives: two pairs cancel, leaving one positive = 1.",
  },
  {
    question:
      "Each negative tile cancels one positive tile. What is the total value shown?",
    tiles: ["+", "+", "+", "-", "-", "-"] as const,
    cancels: true,
    options: [0, 1, 2, 3],
    answer: 0,
    explanation:
      "Three positives and three negatives cancel completely, leaving a value of 0.",
  },
  {
    question:
      "Each negative tile cancels one positive tile. What is the total value shown?",
    tiles: ["+", "+", "+", "+", "-"] as const,
    cancels: true,
    options: [1, 2, 3, 4],
    answer: 3,
    explanation:
      "Four positives and one negative: one pair cancels, leaving three positives = 3.",
  },
]

export default function TileCounterPlayground(): React.JSX.Element {
  const [step, setStep] = React.useState<number>(0)
  const current = steps[step]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-lesson-paper p-8">
      {/* <div className="text-sm text-lesson-ink/40 font-mono">
        tile-counter · step {step + 1} of {steps.length}
      </div> */}

      <TileCounter
        key={step}
        question={current.question}
        tiles={current.tiles}
        cancels={current.cancels}
        options={current.options}
        answer={current.answer}
        explanation={current.explanation}
        onContinue={(): void =>
          setStep((s: number): number => (s + 1) % steps.length)
        }
      />

      <div className="flex gap-2">
        {steps.map(
          (_: (typeof steps)[number], i: number): React.JSX.Element => (
            <button
              key={i}
              onClick={(): void => setStep(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === step ? "bg-lesson-ink" : "bg-lesson-ink/20"
              }`}
            />
          )
        )}
      </div>
    </div>
  )
}
