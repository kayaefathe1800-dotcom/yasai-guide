'use client'

import { useState, useEffect } from 'react'
import type { CartItem, CartSettings, TaxRate } from '@/types/shopping'
import { calcCartSummary, calcItemTotal } from '@/lib/shopping-calculator'
import DiscountControls from './DiscountControls'

const LS_CART_KEY = 'shoppingCart'
const LS_SETTINGS_KEY = 'shoppingCartSettings'

function defaultCartItem(): Omit<CartItem, 'id'> {
  return {
    price: '',
    quantity: 1,
    taxMode: 'included',
    taxRate: 10,
    discountType: 'none',
    discountValue: '',
    bundleQuantity: '',
    bundlePrice: '',
  }
}

function defaultSettings(): CartSettings {
  return {
    budget: '',
    couponType: 'none',
    couponValue: '',
    pointRate: '',
  }
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString()
}

const TAX_RATES: TaxRate[] = [8, 10]

export default function CartTotalCalculator() {
  const [items, setItems] = useState<CartItem[]>([])
  const [settings, setSettings] = useState<CartSettings>(defaultSettings())
  const [newItem, setNewItem] = useState<Omit<CartItem, 'id'>>(defaultCartItem())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const savedCart = localStorage.getItem(LS_CART_KEY)
      if (savedCart) setItems(JSON.parse(savedCart) as CartItem[])
      const savedSettings = localStorage.getItem(LS_SETTINGS_KEY)
      if (savedSettings) setSettings(JSON.parse(savedSettings) as CartSettings)
    } catch {
      // ignore
    }
  }, [])

  const persistItems = (newItems: CartItem[]) => {
    setItems(newItems)
    try {
      localStorage.setItem(LS_CART_KEY, JSON.stringify(newItems))
    } catch {
      // ignore
    }
  }

  const persistSettings = (newSettings: CartSettings) => {
    setSettings(newSettings)
    try {
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(newSettings))
    } catch {
      // ignore
    }
  }

  const handleAddItem = () => {
    const item: CartItem = { ...newItem, id: Date.now().toString() }
    persistItems([...items, item])
    setNewItem(defaultCartItem())
  }

  const handleDeleteItem = (id: string) => {
    persistItems(items.filter((i) => i.id !== id))
  }

  const handleClearAll = () => {
    persistItems([])
  }

  const summary = calcCartSummary(items, settings)

  if (!mounted) {
    return (
      <div className="p-4 text-center text-[#9b8e7c] text-sm">読み込み中...</div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {/* Summary card (always visible at top) */}
      <div className="bg-white rounded-2xl border border-[#ede8e0] p-5 space-y-3">
        <p className="text-xs font-bold text-[#9b8e7c] tracking-wider uppercase">合計</p>

        <div className="text-center">
          <p className="text-3xl font-bold text-[#3d3228]">
            ¥{fmt(summary.paymentTotal)}
          </p>
          <p className="text-xs text-[#9b8e7c] mt-0.5">支払予定額（割引・税込）</p>
        </div>

        {(summary.discountTotal > 0 ||
          summary.couponDiscount > 0 ||
          summary.pointReward > 0) && (
          <div className="border-t border-[#ede8e0] pt-3 space-y-1.5">
            {summary.discountTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#9b8e7c]">商品割引</span>
                <span className="font-bold text-primary">-¥{fmt(summary.discountTotal)}</span>
              </div>
            )}
            {summary.couponDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#9b8e7c]">クーポン割引</span>
                <span className="font-bold text-primary">-¥{fmt(summary.couponDiscount)}</span>
              </div>
            )}
            {summary.pointReward > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#9b8e7c]">ポイント還元</span>
                <span className="font-bold text-primary">+¥{fmt(summary.pointReward)}相当</span>
              </div>
            )}
            <div className="border-t border-[#ede8e0] pt-1.5 flex justify-between text-sm">
              <span className="text-[#5c4f3a] font-bold">実質負担額</span>
              <span className="font-bold text-[#3d3228]">¥{fmt(summary.actualCost)}</span>
            </div>
          </div>
        )}

        {summary.budgetRemaining !== null && (
          <div
            className={`rounded-xl p-3 text-center text-sm font-bold ${
              summary.budgetRemaining >= 0
                ? 'bg-[#f0fdf4] text-green-700'
                : 'bg-[#fef2f2] text-red-600'
            }`}
          >
            {summary.budgetRemaining >= 0
              ? `予算まであと ¥${fmt(summary.budgetRemaining)}`
              : `予算オーバー ¥${fmt(Math.abs(summary.budgetRemaining))}`}
          </div>
        )}
      </div>

      {/* Add new item form */}
      <div className="bg-white rounded-2xl border border-[#ede8e0] p-4 space-y-3">
        <p className="text-sm font-bold text-[#3d3228]">商品を追加</p>

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
              value={newItem.price === '' ? '' : newItem.price}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  price: e.target.value === '' ? '' : Number(e.target.value),
                })
              }
              placeholder="0"
              className="flex-1 px-3 py-3 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-2xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
            />
            <span className="text-sm text-[#5c4f3a]">円</span>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase block mb-1">
            数量
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min="1"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  quantity: Math.max(1, Number(e.target.value) || 1),
                })
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
              onClick={() => setNewItem({ ...newItem, taxMode: 'included' })}
              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                newItem.taxMode === 'included'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-[#faf8f5] text-[#5c4f3a] border-[#ede8e0]'
              }`}
            >
              税込
            </button>
            <button
              type="button"
              onClick={() => setNewItem({ ...newItem, taxMode: 'excluded' })}
              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                newItem.taxMode === 'excluded'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-[#faf8f5] text-[#5c4f3a] border-[#ede8e0]'
              }`}
            >
              税抜
            </button>
            {newItem.taxMode === 'excluded' && (
              <div className="flex gap-1 ml-1">
                {TAX_RATES.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setNewItem({ ...newItem, taxRate: rate })}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-colors ${
                      newItem.taxRate === rate
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
          item={{ ...newItem, id: '__new__' }}
          onChange={(updated) => {
            const { id: _id, ...rest } = updated as CartItem
            setNewItem(rest)
          }}
          label="割引"
        />

        <button
          type="button"
          onClick={handleAddItem}
          disabled={newItem.price === '' || newItem.price <= 0}
          className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-40 transition-opacity"
        >
          カゴに追加
        </button>
      </div>

      {/* Cart items list */}
      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#9b8e7c] tracking-wider uppercase">
              カゴの中身（{items.length}点）
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-[#9b8e7c] border border-[#ede8e0] rounded-lg px-3 py-1.5"
            >
              全削除
            </button>
          </div>

          {items.map((item, idx) => {
            const total = calcItemTotal(item)
            const price = item.price === '' ? 0 : item.price
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#ede8e0] p-3 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#3d3228]">商品{idx + 1}</p>
                  <p className="text-xs text-[#9b8e7c] mt-0.5">
                    ¥{price.toLocaleString()} × {item.quantity}個
                    {item.taxMode === 'excluded' ? `（税抜${item.taxRate}%）` : '（税込）'}
                    {item.discountType !== 'none' && (
                      <span className="text-primary ml-1">割引あり</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-2">
                  <span className="text-sm font-bold text-[#3d3228]">¥{fmt(total)}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-[#9b8e7c] text-lg leading-none"
                    aria-label="削除"
                  >
                    ×
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-[#ede8e0] p-4 space-y-4">
        <p className="text-sm font-bold text-[#3d3228]">設定</p>

        {/* Budget */}
        <div>
          <label className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase block mb-1">
            予算
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={settings.budget === '' ? '' : settings.budget}
              onChange={(e) =>
                persistSettings({
                  ...settings,
                  budget: e.target.value === '' ? '' : Number(e.target.value),
                })
              }
              placeholder="0"
              className="flex-1 px-3 py-3 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-2xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
            />
            <span className="text-sm text-[#5c4f3a]">円</span>
          </div>
        </div>

        {/* Coupon */}
        <div>
          <label className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase block mb-1">
            全体クーポン
          </label>
          <div className="flex gap-2 mb-2">
            {(['none', 'yen', 'percent'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => persistSettings({ ...settings, couponType: type })}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                  settings.couponType === type
                    ? 'bg-primary text-white border-primary'
                    : 'bg-[#faf8f5] text-[#5c4f3a] border-[#ede8e0]'
                }`}
              >
                {type === 'none' ? 'なし' : type === 'yen' ? '円引き' : '%OFF'}
              </button>
            ))}
          </div>
          {settings.couponType !== 'none' && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={settings.couponValue === '' ? '' : settings.couponValue}
                onChange={(e) =>
                  persistSettings({
                    ...settings,
                    couponValue: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                placeholder="0"
                className="w-32 px-3 py-2.5 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
              />
              <span className="text-sm text-[#5c4f3a]">
                {settings.couponType === 'yen' ? '円引き' : '%OFF'}
              </span>
            </div>
          )}
        </div>

        {/* Point rate */}
        <div>
          <label className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase block mb-1">
            ポイント還元率
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              value={settings.pointRate === '' ? '' : settings.pointRate}
              onChange={(e) =>
                persistSettings({
                  ...settings,
                  pointRate: e.target.value === '' ? '' : Number(e.target.value),
                })
              }
              placeholder="0"
              className="w-28 px-3 py-2.5 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-xl text-[#3d3228] text-right focus:outline-none focus:border-primary"
            />
            <span className="text-sm text-[#5c4f3a]">%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
