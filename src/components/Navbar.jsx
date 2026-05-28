// src/components/Navbar.jsx
import React,{useState,useEffect,useRef} from 'react'
import {FiX,FiSend,FiAlertCircle,FiCheckCircle,FiMenu} from 'react-icons/fi'
import './Navbar.css'

const LINKS=[
  {label:'Home',      id:'home'},
  {label:'About',     id:'about'},
  {label:'Projects',  id:'projects'},
  {label:'Certificates',id:'certificates'},
  {label:'Feedback',  id:'feedback'},
  {label:'Contact',   id:'feedback'},
]

const SVC  = import.meta.env.VITE_EMAILJS_SERVICE_ID  ||''
const TPL  = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||''
const KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  ||''

export default function Navbar(){
  const[scrolled,setScrolled]=useState(false)
  const[active,setActive]=useState('home')
  const[mobileOpen,setMobileOpen]=useState(false)
  const[hireOpen,setHireOpen]=useState(false)
  const[form,setForm]=useState({name:'',email:'',message:''})
  const[status,setStatus]=useState('idle')
  const[err,setErr]=useState('')

  /* ── scroll spy ── */
  useEffect(()=>{
    const ids=['home','about','projects','certificates','feedback']
    const onScroll=()=>{
      setScrolled(window.scrollY>40)
      let cur='home'
      for(const id of ids){
        const el=document.getElementById(id)
        if(el && el.getBoundingClientRect().top<=130) cur=id
      }
      setActive(cur)
    }
    window.addEventListener('scroll',onScroll,{passive:true})
    onScroll()
    return()=>window.removeEventListener('scroll',onScroll)
  },[])

  /* ── esc closes ── */
  useEffect(()=>{
    const h=e=>{if(e.key==='Escape'){setHireOpen(false);setMobileOpen(false)}}
    window.addEventListener('keydown',h)
    return()=>window.removeEventListener('keydown',h)
  },[])

  const nav=id=>{
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  }

  const onChange=e=>setForm(p=>({...p,[e.target.name]:e.target.value}))

  const onSubmit=async e=>{
    e.preventDefault()
    if(!form.name||!form.email||!form.message)return
    setStatus('sending'); setErr('')
    try{
      const ejs=(await import('emailjs-com')).default
      await ejs.send(SVC,TPL,{
        from_name:form.name, from_email:form.email,
        message:`HIRE ME REQUEST\n\n${form.message}`,
        to_email:'rgokul08.in@gmail.com', reply_to:form.email,
      },KEY)
      setStatus('success'); setForm({name:'',email:'',message:''})
    }catch(ex){
      console.error(ex)
      setErr('Failed to send. Please email rgokul08.in@gmail.com directly.')
      setStatus('error')
    }
  }

  return(
    <>
      <header className={`navbar${scrolled?' scrolled':''}`}>
        <div className="nav-inner">
          <button className="nav-logo" onClick={()=>nav('home')}>
            <div className="nav-mark">G</div>
            <span>Gokul</span>
          </button>

          <nav className="nav-links">
            {LINKS.map((l,i)=>(
              <button key={i} className={`nav-link${active===l.id?' active':''}`} onClick={()=>nav(l.id)}>
                {l.label}
              </button>
            ))}
          </nav>

          <button className="btn-primary nav-cta" onClick={()=>setHireOpen(true)}>Hire Me</button>

          <button className={`nav-ham${mobileOpen?' open':''}`} onClick={()=>setMobileOpen(v=>!v)} aria-label="menu">
            <span/><span/><span/>
          </button>
        </div>

        {/* mobile drawer */}
        <div className={`nav-drawer${mobileOpen?' open':''}`}>
          {LINKS.map((l,i)=>(
            <button key={i} className={`nav-drawer-link${active===l.id?' active':''}`} onClick={()=>nav(l.id)}>
              {l.label}
            </button>
          ))}
          <button className="btn-primary" style={{marginTop:12,width:'100%',justifyContent:'center'}}
            onClick={()=>{setMobileOpen(false);setHireOpen(true)}}>Hire Me</button>
        </div>
      </header>

      {/* Hire Me Modal */}
      {hireOpen&&(
        <div className="hire-overlay" onClick={()=>{setHireOpen(false);setStatus('idle')}}>
          <div className="hire-modal glass-card" onClick={e=>e.stopPropagation()}>
            <button className="hire-close" onClick={()=>{setHireOpen(false);setStatus('idle')}}><FiX/></button>
            <div className="hire-header">
              <div className="hire-emoji">🚀</div>
              <h2>Let's Work Together</h2>
              <p>Tell me about your project — I'll reply within 24 hours.</p>
            </div>
            {status==='success'?(
              <div className="hire-success">
                <FiCheckCircle/>
                <h3>Message Sent!</h3>
                <p>Thanks! I'll get back to you soon.</p>
                <button className="btn-outline" onClick={()=>setStatus('idle')}>Send Another</button>
              </div>
            ):(
              <form onSubmit={onSubmit} className="hire-form" noValidate>
                <div className="form-group"><label>Your Name</label>
                  <input name="name" className="form-input" placeholder="John Doe" value={form.name} onChange={onChange} required/></div>
                <div className="form-group"><label>Email Address</label>
                  <input name="email" type="email" className="form-input" placeholder="john@example.com" value={form.email} onChange={onChange} required/></div>
                <div className="form-group"><label>Message</label>
                  <textarea name="message" className="form-input form-textarea" placeholder="Tell me about your project…" value={form.message} onChange={onChange} required rows={4}/></div>
                {status==='error'&&<div className="form-error"><FiAlertCircle/>{err}</div>}
                <button type="submit" className="btn-primary form-submit" disabled={status==='sending'}>
                  {status==='sending'?<><div className="spinner"/>Sending…</>:<><FiSend/>Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}