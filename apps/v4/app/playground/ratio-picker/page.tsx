"use client"

import * as React from "react"

import { RatioPicker } from "@/components/lesson/ratio-picker"

const steps = [
  {
    question: "Set the amount of blue to make a darker shade of blue.",
    color: "blue",
    ratio: [5, 2] as [number, number],
    blank: "left" as const,
    options: [1, 3, 5],
    explanation:
      "More blue relative to white makes the mix darker. 5 : 2 has more blue than 1 : 2 or 3 : 2.",
  },
  {
    question: "Set the amount of white to make a lighter shade of red.",
    color: "red",
    ratio: [5, 4] as [number, number],
    blank: "right" as const,
    options: [1, 2, 4],
    explanation:
      "More white relative to red makes the mix lighter. 5 : 4 has more white than 5 : 1 or 5 : 2.",
  },
  {
    question: "Make a lighter shade of green.",
    color: "green",
    ratio: [2, 3] as [number, number],
    blank: "left" as const,
    options: [2, 3, 4],
    explanation:
      "To make a lighter shade, you need less green relative to white. 2 : 3 has less green than 3 : 3 or 4 : 3.",
  },
  {
    question: "Make a darker shade of purple.",
    color: "purple",
    ratio: [3, 1] as [number, number],
    blank: "right" as const,
    options: [1, 2, 3, 4],
    explanation:
      "To make a darker shade, you need less white relative to purple. 3 : 1 has less white than 3 : 2, 3 : 3, or 3 : 4.",
  },
]

export default function RatioPickerPlayground(): React.JSX.Element {
  const [step, setStep] = React.useState<number>(0)
  const current = steps[step]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-lesson-paper p-8">
      {/* <div className="text-sm text-lesson-ink/40 font-mono">
        ratio-picker · step {step + 1} of {steps.length}
      </div> */}

      <RatioPicker
        key={step}
        question={current.question}
        color={current.color}
        ratio={current.ratio}
        blank={current.blank}
        options={current.options}
        explanation={current.explanation}
        onContinue={(): void => setStep((s: number) => (s + 1) % steps.length)}
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
