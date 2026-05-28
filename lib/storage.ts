import { Vegetable, defaultVegetables } from './vegetables'

const STORAGE_KEY = 'yasaiGuideData'

export function loadVegetables(): Vegetable[] {
  if (typeof window === 'undefined') return defaultVegetables
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultVegetables
    return JSON.parse(raw) as Vegetable[]
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
