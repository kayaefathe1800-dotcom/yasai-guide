'use client'

import { useState, useEffect } from 'react'
import UnitCompareCalculator from './UnitCompareCalculator'
import CartTotalCalculator from './CartTotalCalculator'

const LS_TAB_KEY = 'shoppingCalcTab'

type Tab = 'compare' | 'cart'

export default function ShoppingCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>('compare')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem(LS_TAB_KEY) as Tab | null
      if (saved === 'compare' || saved === 'cart') {
        setActiveTab(saved)
      }
    } catch {
      // ignore
    }
  }, [])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    try {
      localStorage.setItem(LS_TAB_KEY, tab)
    } catch {
      // ignore
    }
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-[#ede8e0] px-4 py-3 sticky top-0 z-10">
        <h1 className="text-base font-bold text-[#3d3228] text-center">
          買い物お得即決計算機
        </h1>
      </header>

      {/* Tab switcher */}
      <div className="bg-white border-b border-[#ede8e0] px-4 pb-0 sticky top-[52px] z-10">
        <div className="flex">
          <button
            type="button"
            onClick={() => handleTabChange('compare')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'compare'
                ? 'border-primary text-primary'
                : 'border-transparent text-[#9b8e7c]'
            }`}
          >
            どっちがお得？
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('cart')}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'cart'
                ? 'border-primary text-primary'
                : 'border-transparent text-[#9b8e7c]'
            }`}
          >
            レジ前合計
          </button>
        </div>
      </div>

      {/* Tab content */}
      {mounted && (
        <>
          {activeTab === 'compare' && <UnitCompareCalculator />}
          {activeTab === 'cart' && <CartTotalCalculator />}
        </>
      )}
    </div>
  )
}
