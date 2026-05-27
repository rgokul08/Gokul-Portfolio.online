// src/components/Footer.jsx
import React from 'react'
import { FiGithub, FiLinkedin, FiMail, FiArrowUp, FiHeart } from 'react-icons/fi'
import './Footer.css'

const navLinks = [
  { label: 'Home',         href: '#home' },
  { label: 'About',        href: '#about' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Feedback',     href: '#feedback' },
]

const socials = [
  { icon: <FiGithub />,   href: 'https://github.com/rgokul08',                            label: 'GitHub' },
  { icon: <FiLinkedin />, href: 'https://www.linkedin.com/in/gokul-r-69ab13385/',         label: 'LinkedIn' },
  { icon: <FiMail />,     href: 'mailto:rgokul08.in@gmail.com',                           label: 'Email' },
]

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleNav = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

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
                className="footer-social" aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="footer-links">
          <h4 className="footer-col-title">Quick Links</h4>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="footer-link"
              onClick={(e) => { e.preventDefault(); handleNav(link.href) }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h4 className="footer-col-title">Contact</h4>
          <div className="footer-contact-item">
            <FiMail />
            <a href="mailto:rgokul08.in@gmail.com">rgokul08.in@gmail.com</a>
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
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>
            Made with <FiHeart style={{ color: '#fc4b4b', display: 'inline', verticalAlign: 'middle' }} /> by Gokul — {new Date().getFullYear()}
          </p>
          <button className="footer-back-top" onClick={scrollTop} aria-label="Back to top">
            <FiArrowUp />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
