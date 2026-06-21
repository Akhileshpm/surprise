import { getStore } from '@netlify/blobs'

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  const secret = process.env.ANALYTICS_SECRET
  if (!secret) {
    return new Response('Analytics not configured', { status: 503 })
  }

  const url = new URL(req.url)
  if (url.searchParams.get('secret') !== secret) {
    return new Response('Unauthorized', { status: 401 })
  }

  const store = getStore('analytics-events')
  const { blobs } = await store.list({ prefix: 'events/' })

  const recent = blobs.sort((a, b) => b.key.localeCompare(a.key)).slice(0, 200)

  const events = await Promise.all(
    recent.map(({ key }) => store.get(key, { type: 'json' }))
  )

  return Response.json({ count: events.length, events })
}
