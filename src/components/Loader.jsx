import React,{useEffect,useState} from 'react'
import './Loader.css'

export default function Loader(){
  const[p,setP]=useState(0)
  useEffect(()=>{
    const iv=setInterval(()=>setP(v=>{
      if(v>=100){clearInterval(iv);return 100}
      return Math.min(v+Math.random()*14+3,100)
    }),90)
    return()=>clearInterval(iv)
  },[])
  return(
    <div className="loader">
      <div className="loader-grid"/>
      <div className="loader-scan"/>
      <div className="loader-inner">
        <div className="loader-logo"><span>G</span></div>
        <div className="loader-name">GOKUL R</div>
        <div className="loader-bar-wrap">
          <div className="loader-bar" style={{width:`${Math.min(p,100)}%`}}/>
        </div>
        <div className="loader-text">INITIALIZING PORTFOLIO…</div>
      </div>
    </div>
  )
}