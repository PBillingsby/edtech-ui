import { LinearGraph } from "@/components/lesson/linear-graph"

export default function LinearGraphPlayground() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-lesson-paper p-8">
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
          { x: 5, y: 50 },
          { x: 6, y: 60 },
          { x: 7, y: 70 },
          { x: 8, y: 80 },
          { x: 9, y: 90 },
          { x: 10, y: 100 },
          { x: 11, y: 110 },
        ]}
        correctX={2}
        explanation="Each rock adds 10 units of volume. 2 × 10 = 20."
      />
    </div>
  )
}
