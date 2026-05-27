// src/components/CustomCursor.jsx
import React, { useEffect, useRef } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const dot = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Hide on mobile
    if (window.innerWidth < 768) return

    const moveCursor = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top  = `${e.clientY}px`
      }
    }

    const animate = () => {
      dot.current.x += (pos.current.x - dot.current.x) * 0.12
      dot.current.y += (pos.current.y - dot.current.y) * 0.12
      if (cursorRef.current) {
        cursorRef.current.style.left = `${dot.current.x}px`
        cursorRef.current.style.top  = `${dot.current.y}px`
      }
      requestAnimationFrame(animate)
    }

    const expand = () => cursorRef.current?.classList.add('cursor-expand')
    const shrink = () => cursorRef.current?.classList.remove('cursor-expand')

    document.addEventListener('mousemove', moveCursor)
    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', expand)
      el.addEventListener('mouseleave', shrink)
    })

    animate()
    return () => document.removeEventListener('mousemove', moveCursor)
  }, [])

  if (typeof window !== 'undefined' && window.innerWidth < 768) return null

  return (
    <>
      <div ref={dotRef}    className="cursor-dot" />
      <div ref={cursorRef} className="cursor-ring" />
    </>
  )
}
