import { useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const thumbRef = useRef<HTMLDivElement>(null)

  const handleToggle = () => {
    if (thumbRef.current) {
      thumbRef.current.classList.remove('squish')
      void (thumbRef.current as HTMLElement).offsetWidth
      thumbRef.current.classList.add('squish')
      setTimeout(() => thumbRef.current?.classList.remove('squish'), 480)
    }
    document.body.classList.add('theme-transitioning')
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 700)
    toggleTheme()
  }

  return (
    <button
      className={`theme-toggle${isDark ? ' dark' : ''}`}
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="theme-toggle-bg">
        <div className="theme-toggle-stars">
          <div className="theme-toggle-star" />
          <div className="theme-toggle-star" />
          <div className="theme-toggle-star" />
          <div className="theme-toggle-star" />
        </div>
      </div>
      <div ref={thumbRef} className="theme-toggle-thumb">
        {isDark ? '🌙' : '☀️'}
      </div>
    </button>
  )
}
