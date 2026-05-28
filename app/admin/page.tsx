'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Vegetable } from '@/lib/vegetables'
import { loadVegetables, saveVegetables } from '@/lib/storage'

// NEXT_PUBLIC_ makes this visible in the client bundle — intentional for a
// localStorage-only app with no server. This is a UI-layer deterrent only.
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'yasai123'

export default function AdminPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [vegetables, setVegetables] = useState<Vegetable[]>([])

  useEffect(() => {
    if (authed) setVegetables(loadVegetables())
  }, [authed])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      alert('パスワードが違います')
    }
  }

  const updateImageUrl = (id: string, imageUrl: string) => {
    setVegetables((prev) => {
      const next = prev.map((v) => (v.id === id ? { ...v, imageUrl } : v))
      saveVegetables(next)
      return next
    })
  }

  const updatePoint = (id: string, idx: number, text: string) => {
    setVegetables((prev) => {
      const next = prev.map((v) => {
        if (v.id !== id) return v
        const points = [...v.points]
        points[idx] = text
        return { ...v, points }
      })
      saveVegetables(next)
      return next
    })
  }

  if (!authed) {
    return (
      <div className="max-w-lg mx-auto min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-xs bg-white rounded-2xl p-6 border border-[#ede8e0]">
          <h1 className="text-base font-bold text-[#3d3228] text-center mb-4">
            管理モード
          </h1>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              aria-label="パスワード"
              className="w-full px-3 py-2.5 bg-[#faf8f5] border border-[#ede8e0] rounded-xl text-sm text-[#5c4f3a] placeholder:text-[#9b8e7c] focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-bold"
            >
              ログイン
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full py-2.5 bg-transparent border border-[#ede8e0] rounded-xl text-sm text-[#5c4f3a]"
            >
              キャンセル
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen">
      <header className="bg-white border-b border-[#ede8e0] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-sm font-bold text-[#3d3228]">野菜データ管理</h1>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-xs text-[#9b8e7c] border border-[#ede8e0] rounded-lg px-3 py-1"
        >
          終了
        </button>
      </header>

      <div className="p-4 space-y-4">
        {vegetables.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-xl border border-[#ede8e0] p-4"
          >
            <h3 className="text-sm font-bold text-[#3d3228] mb-3">
              {v.emoji} {v.name}
            </h3>

            <div className="mb-3">
              <label className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase block mb-1.5">
                画像URL
              </label>
              <input
                type="text"
                value={v.imageUrl ?? ''}
                onChange={(e) => updateImageUrl(v.id, e.target.value)}
                placeholder="https://drive.google.com/uc?export=view&id=..."
                className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ede8e0] rounded-lg text-xs text-[#5c4f3a] placeholder:text-[#9b8e7c] focus:outline-none focus:border-primary"
              />
              {v.imageUrl && (
                <img
                  src={v.imageUrl}
                  alt={v.name}
                  className="mt-2 w-16 h-16 object-cover rounded-lg border border-[#ede8e0]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
            </div>

            <div>
              <label className="text-[10px] text-[#9b8e7c] font-bold tracking-wider uppercase block mb-1.5">
                見分け方
              </label>
              <div className="space-y-2">
                {v.points.map((point, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={point}
                    onChange={(e) => updatePoint(v.id, idx, e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf8f5] border border-[#ede8e0] rounded-lg text-xs text-[#5c4f3a] focus:outline-none focus:border-primary"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
