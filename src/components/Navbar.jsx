// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react'
import './Navbar.css'

const navLinks = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Feedback',     href: '#feedback' },
  { label: 'Contact',      href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active,   setActive]   = useState('#home')
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      // Highlight active section
      const sections = navLinks.map(l => l.href.slice(1))
      let current = '#home'
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) current = `#${id}`
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href) => {
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <a href="#home" className="nav-logo" onClick={() => handleNav('#home')}>
          <div className="nav-logo-mark">G</div>
          <span>Gokul</span>
        </a>

        {/* Desktop links */}
        <nav className="nav-links">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${active === link.href ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNav(link.href) }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="mailto:rgokul08.in@gmail.com"
          className="btn-primary nav-cta"
        >
          Hire Me
        </a>

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`nav-mobile ${open ? 'open' : ''}`}>
        {navLinks.map(link => (
          <a
            key={link.href}
            href={link.href}
            className={`nav-mobile-link ${active === link.href ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNav(link.href) }}
          >
            {link.label}
          </a>
        ))}
        <a href="mailto:rgokul08.in@gmail.com" className="btn-primary" style={{ marginTop: 16 }}>
          Hire Me
        </a>
      </div>
    </header>
  )
}
