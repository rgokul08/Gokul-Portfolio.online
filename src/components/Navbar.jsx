// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react'
import { FiX, FiSend, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import './Navbar.css'

const navLinks = [
  { label: 'Home',         href: 'home' },
  { label: 'About',        href: 'about' },
  { label: 'Projects',     href: 'projects' },
  { label: 'Certificates', href: 'certificates' },
  { label: 'Feedback',     href: 'feedback' },
  { label: 'Contact',      href: 'feedback' },
]

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || ''

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [active,    setActive]    = useState('home')
  const [open,      setOpen]      = useState(false)
  const [hireOpen,  setHireOpen]  = useState(false)
  const [form,      setForm]      = useState({ name: '', email: '', message: '' })
  const [status,    setStatus]    = useState('idle')
  const [errMsg,    setErrMsg]    = useState('')

  useEffect(() => {
    const sectionIds = ['home', 'about', 'projects', 'certificates', 'feedback']

    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      // Find active section based on scroll position
      let current = 'home'
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) current = id
        }
      }
      setActive(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // run on mount
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setHireOpen(false); setStatus('idle') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleNav = (href) => {
    setOpen(false)
    const el = document.getElementById(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleHireSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    setErrMsg('')
    try {
      const emailjs = (await import('emailjs-com')).default
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          message:    `HIRE ME REQUEST\n\n${form.message}`,
          to_email:   'rgokul08.in@gmail.com',
          reply_to:   form.email,
        },
        EMAILJS_PUBLIC_KEY
      )
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      setErrMsg('Failed to send. Please email directly at rgokul08.in@gmail.com')
      setStatus('error')
    }
  }

  // Determine if a nav item is active
  const isActive = (href) => {
    if (href === 'feedback') return active === 'feedback'
    return active === href
  }

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <button className="nav-logo" onClick={() => handleNav('home')}>
            <div className="nav-logo-mark">G</div>
            <span>Gokul</span>
          </button>

          <nav className="nav-links">
            {navLinks.map((link, i) => (
              <button
                key={`${link.href}-${i}`}
                className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
                onClick={() => handleNav(link.href)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <button className="btn-primary nav-cta" onClick={() => setHireOpen(true)}>
            Hire Me
          </button>

          <button
            className={`nav-hamburger ${open ? 'open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>

        <div className={`nav-mobile ${open ? 'open' : ''}`}>
          {navLinks.map((link, i) => (
            <button
              key={`mobile-${link.href}-${i}`}
              className={`nav-mobile-link ${isActive(link.href) ? 'active' : ''}`}
              onClick={() => handleNav(link.href)}
            >
              {link.label}
            </button>
          ))}
          <button
            className="btn-primary"
            style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
            onClick={() => { setOpen(false); setHireOpen(true) }}
          >
            Hire Me
          </button>
        </div>
      </header>

      {/* Hire Me Modal */}
      {hireOpen && (
        <div className="hire-overlay" onClick={() => { setHireOpen(false); setStatus('idle') }}>
          <div className="hire-modal glass-card" onClick={e => e.stopPropagation()}>
            <button className="hire-close" onClick={() => { setHireOpen(false); setStatus('idle') }}>
              <FiX />
            </button>
            <div className="hire-header">
              <div className="hire-icon">🚀</div>
              <h2>Let's Work Together</h2>
              <p>Tell me about your project and I'll get back within 24 hours.</p>
            </div>

            {status === 'success' ? (
              <div className="hire-success">
                <FiCheckCircle />
                <h3>Message Sent!</h3>
                <p>Thanks {form.name || 'there'}! I'll get back to you soon.</p>
                <button className="btn-outline" onClick={() => setStatus('idle')}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleHireSubmit} className="hire-form" noValidate>
                <div className="form-group">
                  <label>Your Name</label>
                  <input name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required className="form-input" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input name="email" type="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required className="form-input" />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea name="message" placeholder="Tell me about your project..." value={form.message} onChange={handleChange} required rows={4} className="form-input form-textarea" />
                </div>
                {status === 'error' && (
                  <div className="form-error"><FiAlertCircle /> {errMsg}</div>
                )}
                <button type="submit" className="btn-primary form-submit" disabled={status === 'sending'}>
                  {status === 'sending'
                    ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Sending...</>
                    : <><FiSend /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}