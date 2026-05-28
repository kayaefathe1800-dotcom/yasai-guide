import type {
  TaxMode,
  TaxRate,
  DiscountType,
  CompareBase,
  CartItem,
  CartSettings,
} from '@/types/shopping'

// 税込価格を返す
export function calcTaxIncluded(
  price: number,
  taxMode: TaxMode,
  taxRate: TaxRate
): number {
  if (taxMode === 'included') return price
  return price * (1 + taxRate / 100)
}

// 割引後の実質合計価格を返す（複数個購入を考慮）
export function calcDiscountedTotal(
  price: number,
  quantity: number,
  discountType: DiscountType,
  discountValue: number,
  bundleQuantity: number,
  bundlePrice: number
): number {
  switch (discountType) {
    case 'none':
      return price * quantity
    case 'yen':
      return Math.max(0, price - discountValue) * quantity
    case 'percent':
      return price * (1 - discountValue / 100) * quantity
    case 'second_half':
      return price * quantity - price * 0.5 * Math.floor(quantity / 2)
    case 'bundle': {
      const sets = Math.floor(quantity / bundleQuantity)
      const remainder = quantity % bundleQuantity
      return sets * bundlePrice + remainder * price
    }
    default:
      return price * quantity
  }
}

// 単価を返す（compareBaseに応じて計算）
export function calcUnitPrice(
  effectiveTotal: number, // 実質合計（割引・税込み済み）
  amount: number,         // 内容量
  quantity: number,
  compareBase: CompareBase
): number {
  switch (compareBase) {
    case 'per_1g':
    case 'per_1ml':
      // effectiveTotal / quantity = 1個あたり、÷ amount = 1gあたり
      return effectiveTotal / quantity / amount
    case 'per_100g':
    case 'per_100ml':
      return (effectiveTotal / quantity / amount) * 100
    case 'per_piece':
    case 'per_bottle':
    case 'per_sheet':
      return effectiveTotal / quantity
    default:
      return effectiveTotal / quantity
  }
}

// カゴ1商品の合計金額（割引・税込み済み）を返す
export function calcItemTotal(item: CartItem): number {
  const price = item.price === '' ? 0 : item.price
  const taxIncluded = calcTaxIncluded(price, item.taxMode, item.taxRate)
  const discountValue = item.discountValue === '' ? 0 : item.discountValue
  const bundleQuantity = item.bundleQuantity === '' ? 1 : item.bundleQuantity
  const bundlePrice = item.bundlePrice === '' ? 0 : item.bundlePrice

  return calcDiscountedTotal(
    taxIncluded,
    item.quantity,
    item.discountType,
    discountValue,
    bundleQuantity,
    bundlePrice
  )
}

// カゴ全体の合計計算
export interface CartSummary {
  subtotal: number               // 割引前小計（税込）
  discountTotal: number          // 割引合計
  taxTotal: number               // 消費税合計
  paymentTotal: number           // 支払予定額（割引後・税込）
  couponDiscount: number         // 全体クーポン割引額
  pointReward: number            // ポイント還元予定（円）
  actualCost: number             // 実質負担額
  budgetRemaining: number | null // 予算まであといくら（null=予算未設定）
}

export function calcCartSummary(
  items: CartItem[],
  settings: CartSettings
): CartSummary {
  // 各商品の税込み・割引後合計
  const paymentTotal = items.reduce((sum, item) => sum + calcItemTotal(item), 0)

  // 割引前小計（税込）= 各商品の価格×数量の税込み合計
  const subtotal = items.reduce((sum, item) => {
    const price = item.price === '' ? 0 : item.price
    const taxIncluded = calcTaxIncluded(price, item.taxMode, item.taxRate)
    return sum + taxIncluded * item.quantity
  }, 0)

  const discountTotal = subtotal - paymentTotal

  // 消費税合計
  const taxTotal = items.reduce((sum, item) => {
    const price = item.price === '' ? 0 : item.price
    if (item.taxMode === 'included') return sum
    const taxAmount = price * (item.taxRate / 100)
    return sum + taxAmount * item.quantity
  }, 0)

  // クーポン
  const couponValue = settings.couponValue === '' ? 0 : settings.couponValue
  let couponDiscount = 0
  if (settings.couponType === 'yen') {
    couponDiscount = couponValue
  } else if (settings.couponType === 'percent') {
    couponDiscount = Math.floor(paymentTotal * (couponValue / 100))
  }

  const afterCoupon = Math.max(0, paymentTotal - couponDiscount)

  // ポイント
  const pointRate = settings.pointRate === '' ? 0 : settings.pointRate
  const pointReward = Math.floor(afterCoupon * (pointRate / 100))

  const actualCost = afterCoupon - pointReward

  const budget = settings.budget
  const budgetRemaining = budget !== '' ? budget - afterCoupon : null

  return {
    subtotal,
    discountTotal,
    taxTotal,
    paymentTotal,
    couponDiscount,
    pointReward,
    actualCost,
    budgetRemaining,
  }
}
