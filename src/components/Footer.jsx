// src/components/Footer.jsx
import React from 'react'
import { FiGithub, FiLinkedin, FiMail, FiInstagram, FiHeart } from 'react-icons/fi'
import './Footer.css'

const socials = [
  { icon: <FiGithub />,    href: 'https://github.com/rgokul08',                           label: 'GitHub',    cls: '' },
  { icon: <FiLinkedin />,  href: 'https://www.linkedin.com/in/gokul-r-69ab13385/',        label: 'LinkedIn',  cls: '' },
  { icon: <FiInstagram />, href: 'https://instagram.com/itz_goku.08',                     label: 'Instagram', cls: 'instagram' },
  { icon: <FiMail />,      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=rgokul08.in@gmail.com', label: 'Email', cls: '' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top-line" />
      <div className="container footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-mark">G</div>
            <span>Gokul</span>
          </div>
          <p className="footer-bio">
            Aspiring Software Developer & Engineering Student passionate 
            about building meaningful digital experiences.
          </p>
          <div className="footer-socials">
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className={`footer-social ${s.cls}`} aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="footer-contact-col">
          <h4 className="footer-col-title">Contact</h4>
          <div className="footer-contact-list">
            <div className="footer-contact-item">
              <FiMail />
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=rgokul08.in@gmail.com" target="_blank" rel="noopener noreferrer">
                rgokul08.in@gmail.com
              </a>
            </div>
            <div className="footer-contact-item">
              <FiLinkedin />
              <a href="https://www.linkedin.com/in/gokul-r-69ab13385/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
            <div className="footer-contact-item">
              <FiGithub />
              <a href="https://github.com/rgokul08" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
            <div className="footer-contact-item footer-contact-instagram">
              <FiInstagram />
              <a href="https://instagram.com/itz_goku.08" target="_blank" rel="noopener noreferrer">
                @itz_goku.08
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>
            Made with <FiHeart style={{ color: '#fc4b4b', display: 'inline', verticalAlign: 'middle' }} /> by Gokul — {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}