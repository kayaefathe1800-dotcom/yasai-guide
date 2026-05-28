'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Vegetable, Season, filterVegetables, sortVegetables } from '@/lib/vegetables'
import { loadVegetables } from '@/lib/storage'
import { VeggieCard } from '@/components/VeggieCard'
import { SearchBar } from '@/components/SearchBar'
import { SeasonChips } from '@/components/SeasonChips'
import { FilterBottomSheet, FilterState } from '@/components/FilterBottomSheet'

type SeasonOrAll = Season | 'すべて'

export default function HomePage() {
  const [vegetables, setVegetables] = useState<Vegetable[]>(() => typeof window !== 'undefined' ? loadVegetables() : [])
  const [query, setQuery] = useState('')
  const [activeSeason, setActiveSeason] = useState<SeasonOrAll>('すべて')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    seasons: [],
    sortOrder: '五十音順',
  })

  const effectiveSeasons: Season[] =
    activeSeason !== 'すべて' ? [activeSeason] : filters.seasons

  const displayed = sortVegetables(
    filterVegetables(vegetables, query, effectiveSeasons),
    filters.sortOrder
  )

  return (
    <div className="max-w-lg mx-auto min-h-screen">
      <header
        className="bg-white border-b border-[#ede8e0] px-4 pt-4 pb-3 sticky top-0 z-10"
        style={{ boxShadow: '0 1px 0 #ede8e0' }}
      >
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-[#3d3228] tracking-widest">
              YASAI GUIDE
            </h1>
            <p className="text-[10px] text-[#9b8e7c] tracking-wide">
              スーパー野菜選びの手引き
            </p>
          </div>
          <Link
            href="/shopping-calculator"
            className="flex items-center gap-1 px-3 py-1.5 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-xs text-[#5c4f3a] font-bold hover:border-primary transition-colors"
          >
            🧮 計算機
          </Link>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold flex-shrink-0"
          >
            絞込
          </button>
        </div>
        <div className="mt-2">
          <SeasonChips selected={activeSeason} onChange={setActiveSeason} />
        </div>
      </header>

      <main className="p-4">
        {displayed.length === 0 ? (
          <p className="text-center text-[#9b8e7c] text-sm py-16">
            該当する野菜が見つかりませんでした
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {displayed.map((v) => (
              <VeggieCard key={v.id} veggie={v} />
            ))}
          </div>
        )}
      </main>

      <footer className="p-4 text-center border-t border-[#ede8e0] mt-4">
        <a
          href="/admin"
          className="text-[10px] text-[#9b8e7c]"
        >
          管理モード
        </a>
      </footer>

      <FilterBottomSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  )
}
