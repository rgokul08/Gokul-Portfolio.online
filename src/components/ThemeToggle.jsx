// src/components/ThemeToggle.jsx
// QUANTUM MORPHIC THEME TOGGLE v5.0
//
// On click:
// 1. Adds .squish class to thumb (liquid squish spring)
// 2. Adds .just-toggled class to self (aura pulse)
// 3. Fires __cursorScanLine() for scan-line effect across cursor
// 4. Sets CSS var --ripple-x / --ripple-y for body ripple position
// 5. Adds .theme-transitioning to body for 700ms
// 6. Calls toggleTheme() — which flips [data-theme] on <html>
// 7. All CSS vars update instantly → cursor colors change immediately
//    (dark = cyan glow, light = gold-violet glow)

import React, { useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark   = theme === 'dark'
  const btnRef   = useRef(null)
  const thumbRef = useRef(null)

  const handleToggle = (e) => {
    /* ── 1. Thumb squish ── */
    if (thumbRef.current) {
      thumbRef.current.classList.remove('squish')
      void thumbRef.current.offsetWidth // force reflow to re-trigger
      thumbRef.current.classList.add('squish')
      setTimeout(() => thumbRef.current?.classList.remove('squish'), 480)
    }

    /* ── 2. Button aura pulse ── */
    if (btnRef.current) {
      btnRef.current.classList.remove('just-toggled')
      void btnRef.current.offsetWidth
      btnRef.current.classList.add('just-toggled')
      setTimeout(() => btnRef.current?.classList.remove('just-toggled'), 700)
    }

    /* ── 3. Cursor scan line (position at cursor Y) ── */
    if (window.__cursorScanLine) {
      window.__cursorScanLine(e.clientY)
    }

    /* ── 4. Set ripple origin on body for CSS radial-gradient ── */
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    document.documentElement.style.setProperty('--ripple-x', `${cx}px`)
    document.documentElement.style.setProperty('--ripple-y', `${cy}px`)

    /* ── 5. Body transition class ── */
    document.body.classList.add('theme-transitioning')
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 700)

    /* ── 6. Flip theme (updates [data-theme] → all CSS vars change) ── */
    toggleTheme()
  }

  return (
    <button
      ref={btnRef}
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={!isDark}
    >
      <span className="toggle-label-sr">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>

      <div className="toggle-track">
        <span className="toggle-icon moon" aria-hidden="true">🌙</span>
        <span className="toggle-icon sun"  aria-hidden="true">☀️</span>

        <div
          ref={thumbRef}
          className={`toggle-thumb${isDark ? '' : ' light'}`}
        />
      </div>
    </button>
  )
}