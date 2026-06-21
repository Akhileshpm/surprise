import { useEffect, useRef } from 'react'
import { track } from '../analytics'

const VIEWED_SECTIONS_KEY = 'analytics_viewed_sections'

function markSectionViewed(sectionId) {
  try {
    const viewed = JSON.parse(sessionStorage.getItem(VIEWED_SECTIONS_KEY) || '[]')
    if (viewed.includes(sectionId)) return false
    viewed.push(sectionId)
    sessionStorage.setItem(VIEWED_SECTIONS_KEY, JSON.stringify(viewed))
    return true
  } catch {
    return true
  }
}

export function useSectionAnalytics(sectionRef, sectionId, sectionLabel = sectionId) {
  const enteredAt = useRef(null)

  useEffect(() => {
    const el = sectionRef?.current
    if (!el) return

    const flush = () => {
      if (!enteredAt.current) return
      const durationMs = Date.now() - enteredAt.current
      enteredAt.current = null
      if (durationMs > 500) {
        track('section_dwell', {
          section_id: sectionId,
          section_label: sectionLabel,
          duration_ms: durationMs,
        })
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (markSectionViewed(sectionId)) {
            track('section_viewed', {
              section_id: sectionId,
              section_label: sectionLabel,
            })
          }
          enteredAt.current = Date.now()
        } else if (enteredAt.current) {
          flush()
        }
      },
      { threshold: [0, 0.5] }
    )

    observer.observe(el)

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush()
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      flush()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      observer.disconnect()
    }
  }, [sectionRef, sectionId, sectionLabel])
}
