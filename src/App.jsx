// src/App.jsx
import React, { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar       from './components/Navbar'
import Hero         from './components/Hero'
import About        from './components/About'
import Projects     from './components/Projects'
import GitProjects  from './components/GitProjects'
import Certificates from './components/Certificates'
import Feedback     from './components/Feedback'
import Footer       from './components/Footer'
import Loader       from './components/Loader'
import CustomCursor from './components/CustomCursor'
import { FiArrowUp } from 'react-icons/fi'
import './styles/global.css'

/* ── Floating Back-to-Top ── */
function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      setShow(pct >= 0.72)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      className={`back-to-top${show ? ' show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <FiArrowUp />
    </button>
  )
}

function PortfolioApp() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 4000)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <Loader />

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <section id="home">         <Hero />         </section>
        <section id="about">        <About />        </section>
        <section id="projects">     <Projects />     </section>
        <section id="git-projects"> <GitProjects />  </section>
        <section id="certificates"> <Certificates /> </section>
        <section id="feedback">     <Feedback />     </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioApp />
      <Analytics />
    </ThemeProvider>
  )
}
