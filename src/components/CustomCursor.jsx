import React,{useEffect,useRef} from 'react'
import './CustomCursor.css'

export default function CustomCursor(){
  const dotRef=useRef(null), ringRef=useRef(null), trailRef=useRef(null)
  const pos=useRef({x:0,y:0}), ring=useRef({x:0,y:0}), trail=useRef({x:0,y:0})

  useEffect(()=>{
    if(window.innerWidth<768) return
    const move=e=>{
      pos.current={x:e.clientX,y:e.clientY}
      if(dotRef.current){
        dotRef.current.style.left=`${e.clientX}px`
        dotRef.current.style.top=`${e.clientY}px`
      }
    }
    let raf
    const tick=()=>{
      ring.current.x+=(pos.current.x-ring.current.x)*0.12
      ring.current.y+=(pos.current.y-ring.current.y)*0.12
      trail.current.x+=(pos.current.x-trail.current.x)*0.06
      trail.current.y+=(pos.current.y-trail.current.y)*0.06
      if(ringRef.current){
        ringRef.current.style.left=`${ring.current.x}px`
        ringRef.current.style.top=`${ring.current.y}px`
      }
      if(trailRef.current){
        trailRef.current.style.left=`${trail.current.x}px`
        trailRef.current.style.top=`${trail.current.y}px`
      }
      raf=requestAnimationFrame(tick)
    }
    const expand=()=>ringRef.current?.classList.add('expand')
    const shrink=()=>ringRef.current?.classList.remove('expand')
    document.addEventListener('mousemove',move)
    document.querySelectorAll('a,button,[data-cursor]').forEach(el=>{
      el.addEventListener('mouseenter',expand)
      el.addEventListener('mouseleave',shrink)
    })
    tick()
    return()=>{ document.removeEventListener('mousemove',move); cancelAnimationFrame(raf) }
  },[])

  if(typeof window!=='undefined'&&window.innerWidth<768) return null
  return(
    <>
      <div ref={dotRef} className="c-dot"/>
      <div ref={ringRef} className="c-ring"/>
      <div ref={trailRef} className="c-trail"/>
    </>
  )
}