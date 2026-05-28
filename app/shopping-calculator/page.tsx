import type { Metadata } from 'next'
import ShoppingCalculator from '@/components/shopping/ShoppingCalculator'

export const metadata: Metadata = {
  title: '買い物計算機 | 野菜ガイド',
}

export default function ShoppingCalculatorPage() {
  return <ShoppingCalculator />
}
