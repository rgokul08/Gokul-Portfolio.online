// src/components/Footer.jsx
import React, { useState, useEffect } from 'react'
import { FiGithub, FiLinkedin, FiMail, FiArrowUp, FiHeart, FiInstagram } from 'react-icons/fi'
import './Footer.css'

const socials = [
  { icon: <FiGithub />,   href: 'https://github.com/rgokul08',                            label: 'GitHub' },
  { icon: <FiLinkedin />, href: 'https://www.linkedin.com/in/gokul-r-69ab13385/',         label: 'LinkedIn' },
  { icon: <FiInstagram />, href: 'https://instagram.com/itz_goku.08',                      label: 'Instagram' },
  { icon: <FiMail />,     href: 'mailto:rgokul08.in@gmail.com',                           label: 'Email' },
]

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show back to top when user is near the end of the page
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      setShowBackToTop(scrollPercentage > 70)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
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
                <a key={s.label} href={s.href} target={s.label !== 'Email' ? "_blank" : undefined} rel={s.label !== 'Email' ? "noopener noreferrer" : undefined}
                  className="footer-social" aria-label={s.label} title={s.label}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <p>
              Made with <FiHeart style={{ color: '#fc4b4b', display: 'inline', verticalAlign: 'middle' }} /> by Gokul — {new Date().getFullYear()}
            </p>
            {showBackToTop && (
              <button className="footer-back-top" onClick={scrollTop} aria-label="Back to top">
                <FiArrowUp />
                Back to top
              </button>
            )}
          </div>
        </div>
      </footer>
    </>
  )
}