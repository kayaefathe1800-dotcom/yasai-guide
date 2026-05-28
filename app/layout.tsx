import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'YASAI GUIDE — スーパー野菜選びの手引き',
  description: 'スーパーマーケットで新鮮な野菜を選ぶための見分け方チェックガイド',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '野菜ガイド',
  },
}

export const viewport: Viewport = {
  themeColor: '#8b7355',
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
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  )
}
