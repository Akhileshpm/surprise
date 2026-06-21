import { useEffect, useRef } from 'react'
import { track } from '../analytics'

export function useSectionDwell(sectionRef, sectionId) {
  const enteredAt = useRef(null)

  useEffect(() => {
    const el = sectionRef?.current
    if (!el) return

    const flush = () => {
      if (!enteredAt.current) return
      const durationMs = Date.now() - enteredAt.current
      enteredAt.current = null
      if (durationMs > 500) {
        track('section_dwell', { section_id: sectionId, duration_ms: durationMs })
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
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
  }, [sectionRef, sectionId])
}
