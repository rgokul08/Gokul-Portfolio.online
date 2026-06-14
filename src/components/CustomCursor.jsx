// src/components/CustomCursor.jsx
// QUANTUM THEME-REACTIVE CURSOR v5.0
// • Dot follows mouse instantly
// • Ring lerps at 0.12 lag
// • Trail lerps at 0.05 lag (dreamy)
// • Expands on all interactive elements
// • Click spawns 8 particle burst
// • Magnetic trail dots left behind
// • Scan line fires on theme toggle
// • ALL colors driven by CSS vars → change instantly on theme toggle
// • Zero hardcoded colors in JS

import React, { useEffect, useRef, useCallback } from 'react'
import './CustomCursor.css'

/* ── Config ── */
const RING_LAG    = 0.13
const TRAIL_LAG   = 0.055
const PARTICLE_N  = 8
const TRAIL_EVERY = 4  // px moved before leaving mag dot
const IS_MOBILE   = () => window.innerWidth < 768 || !window.matchMedia('(hover:hover)').matches

/* ── Spawn a single click particle ── */
function spawnParticle(x, y) {
  const el = document.createElement('div')
  el.className = 'c-particle'
  el.style.left = `${x}px`
  el.style.top  = `${y}px`
  const angle = Math.random() * Math.PI * 2
  const dist  = 20 + Math.random() * 40
  el.style.setProperty('--px', `${Math.cos(angle) * dist}px`)
  el.style.setProperty('--py', `${Math.sin(angle) * dist}px`)
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 750)
}

/* ── Spawn magnetic trail dot ── */
function spawnMagDot(x, y) {
  const el = document.createElement('div')
  el.className = 'c-mag-dot'
  el.style.left = `${x}px`
  el.style.top  = `${y}px`
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 600)
}

/* ── Fire scan line (called from ThemeToggle) ── */
function fireScanLine(y) {
  const el = document.createElement('div')
  el.className = 'c-scan'
  el.style.top = `${y}px`
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 700)
}

// Expose for ThemeToggle to call
if (typeof window !== 'undefined') {
  window.__cursorScanLine = fireScanLine
}

export default function CustomCursor() {
  const dotRef   = useRef(null)
  const ringRef  = useRef(null)
  const trailRef = useRef(null)

  const mouse  = useRef({ x: 0, y: 0 })
  const ring   = useRef({ x: 0, y: 0 })
  const trail  = useRef({ x: 0, y: 0 })
  const lastMag = useRef({ x: 0, y: 0 })
  const rafRef  = useRef(null)
  const active  = useRef(false)

  /* ── Expand / shrink ring on hover ── */
  const expand = useCallback(() => ringRef.current?.classList.add('expand'), [])
  const shrink = useCallback(() => ringRef.current?.classList.remove('expand'), [])

  /* ── Spin ring on links ── */
  const linkEnter = useCallback(() => {
    ringRef.current?.classList.add('on-link', 'expand')
  }, [])
  const linkLeave = useCallback(() => {
    ringRef.current?.classList.remove('on-link', 'expand')
  }, [])

  /* ── Attach hover listeners to all interactive elements ── */
  const attachListeners = useCallback(() => {
    // Buttons & general interactive
    document.querySelectorAll('button, [data-cursor], input, textarea, select, label').forEach(el => {
      el.addEventListener('mouseenter', expand,   { passive: true })
      el.addEventListener('mouseleave', shrink,   { passive: true })
    })
    // Links get spinning ring
    document.querySelectorAll('a').forEach(el => {
      el.addEventListener('mouseenter', linkEnter, { passive: true })
      el.addEventListener('mouseleave', linkLeave, { passive: true })
    })
    // Cards
    document.querySelectorAll('.glass-card, .cert-card, .proj-card, .about-stat').forEach(el => {
      el.addEventListener('mouseenter', expand, { passive: true })
      el.addEventListener('mouseleave', shrink, { passive: true })
    })
  }, [expand, shrink, linkEnter, linkLeave])

  useEffect(() => {
    if (IS_MOBILE()) return

    /* ── Mouse move ── */
    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      // Instant dot placement
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top  = `${e.clientY}px`
      }

      // Magnetic trail: leave a dot every TRAIL_EVERY px
      const dx = e.clientX - lastMag.current.x
      const dy = e.clientY - lastMag.current.y
      if (Math.sqrt(dx * dx + dy * dy) > TRAIL_EVERY) {
        spawnMagDot(e.clientX, e.clientY)
        lastMag.current = { x: e.clientX, y: e.clientY }
      }
    }

    /* ── Click burst ── */
    const onClick = (e) => {
      if (dotRef.current)  dotRef.current.classList.add('clicking')
      if (ringRef.current) ringRef.current.classList.add('clicking')
      setTimeout(() => {
        dotRef.current?.classList.remove('clicking')
        ringRef.current?.classList.remove('clicking')
      }, 450)
      for (let i = 0; i < PARTICLE_N; i++) spawnParticle(e.clientX, e.clientY)
    }

    /* ── Cursor hide/show on leave/enter window ── */
    const onLeave  = () => {
      if (dotRef.current)   dotRef.current.style.opacity   = '0'
      if (ringRef.current)  ringRef.current.style.opacity  = '0'
      if (trailRef.current) trailRef.current.style.opacity = '0'
    }
    const onEnter  = () => {
      if (dotRef.current)   dotRef.current.style.opacity   = '1'
      if (ringRef.current)  ringRef.current.style.opacity  = '1'
      if (trailRef.current) trailRef.current.style.opacity = '0.55'
    }

    /* ── RAF loop for lagged elements ── */
    let frameCount = 0
    const tick = () => {
      ring.current.x  += (mouse.current.x - ring.current.x)  * RING_LAG
      ring.current.y  += (mouse.current.y - ring.current.y)  * RING_LAG
      trail.current.x += (mouse.current.x - trail.current.x) * TRAIL_LAG
      trail.current.y += (mouse.current.y - trail.current.y) * TRAIL_LAG

      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`
        ringRef.current.style.top  = `${ring.current.y}px`
      }
      // Trail updates every 2 frames to feel more ghostly
      if (frameCount % 2 === 0 && trailRef.current) {
        trailRef.current.style.left = `${trail.current.x}px`
        trailRef.current.style.top  = `${trail.current.y}px`
      }
      frameCount++
      rafRef.current = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove',    onMove,   { passive: true })
    document.addEventListener('click',        onClick)
    document.addEventListener('mouseleave',   onLeave,  { passive: true })
    document.addEventListener('mouseenter',   onEnter,  { passive: true })

    // Initial listener attach + reattach on DOM mutations
    attachListeners()
    const observer = new MutationObserver(() => attachListeners())
    observer.observe(document.body, { childList: true, subtree: true })

    active.current = true
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('click',      onClick)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [attachListeners])

  if (typeof window !== 'undefined' && IS_MOBILE()) return null

  return (
    <>
      {/* Instant-position dot */}
      <div ref={dotRef}   className="c-dot"   aria-hidden="true" />
      {/* Lagged ring */}
      <div ref={ringRef}  className="c-ring"  aria-hidden="true" />
      {/* Dreamy trail */}
      <div ref={trailRef} className="c-trail" aria-hidden="true" />
    </>
  )
}