import { useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const btnRef = useRef<HTMLButtonElement>(null)
  const sparkleCount = 12

  const spawnSparkles = useCallback(() => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    for (let i = 0; i < sparkleCount; i++) {
      const el = document.createElement('div')
      el.style.cssText = `
        position:fixed;left:${cx}px;top:${cy}px;
        width:${3 + Math.random() * 4}px;height:${3 + Math.random() * 4}px;
        border-radius:50%;pointer-events:none;z-index:100010;
        background:${isDark ? '#ffc83d' : '#ff5a1f'};
        box-shadow:0 0 6px ${isDark ? '#ffc83d' : '#ff5a1f'};
      `
      const angle = (Math.PI * 2 * i) / sparkleCount + Math.random() * 0.3
      const dist = 30 + Math.random() * 40
      el.style.setProperty('--tx', `${Math.cos(angle) * dist}px`)
      el.style.setProperty('--ty', `${Math.sin(angle) * dist}px`)
      el.animate([
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0)`, opacity: 0 }
      ], { duration: 600, easing: 'cubic-bezier(0.2,0.8,0.3,1)', fill: 'forwards' })
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 650)
    }
  }, [isDark])

  const handleToggle = () => {
    spawnSparkles()
    document.body.classList.add('theme-transitioning')
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 700)
    toggleTheme()
  }

  return (
    <motion.button
      ref={btnRef}
      className="theme-toggle-btn"
      onClick={handleToggle}
      whileHover={{ scale: 1.15, rotate: 15 }}
      whileTap={{ scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        boxShadow: isDark
          ? '0 0 20px rgba(255,180,56,0.2), inset 0 0 10px rgba(255,180,56,0.05)'
          : '0 0 20px rgba(255,90,31,0.25), inset 0 0 10px rgba(255,90,31,0.05)',
      }}
    >
      {/* Rotating ring */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: '50%',
          border: '1.5px dashed',
          borderColor: isDark ? 'rgba(255,180,56,0.3)' : 'rgba(255,90,31,0.3)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Glow pulse */}
      <motion.div
        style={{
          position: 'absolute',
          inset: -6,
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(255,180,56,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,90,31,0.12) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ fontSize: '1.4rem', lineHeight: 1 }}
          >
            🌙
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ fontSize: '1.4rem', lineHeight: 1 }}
          >
            ☀️
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
