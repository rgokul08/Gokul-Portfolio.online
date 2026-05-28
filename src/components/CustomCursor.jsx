// src/components/CustomCursor.jsx
import React,{useEffect,useRef} from 'react'
import './CustomCursor.css'

export default function CustomCursor(){
  const dotRef=useRef(null), ringRef=useRef(null)
  const pos=useRef({x:0,y:0}), smooth=useRef({x:0,y:0})

  useEffect(()=>{
    if(window.innerWidth<768)return
    const move=e=>{
      pos.current={x:e.clientX,y:e.clientY}
      if(dotRef.current){
        dotRef.current.style.left=`${e.clientX}px`
        dotRef.current.style.top=`${e.clientY}px`
      }
    }
    const tick=()=>{
      smooth.current.x+=(pos.current.x-smooth.current.x)*0.11
      smooth.current.y+=(pos.current.y-smooth.current.y)*0.11
      if(ringRef.current){
        ringRef.current.style.left=`${smooth.current.x}px`
        ringRef.current.style.top=`${smooth.current.y}px`
      }
      requestAnimationFrame(tick)
    }
    const expand=()=>ringRef.current?.classList.add('expand')
    const shrink=()=>ringRef.current?.classList.remove('expand')
    document.addEventListener('mousemove',move)
    document.querySelectorAll('a,button,[data-cursor]').forEach(el=>{
      el.addEventListener('mouseenter',expand)
      el.addEventListener('mouseleave',shrink)
    })
    tick()
    return()=>document.removeEventListener('mousemove',move)
  },[])

  if(typeof window!=='undefined'&&window.innerWidth<768)return null
  return(
    <>
      <div ref={dotRef} className="c-dot"/>
      <div ref={ringRef} className="c-ring"/>
    </>
  )
}