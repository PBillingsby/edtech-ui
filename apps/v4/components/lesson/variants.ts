import { cva, type VariantProps } from "class-variance-authority"

// ── Buttons ───────────────────────────────────────────────────
export const lessonButtonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lesson px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-lesson-accent focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      intent: {
        primary: "bg-lesson-ink text-white hover:bg-lesson-ink/90",
        outline:
          "border-2 border-lesson-ink/20 text-lesson-ink hover:bg-lesson-ink/5",
        warning: "bg-lesson-accent text-white hover:bg-lesson-accent/90",
        link: "text-lesson-ink/60 underline-offset-4 hover:text-lesson-ink hover:underline",
      },
    },
    defaultVariants: { intent: "primary" },
  }
)

// ── Answer options ────────────────────────────────────────────
export const lessonOptionVariants = cva(
  "flex w-full cursor-pointer items-center gap-3 rounded-lesson border-2 px-4 py-3 text-left font-mono text-sm transition-colors focus-visible:ring-2 focus-visible:ring-lesson-accent focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      state: {
        idle: "border-lesson-ink/20 bg-lesson-card hover:border-lesson-ink/40",
        selected: "border-lesson-accent bg-lesson-accent/15",
        correct: "border-lesson-success bg-lesson-success/15",
        incorrect: "border-lesson-error bg-lesson-error/10",
      },
    },
    defaultVariants: { state: "idle" },
  }
)

// ── Answer option markers (A/B/C/D bubbles) ───────────────────
export const lessonMarkerVariants = cva(
  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs transition-colors",
  {
    variants: {
      state: {
        idle: "border-lesson-ink/30 text-lesson-ink/60",
        selected: "border-lesson-accent text-lesson-accent",
        correct: "border-lesson-success bg-lesson-success text-white",
        incorrect: "border-lesson-error bg-lesson-error text-white",
      },
    },
    defaultVariants: { state: "idle" },
  }
)

// ── Feedback message text ─────────────────────────────────────
export const feedbackVariants = cva(
  "min-h-5 text-sm transition-all duration-200",
  {
    variants: {
      state: {
        hidden: "font-medium opacity-0 select-none",
        correct: "font-medium text-lesson-success",
        incorrect: "font-medium text-lesson-accent",
        explanation: "font-normal text-lesson-ink/70",
      },
    },
    defaultVariants: { state: "hidden" },
  }
)

// ── Card border / ring on feedback ───────────────────────────
export const lessonCardFeedbackVariants = cva(
  "transition-shadow duration-300",
  {
    variants: {
      state: {
        idle: "",
        correct:
          "shadow-lg ring-2 shadow-lesson-success/10 ring-lesson-success/50",
        incorrect: "ring-2 ring-lesson-accent/50",
      },
    },
    defaultVariants: { state: "idle" },
  }
)

// Re-export VariantProps so consumers don't need to import cva directly
export type { VariantProps }
