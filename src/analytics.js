const SESSION_KEY = 'analytics_session_id'
const FLUSH_MS = 5000
const MAX_BATCH = 15

const queue = []
let flushTimer = null
let listenersBound = false

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function sendPayload(payload, useBeacon = false) {
  if (useBeacon && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' })
    navigator.sendBeacon('/api/track', blob)
    return
  }

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {})
}

function flush(useBeacon = false) {
  if (queue.length === 0) return

  const events = queue.splice(0, MAX_BATCH)
  const payload = JSON.stringify({
    events,
    sessionId: getSessionId(),
  })

  sendPayload(payload, useBeacon)

  if (queue.length > 0) {
    flush(useBeacon)
  }
}

function scheduleFlush() {
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    flush()
  }, FLUSH_MS)
}

function bindUnloadFlush() {
  if (listenersBound) return
  listenersBound = true

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true)
  })

  window.addEventListener('pagehide', () => flush(true))
}

export function track(event, properties = {}, options = {}) {
  if (import.meta.env.DEV) return

  bindUnloadFlush()

  queue.push({
    event,
    properties,
    ts: new Date().toISOString(),
  })

  if (queue.length >= MAX_BATCH || options.immediate) {
    if (flushTimer) {
      clearTimeout(flushTimer)
      flushTimer = null
    }
    flush()
    return
  }

  scheduleFlush()
}
