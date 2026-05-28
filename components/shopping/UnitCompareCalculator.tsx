'use client'

import { useState, useEffect } from 'react'
import type { CompareItem, CompareBase, UnitType, TaxRate } from '@/types/shopping'
import { calcTaxIncluded, calcDiscountedTotal, calcUnitPrice } from '@/lib/shopping-calculator'
import DiscountControls from './DiscountControls'
import ResultCard from './ResultCard'

const LS_KEY = 'shoppingCalcUnit'

type CompareBaseOption = {
  base: CompareBase
  label: string
  unit: UnitType | null // null means piece/bottle/sheet
}

const BASE_OPTIONS: CompareBaseOption[] = [
  { base: 'per_100g', label: '100g', unit: 'g' },
  { base: 'per_1g', label: '1g', unit: 'g' },
  { base: 'per_100ml', label: '100ml', unit: 'ml' },
  { base: 'per_1ml', label: '1ml', unit: 'ml' },
  { base: 'per_piece', label: '1個', unit: 'piece' },
  { base: 'per_bottle', label: '1本', unit: 'bottle' },
  { base: 'per_sheet', label: '1枚', unit: 'sheet' },
]

const isWeightVolume = (base: CompareBase) =>
  base === 'per_1g' || base === 'per_100g' || base === 'per_1ml' || base === 'per_100ml'

function defaultItem(): CompareItem {
  return {
    price: '',
    amount: '',
    quantity: 1,
    unit: 'g',
    taxMode: 'included',
    taxRate: 10,
    discountType: 'none',
    discountValue: '',
    bundleQuantity: '',
    bundlePrice: '',
  }
}


function getUnitPriceForItem(
  item: CompareItem,
  compareBase: CompareBase
): number | null {
  const price = item.price === '' ? 0 : item.price
  const amount = item.amount === '' ? 0 : item.amount

  if (price <= 0) return null
  if (isWeightVolume(compareBase) && amount <= 0) return null

  const taxIncluded = calcTaxIncluded(price, item.taxMode, item.taxRate)
  const discountValue = item.discountValue === '' ? 0 : item.discountValue
  const bundleQuantity = item.bundleQuantity === '' ? 1 : item.bundleQuantity
  const bundlePrice = item.bundlePrice === '' ? 0 : item.bundlePrice

  const effectiveTotal = calcDiscountedTotal(
    taxIncluded,
    item.quantity,
    item.discountType,
    discountValue,
    bundleQuantity,
    bundlePrice
  )

  return calcUnitPrice(effectiveTotal, amount, item.quantity, compareBase)
}

interface ItemInputProps {
  label: string
  item: CompareItem
  onChange: (updated: CompareItem) => void
  compareBase: CompareBase
  showAmount: boolean
}

function ItemInput({ label, item, onChange, compareBase, showAmount }: ItemInputProps) {
  const TAX_RATES: TaxRate[] = [8, 10]

  return (
    <div className="bg-white rounded-2xl border border-[#ede8e0] p-4 space-y-3">
      <p className="text-sm font-bold text-[#3d3228]">{label}</p>

      {/* Price */}
      <div>
        <label className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase block mb-1">
          価格
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={item.price === '' ? '' : item.price}
            onChange={(e) =>
              onChange({ ...item, price: e.target.value === '' ? '' : Number(e.target.value) })
            }
            placeholder="0"
            className="flex-1 px-3 py-3 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-2xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
          />
          <span className="text-sm text-[#5c4f3a]">円</span>
        </div>
      </div>

      {/* Amount (only for weight/volume) */}
      {showAmount && (
        <div>
          <label className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase block mb-1">
            内容量
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={item.amount === '' ? '' : item.amount}
              onChange={(e) =>
                onChange({ ...item, amount: e.target.value === '' ? '' : Number(e.target.value) })
              }
              placeholder="0"
              className="flex-1 px-3 py-3 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-2xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
            />
            <span className="text-sm text-[#5c4f3a]">
              {compareBase.includes('ml') ? 'ml' : 'g'}
            </span>
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase block mb-1">
          購入数
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              onChange({ ...item, quantity: Math.max(1, Number(e.target.value) || 1) })
            }
            className="w-24 px-3 py-3 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-2xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
          />
          <span className="text-sm text-[#5c4f3a]">個</span>
        </div>
      </div>

      {/* Tax */}
      <div>
        <label className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase block mb-1">
          消費税
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ ...item, taxMode: 'included' })}
            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
              item.taxMode === 'included'
                ? 'bg-primary text-white border-primary'
                : 'bg-[#faf8f5] text-[#5c4f3a] border-[#ede8e0]'
            }`}
          >
            税込
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...item, taxMode: 'excluded' })}
            className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
              item.taxMode === 'excluded'
                ? 'bg-primary text-white border-primary'
                : 'bg-[#faf8f5] text-[#5c4f3a] border-[#ede8e0]'
            }`}
          >
            税抜
          </button>
          {item.taxMode === 'excluded' && (
            <div className="flex gap-1 ml-1">
              {TAX_RATES.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => onChange({ ...item, taxRate: rate })}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-colors ${
                    item.taxRate === rate
                      ? 'bg-primary text-white border-primary'
                      : 'bg-[#faf8f5] text-[#5c4f3a] border-[#ede8e0]'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Discount */}
      <DiscountControls
        item={item}
        onChange={(updated) => onChange(updated as CompareItem)}
        label="割引"
      />
    </div>
  )
}

export default function UnitCompareCalculator() {
  const [compareBase, setCompareBase] = useState<CompareBase>('per_100g')
  const [itemA, setItemA] = useState<CompareItem>(defaultItem())
  const [itemB, setItemB] = useState<CompareItem>(defaultItem())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as CompareBase
        setCompareBase(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  const handleBaseChange = (base: CompareBase) => {
    setCompareBase(base)
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(base))
    } catch {
      // ignore
    }
  }

  const showAmount = isWeightVolume(compareBase)

  const unitA = getUnitPriceForItem(itemA, compareBase)
  const unitB = getUnitPriceForItem(itemB, compareBase)

  const canShowResult = unitA !== null && unitB !== null

  if (!mounted) {
    return (
      <div className="p-4 text-center text-[#9b8e7c] text-sm">読み込み中...</div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {/* Compare base selector */}
      <div>
        <p className="text-xs font-bold text-[#9b8e7c] tracking-wider uppercase mb-2">
          比較単位
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {BASE_OPTIONS.map((opt) => (
            <button
              key={opt.base}
              type="button"
              onClick={() => handleBaseChange(opt.base)}
              className={`py-2.5 px-4 rounded-xl text-sm font-bold border whitespace-nowrap flex-shrink-0 transition-colors ${
                compareBase === opt.base
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-[#5c4f3a] border-[#ede8e0]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {canShowResult ? (
        <ResultCard unitA={unitA} unitB={unitB} compareBase={compareBase} />
      ) : (
        <div className="bg-white rounded-2xl border border-[#ede8e0] p-5 text-center">
          <p className="text-sm text-[#9b8e7c]">
            価格{showAmount ? 'と内容量' : ''}を入力してください
          </p>
        </div>
      )}

      {/* Item inputs */}
      <ItemInput
        label="商品 A"
        item={itemA}
        onChange={setItemA}
        compareBase={compareBase}
        showAmount={showAmount}
      />
      <ItemInput
        label="商品 B"
        item={itemB}
        onChange={setItemB}
        compareBase={compareBase}
        showAmount={showAmount}
      />
    </div>
  )
}
