// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react'
import { FiX, FiSend, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import './Navbar.css'

const navLinks = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact',      href: '#feedback' },
]

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || ''

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active,   setActive]   = useState('#home')
  const [open,     setOpen]     = useState(false)
  const [hireOpen, setHireOpen] = useState(false)
  const [form,     setForm]     = useState({ name: '', email: '', message: '' })
  const [status,   setStatus]   = useState('idle')
  const [errMsg,   setErrMsg]   = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      
      // Check which section is currently in view
      const sections = navLinks.map(l => l.href.slice(1))
      let current = '#home'
      
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 200) {
          current = `#${id}`
        }
      }
      setActive(current)
    }
    
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close hire modal on Escape
  useEffect(() => {
    const handler = (e) => { 
      if (e.key === 'Escape') { 
        setHireOpen(false)
        setStatus('idle') 
      } 
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleNav = (href) => {
    setOpen(false)
    const el = document.querySelector(href)
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

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); handleNav('#home') }}>
            <div className="nav-logo-mark">G</div>
            <span>Gokul</span>
          </a>

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
          <button className="btn-primary" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }} onClick={() => { setOpen(false); setHireOpen(true) }}>
            Hire Me
          </button>
        </div>
      </header>

      {/* Hire Me Modal */}
      {hireOpen && (
        <div className="hire-overlay" onClick={() => { setHireOpen(false); setStatus('idle') }}>
          <div className="hire-modal glass-card" onClick={e => e.stopPropagation()}>
            <button className="hire-close" onClick={() => { setHireOpen(false); setStatus('idle') }}><FiX /></button>
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
                <button className="btn-outline" onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }) }}>Send Another</button>
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
                  {status === 'sending' ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Sending...</> : <><FiSend /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}