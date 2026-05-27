// src/components/About.jsx
import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiUser } from 'react-icons/fi'
import './About.css'

const DEFAULT_ABOUT = {
  name: 'Gokul R',
  bio: `I'm a passionate engineering student with a strong foundation in software development and a keen eye for design. I thrive at the intersection of technology and creativity — building applications that are not only functional but also delightful to use.

My journey in tech started with curiosity about how things work under the hood. Today, I channel that curiosity into crafting clean, efficient code and modern user interfaces. Whether it's a full-stack web app or a sleek UI component, I bring dedication and attention to detail to everything I build.

When I'm not coding, I'm exploring the latest in web technologies, contributing to open-source, or sketching UI concepts.`,
  skills: ['Java', 'Python', 'Figma', 'HTML & CSS', 'JavaScript', 'Supabase', 'Git & GitHub'],
  email: 'rgokul08.in@gmail.com',
  contact: '+91 88382104XX',
  linkedin: 'https://www.linkedin.com/in/gokul-r-69ab13385/',
  github: 'https://github.com/rgokul08',
}

const stats = [
  { label: 'Projects Built',  value: '3+',  icon: '🚀' },
  { label: 'Certificates',    value: '25+', icon: '🏆' },
  { label: 'Technologies',    value: '7+',  icon: '⚡' },
  { label: 'Years Learning',  value: '2+',  icon: '📚' },
]

function useIntersection(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return visible
}

export default function About() {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef(null)
  const visible = useIntersection(sectionRef)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase.from('about').select('*').single()
        if (error || !data) setAbout(DEFAULT_ABOUT)
        else setAbout({ ...DEFAULT_ABOUT, ...data })
      } catch {
        setAbout(DEFAULT_ABOUT)
      } finally {
        setLoading(false)
      }
    }
    fetchAbout()
  }, [])

  const info = about || DEFAULT_ABOUT

  return (
    <div className="about" ref={sectionRef}>
      <div className="container">
        <div className={`section-label ${visible ? 'reveal' : ''}`}>About Me</div>
        <h2 className={`section-title ${visible ? 'reveal delay-1' : ''}`}>
          Turning Ideas into <span>Reality</span>
        </h2>

        <div className="about-grid">
          {/* Left — story */}
          <div className={`about-story glass-card ${visible ? 'reveal delay-2' : ''}`}>
            <div className="about-story-icon"><FiUser /></div>
            <h3 className="about-story-title">My Story</h3>
            {loading ? (
              <div className="about-loading"><div className="spinner" /></div>
            ) : (
              <div className="about-bio-wrap">
                {info.bio.split('\n\n').map((para, i) => (
                  <p key={i} className={`about-para ${visible ? 'reveal' : ''}`} style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
                    {para.trim()}
                  </p>
                ))}
              </div>
            )}
            <div className="about-contacts">
              <a href={`mailto:${info.email}`} className="about-contact-item">
                <FiMail /> <span>{info.email}</span>
              </a>
              {info.contact && (
                <div className="about-contact-item">
                  <FiPhone /> <span>{info.contact}</span>
                </div>
              )}
              <a href={info.linkedin} target="_blank" rel="noopener noreferrer" className="about-contact-item">
                <FiLinkedin /> <span>LinkedIn Profile</span>
              </a>
              <a href={info.github} target="_blank" rel="noopener noreferrer" className="about-contact-item">
                <FiGithub /> <span>GitHub Profile</span>
              </a>
            </div>
          </div>

          {/* Right — stats + skills */}
          <div className="about-right">
            <div className="about-stats">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`about-stat glass-card ${visible ? 'reveal' : ''}`}
                  style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                >
                  <div className="about-stat-emoji">{s.icon}</div>
                  <div className="about-stat-value">{s.value}</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className={`about-skills-card glass-card ${visible ? 'reveal delay-4' : ''}`}>
              <h3 className="about-skills-title">Tech Stack & Skills</h3>
              <div className="about-skills-grid">
                {(info.skills || []).map((skill, i) => (
                  <span
                    key={i}
                    className={`skill-tag ${visible ? 'reveal' : ''}`}
                    style={{ animationDelay: `${0.5 + i * 0.07}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}