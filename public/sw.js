/* global self, fetch, Request, caches */

self.addEventListener('install', event => {
  const offlineRequestHtml = new Request('index.html')

  event.waitUntil(
    fetch(offlineRequestHtml).then(response => caches.open('offline').then(cache => {
      console.log('[oninstall] Cached offline html', response.url)
      return cache.put(offlineRequestHtml, response)
    })
    )
  )

  const offlineRequestJs = new Request('script.js')

  event.waitUntil(
    fetch(offlineRequestJs).then(response => caches.open('offline').then(cache => {
      console.log('[oninstall] Cached offline js', response.url)
      return cache.put(offlineRequestJs, response)
    })
    )
  )
})

self.addEventListener('fetch', event => {
  const request = event.request

  if (request.method === 'GET') {
    event.respondWith(
        fetch(request).catch(err => {
          console.error('[onfetch] Failed. Serving cached offline fallback ' + err)
          return caches.open('offline').then(cache => cache.match((request.url.endsWith('script.js')) ? 'script.js' : 'index.html'))
        })
      )
  }
})
