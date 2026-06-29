import { useEffect, useRef, useCallback } from 'react'
import './CustomCursor.css'

/* ── Config ── */
const RING_LAG   = 0.12
const TRAIL_LAG  = 0.05
const PARTICLE_N = 10

function isMobile() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

function spawnParticle(x: number, y: number) {
  const el = document.createElement('div')
  el.className = 'cc-particle'
  el.style.left = `${x}px`
  el.style.top  = `${y}px`
  const angle = Math.random() * Math.PI * 2
  const dist  = 35 + Math.random() * 55
  el.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
  el.style.setProperty('--dy', `${Math.sin(angle) * dist}px`)
  el.style.setProperty('--size', `${3 + Math.random() * 5}px`)
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 700)
}

function spawnRipple(x: number, y: number) {
  const el = document.createElement('div')
  el.className = 'cc-ripple'
  el.style.left = `${x}px`
  el.style.top  = `${y}px`
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 800)
}

function spawnMagDot(x: number, y: number) {
  const el = document.createElement('div')
  el.className = 'cc-magdot'
  el.style.left = `${x}px`
  el.style.top  = `${y}px`
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 500)
}

function spawnGlitch(x: number, y: number) {
  for (let i = 0; i < 3; i++) {
    const el = document.createElement('div')
    el.className = 'cc-glitch'
    el.style.left = `${x + (Math.random() - 0.5) * 30}px`
    el.style.top  = `${y + (Math.random() - 0.5) * 30}px`
    el.style.width  = `${20 + Math.random() * 40}px`
    el.style.height = '2px'
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 350)
  }
}

export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const ringRef  = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const auraRef  = useRef<HTMLDivElement>(null)
  const mouse    = useRef({ x: -100, y: -100 })
  const ring     = useRef({ x: -100, y: -100 })
  const trail    = useRef({ x: -100, y: -100 })
  const lastMag  = useRef({ x: 0, y: 0 })
  const raf      = useRef(0)
  const velocity = useRef({ x: 0, y: 0 })
  const prevMouse = useRef({ x: 0, y: 0 })

  const expand  = useCallback(() => ringRef.current?.classList.add('cc-expand'), [])
  const shrink  = useCallback(() => ringRef.current?.classList.remove('cc-expand'), [])
  const linkIn  = useCallback(() => { ringRef.current?.classList.add('cc-expand', 'cc-link') }, [])
  const linkOut = useCallback(() => { ringRef.current?.classList.remove('cc-expand', 'cc-link') }, [])

  const attachListeners = useCallback(() => {
    document.querySelectorAll(
      'button, input, textarea, select, label, .skill-chip, .ai-chip, .cert-card, .proj-card, .git-card, .about-stat, .marquee-arrow, .glass-card'
    ).forEach(el => {
      el.addEventListener('mouseenter', expand, { passive: true })
      el.addEventListener('mouseleave', shrink, { passive: true })
    })
    document.querySelectorAll('a').forEach(el => {
      el.addEventListener('mouseenter', linkIn, { passive: true })
      el.addEventListener('mouseleave', linkOut, { passive: true })
    })
  }, [expand, shrink, linkIn, linkOut])

  useEffect(() => {
    if (isMobile()) return

    // Add class to html to hide native cursor via CSS
    document.documentElement.classList.add('custom-cursor-active')

    const onMove = (e: MouseEvent) => {
      velocity.current = {
        x: e.clientX - prevMouse.current.x,
        y: e.clientY - prevMouse.current.y,
      }
      prevMouse.current = { x: e.clientX, y: e.clientY }
      mouse.current = { x: e.clientX, y: e.clientY }

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top  = `${e.clientY}px`
        // Velocity-based dot stretch
        const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2)
        const stretch = Math.min(speed * 0.1, 2)
        const angle = Math.atan2(velocity.current.y, velocity.current.x) * 180 / Math.PI
        dotRef.current.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scaleX(${1 + stretch}) scaleY(${1 - stretch * 0.15})`
      }

      // Magnetic trail
      const dx = e.clientX - lastMag.current.x
      const dy = e.clientY - lastMag.current.y
      if (Math.sqrt(dx * dx + dy * dy) > 8) {
        spawnMagDot(e.clientX, e.clientY)
        lastMag.current = { x: e.clientX, y: e.clientY }
      }
    }

    const onClick = (e: MouseEvent) => {
      dotRef.current?.classList.add('cc-click')
      ringRef.current?.classList.add('cc-click')
      auraRef.current?.classList.add('cc-click')
      setTimeout(() => {
        dotRef.current?.classList.remove('cc-click')
        ringRef.current?.classList.remove('cc-click')
        auraRef.current?.classList.remove('cc-click')
      }, 500)
      for (let i = 0; i < PARTICLE_N; i++) spawnParticle(e.clientX, e.clientY)
      spawnRipple(e.clientX, e.clientY)
      spawnGlitch(e.clientX, e.clientY)
    }

    const onLeave = () => {
      [dotRef, ringRef, trailRef, auraRef].forEach(r => {
        if (r.current) r.current.style.opacity = '0'
      })
    }
    const onEnter = () => {
      if (dotRef.current)   dotRef.current.style.opacity   = '1'
      if (ringRef.current)  ringRef.current.style.opacity  = '1'
      if (trailRef.current) trailRef.current.style.opacity = '0.5'
      if (auraRef.current)  auraRef.current.style.opacity  = '0.25'
    }

    let fc = 0
    const tick = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * RING_LAG
      ring.current.y += (mouse.current.y - ring.current.y) * RING_LAG
      trail.current.x += (mouse.current.x - trail.current.x) * TRAIL_LAG
      trail.current.y += (mouse.current.y - trail.current.y) * TRAIL_LAG

      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`
        ringRef.current.style.top  = `${ring.current.y}px`
      }
      if (fc % 2 === 0 && trailRef.current) {
        trailRef.current.style.left = `${trail.current.x}px`
        trailRef.current.style.top  = `${trail.current.y}px`
      }
      if (auraRef.current) {
        auraRef.current.style.left = `${ring.current.x}px`
        auraRef.current.style.top  = `${ring.current.y}px`
      }
      fc++
      raf.current = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('click', onClick)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    attachListeners()
    const observer = new MutationObserver(() => attachListeners())
    observer.observe(document.body, { childList: true, subtree: true })
    raf.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('click', onClick)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf.current)
      observer.disconnect()
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [attachListeners])

  if (typeof window !== 'undefined' && isMobile()) return null

  return (
    <>
      <div ref={auraRef}  className="cc-aura" />
      <div ref={trailRef} className="cc-trail" />
      <div ref={ringRef}  className="cc-ring"><div className="cc-ring-inner" /></div>
      <div ref={dotRef}   className="cc-dot" />
    </>
  )
}
