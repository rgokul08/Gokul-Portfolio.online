// src/components/Hero.jsx
import React,{useEffect,useRef,useState} from 'react'
import {FiGithub,FiLinkedin,FiMail,FiArrowDown,FiInstagram} from 'react-icons/fi'
import {SiBehance} from 'react-icons/si'
import {supabase} from '../lib/supabase'
import './Hero.css'

const ROLES=['Software Developer','Engineering Student','Problem Solver','UI Enthusiast']
const BUCKET='Portfolio'
const FOLDER='user_image'

export default function Hero(){
  const roleRef=useRef(null)
  const idx=useRef(0), chars=useRef(0), del=useRef(false)
  const[imgUrl,setImgUrl]=useState(null)

  /* typewriter */
  useEffect(()=>{
    const tick=()=>{
      const w=ROLES[idx.current]
      if(!del.current){
        chars.current++
        if(roleRef.current)roleRef.current.textContent=w.slice(0,chars.current)
        if(chars.current===w.length){del.current=true;setTimeout(tick,1900);return}
      }else{
        chars.current--
        if(roleRef.current)roleRef.current.textContent=w.slice(0,chars.current)
        if(chars.current===0){del.current=false;idx.current=(idx.current+1)%ROLES.length}
      }
      setTimeout(tick,del.current?55:88)
    }
    const t=setTimeout(tick,500)
    return()=>clearTimeout(t)
  },[])

  /* fetch user image from supabase bucket Portfolio/user_image */
  useEffect(()=>{
    const load=async()=>{
      try{
        const{data,error}=await supabase.storage.from(BUCKET).list(FOLDER,{limit:10})
        if(error||!data||data.length===0)return
        // pick first image file
        const file=data.find(f=>f.name&&/\.(jpe?g|png|webp|gif|avif)$/i.test(f.name))
        if(!file)return
        const{data:d}=supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${file.name}`)
        setImgUrl(d.publicUrl)
      }catch(e){console.warn('hero image load',e)}
    }
    load()
  },[])

  return(
    <div className="hero">
      <div className="orb orb-1"/><div className="orb orb-2"/><div className="orb orb-3"/>
      <div className="hero-grid"/>

      <div className="container hero-container">
        {/* — text — */}
        <div className="hero-text">
          <div className="hero-badge fade-in delay-1">
            <span className="hero-dot"/>Available for opportunities
          </div>

          <h1 className="hero-name fade-in delay-2">
            Hey, I'm<br/>
            <span className="hero-name-grad">Gokul</span>
          </h1>

          <div className="hero-role fade-in delay-3">
            <span>Aspiring </span>
            <span ref={roleRef} className="hero-typed"/>
            <span className="hero-cursor">|</span>
          </div>

          <p className="hero-tagline fade-in delay-4">
            Transforming ideas into impactful applications through&nbsp;
            <strong>clean code</strong>, <strong>modern web development</strong>&nbsp;
            and <strong>data analysis</strong>.
          </p>

          <div className="hero-actions fade-in delay-5">
            <button className="btn-primary" onClick={()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})}>
              View My Work <FiArrowDown/>
            </button>
            <button className="btn-outline" onClick={()=>document.getElementById('feedback')?.scrollIntoView({behavior:'smooth'})}>
              Let's Talk
            </button>
          </div>

          <div className="hero-socials fade-in delay-5">
            <a href="https://github.com/rgokul08" target="_blank" rel="noopener noreferrer" className="hs-link" title="GitHub"><FiGithub/></a>
            <a href="https://www.linkedin.com/in/gokul-r-69ab13385/" target="_blank" rel="noopener noreferrer" className="hs-link" title="LinkedIn"><FiLinkedin/></a>
            <a href="https://instagram.com/itz_goku.08" target="_blank" rel="noopener noreferrer" className="hs-link hs-insta" title="Instagram"><FiInstagram/></a>
            <a href="https://www.behance.net/gokul08" target="_blank" rel="noopener noreferrer" className="hs-link hs-behance" title="Behance"><SiBehance/></a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=rgokul08.in@gmail.com" target="_blank" rel="noopener noreferrer" className="hs-link" title="Email"><FiMail/></a>
          </div>
        </div>

        {/* — image — */}
        <div className="hero-img-wrap fade-in delay-3">
          <div className="hero-img-card">
            <div className="hero-img-glow"/>
            {imgUrl
              ? <img src={imgUrl} alt="Gokul" className="hero-photo"/>
              : <div className="hero-avatar"><span>G</span></div>
            }
            <div className="hero-badge-float badge-1"><span>🎓</span>Engineering Student</div>
            <div className="hero-badge-float badge-2"><span>💻</span>Dev & Designer</div>
          </div>
          <div className="hero-orbit"><div className="hero-orbit-dot"/></div>
        </div>
      </div>

      <button className="hero-scroll-ind"
        onClick={()=>document.getElementById('about')?.scrollIntoView({behavior:'smooth'})}>
        <div className="hero-scroll-line"/><span>Scroll</span>
      </button>
    </div>
  )
}