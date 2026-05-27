// src/App.jsx
import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Certificates from './components/Certificates'
import Feedback from './components/Feedback'
import Footer from './components/Footer'
import Loader from './components/Loader'
import CustomCursor from './components/CustomCursor'
import { FiArrowUp } from 'react-icons/fi'
import './styles/global.css'

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const total    = document.body.scrollHeight - window.innerHeight
      // Show when user is 75% down the page
      setVisible(total > 0 && scrolled / total >= 0.75)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={scrollTop}
      aria-label="Back to top"
    >
      <FiArrowUp />
    </button>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <section id="home"><Hero /></section>
        <section id="about"><About /></section>
        <section id="projects"><Projects /></section>
        <section id="certificates"><Certificates /></section>
        <section id="feedback"><Feedback /></section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}