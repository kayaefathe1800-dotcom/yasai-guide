'use client'

import type { CompareBase } from '@/types/shopping'

interface ResultCardProps {
  unitA: number
  unitB: number
  compareBase: CompareBase
}

const COMPARE_LABEL: Record<CompareBase, string> = {
  per_1g: '1gあたり',
  per_100g: '100gあたり',
  per_1ml: '1mlあたり',
  per_100ml: '100mlあたり',
  per_piece: '1個あたり',
  per_bottle: '1本あたり',
  per_sheet: '1枚あたり',
}

function fmt(n: number): string {
  if (n < 1) {
    return n.toFixed(2)
  }
  return Math.round(n).toLocaleString()
}

export default function ResultCard({ unitA, unitB, compareBase }: ResultCardProps) {
  const label = COMPARE_LABEL[compareBase]

  const diff = Math.abs(unitA - unitB)
  const percentDiff =
    Math.max(unitA, unitB) > 0
      ? Math.round((diff / Math.max(unitA, unitB)) * 100)
      : 0

  if (unitA === unitB) {
    return (
      <div className="bg-white rounded-2xl border border-[#ede8e0] p-5">
        <p className="text-xl font-bold text-[#3d3228] text-center">同じ価格です</p>
        <p className="text-sm text-[#9b8e7c] text-center mt-1">
          {label} {fmt(unitA)}円（A・B同額）
        </p>
      </div>
    )
  }

  const cheaper = unitA < unitB ? 'A' : 'B'
  const cheaperUnit = unitA < unitB ? unitA : unitB
  const expensiveUnit = unitA < unitB ? unitB : unitA

  return (
    <div className="bg-white rounded-2xl border border-[#ede8e0] p-5 space-y-3">
      <div className="text-center">
        <p className="text-3xl font-bold text-primary">
          {cheaper}がお得
        </p>
        <p className="text-sm text-[#5c4f3a] mt-1">
          {label} <span className="font-bold">{fmt(diff)}円</span>安い
        </p>
        <p className="text-sm text-[#5c4f3a]">
          約<span className="font-bold">{percentDiff}%</span>お得
        </p>
      </div>

      <div className="border-t border-[#ede8e0] pt-3 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-[#9b8e7c]">A: {label}</span>
          <span className={`font-bold ${unitA < unitB ? 'text-primary' : 'text-[#3d3228]'}`}>
            {fmt(unitA)}円
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#9b8e7c]">B: {label}</span>
          <span className={`font-bold ${unitB < unitA ? 'text-primary' : 'text-[#3d3228]'}`}>
            {fmt(unitB)}円
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1 pt-1 border-t border-[#ede8e0]">
          <span className="text-[#9b8e7c]">差額</span>
          <span className="font-bold text-[#3d3228]">
            {fmt(expensiveUnit - cheaperUnit)}円/
            {label.replace('あたり', '')}
          </span>
        </div>
      </div>
    </div>
  )
}
