import { useState, useEffect, useRef } from 'react'
import { FiX, FiSend, FiAlertCircle, FiCheckCircle, FiZap } from 'react-icons/fi'
import ThemeToggle from './ThemeToggle'

const LINKS = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Certificates', id: 'certificates' },
  { label: 'Contact', id: 'feedback' },
]

const SVC = 'service_goku08'
const TPL = 'template_95bsjjz'
const KEY = 'vME-mdDF8y05MgnRa'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hireOpen, setHireOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [err, setErr] = useState('')
  const ejsRef = useRef<any>(null)

  useEffect(() => {
    import('emailjs-com').then(mod => {
      ejsRef.current = mod.default
      try { ejsRef.current.init(KEY) } catch (_) {}
    })
  }, [])

  useEffect(() => {
    const ids = ['home', 'about', 'projects', 'certificates', 'feedback']
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      let cur = 'home'
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 130) cur = id
      }
      setActive(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setHireOpen(false); setMobileOpen(false) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || hireOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, hireOpen])

  const nav = (id: string) => {
    setMobileOpen(false)
    setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }),
      mobileOpen ? 300 : 0
    )
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    setErr('')
    try {
      const ejs = ejsRef.current
      if (!ejs) throw new Error('EmailJS not loaded')
      await ejs.send(SVC, TPL, {
        from_name: form.name,
        from_email: form.email,
        message: `HIRE ME REQUEST\n\n${form.message}`,
        to_email: 'rgokul08.in@gmail.com',
        reply_to: form.email,
      }, KEY)
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (ex) {
      console.error('EmailJS error:', ex)
      setErr('Send failed — please email rgokul08.in@gmail.com directly.')
      setStatus('error')
    }
  }

  const openHire = () => { setMobileOpen(false); setHireOpen(true) }
  const closeHire = () => { setHireOpen(false); setStatus('idle'); setErr('') }

  return (
    <>
      <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => nav('home')}>
            <div className="nav-mark">G</div>
            <span>Gokul</span>
          </button>

          <nav className="nav-links">
            {LINKS.map((l, i) => (
              <button key={i} className={`nav-link${active === l.id ? ' active' : ''}`} onClick={() => nav(l.id)}>
                {l.label}
              </button>
            ))}
          </nav>

          <div className="nav-right">
            <ThemeToggle />
            <button className="btn-primary nav-cta" onClick={openHire}>
              <FiZap /> Hire Me
            </button>
          </div>

          <div className="nav-mobile-right">
            <ThemeToggle />
            <button
              className={`nav-ham${mobileOpen ? ' open' : ''}`}
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        <nav className={`nav-drawer${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
          {LINKS.map((l, i) => (
            <button
              key={i}
              className={`nav-drawer-link${active === l.id ? ' active' : ''}`}
              onClick={() => nav(l.id)}
              tabIndex={mobileOpen ? 0 : -1}
            >
              {l.label}
            </button>
          ))}
          <button className="btn-primary nav-drawer-cta" onClick={openHire} tabIndex={mobileOpen ? 0 : -1}>
            <FiZap /> Hire Me
          </button>
        </nav>
      </header>

      {mobileOpen && <div className="nav-overlay" onClick={() => setMobileOpen(false)} />}

      {hireOpen && (
        <div className="hire-overlay" onClick={closeHire}>
          <div className="hire-modal glass-card" onClick={e => e.stopPropagation()}>
            <button className="hire-close" onClick={closeHire} aria-label="Close">
              <FiX />
            </button>
            <div className="hire-header">
              <span className="hire-emoji">🚀</span>
              <h2>Let's Build Together</h2>
              <p>Tell me about your project — I'll reply within 24 hours.</p>
            </div>
            {status === 'success' ? (
              <div className="hire-success">
                <FiCheckCircle />
                <h3>Message Sent! 🎉</h3>
                <p>Thanks! I'll get back to you soon.</p>
                <button className="btn-outline" onClick={() => setStatus('idle')}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="form-group">
                  <label>Your Name</label>
                  <input name="name" className="form-input" placeholder="John Doe" value={form.name} onChange={onChange} required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input name="email" type="email" className="form-input" placeholder="john@example.com" value={form.email} onChange={onChange} required />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea name="message" className="form-input form-textarea" placeholder="Tell me about your project…" value={form.message} onChange={onChange} required rows={4} />
                </div>
                {status === 'error' && (
                  <div className="form-error"><FiAlertCircle />{err}</div>
                )}
                <button type="submit" className="btn-primary form-submit" disabled={status === 'sending'}>
                  {status === 'sending' ? <><div className="spinner" />Sending…</> : <><FiSend />Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
