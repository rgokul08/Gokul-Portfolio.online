import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiInstagram, FiMapPin } from 'react-icons/fi'
import { SiBehance } from 'react-icons/si'

const SKILL_LOGOS: Record<string, string> = {
  'java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'javascript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'typescript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'c': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  'c++': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'react': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'html': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'html & css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'css': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'tailwind': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'tailwindcss': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'redux': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
  'node': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'nodejs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'express': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'mongodb': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'mysql': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'git & github': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'github': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'supabase': 'https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png',
  'firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  'vite': 'https://vitejs.dev/logo.svg',
}

const AI_LOGOS: Record<string, string> = {
  'claude ai': 'https://anthropic.com/favicon.ico',
  'genspark ai': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/genspark-ai-icon.png',
  'chatgpt': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/120px-ChatGPT_logo.svg.png',
  'gemini': 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
  'copilot ai': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-copilot-icon.png',
  'grok ai': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/grok-icon.png',
  'perplexity': 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png',
  'hugging face': 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
}

const AI_TOOLS = [
  { name: 'Claude AI' },
  { name: 'ChatGPT' },
  { name: 'Gemini' },
  { name: 'Copilot AI' },
  { name: 'Grok AI' },
  { name: 'Genspark AI' },
  { name: 'Perplexity' },
  { name: 'Hugging Face' },
]

const EDUCATION = [
  {
    degree: 'B.Tech in AI & Data Science',
    school: 'Prince Dr. K. Vasudevan College',
    year: '2025–2029',
    score: 'CGPA: 8.2/10',
    logo: 'https://rshbwueoscurgzfkouuh.supabase.co/storage/v1/object/public/Portfolio/logos/college-logo.png',
  },
  {
    degree: 'Higher Secondary (12th)',
    school: 'Zion International Public School (CBSE)',
    year: '2024–2025',
    score: '80%',
    logo: 'https://rshbwueoscurgzfkouuh.supabase.co/storage/v1/object/public/Portfolio/logos/school-logo.png',
  },
  {
    degree: 'Secondary (10th)',
    school: 'Zion International Public School (CBSE)',
    year: '2022–2023',
    score: '78%',
    logo: 'https://rshbwueoscurgzfkouuh.supabase.co/storage/v1/object/public/Portfolio/logos/school-logo.png',
  },
]

const DEFAULT = {
  name: 'Gokul R',
  bio: `I'm Gokul R, a passionate Software Developer and AI & Data Science student. I specialize in web design, frontend development, and software development, with skills in building responsive and user-friendly websites. I enjoy learning new technologies, solving real-world problems, and continuously improving my technical abilities.`,
  skills: ['Java', 'Python', 'Figma', 'HTML & CSS', 'JavaScript', 'React', 'NodeJs', 'Vite', 'Supabase', 'Git', 'GitHub'],
  email: 'rgokul08.in@gmail.com',
  contact: '+91 88382104XX',
  linkedin: 'https://www.linkedin.com/in/gokul-r-69ab13385/',
  github: 'https://github.com/rgokul08',
  instagram: 'https://instagram.com/itz_goku.08',
  behance: 'https://www.behance.net/gokul08',
}

const STATS = [
  { label: 'Projects Built', value: '3+' },
  { label: 'Certificates', value: '25+' },
  { label: 'Technologies', value: '12+' },
  { label: 'Years Learning', value: '2+' },
]

function useVisible(ref: React.RefObject<HTMLElement | null>, thresh = 0.1) {
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

function getLogo(skill: string) {
  return SKILL_LOGOS[skill.toLowerCase().trim()] || null
}
function getAiLogo(name: string) {
  return AI_LOGOS[name.toLowerCase().trim()] || null
}

export default function About() {
  const [profile, setProfile] = useState(DEFAULT)
  const sectionRef = useRef<HTMLDivElement>(null)
  const visible = useVisible(sectionRef)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase.from('profile').select('*').single()
        if (data) {
          setProfile({
            name: data.name || DEFAULT.name,
            bio: data.bio || DEFAULT.bio,
            skills: data.skills || DEFAULT.skills,
            email: data.email || DEFAULT.email,
            contact: data.contact || DEFAULT.contact,
            linkedin: data.linkedin || DEFAULT.linkedin,
            github: data.github || DEFAULT.github,
            instagram: data.instagram || DEFAULT.instagram,
            behance: data.behance || DEFAULT.behance,
          })
        }
      } catch (e) { console.warn('profile fetch', e) }
    }
    load()
  }, [])

  const skills = Array.isArray(profile.skills) ? profile.skills :
    typeof profile.skills === 'string' ? (profile.skills as string).split(',').map((s: string) => s.trim()) : DEFAULT.skills

  return (
    <div className={`about reveal${visible ? ' visible' : ''}`} ref={sectionRef}>
      <div className="container">
        <div className="section-label">About Me</div>
        <h2 className="section-title">My <span>Story</span></h2>

        <div className="about-content">
          {/* Left Column: Bio + Contact */}
          <div>
            <div className="about-bio">
              <h3>Who I Am 🚀</h3>
              <p className="about-bio-text">{profile.bio}</p>
            </div>

            <div className="about-contact-list">
              <div className="about-contact-item"><FiMail /><a href={`mailto:${profile.email}`}>{profile.email}</a></div>
              <div className="about-contact-item"><FiPhone /><span>{profile.contact}</span></div>
              <div className="about-contact-item"><FiMapPin /><span>Chengalpattu, Tamil Nadu, India</span></div>
              <div className="about-contact-item"><FiLinkedin /><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
              <div className="about-contact-item"><FiGithub /><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a></div>
              <div className="about-contact-item"><FiInstagram /><a href={profile.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></div>
              <div className="about-contact-item"><SiBehance /><a href={profile.behance} target="_blank" rel="noopener noreferrer">Behance</a></div>
            </div>

            <div className="about-stats">
              {STATS.map((s, i) => (
                <div key={i} className="about-stat glass-card">
                  <div className="about-stat-value">{s.value}</div>
                  <div className="about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Education + Skills + AI */}
          <div>
            {/* Education Timeline */}
            <div className="edu-timeline">
              <div className="edu-timeline-title">🎓 Education Journey</div>
              <div className="timeline">
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-header">
                      <img
                        src={edu.logo}
                        alt={edu.school}
                        className="timeline-logo"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      <div className="timeline-info">
                        <div className="timeline-degree">{edu.degree}</div>
                        <div className="timeline-school">{edu.school}</div>
                      </div>
                    </div>
                    <div className="timeline-year">{edu.year}</div>
                    <div className="timeline-score">{edu.score}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Skills */}
            <div className="about-skills-section">
              <div className="about-skills-title">⚡ Tech Stack</div>
              <div className="skills-grid">
                {skills.map((skill: string, i: number) => {
                  const logo = getLogo(skill)
                  return (
                    <div key={i} className="skill-chip" tabIndex={0} role="button" aria-label={skill}>
                      {logo ? (
                        <img src={logo} alt={skill} className="skill-chip-logo" loading="lazy" />
                      ) : (
                        <div className="skill-chip-logo" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔧</div>
                      )}
                      <span className="skill-chip-name">{skill}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* AI Tools */}
            <div className="ai-tools-section">
              <div className="about-skills-title">🤖 AI Tools I Use</div>
              <div className="ai-grid">
                {AI_TOOLS.map((tool, i) => {
                  const logo = getAiLogo(tool.name)
                  return (
                    <div key={i} className="ai-chip" tabIndex={0} role="button" aria-label={tool.name}>
                      {logo ? (
                        <img src={logo} alt={tool.name} className="ai-chip-logo" loading="lazy" />
                      ) : (
                        <div className="ai-chip-logo" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
                      )}
                      <span className="ai-chip-name">{tool.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
