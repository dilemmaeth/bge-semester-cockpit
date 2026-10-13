/* Kept separate from Workbox's generated worker; cache/update behaviour remains intact. */
self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    let payload
    try { payload = event.data?.json() } catch { /* Show a safe visible notification even for malformed push. */ }
    const title = typeof payload?.title === 'string' ? payload.title.slice(0, 100) : 'ZH Napló'
    const body = typeof payload?.body === 'string' ? payload.body.slice(0, 240) : 'Nyisd meg az alkalmazást az időpontok megtekintéséhez.'
    await self.registration.showNotification(title, {
      body, tag: typeof payload?.id === 'string' ? payload.id.slice(0, 100) : 'zh-naplo-reminder',
      icon: new URL('pwa-192x192-v5.png', self.registration.scope).href,
      badge: new URL('pwa-192x192-v5.png', self.registration.scope).href,
      data: { url: self.registration.scope },
    })
  })())
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil((async () => {
    const tabs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const tab of tabs) {
      if (tab.url.startsWith(self.registration.scope)) { await tab.focus(); return }
    }
    await self.clients.openWindow(self.registration.scope)
  })())
})
