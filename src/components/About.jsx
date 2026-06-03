// src/components/About.jsx
import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiUser, FiInstagram, FiMapPin } from 'react-icons/fi'
import { SiBehance } from 'react-icons/si'
import './About.css'

/* ── Skill → logo mapping (expanded with AI tools) ── */
const SKILL_LOGOS = {
  // Languages
  'java':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'python':       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'javascript':   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'js':           'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'typescript':   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'ts':           'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'c':            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  'c++':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'php':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'kotlin':       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
  'dart':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
  // Frontend
  'react':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'html':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'html & css':   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'css':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'tailwind':     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'tailwindcss':  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'redux':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
  'graphql':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
  'flutter':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  // Backend & runtime
  'node':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'nodejs':       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'node.js':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'express':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  // Databases
  'mongodb':      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'mysql':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'postgresql':   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  // DevOps / Tools
  'git':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'git & github': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'github':       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'docker':       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'aws':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
  'linux':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  'bash':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
  'vite':         'https://vitejs.dev/logo.svg',
  // Design & BaaS
  'figma':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'supabase':     'https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png',
  'firebase':     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  // ── AI Tools ──
  'claude':       'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/512px-Claude_AI_logo.svg.png',
  'claude ai':    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/512px-Claude_AI_logo.svg.png',
  'chatgpt':      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png',
  'chat gpt':     'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png',
  'openai':       'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png',
  'gemini':       'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/512px-Google_Gemini_logo.svg.png',
  'google gemini':'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/512px-Google_Gemini_logo.svg.png',
  'copilot':      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Microsoft_365_Copilot_Icon.svg/512px-Microsoft_365_Copilot_Icon.svg.png',
  'github copilot':'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Microsoft_365_Copilot_Icon.svg/512px-Microsoft_365_Copilot_Icon.svg.png',
  'midjourney':   'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Midjourney_Emblem.png/512px-Midjourney_Emblem.png',
  'stable diffusion': null,
  'hugging face': 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
  'huggingface':  'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
  'langchain':    null,
  'ollama':       null,
  'perplexity':   null,
}

function getLogo(skill) {
  const key = skill.toLowerCase().trim()
  return SKILL_LOGOS[key] || null
}

/* ── AI badge colour by tool ── */
function getAiBadgeClass(skill) {
  const k = skill.toLowerCase()
  if (k.includes('claude'))     return 'ai-claude'
  if (k.includes('chatgpt') || k.includes('openai')) return 'ai-openai'
  if (k.includes('gemini'))     return 'ai-gemini'
  if (k.includes('copilot'))    return 'ai-copilot'
  if (k.includes('midjourney')) return 'ai-mid'
  if (k.includes('hugging') || k.includes('huggingface')) return 'ai-hf'
  return 'ai-generic'
}

const AI_SKILLS = ['Claude AI', 'ChatGPT', 'Gemini', 'GitHub Copilot', 'Midjourney', 'HuggingFace']

const DEFAULT = {
  name: 'Gokul R',
  bio: `I'm Gokul R, a passionate Software Developer and AI & Data Science student at Prince Dr. K. Vasudevan College (2025–2029). I have a strong interest in web development, coding, and creating modern digital experiences.

I specialize in web design, frontend development, and software development, with skills in building responsive and user-friendly websites. I enjoy learning new technologies, solving real-world problems, and continuously improving my technical abilities.

Education Journey

🎓 B.Tech in AI & Data Science — Prince Dr. K. Vasudevan College — 2025–2029 | CGPA: 8.2/10

🎓 Higher Secondary — Zion International Public School (CBSE) — 2024–2025 | 80%

🎓 Secondary — Zion International Public School (CBSE) — 2022–2023 | 78%`,
  skills: ['Java', 'Python', 'Figma', 'HTML & CSS', 'JavaScript', 'React', 'NodeJs', 'Vite', 'Supabase', 'Git', 'GitHub'],
  email: 'rgokul08.in@gmail.com',
  figma_email: 'rffgokul@gmail.com',
  contact: '+91 88382104XX',
  linkedin: 'https://www.linkedin.com/in/gokul-r-69ab13385/',
  github: 'https://github.com/rgokul08',
  instagram: 'https://instagram.com/itz_goku.08',
  behance: 'https://www.behance.net/gokul08',
  location: 'Tambaram, Chengalpattu, Tamil Nadu',
}

const STATS = [
  { label: 'Projects Built', value: '3+',  icon: '🚀' },
  { label: 'Certificates',   value: '25+', icon: '🏆' },
  { label: 'Technologies',   value: '12+', icon: '⚡' },
  { label: 'Years Learning', value: '2+',  icon: '📚' },
]

function useVisible(ref, thresh = 0.1) {
  const [v, setV] = useState(false)
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold: thresh })
    if (ref.current) ob.observe(ref.current)
    return () => ob.disconnect()
  }, [ref, thresh])
  return v
}

export default function About() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const vis = useVisible(ref)

  useEffect(() => {
    supabase.from('about').select('*').single()
      .then(({ data: d, error }) => {
        setData(error || !d ? DEFAULT : { ...DEFAULT, ...d })
      })
      .catch(() => setData(DEFAULT))
      .finally(() => setLoading(false))
  }, [])

  const info = data || DEFAULT

  return (
    <div className="about" ref={ref}>
      <div className="container">
        <div className={`section-label${vis ? ' anim' : ''}`}>About Me</div>
        <h2 className={`section-title${vis ? ' anim delay-1' : ''}`}>
          Turning Ideas into <span>Reality</span>
        </h2>

        <div className="about-grid">
          {/* ── Left: Story ── */}
          <div className={`about-story glass-card${vis ? ' anim delay-2' : ''}`}>
            <div className="about-icon-wrap"><FiUser /></div>
            <h3 className="about-story-title">My Story</h3>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0' }}>
                <div className="spinner" style={{ width: 36, height: 36 }} />
              </div>
            ) : (
              <div className="about-bio">
                {info.bio.split('\n\n').filter(Boolean).map((p, i) => (
                  <p
                    key={i}
                    className={`about-para${vis ? ' anim' : ''}`}
                    style={{ animationDelay: `${0.28 + i * 0.11}s` }}
                  >
                    {p.trim()}
                  </p>
                ))}
              </div>
            )}

            <div className="about-contacts">
              <div className="ac-item ac-location">
                <FiMapPin />
                <span>Tambaram, Chengalpattu, Tamil Nadu</span>
              </div>
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${info.email}`}
                 target="_blank" rel="noopener noreferrer" className="ac-item">
                <FiMail /><span>{info.email}</span>
              </a>
              {info.figma_email && (
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${info.figma_email}`}
                   target="_blank" rel="noopener noreferrer" className="ac-item ac-figma">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"
                       alt="figma" style={{ width: 15, height: 15 }} />
                  <span>{info.figma_email}</span>
                </a>
              )}
              {info.contact && (
                <div className="ac-item"><FiPhone /><span>{info.contact}</span></div>
              )}
              <a href={info.linkedin} target="_blank" rel="noopener noreferrer" className="ac-item">
                <FiLinkedin /><span>LinkedIn</span>
              </a>
              <a href={info.github} target="_blank" rel="noopener noreferrer" className="ac-item">
                <FiGithub /><span>GitHub</span>
              </a>
              <a href={info.instagram || DEFAULT.instagram} target="_blank" rel="noopener noreferrer"
                 className="ac-item ac-insta">
                <FiInstagram /><span>Instagram</span>
              </a>
              <a href={info.behance || DEFAULT.behance} target="_blank" rel="noopener noreferrer"
                 className="ac-item ac-behance">
                <SiBehance /><span>Behance</span>
              </a>
            </div>
          </div>

          {/* ── Right ── */}
          <div className="about-right">
            {/* Stats */}
            <div className="about-stats">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`about-stat glass-card${vis ? ' anim' : ''}`}
                  style={{ animationDelay: `${0.18 + i * 0.09}s` }}
                >
                  <span className="stat-icon">{s.icon}</span>
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Tech Stack */}
            <div className={`about-skills-card glass-card${vis ? ' anim delay-4' : ''}`}>
              <h3 className="skills-title">Tech Stack & Skills</h3>
              <div className="skills-grid">
                {(info.skills || []).map((sk, i) => {
                  const logo = getLogo(sk)
                  return (
                    <span
                      key={i}
                      className={`skill-tag${vis ? ' anim' : ''}`}
                      style={{ animationDelay: `${0.48 + i * 0.06}s` }}
                    >
                      {logo && (
                        <img src={logo} alt={sk} onError={e => e.target.style.display = 'none'} />
                      )}
                      {sk}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* ── AI Tools Section ── */}
            <div className={`about-ai-card glass-card${vis ? ' anim delay-5' : ''}`}>
              <div className="ai-card-header">
                <div className="ai-card-icon">🤖</div>
                <div>
                  <h3 className="skills-title" style={{ marginBottom: 2 }}>AI Tools I Use</h3>
                  <p className="ai-card-sub">Leveraging cutting-edge AI to supercharge productivity</p>
                </div>
              </div>
              <div className="skills-grid ai-skills-grid">
                {AI_SKILLS.map((sk, i) => {
                  const logo = getLogo(sk)
                  const cls  = getAiBadgeClass(sk)
                  return (
                    <span
                      key={i}
                      className={`skill-tag ai-skill-tag ${cls}${vis ? ' anim' : ''}`}
                      style={{ animationDelay: `${0.55 + i * 0.07}s` }}
                    >
                      {logo ? (
                        <img src={logo} alt={sk} onError={e => e.target.style.display = 'none'} />
                      ) : (
                        <span className="ai-emoji-icon">✨</span>
                      )}
                      {sk}
                    </span>
                  )
                })}
              </div>

              {/* Floating AI orbit decoration */}
              <div className="ai-orbit-ring">
                <div className="ai-orbit-dot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}