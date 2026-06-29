import { useEffect, useState, useRef } from 'react'

const LETTERS = ['G', 'O', 'K', 'U', 'L']

export default function Loader() {
  const [p, setP] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  /* ── Progress counter ── */
  useEffect(() => {
    const iv = setInterval(() => {
      setP(v => {
        if (v >= 100) { clearInterval(iv); return 100 }
        const step = v < 40 ? Math.random() * 8 + 2
                   : v < 80 ? Math.random() * 12 + 4
                   : Math.random() * 18 + 6
        return Math.min(v + step, 100)
      })
    }, 70)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (p >= 100) {
      const t = setTimeout(() => setFadeOut(true), 3500)
      return () => clearTimeout(t)
    }
  }, [p])

  /* ── Particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)

    interface Particle {
      x: number; y: number; vx: number; vy: number
      size: number; life: number; maxLife: number
      hue: number
    }
    const particles: Particle[] = []

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.3,
        size: Math.random() * 2.5 + 0.5,
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 150,
        hue: 20 + Math.random() * 30,
      })
    }

    let raf = 0
    const tick = () => {
      ctx.clearRect(0, 0, w, h)

      /* Connection lines */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12
            ctx.strokeStyle = `hsla(${particles[i].hue}, 100%, 60%, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.life++
        if (p.life > p.maxLife) {
          p.x = Math.random() * w
          p.y = Math.random() * h
          p.life = 0
        }
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        const alpha = 1 - Math.abs(p.life - p.maxLife / 2) / (p.maxLife / 2)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${alpha * 0.6})`
        ctx.shadowBlur = 12
        ctx.shadowColor = `hsla(${p.hue}, 100%, 65%, 0.4)`
        ctx.fill()
        ctx.shadowBlur = 0
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className={`ld-wrap${fadeOut ? ' ld-out' : ''}`}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="ld-canvas" />

      {/* Grid overlay */}
      <div className="ld-grid" />

      {/* Ambient glows */}
      <div className="ld-glow ld-glow-1" />
      <div className="ld-glow ld-glow-2" />
      <div className="ld-glow ld-glow-3" />

      {/* Content */}
      <div className="ld-content">
        {/* Logo orbiter */}
        <div className="ld-logo-wrap">
          <div className="ld-orbit ld-orbit-1"><div className="ld-orbit-dot" /></div>
          <div className="ld-orbit ld-orbit-2"><div className="ld-orbit-dot" /></div>
          <div className="ld-orbit ld-orbit-3"><div className="ld-orbit-dot" /></div>

          {/* Hex ring */}
          <svg className="ld-hex" viewBox="0 0 120 120" fill="none">
            <polygon
              points="60,5 110,30 110,90 60,115 10,90 10,30"
              stroke="url(#ld-hex-grad)"
              strokeWidth="2"
              fill="none"
              className="ld-hex-path"
            />
            <defs>
              <linearGradient id="ld-hex-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--loader-accent)" />
                <stop offset="50%" stopColor="var(--neon-cyan)" />
                <stop offset="100%" stopColor="var(--neon-purple)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central letter */}
          <div className="ld-letter">G</div>
        </div>

        {/* Animated name letters */}
        <div className="ld-name">
          {LETTERS.map((l, i) => (
            <span key={i} className="ld-name-char" style={{ animationDelay: `${i * 0.1}s` }}>{l}</span>
          ))}
          <span className="ld-name-char ld-name-space" style={{ animationDelay: '0.5s' }}>&nbsp;</span>
          <span className="ld-name-char" style={{ animationDelay: '0.6s' }}>R</span>
        </div>

        {/* Tagline */}
        <div className="ld-tagline">
          <span className="ld-tag-line" />
          <span className="ld-tag-text">INITIALIZING PORTFOLIO</span>
          <span className="ld-tag-line" />
        </div>

        {/* Progress bar */}
        <div className="ld-bar-wrap">
          <div className="ld-bar-track">
            <div className="ld-bar-fill" style={{ width: `${p}%` }}>
              <div className="ld-bar-glow" />
            </div>
          </div>
          <div className="ld-bar-info">
            <span className="ld-bar-pct">{Math.round(p)}%</span>
            <span className="ld-bar-label">
              {p < 30 ? 'Loading assets…' : p < 60 ? 'Building interface…' : p < 90 ? 'Almost ready…' : 'Launching! 🚀'}
            </span>
          </div>
        </div>

        {/* Scanning dots */}
        <div className="ld-dots">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="ld-dot" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
