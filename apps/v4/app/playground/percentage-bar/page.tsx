"use client"

import * as React from "react"

import { PercentageBar } from "@/components/lesson/percentage-bar"

const steps = [
  {
    question: "Make 25% of 100.",
    whole: 100,
    correctPercent: 25,
    explanation: "Every 25% is one quarter. 1/4 of 100 is 25.",
  },
  {
    question: "Make 75% of 100.",
    whole: 100,
    correctPercent: 75,
    explanation: "75% is three quarters. 3/4 of 100 is 75.",
  },
  {
    question: "Make 75% of 20.",
    whole: 20,
    correctPercent: 75,
    explanation: "75% of 20 is 15. Three quarters of 20 = 3 × 5 = 15.",
  },
  {
    question: "Make 40% of 100.",
    whole: 100,
    correctPercent: 40,
    explanation: "40% means 40 out of every 100.",
  },
]

export default function PercentageBarPlayground() {
  const [step, setStep] = React.useState(0)
  const current = steps[step]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-lesson-paper p-8">
      {/* <div className="text-sm text-lesson-ink/40 font-mono">
        Step {step + 1} of {steps.length}
      </div> */}

      <PercentageBar
        key={step}
        question={current.question}
        whole={current.whole}
        correctPercent={current.correctPercent}
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
