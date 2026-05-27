// src/components/Projects.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { FiExternalLink, FiGithub, FiClock, FiCode, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './Projects.css'

const BUCKET = 'Portfolio'
const FOLDER = 'projects_image'
const SLIDE_THRESHOLD = 3 // Use slideshow when more than this many projects

function getImageUrl(item) {
  if (item.image_url && item.image_url.startsWith('http')) return item.image_url
  if (item.image_url) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${item.image_url}`)
    return data.publicUrl
  }
  return null
}

function parseTools(tools) {
  if (!tools) return []
  if (Array.isArray(tools)) return tools
  if (typeof tools === 'string') {
    try { return JSON.parse(tools) } catch { return tools.split(',').map(t => t.trim()) }
  }
  return []
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [filter,  setFilter]    = useState('All')
  const [current, setCurrent]   = useState(0)
  const [paused,  setPaused]    = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const { data, error: dbError } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: false })
        
        if (dbError) {
          console.error('Supabase error:', dbError)
          setError('Failed to fetch projects')
          setProjects([])
        } else if (data && data.length > 0) {
          setProjects(data)
        } else {
          setProjects([])
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to fetch projects')
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const allTools = ['All', ...new Set(projects.flatMap(p => parseTools(p.tools)))]
  const filtered = filter === 'All' ? projects : projects.filter(p => parseTools(p.tools).includes(filter))
  const useSlideshow = filtered.length > SLIDE_THRESHOLD

  // Auto-advance slideshow
  const next = useCallback(() => {
    if (useSlideshow) setCurrent(c => (c + 1) % filtered.length)
  }, [useSlideshow, filtered.length])

  const prev = useCallback(() => {
    if (useSlideshow) setCurrent(c => (c - 1 + filtered.length) % filtered.length)
  }, [useSlideshow, filtered.length])

  useEffect(() => {
    if (!useSlideshow || paused) return
    timerRef.current = setInterval(next, 4000)
    return () => clearInterval(timerRef.current)
  }, [useSlideshow, paused, next])

  // Reset slide index when filter changes
  useEffect(() => { setCurrent(0) }, [filter])

  // Visible projects for slideshow: show up to 3 centered on current
  const getVisible = () => {
    if (!useSlideshow) return filtered.map((p, i) => ({ project: p, pos: 0, idx: i }))
    const vis = []
    for (let offset = -1; offset <= 1; offset++) {
      const idx = (current + offset + filtered.length) % filtered.length
      vis.push({ project: filtered[idx], pos: offset, idx })
    }
    return vis
  }

  if (loading) {
    return (
      <div className="projects">
        <div className="container">
          <div className="section-label">My Work</div>
          <h2 className="section-title">Featured <span>Projects</span></h2>
          <div className="projects-loading">
            {[1, 2, 3].map(i => <div key={i} className="project-skeleton" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="projects">
      <div className="container">
        <div className="section-label">My Work</div>
        <h2 className="section-title">
          Featured <span>Projects</span>
        </h2>

        {!loading && allTools.length > 1 && (
          <div className="projects-filters">
            {allTools.slice(0, 8).map(tool => (
              <button
                key={tool}
                className={`projects-filter-btn ${filter === tool ? 'active' : ''}`}
                onClick={() => setFilter(tool)}
              >
                {tool}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="projects-empty">
            <FiCode />
            <p>{error}</p>
          </div>
        )}

        {!error && projects.length === 0 && !loading && (
          <div className="projects-empty">
            <FiCode />
            <p>No projects yet. Check back soon!</p>
          </div>
        )}

        {!error && projects.length > 0 && useSlideshow ? (
          /* ── Slideshow mode ── */
          <div
            className="projects-slideshow"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="projects-stage">
              {getVisible().map(({ project, pos }) => (
                <ProjectCard key={`${project.id}-${pos}`} project={project} pos={pos} />
              ))}
            </div>

            {/* Controls */}
            <button className="slide-btn slide-prev" onClick={() => { prev(); setPaused(true) }} aria-label="Previous">
              <FiChevronLeft />
            </button>
            <button className="slide-btn slide-next" onClick={() => { next(); setPaused(true) }} aria-label="Next">
              <FiChevronRight />
            </button>

            {/* Dots */}
            <div className="slide-dots">
              {filtered.map((_, i) => (
                <button
                  key={i}
                  className={`slide-dot ${i === current ? 'active' : ''}`}
                  onClick={() => { setCurrent(i); setPaused(true) }}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>

            {/* Progress bar */}
            {!paused && (
              <div className="slide-progress">
                <div className="slide-progress-bar" key={current} />
              </div>
            )}
          </div>
        ) : !error && projects.length > 0 ? (
          /* ── Grid mode ── */
          <div className="projects-grid">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} pos={0} grid />
            ))}
          </div>
        ) : null}

        {!error && filtered.length === 0 && projects.length > 0 && (
          <div className="projects-empty">
            <FiCode />
            <p>No projects match this filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project, index = 0, pos = 0, grid = false }) {
  const imgSrc = getImageUrl(project)
  const tools  = parseTools(project.tools)

  const posClass = pos === -1 ? 'slide-left' : pos === 1 ? 'slide-right' : 'slide-center'

  return (
    <div
      className={`project-card glass-card ${grid ? 'fade-in' : `slide-card ${posClass}`}`}
      style={grid ? { animationDelay: `${index * 0.12}s` } : {}}
    >
      <div className="project-image-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={project.title} className="project-image" loading="lazy" />
        ) : (
          <div className="project-image-placeholder">
            <FiCode />
          </div>
        )}
        <div className="project-image-overlay">
          <div className="project-image-overlay-links">
            {project.project_link && (
              <a href={project.project_link} target="_blank" rel="noopener noreferrer" className="project-overlay-btn">
                <FiExternalLink /> Live Demo
              </a>
            )}
            {project.github_link && (
              <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="project-overlay-btn secondary">
                <FiGithub /> Code
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="project-body">
        {project.duration && (
          <div className="project-duration"><FiClock /> {project.duration}</div>
        )}
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
        <div className="project-tools">
          {tools.map((tool, i) => <span key={i} className="project-tool">{tool}</span>)}
        </div>
        <div className="project-links">
          {project.project_link && (
            <a href={project.project_link} target="_blank" rel="noopener noreferrer" className="project-link-btn">
              <FiExternalLink /> View Project
            </a>
          )}
          {project.github_link && (
            <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="project-link-btn ghost">
              <FiGithub /> Source
            </a>
          )}
        </div>
      </div>
    </div>
  )
}