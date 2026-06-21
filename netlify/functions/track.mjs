import { getStore } from '@netlify/blobs'

const ALLOWED_EVENTS = new Set([
  'password_attempt',
  'session_started',
  'session_summary',
  'section_viewed',
  'section_dwell',
  'question_opened',
  'question_closed',
  'language_toggled',
  'scroll_hint_clicked',
])

const FORBIDDEN_PROPERTY_KEYS = new Set(['password', 'value', 'secret'])
const MAX_BATCH_SIZE = 50

function hasForbiddenProperties(properties) {
  return Object.keys(properties).some((key) =>
    FORBIDDEN_PROPERTY_KEYS.has(key.toLowerCase())
  )
}

function validateEvent({ event, properties = {} }) {
  if (!event || !ALLOWED_EVENTS.has(event)) {
    return 'Unknown event'
  }
  if (hasForbiddenProperties(properties)) {
    return 'Forbidden property'
  }
  return null
}

async function persistEvent(store, { event, properties, sessionId, ts }, ua) {
  const id = crypto.randomUUID()
  const key = `events/${Date.now()}-${id}`

  const record = {
    id,
    event,
    properties,
    sessionId: sessionId ?? null,
    ts: ts ?? new Date().toISOString(),
    ua,
  }

  await store.setJSON(key, record, {
    metadata: { event, ts: record.ts },
  })

  return id
}

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

  const ua = req.headers.get('user-agent')
  const store = getStore('analytics-events')

  if (Array.isArray(body.events)) {
    if (body.events.length === 0) {
      return new Response('Empty batch', { status: 400 })
    }
    if (body.events.length > MAX_BATCH_SIZE) {
      return new Response('Batch too large', { status: 400 })
    }

    for (const item of body.events) {
      const error = validateEvent(item)
      if (error) return new Response(error, { status: 400 })
    }

    const ids = await Promise.all(
      body.events.map((item) =>
        persistEvent(
          store,
          {
            event: item.event,
            properties: item.properties ?? {},
            sessionId: body.sessionId,
            ts: item.ts,
          },
          ua
        )
      )
    )

    return Response.json({ ok: true, count: ids.length, ids })
  }

  const error = validateEvent(body)
  if (error) return new Response(error, { status: 400 })

  const id = await persistEvent(
    store,
    {
      event: body.event,
      properties: body.properties ?? {},
      sessionId: body.sessionId,
      ts: body.ts,
    },
    ua
  )

  return Response.json({ ok: true, count: 1, ids: [id] })
}
