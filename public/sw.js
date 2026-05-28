const CACHE_NAME = 'yasai-v1'

// インストール時：即座にアクティブ化
self.addEventListener('install', () => {
  self.skipWaiting()
})

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
  )
  self.clients.claim()
})

// フェッチ時：ネットワーク優先、オフライン時はキャッシュから返す
self.addEventListener('fetch', (e) => {
  // 同一オリジンのGETリクエストのみ対象
  if (e.request.method !== 'GET') return
  if (!e.request.url.startsWith(self.location.origin)) return

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // 成功したレスポンスをキャッシュに保存
        const clone = res.clone()
        caches.open(CACHE_NAME).then((c) => c.put(e.request, clone))
        return res
      })
      .catch(() =>
        // オフライン時はキャッシュから返す
        caches.match(e.request)
      )
  )
})
