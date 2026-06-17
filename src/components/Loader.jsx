import React, { useEffect, useState } from 'react'
import './Loader.css'

export default function Loader() {
  const [smallStars, setSmallStars] = useState('')
  const [mediumStars, setMediumStars] = useState('')
  const [bigStars, setBigStars] = useState('')

  const generateStarBoxShadow = count => {
    const shadows = []

    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * 2000)
      const y = Math.floor(Math.random() * 2000)
      shadows.push(`${x}px ${y}px #FFF`)
    }

    return shadows.join(', ')
  }

  useEffect(() => {
    setSmallStars(generateStarBoxShadow(700))
    setMediumStars(generateStarBoxShadow(200))
    setBigStars(generateStarBoxShadow(100))
  }, [])

  return (
    <div className="cosmic-parallax-container">
      <div
        id="stars"
        style={{ boxShadow: smallStars }}
      />

      <div
        id="stars2"
        style={{ boxShadow: mediumStars }}
      />

      <div
        id="stars3"
        style={{ boxShadow: bigStars }}
      />

      <div id="horizon">
        <div className="glow" />
      </div>

      <div id="earth" />

      <div id="title">GOKUL R</div>

      <div id="subtitle">
        <span>WEB DEVELOPER</span>
        <span> • </span>
        <span>UI DESIGNER</span>
        <span> • </span>
        <span>DATA ANALYST</span>
      </div>
    </div>
  )
}