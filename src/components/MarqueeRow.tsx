import { useEffect, useRef, useCallback } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

/**
 * Premium infinite-scroll marquee row — fixed & responsive.
 *
 * Key fixes:
 *  1. Mask gradient is applied via a CSS custom property so it scales
 *     responsively instead of using fixed pixel values.
 *  2. The rAF loop is gate-kept by a `runningRef` flag so cleanup is
 *     always clean — no double-start on StrictMode remounts.
 *  3. setWidth is re-measured after fonts/images load (ResizeObserver).
 *  4. Speed nudge uses a proper spring back to baseSpeed regardless of
 *     direction so arrows always return to the correct sign.
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
  const trackRef   = useRef<HTMLDivElement>(null)
  const maskRef    = useRef<HTMLDivElement>(null)
  const offsetRef  = useRef(0)
  const speedRef   = useRef(0)
  const baseSpeedRef = useRef(0)
  const rafRef     = useRef(0)
  const runningRef = useRef(false)
  const pausedRef  = useRef(false)
  const setWidthRef = useRef(0)

  /* ── measure one copy of the items ── */
  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track || items.length === 0) return
    // Track contains 3 identical copies → one set = total / 3
    const sw = track.scrollWidth / 3
    if (sw > 0) setWidthRef.current = sw
  }, [items])

  /* ── update mask gradient width responsively ── */
  const updateMask = useCallback(() => {
    const mask = maskRef.current
    if (!mask) return
    const w = mask.offsetWidth
    // Fade zone: clamp between 40px (mobile) and 120px (desktop)
    const fade = Math.min(120, Math.max(40, w * 0.07))
    const pct  = (fade / w) * 100
    mask.style.webkitMaskImage =
      `linear-gradient(to right, transparent, black ${pct.toFixed(1)}%, black ${(100 - pct).toFixed(1)}%, transparent)`
    mask.style.maskImage = mask.style.webkitMaskImage
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track || items.length === 0) return

    // Stop any existing loop first
    runningRef.current = false
    cancelAnimationFrame(rafRef.current)

    const base = direction === 'ltr' ? speed : -speed
    baseSpeedRef.current = base
    speedRef.current     = base

    /* Start offset: RTL begins at one set so wrap-back lands at set, not 0 */
    requestAnimationFrame(() => {
      measure()
      updateMask()

      const sw = setWidthRef.current
      if (sw === 0) return

      offsetRef.current = direction === 'rtl' ? sw : 0

      let fc = 0
      runningRef.current = true

      const tick = () => {
        if (!runningRef.current) return

        if (!pausedRef.current) {
          offsetRef.current += speedRef.current
        }

        /* Spring back toward base speed */
        speedRef.current += (baseSpeedRef.current - speedRef.current) * 0.04

        const sw = setWidthRef.current
        if (sw > 0) {
          /* Seamless wrap within the middle copy */
          if (offsetRef.current >= sw * 2) offsetRef.current -= sw
          if (offsetRef.current <= 0)      offsetRef.current += sw

          track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
        }

        fc++
        rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    })

    /* ResizeObserver re-measures + re-masks on container resize */
    const ro = new ResizeObserver(() => {
      measure()
      updateMask()
    })
    if (maskRef.current)  ro.observe(maskRef.current)
    if (trackRef.current) ro.observe(trackRef.current)

    return () => {
      runningRef.current = false
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [items, direction, speed, measure, updateMask])

  const nudge = useCallback((dir: 'left' | 'right') => {
    speedRef.current = dir === 'right' ? 8 : -8
  }, [])

  if (items.length === 0) return null

  // Three copies for guaranteed no-gap infinite scroll
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
        ref={maskRef}
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