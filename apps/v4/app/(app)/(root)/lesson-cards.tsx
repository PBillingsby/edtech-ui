"use client"
import { CoordinatePlane } from "@/components/lesson/coordinate-plane"
import { Fraction, circleSegments } from "@/components/lesson/fraction"
import { LinearGraph } from "@/components/lesson/linear-graph"
import { MultipleChoice } from "@/components/lesson/multiple-choice"
import { PercentageBar } from "@/components/lesson/percentage-bar"
import { RatioPicker } from "@/components/lesson/ratio-picker"
import { TileCounter } from "@/components/lesson/tile-counter"

interface ShowcaseItem {
  name: string
  node: React.ReactNode
}

const items: ShowcaseItem[] = [
  {
    name: "MultipleChoice",
    node: (
      <MultipleChoice
        question="What's the weight of 1 square?"
        options={[
          { id: "a", label: "4", correct: false },
          { id: "b", label: "8", correct: true },
          { id: "c", label: "10", correct: false },
          { id: "d", label: "16", correct: false },
        ]}
        explanation="40 split across 5 squares means each one weighs 8."
      />
    ),
  },
  {
    name: "TileCounter",
    node: (
      <TileCounter
        question="Each negative tile cancels one positive tile. What is the total value shown?"
        tiles={["+", "-", "+", "-", "+"]}
        options={[1, 2, 3, 5]}
        answer={1}
        explanation="Two pairs cancel, leaving one positive = 1."
      />
    ),
  },
  {
    name: "LinearGraph",
    node: (
      <LinearGraph
        question="Find the volume when there are 2 rocks."
        xLabel="Rocks"
        yLabel="Volume"
        data={[
          { x: 0, y: 0 },
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 },
          { x: 4, y: 40 },
        ]}
        correctX={2}
        explanation="Each rock adds 10 units. 2 × 10 = 20."
      />
    ),
  },
  {
    name: "PercentageBar",
    node: (
      <PercentageBar
        question="Fill the bar to show 25% of 80."
        whole={80}
        correctPercent={25}
        explanation="A quarter of 80 is 20."
      />
    ),
  },
  {
    name: "CoordinatePlane",
    node: (
      <CoordinatePlane
        question="Plot the point (3, 5)."
        correctX={3}
        correctY={5}
        explanation="Move right 3, then up 5."
      />
    ),
  },
  {
    name: "RatioPicker",
    node: (
      <RatioPicker
        question="Set the amount of blue to make a darker shade."
        color="blue"
        ratio={[5, 2]}
        blank="left"
        options={[1, 3, 5]}
        explanation="More blue relative to white makes the mix darker."
      />
    ),
  },
  {
    name: "Fraction",
    node: (
      <Fraction
        question="Color 3/4 of the circle."
        segments={circleSegments(4)}
        numerator={3}
        denominator={4}
        explanation="3/4 means three of the four equal parts."
      />
    ),
  },
]

export default function LessonShowcasePage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-lesson-paper px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-lesson-ink">
            Lesson Components
          </h1>
          <p className="mt-2 text-lesson-ink/60">
            Live preview of every interaction component in the library.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
          {items.map((item: ShowcaseItem): React.JSX.Element => (
            <section key={item.name} className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-lesson-ink/5 px-2 py-1 font-mono text-xs font-medium text-lesson-ink/70">
                  {item.name}
                </span>
              </div>
              <div className="flex justify-center">{item.node}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}