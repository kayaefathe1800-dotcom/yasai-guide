'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Vegetable } from '@/lib/vegetables'

interface Props {
  veggie: Vegetable
}

export function VeggieCard({ veggie }: Props) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link
      href={`/veggie/${veggie.id}`}
      className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-[#ede8e0] shadow-sm active:scale-95 transition-transform"
    >
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#faf8f5] overflow-hidden">
        {veggie.imageUrl && !imgError ? (
          <img
            src={veggie.imageUrl}
            alt={veggie.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-3xl">{veggie.emoji}</span>
        )}
      </div>
      <span className="text-xs font-semibold text-[#5c4f3a] text-center leading-tight">
        {veggie.name}
      </span>
      <span className="text-[10px] text-[#9b8e7c]">
        {veggie.seasons.join('・')}
      </span>
    </Link>
  )
}
