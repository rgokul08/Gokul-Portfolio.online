// src/components/Feedback.jsx
import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import {
  FiSend, FiCheckCircle, FiAlertCircle,
  FiMessageSquare, FiInstagram, FiMail, FiGithub, FiLinkedin
} from 'react-icons/fi'
import { SiBehance } from 'react-icons/si'


const SVC = 'service_goku08'
const TPL = 'template_95bsjjz'
const KEY = 'vME-mdDF8y05MgnRa'

const CONTACTS = [
  { icon: <FiMail />,      label: 'Primary Email',  value: 'rgokul08.in@gmail.com',  href: 'https://mail.google.com/mail/?view=cm&fs=1&to=rgokul08.in@gmail.com', cls: '' },
  { icon: <FiMail />,      label: 'Figma / Design', value: 'rffgokul@gmail.com',      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=rffgokul@gmail.com',   cls: 'figma' },
  { icon: <FiLinkedin />,  label: 'LinkedIn',        value: 'Gokul R',                href: 'https://www.linkedin.com/in/gokul-r-69ab13385/',                     cls: '' },
  { icon: <FiGithub />,    label: 'GitHub',          value: '@rgokul08',              href: 'https://github.com/rgokul08',                                        cls: '' },
  { icon: <FiInstagram />, label: 'Instagram',       value: '@itz_goku.08',           href: 'https://instagram.com/itz_goku.08',                                  cls: 'insta' },
  { icon: <SiBehance />,   label: 'Behance',         value: 'behance.net/gokul08',    href: 'https://www.behance.net/gokul08',                                    cls: 'behance' },
]

export default function Feedback() {
  const [form,   setForm]   = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')  // idle | sending | success | error
  const [err,    setErr]    = useState('')
  const ejsRef = useRef(null)

  /* Init EmailJS once */
  useEffect(() => {
    import('emailjs-com').then(mod => {
      ejsRef.current = mod.default
      try { ejsRef.current.init(KEY) } catch (_) {}
    })
  }, [])

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    setErr('')

    let supabaseOk = false
    let emailOk    = false

    /* 1. Supabase */
    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{ name: form.name, email: form.email, message: form.message }])
      if (error) console.error('Supabase insert error:', error)
      else supabaseOk = true
    } catch (ex) {
      console.error('Supabase exception:', ex)
    }

    /* 2. EmailJS */
    try {
      const ejs = ejsRef.current
      if (!ejs) throw new Error('EmailJS not loaded')

      const res = await ejs.send(SVC, TPL, {
        from_name:  form.name,
        from_email: form.email,
        message:    form.message,
        to_email:   'rgokul08.in@gmail.com',
        reply_to:   form.email,
      }, KEY)
      console.log('EmailJS OK:', res.status, res.text)
      emailOk = true
    } catch (ex) {
      console.error('EmailJS error:', ex)
    }

    if (supabaseOk || emailOk) {
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } else {
      setErr('Something went wrong. Please email rgokul08.in@gmail.com directly.')
      setStatus('error')
    }
  }

  return (
    <div className="feedback" id="contact">
      <div className="container">
        <div className="fb-grid">
          {/* Left: info */}
          <div className="fb-info">
            <div className="section-label">Get In Touch</div>
            <h2 className="section-title" style={{ marginBottom: 20 }}>
              Let's <span>Connect</span>
            </h2>
            <p className="fb-tagline">
              Have a project in mind, a question, or just want to say hi?<br />
              I'd love to hear from you — I'll reply within 24 hours.
            </p>
            <div className="fb-contacts">
              {CONTACTS.map((c, i) => (
                <a key={i} href={c.href} target="_blank" rel="noopener noreferrer"
                   className={`fb-contact-item ${c.cls}`}>
                  <div className={`fb-contact-icon ${c.cls}`}>{c.icon}</div>
                  <div>
                    <div className="fb-contact-label">{c.label}</div>
                    <div className="fb-contact-val">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="fb-form-card glass-card">
            <div className="fb-form-head">
              <FiMessageSquare /><span>Send a Message</span>
            </div>

            {status === 'success' ? (
              <div className="fb-success">
                <FiCheckCircle />
                <h3>Message Sent! 🎉</h3>
                <p>Thanks for reaching out! I'll get back to you soon.</p>
                <button className="btn-outline" onClick={() => setStatus('idle')}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="fb-form" noValidate>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    name="name" className="form-input" placeholder="Enter your name"
                    value={form.name} onChange={onChange} required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    name="email" type="email" className="form-input"
                    placeholder="xyz@example.com"
                    value={form.email} onChange={onChange} required
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message" className="form-input form-textarea"
                    placeholder="Tell me about your project or say hello…"
                    value={form.message} onChange={onChange} required rows={5}
                  />
                </div>
                {status === 'error' && (
                  <div className="form-error"><FiAlertCircle />{err}</div>
                )}
                <button
                  type="submit" className="btn-primary form-submit"
                  disabled={status === 'sending'}
                >
                  {status === 'sending'
                    ? <><div className="spinner" />Sending…</>
                    : <><FiSend />Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}