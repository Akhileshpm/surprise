import { getStore } from '@netlify/blobs'

const ALLOWED_EVENTS = new Set([
  'password_attempt',
  'section_dwell',
  'expand_toggled',
  'language_toggled',
  'scroll_hint_clicked',
])

const FORBIDDEN_PROPERTY_KEYS = new Set(['password', 'value', 'secret'])

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { event, properties = {}, sessionId } = body

  if (!event || !ALLOWED_EVENTS.has(event)) {
    return new Response('Unknown event', { status: 400 })
  }

  if (
    Object.keys(properties).some((key) => FORBIDDEN_PROPERTY_KEYS.has(key.toLowerCase()))
  ) {
    return new Response('Forbidden property', { status: 400 })
  }

  const store = getStore('analytics-events')
  const id = crypto.randomUUID()
  const key = `events/${Date.now()}-${id}`

  const record = {
    id,
    event,
    properties,
    sessionId: sessionId ?? null,
    ts: new Date().toISOString(),
    ua: req.headers.get('user-agent'),
  }

  await store.setJSON(key, record, {
    metadata: { event, ts: record.ts },
  })

  return Response.json({ ok: true, id })
}
