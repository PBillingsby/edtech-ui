import { MultipleChoice } from "@/components/lesson/multiple-choice"

export default function MultipleChoicePlayground() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-lesson-paper p-8">
      <MultipleChoice
        prompt="The scale shows the weight of the items."
        question="What's the weight of 1 square?"
        options={[
          { id: "a", label: "4", correct: false },
          { id: "b", label: "8", correct: true },
          { id: "c", label: "10", correct: false },
          { id: "d", label: "16", correct: false },
        ]}
        explanation="40 split across 5 squares is 8 each."
      />
    </div>
  )
}
