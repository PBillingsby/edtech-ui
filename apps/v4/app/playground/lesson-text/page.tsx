import { LessonText } from "@/components/lesson/lesson-text"

export default function LessonTextPlayground() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-lesson-paper p-8">
      <LessonText
        paragraphs={[
          "You found the weights of the unknown shapes by thinking about their relationship to known weights.",
          "Now we'll try finding multiple unknowns at the same time.",
        ]}
      />
    </div>
  )
}
