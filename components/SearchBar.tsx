'use client'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8e7c] text-sm pointer-events-none">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="野菜を検索..."
        aria-label="野菜を検索"
        className="w-full pl-8 pr-3 py-2 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-sm text-[#5c4f3a] placeholder:text-[#9b8e7c] focus:outline-none focus:border-primary"
      />
    </div>
  )
}
