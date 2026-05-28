export type UnitType = 'g' | 'ml' | 'piece' | 'bottle' | 'sheet'

export type CompareBase =
  | 'per_1g'
  | 'per_100g'
  | 'per_1ml'
  | 'per_100ml'
  | 'per_piece'
  | 'per_bottle'
  | 'per_sheet'

export type DiscountType =
  | 'none'
  | 'yen'
  | 'percent'
  | 'second_half'
  | 'bundle'

export type TaxMode = 'included' | 'excluded'
export type TaxRate = 8 | 10

export interface CompareItem {
  price: number | ''
  amount: number | ''       // 内容量
  quantity: number
  unit: UnitType
  taxMode: TaxMode
  taxRate: TaxRate
  discountType: DiscountType
  discountValue: number | ''  // 円引き額 or %OFF値
  bundleQuantity: number | '' // まとめ買い：何個で
  bundlePrice: number | ''    // まとめ買い：いくら
}

export interface CartItem {
  id: string
  price: number | ''
  quantity: number
  taxMode: TaxMode
  taxRate: TaxRate
  discountType: DiscountType
  discountValue: number | ''
  bundleQuantity: number | ''
  bundlePrice: number | ''
}

export interface CartSettings {
  budget: number | ''
  couponType: 'none' | 'yen' | 'percent'
  couponValue: number | ''
  pointRate: number | ''  // ポイント還元率（%）
}
