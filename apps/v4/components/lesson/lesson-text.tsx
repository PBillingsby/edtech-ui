import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"

export interface LessonTextProps {
  paragraphs: string[]
  onContinue?: () => void
}

export function LessonText({ paragraphs, onContinue }: LessonTextProps): React.JSX.Element {
  return (
    <Card className="w-full max-w-lg border-[var(--lesson-ink)]/15 bg-[var(--lesson-paper)] shadow-sm">
      <CardContent className="flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-4 text-[var(--lesson-ink)]">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed">
              {p}
            </p>
          ))}
        </div>
        <Button
          onClick={onContinue}
          className="self-start bg-[var(--lesson-ink)] text-white hover:cursor-pointer hover:bg-[var(--lesson-ink)]/90"
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  )
}
