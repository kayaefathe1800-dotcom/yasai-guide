'use client'

import { useState, useEffect } from 'react'
import type { DiscountType, TaxMode, TaxRate } from '@/types/shopping'
import { calcTaxIncluded } from '@/lib/shopping-calculator'

// ── 型 ──────────────────────────────────────────────────────────
interface Item {
  price: number | ''
  capacity: number | ''  // 容量（個数 or グラム数）
  taxMode: TaxMode
  taxRate: TaxRate
  discountType: DiscountType
  discountValue: number | ''
  bundleQuantity: number | ''
  bundlePrice: number | ''
}

function defaultItem(): Item {
  return {
    price: '',
    capacity: '',
    taxMode: 'included',
    taxRate: 10,
    discountType: 'none',
    discountValue: '',
    bundleQuantity: '',
    bundlePrice: '',
  }
}

// ── 計算：1つあたりの価格 ────────────────────────────────────────
// price = パッケージ1個の価格
// capacity = 内容量（個数 or グラム）
// → 1つあたり = 実質パッケージ価格（税込）÷ 容量
function getUnitPrice(item: Item): number | null {
  const price = item.price === '' ? 0 : Number(item.price)
  const capacity = item.capacity === '' ? 0 : Number(item.capacity)
  if (price <= 0 || capacity <= 0) return null

  const discountValue = item.discountValue === '' ? 0 : Number(item.discountValue)
  const bundleQty = item.bundleQuantity === '' ? 0 : Number(item.bundleQuantity)
  const bundlePrice = item.bundlePrice === '' ? 0 : Number(item.bundlePrice)

  let packagePrice: number
  switch (item.discountType) {
    case 'none':
      packagePrice = price
      break
    case 'yen':
      packagePrice = Math.max(0, price - discountValue)
      break
    case 'percent':
      packagePrice = price * (1 - Math.min(discountValue, 100) / 100)
      break
    case 'second_half':
      // 2個買う場合の1個あたり平均：(price + price/2) / 2 = price × 0.75
      packagePrice = price * 0.75
      break
    case 'bundle':
      packagePrice =
        bundleQty > 0 && bundlePrice > 0
          ? bundlePrice / bundleQty  // まとめ買い1個あたり価格
          : price
      break
    default:
      packagePrice = price
  }

  const taxIncluded = calcTaxIncluded(packagePrice, item.taxMode, item.taxRate)
  return taxIncluded / capacity
}

// ── 割引入力 ─────────────────────────────────────────────────────
function DiscountRow({
  item,
  onChange,
}: {
  item: Item
  onChange: (v: Item) => void
}) {
  const types: { type: DiscountType; label: string }[] = [
    { type: 'none', label: 'なし' },
    { type: 'yen', label: '円引き' },
    { type: 'percent', label: '%OFF' },
    { type: 'second_half', label: '2個目半額' },
    { type: 'bundle', label: 'まとめ買い' },
  ]

  return (
    <div className="space-y-2.5">
      <p className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase">
        割引
      </p>
      <div className="flex flex-wrap gap-1.5">
        {types.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange({ ...item, discountType: type })}
            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
              item.discountType === type
                ? 'bg-primary text-white border-primary'
                : 'bg-[#faf8f5] text-[#5c4f3a] border-[#ede8e0]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {item.discountType === 'yen' && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={item.discountValue === '' ? '' : item.discountValue}
            onChange={(e) =>
              onChange({ ...item, discountValue: e.target.value === '' ? '' : Number(e.target.value) })
            }
            placeholder="0"
            className="w-32 px-3 py-2.5 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
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
            onChange={(e) =>
              onChange({ ...item, discountValue: e.target.value === '' ? '' : Number(e.target.value) })
            }
            placeholder="0"
            className="w-32 px-3 py-2.5 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
          />
          <span className="text-sm text-[#5c4f3a]">% OFF</span>
        </div>
      )}

      {item.discountType === 'second_half' && (
        <p className="text-xs text-[#9b8e7c]">2個買う場合の1個あたり平均で比較</p>
      )}

      {item.discountType === 'bundle' && (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            inputMode="decimal"
            min="2"
            value={item.bundleQuantity === '' ? '' : item.bundleQuantity}
            onChange={(e) =>
              onChange({ ...item, bundleQuantity: e.target.value === '' ? '' : Number(e.target.value) })
            }
            placeholder="3"
            className="w-20 px-3 py-2.5 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
          />
          <span className="text-sm text-[#5c4f3a]">個で</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={item.bundlePrice === '' ? '' : item.bundlePrice}
            onChange={(e) =>
              onChange({ ...item, bundlePrice: e.target.value === '' ? '' : Number(e.target.value) })
            }
            placeholder="1000"
            className="w-28 px-3 py-2.5 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
          />
          <span className="text-sm text-[#5c4f3a]">円</span>
        </div>
      )}
    </div>
  )
}

// ── 商品入力カード ──────────────────────────────────────────────
function ItemCard({
  label,
  item,
  onChange,
}: {
  label: string
  item: Item
  onChange: (v: Item) => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#ede8e0] p-4 space-y-4">
      <p className="text-base font-bold text-[#3d3228]">{label}</p>

      {/* 価格 & 容量（2列） */}
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
          <label className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase block mb-1">
            価格
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={item.price === '' ? '' : item.price}
              onChange={(e) =>
                onChange({ ...item, price: e.target.value === '' ? '' : Number(e.target.value) })
              }
              placeholder="0"
              className="flex-1 min-w-0 px-3 py-3 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-2xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
            />
            <span className="text-sm text-[#5c4f3a] shrink-0">円</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <label className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase block mb-1">
            容量
          </label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={item.capacity === '' ? '' : item.capacity}
            onChange={(e) =>
              onChange({ ...item, capacity: e.target.value === '' ? '' : Number(e.target.value) })
            }
            placeholder="0"
            className="w-full px-3 py-3 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-2xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* 税 */}
      <div>
        <p className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase mb-1.5">消費税</p>
        <div className="flex gap-1.5 flex-wrap">
          {(['included', 'excluded'] as TaxMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onChange({ ...item, taxMode: mode })}
              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                item.taxMode === mode
                  ? 'bg-primary text-white border-primary'
                  : 'bg-[#faf8f5] text-[#5c4f3a] border-[#ede8e0]'
              }`}
            >
              {mode === 'included' ? '税込' : '税抜'}
            </button>
          ))}
          {item.taxMode === 'excluded' &&
            ([8, 10] as TaxRate[]).map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => onChange({ ...item, taxRate: rate })}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                  item.taxRate === rate
                    ? 'bg-primary text-white border-primary'
                    : 'bg-[#faf8f5] text-[#5c4f3a] border-[#ede8e0]'
                }`}
              >
                {rate}%
              </button>
            ))}
        </div>
      </div>

      <DiscountRow item={item} onChange={onChange} />
    </div>
  )
}

// ── 結果カード ──────────────────────────────────────────────────
function CompareResult({ unitA, unitB }: { unitA: number; unitB: number }) {
  const cheaper = unitA <= unitB ? 'A' : 'B'
  const winUnit = Math.min(unitA, unitB)
  const loseUnit = Math.max(unitA, unitB)
  const diff = loseUnit - winUnit
  const pct = loseUnit > 0 ? (diff / loseUnit) * 100 : 0

  const fmt = (n: number) => {
    if (n >= 100) return Math.round(n).toLocaleString()
    if (n >= 10) return n.toFixed(1)
    return n.toFixed(2)
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-primary p-5 space-y-3">
      <div className="text-center">
        <p className="text-4xl font-bold text-primary">{cheaper}がお得</p>
        <p className="text-lg text-[#5c4f3a] mt-1">
          1つあたり <span className="font-bold text-[#3d3228]">{fmt(diff)}円</span>安い
        </p>
        <p className="text-sm text-[#9b8e7c] mt-0.5">約{pct.toFixed(0)}%お得</p>
      </div>

      <div className="flex gap-3 pt-1">
        {[
          { label: 'A', unit: unitA },
          { label: 'B', unit: unitB },
        ].map(({ label, unit }) => (
          <div
            key={label}
            className={`flex-1 rounded-xl p-3 text-center border ${
              unit === winUnit
                ? 'bg-primary/10 border-primary'
                : 'bg-[#faf8f5] border-[#ede8e0]'
            }`}
          >
            <p className="text-[10px] text-[#9b8e7c] font-bold uppercase mb-0.5">商品{label}</p>
            <p className={`text-xl font-bold ${unit === winUnit ? 'text-primary' : 'text-[#5c4f3a]'}`}>
              {fmt(unit)}円
            </p>
            <p className="text-[10px] text-[#9b8e7c]">1つあたり</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── メイン ──────────────────────────────────────────────────────
export default function UnitCompareCalculator() {
  const [itemA, setItemA] = useState<Item>(defaultItem())
  const [itemB, setItemB] = useState<Item>(defaultItem())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="p-4 text-center text-[#9b8e7c] text-sm">読み込み中...</div>
  }

  const unitA = getUnitPrice(itemA)
  const unitB = getUnitPrice(itemB)
  const canShow = unitA !== null && unitB !== null

  return (
    <div className="space-y-4 p-4">
      {/* 結果 */}
      {canShow ? (
        <CompareResult unitA={unitA} unitB={unitB} />
      ) : (
        <div className="bg-white rounded-2xl border border-[#ede8e0] p-5 text-center">
          <p className="text-sm text-[#9b8e7c]">価格と容量を入力してください</p>
        </div>
      )}

      {/* 商品入力 */}
      <ItemCard label="商品 A" item={itemA} onChange={setItemA} />
      <ItemCard label="商品 B" item={itemB} onChange={setItemB} />

      <p className="text-xs text-[#9b8e7c] text-center px-2 pb-2">
        容量欄：個数・グラム・枚数など比較したい数字を入力（例：6本入り→6、400g→400）
      </p>
    </div>
  )
}
