import { useEffect, useRef, useCallback } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

/**
 * Premium infinite-scroll marquee row.
 *
 * How it works:
 *  1. The unique items are rendered THREE times inside the track
 *     so the visible window is always full — no blank gaps ever.
 *  2. A rAF loop moves the track by `speed` px per frame.
 *  3. When the offset crosses one "set width" boundary the position
 *     resets by exactly one set width — the user sees zero jump because
 *     the cloned set fills in identically.
 *  4. translate3d is used for GPU-composited rendering (60 fps).
 *  5. Hover pauses smoothly; ← → buttons nudge speed temporarily.
 */
interface MarqueeRowProps<T> {
  items: T[]
  direction: 'ltr' | 'rtl'
  speed?: number
  renderCard: (item: T, index: number) => React.ReactNode
  className?: string
  trackClass?: string
  wrapClass?: string
}

export default function MarqueeRow<T>({
  items,
  direction,
  speed = 0.4,
  renderCard,
  className = '',
  trackClass = '',
  wrapClass = '',
}: MarqueeRowProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const speedRef = useRef(0)
  const baseSpeedRef = useRef(0)
  const rafRef = useRef(0)
  const pausedRef = useRef(false)
  const setWidthRef = useRef(0)

  // Measure one "set" of items width (items rendered once)
  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track || items.length === 0) return
    // total track has 3 copies → one set = scrollWidth / 3
    setWidthRef.current = track.scrollWidth / 3
  }, [items])

  useEffect(() => {
    const track = trackRef.current
    if (!track || items.length === 0) return

    // Measure after paint
    requestAnimationFrame(() => {
      measure()
      const sw = setWidthRef.current
      if (sw === 0) return

      // LTR starts at 0 and moves right (offset increases)
      // RTL starts at one set-width and moves left (offset decreases)
      const base = direction === 'ltr' ? speed : -speed
      baseSpeedRef.current = base
      speedRef.current = base
      offsetRef.current = direction === 'rtl' ? sw : 0

      const tick = () => {
        if (!pausedRef.current) {
          offsetRef.current += speedRef.current
        }

        // Ease speed back toward base (spring-like deceleration after nudge)
        speedRef.current += (baseSpeedRef.current - speedRef.current) * 0.04

        const sw = setWidthRef.current
        if (sw > 0) {
          // Seamless wrap: keep offset within [0, setWidth)
          // When LTR scrolls past one full set, jump back by setWidth
          // When RTL scrolls before 0, jump forward by setWidth
          if (offsetRef.current >= sw * 2) offsetRef.current -= sw
          if (offsetRef.current <= 0) offsetRef.current += sw

          track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
        }

        rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    })

    // Re-measure on resize
    const onResize = () => measure()
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [items, direction, speed, measure])

  const nudge = useCallback((dir: 'left' | 'right') => {
    speedRef.current = dir === 'right' ? 8 : -8
  }, [])

  if (items.length === 0) return null

  // Render items 3 times for guaranteed no-gap coverage
  const tripled = [...items, ...items, ...items]

  return (
    <div className={`marquee-row-wrap ${className}`.trim()}>
      <button
        className="marquee-arrow marquee-arrow-left"
        onClick={() => nudge('left')}
        aria-label="Scroll row left"
      >
        <FiChevronLeft />
      </button>

      <div
        className={`marquee-row-mask ${wrapClass}`.trim()}
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
      >
        <div
          ref={trackRef}
          className={`marquee-row-track ${trackClass}`.trim()}
        >
          {tripled.map((item, i) => renderCard(item, i))}
        </div>
      </div>

      <button
        className="marquee-arrow marquee-arrow-right"
        onClick={() => nudge('right')}
        aria-label="Scroll row right"
      >
        <FiChevronRight />
      </button>
    </div>
  )
}
