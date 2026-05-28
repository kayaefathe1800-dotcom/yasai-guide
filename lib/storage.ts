import { Vegetable, defaultVegetables } from './vegetables'

const STORAGE_KEY = 'yasaiGuideData'

export function loadVegetables(): Vegetable[] {
  if (typeof window === 'undefined') return defaultVegetables
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultVegetables
    const saved = JSON.parse(raw) as Partial<Vegetable>[]
    // デフォルトを基盤に保存済みデータを上書きマージ。
    // こうすることで新しいフィールドが追加されても既存ユーザーに自動反映される。
    return defaultVegetables.map((def) => {
      const override = saved.find((s) => s.id === def.id)
      return override ? { ...def, ...override } : def
    })
  } catch {
    return defaultVegetables
  }
}

export function saveVegetables(vegetables: Vegetable[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vegetables))
}

export function getVegetableById(id: string): Vegetable | undefined {
  return loadVegetables().find((v) => v.id === id)
}

export function updateVegetable(updated: Vegetable): void {
  const list = loadVegetables()
  saveVegetables(list.map((v) => (v.id === updated.id ? updated : v)))
}
