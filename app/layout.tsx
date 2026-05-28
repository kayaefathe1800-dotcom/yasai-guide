import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'YASAI GUIDE — スーパー野菜選びの手引き',
  description: 'スーパーマーケットで新鮮な野菜を選ぶための見分け方チェックガイド',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.className} min-h-screen`}
        style={{ backgroundColor: '#faf8f5' }}
      >
        {children}
      </body>
    </html>
  )
}
