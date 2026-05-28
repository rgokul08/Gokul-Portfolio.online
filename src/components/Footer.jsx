// src/components/Footer.jsx
import React from 'react'
import { FiGithub, FiLinkedin, FiMail, FiInstagram, FiHeart, FiMapPin, FiPhone } from 'react-icons/fi'
import { SiBehance } from 'react-icons/si'
import './Footer.css'

const SOCIALS = [
  { icon: <FiGithub />,    href: 'https://github.com/rgokul08',                                          label: 'GitHub',    cls: '' },
  { icon: <FiLinkedin />,  href: 'https://www.linkedin.com/in/gokul-r-69ab13385/',                      label: 'LinkedIn',  cls: '' },
  { icon: <FiInstagram />, href: 'https://instagram.com/itz_goku.08',                                   label: 'Instagram', cls: 'insta' },
  { icon: <SiBehance />,   href: 'https://www.behance.net/gokul08',                                     label: 'Behance',   cls: 'behance' },
  { icon: <FiMail />,      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=rgokul08.in@gmail.com', label: 'Email',     cls: '' },
]

const CONTACT_ITEMS = [
  { icon: <FiMail />,      label: 'Primary Email',  value: 'rgokul08.in@gmail.com',   href: 'https://mail.google.com/mail/?view=cm&fs=1&to=rgokul08.in@gmail.com', cls: '' },
  { icon: <FiMail />,      label: 'Figma / Design', value: 'rffgokul@gmail.com',      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=rffgokul@gmail.com',   cls: 'figma' },
  { icon: <FiLinkedin />,  label: 'LinkedIn',       value: 'Gokul R',                 href: 'https://www.linkedin.com/in/gokul-r-69ab13385/',                     cls: '' },
  { icon: <FiGithub />,    label: 'GitHub',         value: '@rgokul08',               href: 'https://github.com/rgokul08',                                        cls: '' },
  { icon: <FiInstagram />, label: 'Instagram',      value: '@itz_goku.08',            href: 'https://instagram.com/itz_goku.08',                                  cls: 'insta' },
  { icon: <SiBehance />,   label: 'Behance',        value: 'behance.net/gokul08',     href: 'https://www.behance.net/gokul08',                                    cls: 'behance' },
]

const SERVICES = [
  'Frontend Development',
  'UI / UX Design',
  'Web Applications',
  'Data Analysis',
  'Python Scripting',
  'Figma Prototyping',
]

export default function Footer() {
  return (
    <footer className="footer">
      {/* top gradient line */}
      <div className="footer-top-line" />

      <div className="container footer-main">
        {/* ── Brand column ── */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-mark">G</div>
            <span className="footer-logo-name">Gokul R</span>
          </div>
          <p className="footer-bio">
            Aspiring Software Developer &amp; AI/Data Science student passionate
            about building meaningful digital experiences with clean code and
            modern design.
          </p>

          {/* availability badge */}
          <div className="footer-availability">
            <span className="fa-dot" />
            Available for freelance &amp; internships
          </div>

          {/* socials */}
          <div className="footer-socials">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                 className={`footer-social ${s.cls}`} aria-label={s.label}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Services column ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">What I Do</h4>
          <ul className="footer-services">
            {SERVICES.map(s => (
              <li key={s} className="footer-service-item">
                <span className="fsi-dot" />
                {s}
              </li>
            ))}
          </ul>
        </div>

       
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} Gokul R — Designed &amp; Built with{' '}
            <FiHeart style={{ display: 'inline', verticalAlign: 'middle', color: '#fc6b6b' }} />{' '}
            in Tamil Nadu, India
          </p>
        </div>
      </div>
    </footer>
  )
}