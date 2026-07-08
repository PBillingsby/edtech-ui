import Link from "next/link"

const components = [
  { name: "Lesson Text", href: "/playground/lesson-text" },
  { name: "Interactive Question", href: "/playground/interactive-question" },
  { name: "Linear Graph", href: "/playground/linear-graph" },
  { name: "Percentage Bar", href: "/playground/percentage-bar" },
  { name: "Fraction", href: "/playground/fraction" },
  { name: "Coordinate Plane", href: "/playground/coordinate-plane" },
  { name: "Ratio Picker", href: "/playground/ratio-picker" },
]

export default function PlaygroundIndex() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-lesson-paper p-8">
      <h1 className="text-2xl font-bold text-lesson-ink">
        Component Playground
      </h1>
      <ul className="flex flex-col gap-2">
        {components.map((c) => (
          <li key={c.href}>
            <Link
              href={c.href}
              className="text-lesson-ink underline underline-offset-4 hover:text-lesson-ink/70"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
