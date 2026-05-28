'use client'

import { useState, useEffect, useCallback } from 'react'
import { Season, SortOrder } from '@/lib/vegetables'

const SEASONS: { label: string; value: Season; emoji: string }[] = [
  { label: '春', value: '春', emoji: '🌸' },
  { label: '夏', value: '夏', emoji: '☀️' },
  { label: '秋', value: '秋', emoji: '🍂' },
  { label: '冬', value: '冬', emoji: '❄️' },
]

const SORT_OPTIONS: SortOrder[] = ['五十音順', '季節順']

export interface FilterState {
  seasons: Season[]
  sortOrder: SortOrder
}

interface Props {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onApply: (filters: FilterState) => void
}

export function FilterBottomSheet({ isOpen, onClose, filters, onApply }: Props) {
  const [local, setLocal] = useState<FilterState>(filters)

  useEffect(() => {
    if (isOpen) setLocal(filters)
  }, [isOpen, filters])

  const handleEscape = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleEscape])

  const toggleSeason = (season: Season) => {
    setLocal((prev) => ({
      ...prev,
      seasons: prev.seasons.includes(season)
        ? prev.seasons.filter((s) => s !== season)
        : [...prev.seasons, season],
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-sheet-title"
        className="relative bg-white rounded-t-2xl p-5 pb-10"
      >
        <div className="w-8 h-1 bg-[#ede8e0] rounded-full mx-auto mb-4" />
        <h3 id="filter-sheet-title" className="text-sm font-bold text-[#3d3228] mb-4">絞り込み・並び替え</h3>

        <p className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase mb-2">
          旬の季節
        </p>
        <div className="flex gap-2 flex-wrap mb-5">
          {SEASONS.map(({ label, value, emoji }) => (
            <button
              type="button"
              key={value}
              onClick={() => toggleSeason(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                local.seasons.includes(value)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-[#faf8f5] text-[#5c4f3a] border-[#ede8e0]'
              }`}
            >
              {emoji} {label}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase mb-2">
          並び替え
        </p>
        <div className="flex gap-2 mb-6">
          {SORT_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => setLocal((prev) => ({ ...prev, sortOrder: opt }))}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                local.sortOrder === opt
                  ? 'bg-primary text-white border-primary'
                  : 'bg-[#faf8f5] text-[#5c4f3a] border-[#ede8e0]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            onApply(local)
            onClose()
          }}
          className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold"
        >
          この条件で絞り込む
        </button>
      </div>
    </div>
  )
}
