import React,{useEffect,useState,useRef} from 'react'
import {supabase} from '../lib/supabase'
import {FiMail,FiPhone,FiLinkedin,FiGithub,FiUser,FiInstagram,FiMapPin} from 'react-icons/fi'
import {SiBehance} from 'react-icons/si'
import './About.css'

const SKILL_LOGOS={
  'java':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'python':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'javascript':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'js':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'typescript':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'react':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'html':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'html & css':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'css':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'node':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'nodejs':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'node.js':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'express':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'mongodb':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'mysql':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'postgresql':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'git':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'git & github':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'github':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'figma':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'vite':'https://vitejs.dev/logo.svg',
  'tailwind':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
  'tailwindcss':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
  'supabase':'https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png',
  'firebase':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  'docker':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'c':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
  'c++':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  'kotlin':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
  'flutter':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  'linux':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  'php':'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'vercel':'https://cdn.worldvectorlogo.com/logos/vercel.svg',
}
function getLogo(sk){ return SKILL_LOGOS[sk.toLowerCase().trim()]||null }

const DEFAULT={
  name:'Gokul R',
  bio:`I'm Gokul R, a passionate Software Developer and AI & Data Science student at Prince Dr. K. Vasudevan College (2025–2029). I have a strong interest in web development, coding, and creating modern digital experiences.\n\nI specialize in web design, frontend development, and software development, with skills in building responsive and user-friendly websites. I enjoy learning new technologies, solving real-world problems, and continuously improving my technical abilities.\n\nEducation Journey\n\n🎓 B.Tech in AI & Data Science — Prince Dr. K. Vasudevan College — 2025–2029 | CGPA: 8.2/10\n\n🎓 Higher Secondary — Zion International Public School (CBSE) — 2024–2025 | 80%\n\n🎓 Secondary — Zion International Public School (CBSE) — 2022–2023 | 78%`,
  skills:['Java','Python','Figma','HTML & CSS','JavaScript','React','Node.js','Vite','Supabase','Git','GitHub','Tailwind CSS','Vercel'],
  email:'rgokul08.in@gmail.com',
  figma_email:'rffgokul@gmail.com',
  contact:'+91 88382104XX',
  linkedin:'https://www.linkedin.com/in/gokul-r-69ab13385/',
  github:'https://github.com/rgokul08',
  instagram:'https://instagram.com/itz_goku.08',
  behance:'https://www.behance.net/gokul08',
}

const STATS=[
  {label:'Projects Built',value:'3+',icon:''},
  {label:'Certificates',value:'25+',icon:''},
  {label:'Technologies',value:'7+',icon:''},
  {label:'Years Learning',value:'2+',icon:''},
]

function useVisible(ref,thresh=0.1){
  const[v,setV]=useState(false)
  useEffect(()=>{
    const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:thresh})
    if(ref.current) ob.observe(ref.current)
    return()=>ob.disconnect()
  },[ref,thresh])
  return v
}

function SkillsBelt({skills}){
  if(!skills||skills.length===0) return null
  // split into two rows
  const half=Math.ceil(skills.length/2)
  const row1=[...skills.slice(0,half),...skills.slice(0,half)]
  const row2=[...skills.slice(half),...skills.slice(half)]

  return(
    <div className="skills-belt-wrap">
      <div className="skills-belt-row">
        {row1.map((sk,i)=>{
          const logo=getLogo(sk)
          return(
            <span key={i} className="belt-tag">
              {logo&&<img src={logo} alt={sk} onError={e=>e.target.style.display='none'}/>}
              {sk}
            </span>
          )
        })}
      </div>
      {row2.length>0&&(
        <div className="skills-belt-row row-reverse">
          {row2.map((sk,i)=>{
            const logo=getLogo(sk)
            return(
              <span key={i} className="belt-tag">
                {logo&&<img src={logo} alt={sk} onError={e=>e.target.style.display='none'}/>}
                {sk}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function About(){
  const[data,setData]=useState(null)
  const[loading,setLoading]=useState(true)
  const ref=useRef(null)
  const vis=useVisible(ref)

  useEffect(()=>{
    supabase.from('about').select('*').single()
      .then(({data:d,error})=>{ setData(error||!d?DEFAULT:{...DEFAULT,...d}) })
      .catch(()=>setData(DEFAULT))
      .finally(()=>setLoading(false))
  },[])

  const info=data||DEFAULT

  return(
    <div className="about" ref={ref}>
      <div className="container">
        <div className={`section-label${vis?' anim':''}`}>About Me</div>
        <h2 className={`section-title${vis?' anim delay-1':''}`}>
          Turning Ideas into <span>Reality</span>
        </h2>

        <div className="about-grid">
          {/* LEFT */}
          <div className={`about-story glass-card${vis?' anim delay-2':''}`}>
            <div className="about-icon-wrap"><FiUser/></div>
            <h3 className="about-story-title">My Story</h3>

            {loading
              ?<div style={{display:'flex',justifyContent:'center',padding:'32px 0'}}><div className="spinner" style={{width:36,height:36}}/></div>
              :<div className="about-bio">
                {info.bio.split('\n\n').filter(Boolean).map((p,i)=>(
                  <p key={i} className={`about-para${vis?' anim':''}`}
                     style={{animationDelay:`${0.3+i*0.1}s`}}>{p.trim()}</p>
                ))}
              </div>
            }

            <div className="about-contacts">
              <div className="ac-item ac-location"><FiMapPin/><span>Tambaram, Chengalpattu, Tamil Nadu</span></div>
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${info.email}`} target="_blank" rel="noopener noreferrer" className="ac-item">
                <FiMail/><span>{info.email}</span>
              </a>
              {info.figma_email&&(
                <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${info.figma_email}`} target="_blank" rel="noopener noreferrer" className="ac-item ac-figma">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" alt="figma" style={{width:15,height:15}}/>
                  <span>{info.figma_email}</span>
                </a>
              )}
              {info.contact&&<div className="ac-item"><FiPhone/><span>{info.contact}</span></div>}
              <a href={info.linkedin} target="_blank" rel="noopener noreferrer" className="ac-item"><FiLinkedin/><span>LinkedIn</span></a>
              <a href={info.github} target="_blank" rel="noopener noreferrer" className="ac-item"><FiGithub/><span>GitHub</span></a>
              <a href={info.instagram||DEFAULT.instagram} target="_blank" rel="noopener noreferrer" className="ac-item ac-insta"><FiInstagram/><span>Instagram</span></a>
              <a href={info.behance||DEFAULT.behance} target="_blank" rel="noopener noreferrer" className="ac-item ac-behance"><SiBehance/><span>Behance</span></a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="about-right">
            <div className="about-stats">
              {STATS.map((s,i)=>(
                <div key={s.label}
                  className={`about-stat glass-card${vis?' anim':''}`}
                  style={{animationDelay:`${0.2+i*0.1}s`}}>
                  <span className="stat-icon">{s.icon}</span>
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <div className={`about-skills-card glass-card${vis?' anim delay-4':''}`}>
              <h3 className="skills-title"> Tech Stack & Skills</h3>
              <SkillsBelt skills={info.skills||[]}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}