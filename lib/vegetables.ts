export type Season = '春' | '夏' | '秋' | '冬'
export type SortOrder = '五十音順' | '季節順'

export interface Vegetable {
  id: string
  name: string
  emoji: string
  seasons: Season[]
  seasonText: string
  imageUrl: string
  points: string[]
}

export const defaultVegetables: Vegetable[] = [
  {
    id: 'kyabetsu',
    name: 'キャベツ',
    emoji: '🥬',
    seasons: ['春', '冬'],
    seasonText: '春（3月〜5月）/ 冬（11月〜2月）',
    imageUrl: '',
    points: [
      '葉に艶があり、濃い緑色',
      '持ったときずっしり重い',
      '外側の葉に傷や黒い斑点がない',
      '芯が湿っている',
    ],
  },
  {
    id: 'retasu',
    name: 'レタス',
    emoji: '🥬',
    seasons: ['春', '秋'],
    seasonText: '春（4月〜6月）/ 秋（9月〜11月）',
    imageUrl: '',
    points: [
      '葉が濃い緑色でハリと艶がある',
      '根元が白くみずみずしい',
      '黒い斑点がない',
      '軽く握って弾力があるもの',
    ],
  },
  {
    id: 'tamanegi',
    name: '玉ねぎ',
    emoji: '🧅',
    seasons: ['春'],
    seasonText: '春（3月〜5月）',
    imageUrl: '',
    points: [
      '表皮が茶褐色でしっかり乾燥している',
      '首の部分が細く乾いている',
      '球が丸くて硬い',
      '傷や腐れがない',
    ],
  },
  {
    id: 'jagaimo',
    name: 'じゃがいも',
    emoji: '🥔',
    seasons: ['春', '秋'],
    seasonText: '春（4月〜7月）/ 秋（10月〜11月）',
    imageUrl: '',
    points: [
      '皮がなめらかで傷や緑色の部分がない',
      '芽が出ていない',
      '硬くてずっしり重い',
      '形がきれいで均一なもの',
    ],
  },
  {
    id: 'asupara',
    name: 'アスパラガス',
    emoji: '🌿',
    seasons: ['春'],
    seasonText: '春（4月〜6月）',
    imageUrl: '',
    points: [
      '穂先がしっかり閉じてツヤがある',
      '茎が太くて切り口が瑞々しい',
      '鱗片が締まっていてバラバラでない',
      '全体にハリがある',
    ],
  },
  {
    id: 'soramame',
    name: 'そら豆',
    emoji: '🫘',
    seasons: ['春'],
    seasonText: '春（4月〜6月）',
    imageUrl: '',
    points: [
      '鞘が濃い緑色でずっしり重い',
      '鞘にハリがある',
      '豆の黒い筋が薄い（新鮮な証）',
      '豆がぷっくり膨らんでいる',
    ],
  },
  {
    id: 'snapendo',
    name: 'スナップえんどう',
    emoji: '🫛',
    seasons: ['春'],
    seasonText: '春（3月〜6月）',
    imageUrl: '',
    points: [
      '鞘がふっくらとしてハリがある',
      '明るい緑色でみずみずしい',
      '豆が中でぎっしり詰まっている感触',
      '切り口が新鮮でみずみずしい',
    ],
  },
  {
    id: 'tomato',
    name: 'トマト',
    emoji: '🍅',
    seasons: ['夏'],
    seasonText: '夏（6月〜8月）',
    imageUrl: '',
    points: [
      '全体が濃い赤色に均等に染まっている',
      '持ったときずっしり重い',
      'つるが青々としている',
      '底部分がやや凹んでいる（完熟の証）',
    ],
  },
  {
    id: 'kyuuri',
    name: 'きゅうり',
    emoji: '🥒',
    seasons: ['夏'],
    seasonText: '夏（6月〜8月）',
    imageUrl: '',
    points: [
      '全体が濃い緑色で艶がある',
      'イボイボがはっきり立っている',
      '真っすぐで、曲がっていない',
      '握ったときポキッと折れる弾力',
    ],
  },
  {
    id: 'nasu',
    name: 'ナス',
    emoji: '🍆',
    seasons: ['夏'],
    seasonText: '夏（6月〜9月）',
    imageUrl: '',
    points: [
      '濃い紫黒色で艶がある',
      '持ったときずっしり重い',
      'ヘタの部分が新鮮な緑色',
      '皮が傷んでいない',
    ],
  },
  {
    id: 'piiman',
    name: 'ピーマン',
    emoji: '🫑',
    seasons: ['夏'],
    seasonText: '夏（6月〜9月）',
    imageUrl: '',
    points: [
      '深い緑色で艶がある',
      '皮にハリがありツヤツヤしている',
      'ヘタがみずみずしい緑色',
      '肉厚で硬いもの',
    ],
  },
  {
    id: 'papurika',
    name: 'パプリカ',
    emoji: '🫑',
    seasons: ['夏'],
    seasonText: '夏（7月〜9月）',
    imageUrl: '',
    points: [
      '色が鮮やかで均等に染まっている',
      '皮に艶があり、ハリがある',
      '4つの角がしっかり出ている',
      '肉厚で硬いもの',
    ],
  },
  {
    id: 'tomorokoshi',
    name: 'とうもろこし',
    emoji: '🌽',
    seasons: ['夏'],
    seasonText: '夏（6月〜8月）',
    imageUrl: '',
    points: [
      'ヒゲが濃い茶色（多いほど完熟）',
      '皮の緑色が鮮やか',
      '粒が先まで均等に詰まっている',
      '持ったときずっしり重い',
    ],
  },
  {
    id: 'okura',
    name: 'オクラ',
    emoji: '🌿',
    seasons: ['夏'],
    seasonText: '夏（6月〜9月）',
    imageUrl: '',
    points: [
      '鮮やかな緑色でツヤがある',
      '5〜8cmの小ぶりなサイズ（大きすぎると筋張る）',
      '産毛がしっかり立っている',
      '切り口が乾いていない',
    ],
  },
  {
    id: 'goya',
    name: 'ゴーヤ',
    emoji: '🥒',
    seasons: ['夏'],
    seasonText: '夏（6月〜9月）',
    imageUrl: '',
    points: [
      '表面のイボが大きくて均等',
      '鮮やかな緑色',
      'ずっしり重くてハリがある',
      '切り口が乾いていない',
    ],
  },
  {
    id: 'kabocha',
    name: 'かぼちゃ',
    emoji: '🎃',
    seasons: ['夏', '秋'],
    seasonText: '夏〜秋（7月〜10月）',
    imageUrl: '',
    points: [
      '皮が硬くて傷がない',
      'コルク状のへたが乾いている',
      'ずっしり重い',
      'カット品は果肉が鮮やかなオレンジ色',
    ],
  },
  {
    id: 'edamame',
    name: '枝豆',
    emoji: '🫘',
    seasons: ['夏'],
    seasonText: '夏（6月〜9月）',
    imageUrl: '',
    points: [
      '鞘が鮮やかな緑色',
      '豆が3粒入った鞘が多い',
      '産毛がしっかり残っている',
      '豆がぷっくり膨らんでいる',
    ],
  },
  {
    id: 'burokkorii',
    name: 'ブロッコリー',
    emoji: '🥦',
    seasons: ['秋', '冬'],
    seasonText: '秋〜冬（10月〜12月）',
    imageUrl: '',
    points: [
      'つぼみが濃い緑色で、粒がぎっしり詰まっている',
      'つぼみに黄色い花が咲いていない',
      '茎がみずみずしく、断面が白い',
      '握ったときポキッと折れる弾力',
    ],
  },
  {
    id: 'ninjin',
    name: 'ニンジン',
    emoji: '🥕',
    seasons: ['秋', '冬'],
    seasonText: '秋〜冬（10月〜2月）',
    imageUrl: '',
    points: [
      '濃いオレンジ色で艶がある',
      '表面がなめらかで傷がない',
      '細いひび割れがない',
      '曲がっていないまっすぐなもの',
    ],
  },
  {
    id: 'daikon',
    name: 'ダイコン',
    emoji: '🥬',
    seasons: ['秋', '冬'],
    seasonText: '秋〜冬（10月〜2月）',
    imageUrl: '',
    points: [
      '白く艶があり、キズがない',
      '持ったときずっしり重い',
      '根の部分が白く、毛根が細い',
      '肩の部分がしっかり張っている',
    ],
  },
  {
    id: 'satsumaimo',
    name: 'さつまいも',
    emoji: '🍠',
    seasons: ['秋', '冬'],
    seasonText: '秋〜冬（9月〜1月）',
    imageUrl: '',
    points: [
      '皮に傷やしわがなく均一な色',
      '首が細く、全体がずんぐりとした形',
      '表面が乾燥していてツヤがある',
      '切り口（両端）が変色していない',
    ],
  },
  {
    id: 'satoimo',
    name: '里芋',
    emoji: '🥔',
    seasons: ['秋', '冬'],
    seasonText: '秋〜冬（9月〜1月）',
    imageUrl: '',
    points: [
      '泥がついていて、乾燥している',
      '丸みがあってハリがある',
      '皮に傷や黒い斑点がない',
      '重くてずっしりしたもの',
    ],
  },
  {
    id: 'gobou',
    name: 'ごぼう',
    emoji: '🌿',
    seasons: ['秋', '冬'],
    seasonText: '秋〜冬（10月〜3月）',
    imageUrl: '',
    points: [
      '細くて均一な太さ（太すぎると空洞ができやすい）',
      '表面が乾いていてひび割れがない',
      '曲がっていないまっすぐなもの',
      '切り口が瑞々しい',
    ],
  },
  {
    id: 'naganegi',
    name: '長ねぎ',
    emoji: '🌿',
    seasons: ['秋', '冬', '春'],
    seasonText: '秋〜春（10月〜4月）',
    imageUrl: '',
    points: [
      '白い部分が長くてハリがある',
      '白と緑の境目がくっきりしている',
      '根元が乾いていない',
      '太くてずっしりしたもの',
    ],
  },
  {
    id: 'hakusai',
    name: '白菜',
    emoji: '🥬',
    seasons: ['冬'],
    seasonText: '冬（11月〜2月）',
    imageUrl: '',
    points: [
      'ずっしり重くてしっかり巻いている',
      '葉の緑色が濃い',
      'カット品は断面の葉が詰まっている',
      '外葉に傷や変色がない',
    ],
  },
  {
    id: 'komatsuna',
    name: '小松菜',
    emoji: '🌿',
    seasons: ['冬'],
    seasonText: '冬（11月〜3月）',
    imageUrl: '',
    points: [
      '葉が濃い緑色でハリがある',
      '茎が太くてしっかりしている',
      'しなびていない',
      '切り口が瑞々しい',
    ],
  },
  {
    id: 'horenso',
    name: 'ほうれん草',
    emoji: '🌿',
    seasons: ['冬'],
    seasonText: '冬（11月〜3月）',
    imageUrl: '',
    points: [
      '根元が赤みがかっている（甘くておいしい証）',
      '葉が濃い緑色でハリがある',
      'しなびていない',
      '茎が太くて短いもの',
    ],
  },
]

function toKatakana(str: string): string {
  return str.replace(/[ぁ-ゖ]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0x60)
  )
}

export function filterVegetables(
  vegetables: Vegetable[],
  query: string,
  seasons: Season[]
): Vegetable[] {
  return vegetables.filter((v) => {
    const matchesQuery =
      query === '' || toKatakana(v.name).includes(toKatakana(query))
    const matchesSeason =
      seasons.length === 0 || v.seasons.some((s) => seasons.includes(s))
    return matchesQuery && matchesSeason
  })
}

export function sortVegetables(
  vegetables: Vegetable[],
  order: SortOrder
): Vegetable[] {
  const sorted = [...vegetables]
  if (order === '五十音順') {
    sorted.sort((a, b) => a.name.localeCompare(b.name, 'ja'))
  } else {
    const seasonOrder: Record<Season, number> = {
      春: 0,
      夏: 1,
      秋: 2,
      冬: 3,
    }
    sorted.sort((a, b) => {
      const aMin = Math.min(...a.seasons.map((s) => seasonOrder[s]))
      const bMin = Math.min(...b.seasons.map((s) => seasonOrder[s]))
      return aMin - bMin || a.name.localeCompare(b.name, 'ja')
    })
  }
  return sorted
}
