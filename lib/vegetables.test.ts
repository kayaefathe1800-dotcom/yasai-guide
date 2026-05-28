import { filterVegetables, sortVegetables, defaultVegetables, Season } from './vegetables'

describe('filterVegetables', () => {
  it('空クエリ・空seasonsで全件返す', () => {
    const result = filterVegetables(defaultVegetables, '', [])
    expect(result).toHaveLength(defaultVegetables.length)
  })

  it('クエリで部分一致フィルタリング', () => {
    const result = filterVegetables(defaultVegetables, 'トマト', [])
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('トマト')
  })

  it('クエリ「う」で複数マッチ（hiragana部分一致）', () => {
    const result = filterVegetables(defaultVegetables, 'う', [])
    expect(result.length).toBeGreaterThan(1)
    const names = result.map((v) => v.name)
    expect(names).toContain('とうもろこし')
    expect(names).toContain('きゅうり')
  })

  it('seasonsフィルターで季節一致のみ返す', () => {
    const result = filterVegetables(defaultVegetables, '', ['夏'])
    result.forEach((v) => {
      expect(v.seasons).toContain('夏')
    })
  })

  it('複数seasonsはOR条件', () => {
    const result = filterVegetables(defaultVegetables, '', ['春', '冬'])
    result.forEach((v) => {
      const hasMatch = v.seasons.some((s: Season) => ['春', '冬'].includes(s))
      expect(hasMatch).toBe(true)
    })
  })

  it('マッチなしで空配列を返す', () => {
    const result = filterVegetables(defaultVegetables, 'zzz存在しない野菜', [])
    expect(result).toHaveLength(0)
  })
})

describe('sortVegetables', () => {
  it('五十音順でソート', () => {
    const input = [
      defaultVegetables.find((v) => v.id === 'tomato')!,
      defaultVegetables.find((v) => v.id === 'asupara')!,
      defaultVegetables.find((v) => v.id === 'kyabetsu')!,
    ]
    const result = sortVegetables(input, '五十音順')
    expect(result[0].name).toBe('アスパラガス')
    expect(result[1].name).toBe('キャベツ')
    expect(result[2].name).toBe('トマト')
  })

  it('季節順でソート（春→夏→秋→冬）', () => {
    const input = [
      defaultVegetables.find((v) => v.id === 'hakusai')!,
      defaultVegetables.find((v) => v.id === 'tomato')!,
      defaultVegetables.find((v) => v.id === 'tamanegi')!,
    ]
    const result = sortVegetables(input, '季節順')
    expect(result[0].id).toBe('tamanegi')
    expect(result[1].id).toBe('tomato')
    expect(result[2].id).toBe('hakusai')
  })

  it('元の配列を破壊しない', () => {
    const input = [...defaultVegetables]
    sortVegetables(input, '五十音順')
    expect(input[0].id).toBe(defaultVegetables[0].id)
  })
})
