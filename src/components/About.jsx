// src/components/About.jsx
import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiUser, FiInstagram, FiMapPin } from 'react-icons/fi'
import { SiBehance } from 'react-icons/si'
import './About.css'

/* ─────────────────────────────────────────
   SKILL LOGOS
───────────────────────────────────────── */
const SKILL_LOGOS = {
  // Languages
  'java':           'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'python':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'javascript':     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'js':             'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'typescript':     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'ts':             'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'c':              'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  'c++':            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'php':            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'kotlin':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
  'dart':           'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg',
  // Frontend
  'react':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'html':           'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'html & css':     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'css':            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'tailwind':       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'tailwindcss':    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'redux':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
  'graphql':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
  'flutter':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  // Backend / runtime
  'node':           'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'nodejs':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'node.js':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'express':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  // Databases
  'mongodb':        'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'mysql':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'postgresql':     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  // DevOps / Tools
  'git':            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'git & github':   'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'github':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'docker':         'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'aws':            'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
  'linux':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  'bash':           'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
  'vite':           'https://vitejs.dev/logo.svg',
  // Design & BaaS
  'figma':          'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'supabase':       'https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png',
  'firebase':       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
}

/* ── AI tool logos (CDN-safe SVG / PNG) ── */
const AI_LOGOS = {
  'claude ai':      'https://anthropic.com/favicon.ico',
  'genspark ai':    'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
  'chatgpt':        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/120px-ChatGPT_logo.svg.png',
  'gemini':         'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
  'github copilot': 'https://github.githubassets.com/images/modules/site/copilot/copilot-mark.svg',
  'grok ai':     'https://www.bing.com/th?id=OHR.GrokAI_Icon_EN-CA1111b9cbd8a7e089d2c8a9cbbfbb4&pid=Api&rs=1',
  'perplexity':     'https://www.perplexity.ai/icons/icon-96x96.png',
  'hugging face':   'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
}

/* per-AI accent colour class */
const AI_CLS = {
  'claude ai':      'ai-claude',
  'genspark ai':'ai-genspark',
  'chatgpt':        'ai-openai',
  'gemini':         'ai-gemini',
  'github copilot': 'ai-copilot',
  'grok ai':     'ai-grok',
  'perplexity':     'ai-perplexity',
  'hugging face':   'ai-hf',
}

const AI_TOOLS = [
  { name: 'Claude AI',      emoji: '🟠' },
  { name: 'ChatGPT',        emoji: '🟢' },
  { name: 'Gemini',         emoji: '🔵' },
  { name: 'GitHub Copilot', emoji: '⚫' },
  { name: 'Grok AI',        emoji: '🟣' },
  { name: 'Genspark AI',    emoji: '🟣' },
  { name: 'Perplexity',     emoji: '🔷' },
  { name: 'Hugging Face',   emoji: '🤗' },
]

function getLogo(skill) {
  return SKILL_LOGOS[skill.toLowerCase().trim()] || null
}
function getAiLogo(name) {
  return AI_LOGOS[name.toLowerCase().trim()] || null
}
function getAiCls(name) {
  return AI_CLS[name.toLowerCase().trim()] || 'ai-generic'
}

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
}

const STATS = [
  { label: 'Projects Built', value: '3+',  icon: '' },
  { label: 'Certificates',   value: '25+', icon: '' },
  { label: 'Technologies',   value: '12+', icon: '' },
  { label: 'Years Learning', value: '2+',  icon: '' },
]

function useVisible(ref, thresh = 0.1) {
  const [v, setV] = useState(false)
  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setV(true) },
      { threshold: thresh }
    )
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
          {/* ───── LEFT : Story ───── */}
          <div className={`about-story glass-card${vis ? ' anim delay-2' : ''}`}>
            <div className="about-icon-wrap"><FiUser /></div>
            <h3 className="about-story-title">My Story</h3>

            {loading ? (
              <div style={{ display:'flex', justifyContent:'center', padding:'32px 0' }}>
                <div className="spinner" style={{ width:36, height:36 }} />
              </div>
            ) : (
              <div className="about-bio">
                {info.bio.split('\n\n').filter(Boolean).map((p, i) => (
                  <p
                    key={i}
                    className={`about-para${vis ? ' anim' : ''}`}
                    style={{ animationDelay:`${0.28 + i * 0.11}s` }}
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
                       alt="figma" style={{ width:15, height:15 }} />
                  <span>{info.figma_email}</span>
                </a>
              )}
              {info.contact && (
                <div className="ac-item"><FiPhone /><span>{info.contact}</span></div>
              )}
              <a href={info.linkedin}  target="_blank" rel="noopener noreferrer" className="ac-item">
                <FiLinkedin /><span>LinkedIn</span>
              </a>
              <a href={info.github}    target="_blank" rel="noopener noreferrer" className="ac-item">
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

          {/* ───── RIGHT ───── */}
          <div className="about-right">
            {/* Stats */}
            <div className="about-stats">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`about-stat glass-card${vis ? ' anim' : ''}`}
                  style={{ animationDelay:`${0.18 + i * 0.09}s` }}
                >
                  <span className="stat-icon">{s.icon}</span>
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* ── COMBINED Tech Stack + AI Tools card ── */}
            <div className={`about-skills-card glass-card${vis ? ' anim delay-4' : ''}`}>

              {/* Section 1 — Tech Stack */}
              <div className="skills-section-head">
                <span className="skills-section-icon"></span>
                <h3 className="skills-title">Tech Stack &amp; Skills</h3>
              </div>
              <div className="skills-grid">
                {(info.skills || []).map((sk, i) => {
                  const logo = getLogo(sk)
                  return (
                    <span
                      key={i}
                      className={`skill-tag${vis ? ' anim' : ''}`}
                      style={{ animationDelay:`${0.48 + i * 0.055}s` }}
                    >
                      {logo && (
                        <img src={logo} alt={sk}
                             onError={e => e.target.style.display = 'none'} />
                      )}
                      {sk}
                    </span>
                  )
                })}
              </div>

              {/* Divider */}
              <div className="skills-divider">
                <span className="sd-line" />
                <span className="sd-text"> AI Tools Skills</span>
                <span className="sd-line" />
              </div>

              {/* Section 2 — AI Tools */}
              <p className="ai-sub-text">
                Leveraging cutting-edge AI to supercharge productivity &amp; creativity
              </p>
              <div className="skills-grid ai-skills-grid">
                {AI_TOOLS.map((tool, i) => {
                  const logo = getAiLogo(tool.name)
                  const cls  = getAiCls(tool.name)
                  return (
                    <span
                      key={i}
                      className={`skill-tag ai-skill-tag ${cls}${vis ? ' anim' : ''}`}
                      style={{ animationDelay:`${0.55 + i * 0.07}s` }}
                    >
                      {logo ? (
                        <img
                          src={logo} alt={tool.name}
                          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='inline' }}
                        />
                      ) : null}
                      <span className="ai-fallback-emoji" style={{ display: logo ? 'none' : 'inline' }}>
                        {tool.emoji}
                      </span>
                      {tool.name}
                      <span className="ai-pulse-dot" />
                    </span>
                  )
                })}
              </div>

              {/* cosmic orbit decoration */}
              <div className="skills-card-orbit">
                <div className="sco-dot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}