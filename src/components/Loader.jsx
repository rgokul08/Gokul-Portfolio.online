// src/components/Loader.jsx
import React,{useEffect,useState} from 'react'
import './Loader.css'

export default function Loader(){
  const[p,setP]=useState(0)
  useEffect(()=>{
    const iv=setInterval(()=>setP(v=>{
      if(v>=100){clearInterval(iv);return 100}
      return v+Math.random()*15+3
    }),100)
    return()=>clearInterval(iv)
  },[])
  return(
    <div className="loader">
      <div className="loader-inner">
        <div className="loader-logo"><span>G</span></div>
        <div className="loader-name">GOKUL</div>
        <div className="loader-bar-wrap"><div className="loader-bar" style={{width:`${Math.min(p,100)}%`}}/></div>
        <div className="loader-text">Loading portfolio…</div>
      </div>
    </div>
  )
}