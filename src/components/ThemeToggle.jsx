import React from 'react'
import { useTheme } from '../context/ThemeContext'
import './ThemeToggle.css'

export default function ThemeToggle(){
  const{theme,toggleTheme}=useTheme()
  const isDark=theme==='dark'
  return(
    <button className="theme-toggle" onClick={toggleTheme}
      aria-label={isDark?'Switch to light':'Switch to dark'}>
      <div className="toggle-track">
        <span className="toggle-icon moon">🌙</span>
        <span className="toggle-icon sun">☀️</span>
        <div className={`toggle-thumb${isDark?'':' light'}`}/>
      </div>
    </button>
  )
}