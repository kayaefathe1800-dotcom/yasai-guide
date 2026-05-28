interface Props {
  points: string[]
}

export function CheckList({ points }: Props) {
  return (
    <ul className="space-y-3">
      {points.map((point, idx) => (
        <li key={idx} className="flex gap-3">
          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-primary text-white rounded text-[10px] font-bold mt-0.5">
            ✓
          </span>
          <span className="text-sm text-[#5c4f3a] leading-relaxed">{point}</span>
        </li>
      ))}
    </ul>
  )
}
