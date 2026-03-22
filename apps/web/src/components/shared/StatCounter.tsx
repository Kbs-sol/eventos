import { useEffect, useRef, useState } from 'react'

interface StatCounterProps {
  value: number
  suffix?: string
  duration?: number
}

export default function StatCounter({ value, suffix = '', duration = 2000 }: StatCounterProps) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const start = performance.now()

          function tick(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.round(eased * value))
            if (progress < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <div ref={ref} className="flex items-baseline justify-center gap-1">
      <span
        className="text-4xl sm:text-5xl md:text-6xl font-bold tabular-nums"
        style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}
      >
        {display}
      </span>
      {suffix && (
        <span
          className="text-2xl md:text-3xl font-bold"
          style={{ color: 'var(--color-primary)' }}
        >
          {suffix}
        </span>
      )}
    </div>
  )
}
