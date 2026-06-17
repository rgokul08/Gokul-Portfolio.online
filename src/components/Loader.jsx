import React, { useEffect, useState } from 'react'
import './Loader.css'

export default function Loader() {
  const [p, setP] = useState(0)
  
  useEffect(() => {
    const iv = setInterval(() =>
      setP(v => {
        if (v >= 100) {
          clearInterval(iv)
          return 100
        }
        return Math.min(v + Math.random() * 14 + 3, 100)
      }),
      90
    )
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="loader">
      {/* Wind Waves Background */}
      <div className="loader-waves">
        <div className="wave wave-1" />
        <div className="wave wave-2" />
        <div className="wave wave-3" />
      </div>

      {/* Galaxy Particles */}
      <div className="loader-galaxy">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="galaxy-particle"
            style={{
              '--delay': `${i * 0.15}s`,
              '--duration': `${4 + i * 0.3}s`,
              '--size': `${Math.random() * 80 + 40}px`,
            }}
          />
        ))}
      </div>

      {/* Original Grid */}
      <div className="loader-grid" />

      {/* Scan Line */}
      <div className="loader-scan" />

      {/* Content */}
      <div className="loader-inner">
        <div className="loader-logo">
          <span>G</span>
        </div>
        <div className="loader-name">GOKUL R</div>
        <div className="loader-bar-wrap">
          <div className="loader-bar" style={{ width: `${Math.min(p, 100)}%` }} />
        </div>
        <div className="loader-text">INITIALIZING PORTFOLIO…</div>
      </div>
    </div>
  )
}