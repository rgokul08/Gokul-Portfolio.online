import { useEffect, useRef, useState } from 'react'
import { FiGithub, FiLinkedin, FiMail, FiArrowDown, FiInstagram } from 'react-icons/fi'
import { SiBehance } from 'react-icons/si'
import { supabase } from '../lib/supabase'

const ROLES = ['Software Developer', 'Full Stack Developer', 'AI & DS Student', 'UI/UX Enthusiast', 'Problem Solver']
const BUCKET = 'Portfolio'
const FOLDER = 'user_image'

export default function Hero() {
  const roleRef = useRef<HTMLSpanElement>(null)
  const idx = useRef(0)
  const chars = useRef(0)
  const del = useRef(false)
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const imgCardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const orbitRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  // Typewriter effect
  useEffect(() => {
    const tick = () => {
      const w = ROLES[idx.current]
      if (!del.current) {
        chars.current++
        if (roleRef.current) roleRef.current.textContent = w.slice(0, chars.current)
        if (chars.current === w.length) { del.current = true; setTimeout(tick, 2000); return }
      } else {
        chars.current--
        if (roleRef.current) roleRef.current.textContent = w.slice(0, chars.current)
        if (chars.current === 0) { del.current = false; idx.current = (idx.current + 1) % ROLES.length }
      }
      setTimeout(tick, del.current ? 45 : 80)
    }
    const t = setTimeout(tick, 600)
    return () => clearTimeout(t)
  }, [])

  // Load profile image
  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.storage.from(BUCKET).list(FOLDER, { limit: 10 })
        if (error || !data || data.length === 0) return
        const file = data.find(f => f.name && /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name))
        if (!file) return
        const { data: d } = supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${file.name}`)
        setImgUrl(d.publicUrl)
      } catch (e) { console.warn('hero image', e) }
    }
    load()
  }, [])

  // Video autoplay
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const play = () => v.play().catch(() => {})
    play()
    document.addEventListener('click', play, { once: true })
    return () => document.removeEventListener('click', play)
  }, [])

  // 3D Tilt effect on mouse move
  useEffect(() => {
    const card = imgCardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
      setTilt({ x: -y * 12, y: x * 12 })
    }

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 })
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="hero">
      <div className="hero-video-wrap">
        <video
          ref={videoRef}
          className={`hero-video${videoReady ? ' ready' : ''}`}
          autoPlay muted loop playsInline preload="auto"
          onCanPlay={() => setVideoReady(true)}
        >
          <source src="https://rshbwueoscurgzfkouuh.supabase.co/storage/v1/object/public/Portfolio/Background/rocket-launch-bg.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-scrim" />
      </div>

      <div className="hero-container">
        <div className="hero-text">
          <div className="hero-badge">
            <span className="hero-dot" />
            Seeking Opportunity to Contribute and Grow
          </div>

          <h1 className="hero-name">
            <span className="hero-name-line">Hey, I'm</span>
            <span className="hero-name-grad">Gokul R</span>
          </h1>

          <div className="hero-role">
            <span className="hero-role-pre">Aspiring </span>
            <span ref={roleRef} className="hero-typed" />
            <span className="hero-cursor">_</span>
          </div>

          <p className="hero-tagline">
         Transforming ideas into impactful digital experiences through  
          <strong> modern web development </strong> , 
          <strong> AI-powered solutions </strong> , and
          <strong> data-driven innovation </strong> to 
          <strong> create a better future. </strong>
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
              View My Work <FiArrowDown />
            </button>
            <button className="btn-outline" onClick={() => document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' })}>
              Let's Talk 💬
            </button>
          </div>

          <div className="hero-socials">
            <a href="https://github.com/rgokul08" target="_blank" rel="noopener noreferrer" className="hs-link" title="GitHub"><FiGithub /></a>
            <a href="https://www.linkedin.com/in/gokul-r-69ab13385/" target="_blank" rel="noopener noreferrer" className="hs-link" title="LinkedIn"><FiLinkedin /></a>
            <a href="https://instagram.com/itz_goku.08" target="_blank" rel="noopener noreferrer" className="hs-link" title="Instagram"><FiInstagram /></a>
            <a href="https://www.behance.net/gokul08" target="_blank" rel="noopener noreferrer" className="hs-link" title="Behance"><SiBehance /></a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=rgokul08.in@gmail.com" target="_blank" rel="noopener noreferrer" className="hs-link" title="Email"><FiMail /></a>
          </div>
        </div>

        {/* 3D Animated Hero Image */}
        <div 
          className="hero-img-wrap" 
          ref={imgCardRef}
          style={{ 
            transform: `perspective(1000px) translateY(${scrollY * 0.15}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div 
            className="hero-img-card"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${1 + Math.abs(tilt.x + tilt.y) * 0.001})`,
              transition: 'transform 0.15s ease-out',
              transformStyle: 'preserve-3d'
            }}
          >
            <div 
              className="hero-img-glow"
              style={{
                transform: `translateZ(${20 + Math.abs(tilt.x + tilt.y) * 0.5}px)`,
                transition: 'transform 0.15s ease-out'
              }}
            />
            {imgUrl
              ? (
                <img 
                  src={imgUrl} 
                  alt="Gokul" 
                  className="hero-photo"
                  style={{
                    transform: `translateZ(${30 + Math.abs(tilt.x + tilt.y) * 0.8}px) scale(${1 + Math.abs(tilt.x + tilt.y) * 0.002})`,
                    transition: 'transform 0.15s ease-out'
                  }}
                />
              )
              : (
                <div 
                  className="hero-avatar"
                  style={{
                    transform: `translateZ(${30}px)`,
                    transition: 'transform 0.15s ease-out'
                  }}
                >
                  <span>G</span>
                </div>
              )
            }
            <div 
              className="hero-badge-float"
              style={{
                transform: `translateZ(${40 + Math.abs(tilt.x + tilt.y) * 0.5}px) translateY(${tilt.x * 0.5}px)`,
                transition: 'transform 0.15s ease-out'
              }}
            >
              <span className="bf-dot" />💻 Dev &amp; Designer
            </div>

            {/* Floating elements with 3D depth */}
            <div 
              className="hero-float-el hero-float-1"
              style={{ transform: `translateZ(${60}px) translateX(${tilt.y * 2}px) translateY(${tilt.x * 2}px)` }}
            >
              ⚡
            </div>
            <div 
              className="hero-float-el hero-float-2"
              style={{ transform: `translateZ(${80}px) translateX(${tilt.y * 3}px) translateY(${tilt.x * 3}px)` }}
            >
              🚀
            </div>
            <div 
              className="hero-float-el hero-float-3"
              style={{ transform: `translateZ(${50}px) translateX(${tilt.y * 1.5}px) translateY(${tilt.x * 1.5}px)` }}
            >
              💡
            </div>
          </div>

          {/* 3D Orbits */}
          <div 
            className="hero-orbit"
            ref={orbitRef}
            style={{ 
              transform: `perspective(1000px) rotateX(60deg) rotateZ(${Date.now() * 0.02}deg) translateY(${scrollY * 0.1}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="hero-orbit-dot" />
          </div>
          <div 
            className="hero-orbit hero-orbit-2"
            style={{ 
              transform: `perspective(1000px) rotateX(60deg) rotateZ(${-Date.now() * 0.015}deg) translateY(${scrollY * 0.08}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="hero-orbit-dot-2" />
          </div>
          <div 
            className="hero-orbit hero-orbit-3"
            style={{ 
              transform: `perspective(1000px) rotateX(30deg) rotateZ(${Date.now() * 0.01}deg) translateY(${scrollY * 0.12}px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div className="hero-orbit-dot-3" />
          </div>
        </div>
      </div>

      <button className="hero-scroll-ind" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
        <div className="hero-scroll-line" />
        <span>Scroll</span>
      </button>
    </div>
  )
}
