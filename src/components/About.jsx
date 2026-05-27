// src/components/About.jsx
import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiUser, FiInstagram } from 'react-icons/fi'
import './About.css'

const DEFAULT_ABOUT = {
  name: 'Gokul R',
  bio: `I'm Gokul R, a passionate Software Developer and AI & Data Science student at Prince Dr. K. Vasudevan College (2025–2029). I have a strong interest in web development, coding, and creating modern digital experiences. With a background in CBSE education from Zion International Public School, I developed a solid foundation in problem-solving and analytical thinking.

I specialize in web design, frontend development, and software development, with skills in building responsive and user-friendly websites. I enjoy learning new technologies, solving real-world problems, and continuously improving my technical abilities.

Education Journey

🎓 B.Tech in AI & Data Science
Prince Dr. K. Vasudevan College
2025 – 2029 | CGPA: 8.2/10

🎓 Higher Secondary Education (CBSE)
Zion School
2024 – 2025 | 92%

🎓 Secondary Education (CBSE)
Zion School
2022 – 2023 | 89%`,
  skills: ['Java', 'Python', 'Figma', 'HTML & CSS', 'JavaScript', 'Supabase', 'Git & GitHub'],
  email: 'rgokul08.in@gmail.com',
  contact: '+91 88382104XX',
  linkedin: 'https://www.linkedin.com/in/gokul-r-69ab13385/',
  github: 'https://github.com/rgokul08',
  instagram: 'https://instagram.com/itz_goku.08',
}

const stats = [
  { label: 'Projects Built',  value: '3+',  icon: '🚀' },
  { label: 'Certificates',    value: '25+', icon: '🏆' },
  { label: 'Technologies',    value: '7+',  icon: '⚡' },
  { label: 'Years Learning',  value: '2+',  icon: '📚' },
]

function useIntersection(ref, threshold = 0.12) {
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
                  <p
                    key={i}
                    className={`about-para ${visible ? 'reveal' : ''}`}
                    style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                  >
                    {para.trim()}
                  </p>
                ))}
              </div>
            )}
            <div className="about-contacts">
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${info.email}`} target="_blank" rel="noopener noreferrer" className="about-contact-item">
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
              <a href={info.instagram || DEFAULT_ABOUT.instagram} target="_blank" rel="noopener noreferrer" className="about-contact-item about-contact-instagram">
                <FiInstagram /> <span>Instagram Profile</span>
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