"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  lessonCardFeedbackVariants,
  type lessonButtonVariants,
  type VariantProps,
} from "@/components/lesson/variants"

// ── Types ─────────────────────────────────────────────────────
export type FeedbackState = "hidden" | "correct" | "incorrect" | "explanation"

export type CardFeedbackState = "idle" | "correct" | "incorrect"

export type ButtonIntent = VariantProps<typeof lessonButtonVariants>["intent"]

export interface UseFeedbackOptions {
  explanation?: string
  onContinue?: () => void
}

export interface UseFeedbackReturn {
  // Raw state
  checked: boolean
  showWhy: boolean
  shaking: boolean
  isCorrect: boolean

  // Derived — consume directly in JSX, no component-level logic needed
  feedbackState: FeedbackState
  feedbackText: string
  cardClassName: string
  continueIntent: ButtonIntent
  continueLabel: string

  // Handlers
  handleCheck: (correct: boolean) => void
  handleReset: () => void
  toggleWhy: () => void
  onAnimationEnd: () => void
  handleContinue: () => void
}

// ── Hook ──────────────────────────────────────────────────────
export function useFeedback({
  explanation,
  onContinue,
}: UseFeedbackOptions): UseFeedbackReturn {
  const [checked, setChecked] = React.useState<boolean>(false)
  const [showWhy, setShowWhy] = React.useState<boolean>(false)
  const [shaking, setShaking] = React.useState<boolean>(false)
  const [isCorrect, setIsCorrect] = React.useState<boolean>(false)

  const feedbackState: FeedbackState = !checked
    ? "hidden"
    : showWhy
      ? "explanation"
      : isCorrect
        ? "correct"
        : "incorrect"

  const feedbackText: string =
    showWhy && explanation
      ? explanation
      : isCorrect
        ? "Nailed it!"
        : "Not quite."

  const cardFeedbackState: CardFeedbackState = !checked
    ? "idle"
    : isCorrect
      ? "correct"
      : "incorrect"

  const cardClassName: string = cn(
    lessonCardFeedbackVariants({ state: cardFeedbackState }),
    shaking && "lesson-shake"
  )

  const continueIntent: ButtonIntent = isCorrect ? "primary" : "warning"

  const continueLabel: string = isCorrect ? "Continue" : "Try again"

  // ── Handlers ──────────────────────────────────────────────
  function handleCheck(correct: boolean): void {
    setIsCorrect(correct)
    setChecked(true)
    if (!correct) setShaking(true)
  }

  function handleReset(): void {
    setChecked(false)
    setShowWhy(false)
    setShaking(false)
    setIsCorrect(false)
  }

  function toggleWhy(): void {
    setShowWhy((prev: boolean) => !prev)
  }

  function onAnimationEnd(): void {
    setShaking(false)
  }

  function handleContinue(): void {
    if (isCorrect) {
      if (onContinue) {
        onContinue()
      } else {
        handleReset()
      }
    } else {
      handleReset()
    }
  }

  return {
    checked,
    showWhy,
    shaking,
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
  }
}
