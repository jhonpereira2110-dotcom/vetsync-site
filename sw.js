const CACHE = 'vetsync-v3'
const FILES = ['/app.html', '/manifest.json']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ))
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  // Sempre busca versao nova da rede, usa cache como fallback
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const clone = r.clone()
        caches.open(CACHE).then(c => c.put(e.request, clone))
        return r
      })
      .catch(() => caches.match(e.request))
  )
})
