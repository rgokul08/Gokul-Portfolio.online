// src/components/Feedback.jsx
import React, { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { FiSend, FiCheckCircle, FiAlertCircle, FiMessageSquare } from 'react-icons/fi'
import './Feedback.css'

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || ''
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || ''

export default function Feedback() {
  const formRef = useRef(null)
  const [form,    setForm]    = useState({ name: '', email: '', message: '' })
  const [status,  setStatus]  = useState('idle') // idle | sending | success | error
  const [errMsg,  setErrMsg]  = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const sendEmail = async () => {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) return
    // Dynamically import EmailJS to avoid build issues when keys are empty
    try {
      const emailjs = (await import('emailjs-com')).default
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          message:    form.message,
          to_email:   'rgokul08.in@gmail.com',
          reply_to:   form.email,
        },
        EMAILJS_PUBLIC_KEY
      )
    } catch (err) {
      console.warn('EmailJS error (non-fatal):', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    setStatus('sending')
    setErrMsg('')

    try {
      // 1. Save to Supabase
      const { error } = await supabase
        .from('feedback')
        .insert([{
          name:    form.name,
          email:   form.email,
          message: form.message,
        }])

      if (error) throw error

      // 2. Send email via EmailJS (best-effort)
      await sendEmail()

      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      setErrMsg('Something went wrong. Please try again or email directly.')
      setStatus('error')
    }
  }

  return (
    <div className="feedback" id="contact">
      <div className="container">
        <div className="feedback-grid">
          {/* Left — info */}
          <div className="feedback-info">
            <div className="section-label">Get In Touch</div>
            <h2 className="section-title" style={{ marginBottom: 24 }}>
              Let's <span>Connect</span>
            </h2>
            <p className="feedback-tagline">
              Whether you have a project in mind, a question, or just want to say hi — 
              I'd love to hear from you. I'll get back within 24 hours.
            </p>

            <div className="feedback-direct">
              <div className="feedback-direct-item">
                <div className="feedback-direct-icon">📧</div>
                <div>
                  <div className="feedback-direct-label">Email</div>
                  <a href="mailto:rgokul08.in@gmail.com" className="feedback-direct-value">
                    rgokul08.in@gmail.com
                  </a>
                </div>
              </div>
              <div className="feedback-direct-item">
                <div className="feedback-direct-icon">💼</div>
                <div>
                  <div className="feedback-direct-label">LinkedIn</div>
                  <a
                    href="https://www.linkedin.com/in/gokul-r-69ab13385/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="feedback-direct-value"
                  >
                    Gokul R
                  </a>
                </div>
              </div>
              <div className="feedback-direct-item">
                <div className="feedback-direct-icon">💻</div>
                <div>
                  <div className="feedback-direct-label">GitHub</div>
                  <a
                    href="https://github.com/rgokul08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="feedback-direct-value"
                  >
                    @rgokul08
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="feedback-form-wrap glass-card">
            <div className="feedback-form-header">
              <FiMessageSquare />
              <span>Send a Message</span>
            </div>

            {status === 'success' ? (
              <div className="feedback-success">
                <FiCheckCircle />
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out, {form.name || 'there'}! I'll reply soon.</p>
                <button className="btn-outline" onClick={() => setStatus('idle')}>
                  Send Another
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="feedback-form" noValidate>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project or just say hello..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="form-input form-textarea"
                  />
                </div>

                {status === 'error' && (
                  <div className="form-error">
                    <FiAlertCircle /> {errMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary form-submit"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <><div className="spinner" style={{ width: 18, height: 18 }} /> Sending...</>
                  ) : (
                    <><FiSend /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
