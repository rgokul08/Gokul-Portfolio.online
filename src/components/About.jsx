// src/components/About.jsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiUser } from 'react-icons/fi'
import './About.css'

const DEFAULT_ABOUT = {
  name: 'Gokul R',
  bio: `I'm a passionate engineering student with a strong foundation in software development and a keen eye for design. I thrive at the intersection of technology and creativity — building applications that are not only functional but also delightful to use.

My journey in tech started with curiosity about how things work under the hood. Today, I channel that curiosity into crafting clean, efficient code and modern user interfaces. Whether it's a full-stack web app or a sleek UI component, I bring dedication and attention to detail to everything I build.

When I'm not coding, I'm exploring the latest in web technologies, contributing to open-source, or sketching UI concepts.`,

  skills: ['Java', 'Python','Figma', 'HTML & CSS', 'JavaScript', 'Supabase', 'Git & GitHub'],
  email: 'rgokul08.in@gmail.com',
  contact: '+91 88382104XX',
  linkedin: 'https://www.linkedin.com/in/gokul-r-69ab13385/',
  github: 'https://github.com/rgokul08',
}

const stats = [
  { label: 'Projects Built',    value: '3+' },
  { label: 'Certificates',      value: '25+' },
  { label: 'Technologies',      value: '7+' },
  { label: 'Years Learning',    value: '2+' },
]

export default function About() {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data, error } = await supabase
          .from('about')
          .select('*')
          .single()
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
    <div className="about">
      <div className="container">
        <div className="section-label">About Me</div>
        <h2 className="section-title">
          Turning Ideas into <span>Reality</span>
        </h2>

        <div className="about-grid">
          {/* Left — story */}
          <div className="about-story glass-card">
            <div className="about-story-icon"><FiUser /></div>
            <h3 className="about-story-title">My Story</h3>
            {loading ? (
              <div className="about-loading">
                <div className="spinner" />
              </div>
            ) : (
              info.bio.split('\n\n').map((para, i) => (
                <p key={i} className="about-para">{para.trim()}</p>
              ))
            )}

            {/* Contact details */}
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

          {/* Right — skills + stats */}
          <div className="about-right">
            {/* Stats */}
            <div className="about-stats">
              {stats.map((s) => (
                <div key={s.label} className="about-stat glass-card">
                  <div className="about-stat-value">{s.value}</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="about-skills-card glass-card">
              <h3 className="about-skills-title">Tech Stack & Skills</h3>
              <div className="about-skills-grid">
                {(info.skills || []).map((skill, i) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
