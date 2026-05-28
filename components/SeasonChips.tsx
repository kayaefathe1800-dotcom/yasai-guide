'use client'

import { Season } from '@/lib/vegetables'

type SeasonOrAll = Season | 'すべて'

const SEASONS: { label: string; value: SeasonOrAll; emoji: string }[] = [
  { label: 'すべて', value: 'すべて', emoji: '' },
  { label: '春', value: '春', emoji: '🌸' },
  { label: '夏', value: '夏', emoji: '☀️' },
  { label: '秋', value: '秋', emoji: '🍂' },
  { label: '冬', value: '冬', emoji: '❄️' },
]

interface Props {
  selected: SeasonOrAll
  onChange: (season: SeasonOrAll) => void
}

export function SeasonChips({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {SEASONS.map(({ label, value, emoji }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            selected === value
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-[#5c4f3a] border-[#ede8e0]'
          }`}
        >
          {emoji && <span className="mr-1">{emoji}</span>}
          {label}
        </button>
      ))}
    </div>
  )
}
