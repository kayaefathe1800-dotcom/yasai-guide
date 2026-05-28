'use client'

import type { CompareItem, CartItem, DiscountType } from '@/types/shopping'

type Item = CompareItem | CartItem

interface DiscountControlsProps {
  item: Item
  onChange: (updated: Item) => void
  label: string
}

const DISCOUNT_BUTTONS: { type: DiscountType; label: string }[] = [
  { type: 'none', label: 'なし' },
  { type: 'yen', label: '円引き' },
  { type: 'percent', label: '%OFF' },
  { type: 'second_half', label: '2個目半額' },
  { type: 'bundle', label: 'まとめ買い' },
]

export default function DiscountControls({ item, onChange, label }: DiscountControlsProps) {
  const handleDiscountType = (type: DiscountType) => {
    onChange({ ...item, discountType: type })
  }

  const handleDiscountValue = (val: string) => {
    const num = val === '' ? '' : Number(val)
    onChange({ ...item, discountValue: num })
  }

  const handleBundleQuantity = (val: string) => {
    const num = val === '' ? '' : Number(val)
    onChange({ ...item, bundleQuantity: num })
  }

  const handleBundlePrice = (val: string) => {
    const num = val === '' ? '' : Number(val)
    onChange({ ...item, bundlePrice: num })
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-[#9b8e7c] tracking-wider uppercase">
        {label}
      </p>

      {/* Discount type buttons */}
      <div className="flex gap-1.5 flex-wrap">
        {DISCOUNT_BUTTONS.map(({ type, label: btnLabel }) => (
          <button
            key={type}
            type="button"
            onClick={() => handleDiscountType(type)}
            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
              item.discountType === type
                ? 'bg-primary text-white border-primary'
                : 'bg-[#faf8f5] text-[#5c4f3a] border-[#ede8e0]'
            }`}
          >
            {btnLabel}
          </button>
        ))}
      </div>

      {/* Additional inputs based on discount type */}
      {item.discountType === 'yen' && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={item.discountValue === '' ? '' : item.discountValue}
            onChange={(e) => handleDiscountValue(e.target.value)}
            placeholder="0"
            className="w-28 px-3 py-2.5 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-lg text-[#3d3228] text-right focus:outline-none focus:border-primary"
          />
          <span className="text-sm text-[#5c4f3a]">円引き</span>
        </div>
      )}

      {item.discountType === 'percent' && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            max="100"
            value={item.discountValue === '' ? '' : item.discountValue}
            onChange={(e) => handleDiscountValue(e.target.value)}
            placeholder="0"
            className="w-28 px-3 py-2.5 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-lg text-[#3d3228] text-right focus:outline-none focus:border-primary"
          />
          <span className="text-sm text-[#5c4f3a]">%OFF</span>
        </div>
      )}

      {item.discountType === 'bundle' && (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            inputMode="decimal"
            min="1"
            value={item.bundleQuantity === '' ? '' : item.bundleQuantity}
            onChange={(e) => handleBundleQuantity(e.target.value)}
            placeholder="2"
            className="w-20 px-3 py-2.5 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-lg text-[#3d3228] text-right focus:outline-none focus:border-primary"
          />
          <span className="text-sm text-[#5c4f3a]">個で</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={item.bundlePrice === '' ? '' : item.bundlePrice}
            onChange={(e) => handleBundlePrice(e.target.value)}
            placeholder="0"
            className="w-28 px-3 py-2.5 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-lg text-[#3d3228] text-right focus:outline-none focus:border-primary"
          />
          <span className="text-sm text-[#5c4f3a]">円</span>
        </div>
      )}
    </div>
  )
}
