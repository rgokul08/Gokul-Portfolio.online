// src/components/Hero.jsx
import React, { useEffect, useRef } from 'react'
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from 'react-icons/fi'
import './Hero.css'

const roles = [
  'Software Developer',
  'Engineering Student',
  'Problem Solver',
  'UI Enthusiast',
]

export default function Hero() {
  const roleRef = useRef(null)
  const indexRef = useRef(0)
  const charRef = useRef(0)
  const deletingRef = useRef(false)

  useEffect(() => {
    const type = () => {
      const word = roles[indexRef.current]
      if (!deletingRef.current) {
        charRef.current++
        if (roleRef.current) roleRef.current.textContent = word.slice(0, charRef.current)
        if (charRef.current === word.length) {
          deletingRef.current = true
          setTimeout(type, 1800)
          return
        }
      } else {
        charRef.current--
        if (roleRef.current) roleRef.current.textContent = word.slice(0, charRef.current)
        if (charRef.current === 0) {
          deletingRef.current = false
          indexRef.current = (indexRef.current + 1) % roles.length
        }
      }
      setTimeout(type, deletingRef.current ? 60 : 90)
    }
    const t = setTimeout(type, 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="hero">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="hero-grid" />

      <div className="container hero-container">
        {/* Text side */}
        <div className="hero-text">
          <div className="hero-badge fade-in delay-1">
            <span className="hero-badge-dot" />
            Looking to Contribute and Grow
          </div>

          <h1 className="hero-name fade-in delay-2">
            Hey, I'm<br />
            <span className="hero-name-accent">Gokul</span>
          </h1>

          <div className="hero-role fade-in delay-3">
            <span>Aspiring </span>
            <span ref={roleRef} className="hero-typewriter" />
            <span className="hero-cursor">|</span>
          </div>

          <p className="hero-tagline fade-in delay-4">
            Transforming ideas into impactful applications through <strong>clean code</strong>,
            <strong> modern web development</strong> and <strong>data analysis</strong>.
          </p>

          <div className="hero-actions fade-in delay-5">
            <a href="#projects" className="btn-primary" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}>
              View My Work
              <FiArrowDown />
            </a>
            <a href="#contact" className="btn-outline" onClick={(e) => { e.preventDefault(); document.getElementById('feedback')?.scrollIntoView({ behavior: 'smooth' }) }}>
              Let's Talk
            </a>
          </div>

          <div className="hero-socials fade-in delay-5">
            <a
              href="https://github.com/rgokul08"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-link"
              aria-label="GitHub"
            >
              <FiGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/gokul-r-69ab13385/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-link"
              aria-label="LinkedIn"
            >
              <FiLinkedin />
            </a>
            {/* Mail icon — opens Gmail compose with pre-filled recipient */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=rgokul08.in@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-social-link"
              aria-label="Email"
            >
              <FiMail />
            </a>
          </div>
        </div>

        {/* Image side */}
        <div className="hero-image-wrap fade-in delay-3">
          <div className="hero-image-card">
            <div className="hero-image-glow" />
            {/* Fallback gradient avatar if image not available */}
            <div className="hero-image-fallback">
              <div className="hero-avatar-letter">G</div>
            </div>
            <div className="hero-image-badge hero-image-badge-1">
              <span>🎓</span> Engineering Student
            </div>
            <div className="hero-image-badge hero-image-badge-2">
              <span>💻</span> Dev & Designer
            </div>
          </div>
          <div className="hero-orbit">
            <div className="hero-orbit-dot" />
          </div>
        </div>
      </div>

      <a href="#about" className="hero-scroll" onClick={(e) => {
        e.preventDefault()
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
      }}>
        <div className="hero-scroll-line" />
        <span>Scroll</span>
      </a>
    </div>
  )
}