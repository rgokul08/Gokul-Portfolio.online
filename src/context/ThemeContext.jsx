// src/context/ThemeContext.jsx
// QUANTUM THEME CONTEXT v5.0
// Persists to localStorage. Sets [data-theme] on <html>.
// That's all it needs to do — the CSS vars handle everything else.

import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Respect saved preference, else OS preference, else dark
    const saved = localStorage.getItem('portfolio-theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    // This single line propagates ALL theme changes:
    // [data-theme] attr change → all CSS custom properties update →
    // cursor colors, background, text, borders, shadows, etc. all transition
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)