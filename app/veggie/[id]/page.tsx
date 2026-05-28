'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Vegetable } from '@/lib/vegetables'
import { getVegetableById } from '@/lib/storage'
import { CheckList } from '@/components/CheckList'

export default function VeggieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [veggie, setVeggie] = useState<Vegetable | null>(null)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    const found = getVegetableById(id)
    if (!found) {
      router.replace('/')
      return
    }
    setVeggie(found)
  }, [id, router])

  if (!veggie) {
    return (
      <div className="max-w-lg mx-auto min-h-screen flex items-center justify-center">
        <p className="text-[#9b8e7c] text-sm">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen" style={{ backgroundColor: '#faf8f5' }}>
      <header className="bg-white border-b border-[#ede8e0] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-primary text-xl font-medium leading-none"
          aria-label="戻る"
        >
          ←
        </button>
        <h1 className="text-sm font-bold text-[#3d3228]">野菜の見分け方</h1>
      </header>

      <div
        className="flex items-center justify-center h-40"
        style={{
          background: 'linear-gradient(135deg, #f7f4ef 0%, #ede8df 100%)',
        }}
      >
        {veggie.imageUrl && !imgError ? (
          <img
            src={veggie.imageUrl}
            alt={veggie.name}
            className="h-full w-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-7xl">{veggie.emoji}</span>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold text-[#3d3228]">{veggie.name}</h2>
        <p className="text-xs text-[#9b8e7c] mt-1 mb-5">
          🌿 旬：{veggie.seasonText}
        </p>

        <p className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase mb-3">
          見分け方チェック
        </p>
        <CheckList points={veggie.points} />
      </div>
    </div>
  )
}
