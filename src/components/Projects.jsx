// src/components/Projects.jsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { FiExternalLink, FiGithub, FiClock, FiCode } from 'react-icons/fi'
import './Projects.css'

const BUCKET = 'Portfolio'
const FOLDER = 'projects_image'

// Fallback sample projects
const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'A fully responsive personal portfolio built with React + Vite, featuring smooth animations, Supabase integration, and a modern dark UI.',
    tools: ['React', 'Vite', 'Supabase', 'CSS'],
    duration: '2 weeks',
    project_link: 'https://github.com/rgokul08',
    image_url: null,
  },
  {
    id: 2,
    title: 'Task Manager App',
    description: 'A productivity app with real-time task tracking, user authentication, and priority management built on Node.js and React.',
    tools: ['React', 'Node.js', 'Express', 'MongoDB'],
    duration: '3 weeks',
    project_link: 'https://github.com/rgokul08',
    image_url: null,
  },
  {
    id: 3,
    title: 'E-Commerce UI',
    description: 'A sleek, mobile-first e-commerce front-end with cart functionality, product filtering, and clean component architecture.',
    tools: ['React', 'Redux', 'TailwindCSS'],
    duration: '4 weeks',
    project_link: 'https://github.com/rgokul08',
    image_url: null,
  },
]

function getImageUrl(item) {
  // If image_url is a full URL, use as-is
  if (item.image_url && item.image_url.startsWith('http')) return item.image_url
  // If it's just a filename, build from Supabase storage
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
  const [filter, setFilter]     = useState('All')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: false })
        if (error || !data || data.length === 0) setProjects(FALLBACK_PROJECTS)
        else setProjects(data)
      } catch {
        setProjects(FALLBACK_PROJECTS)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Collect all unique tools for filter tabs
  const allTools = ['All', ...new Set(
    projects.flatMap(p => parseTools(p.tools))
  )]

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => parseTools(p.tools).includes(filter))

  return (
    <div className="projects">
      <div className="container">
        <div className="section-label">My Work</div>
        <h2 className="section-title">
          Featured <span>Projects</span>
        </h2>

        {/* Filter tabs */}
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

        {loading ? (
          <div className="projects-loading">
            {[1,2,3].map(i => <div key={i} className="project-skeleton" />)}
          </div>
        ) : (
          <div className="projects-grid">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project, index }) {
  const imgSrc = getImageUrl(project)
  const tools  = parseTools(project.tools)

  return (
    <div
      className="project-card glass-card fade-in"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      {/* Image */}
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

      {/* Body */}
      <div className="project-body">
        {/* Duration */}
        {project.duration && (
          <div className="project-duration">
            <FiClock /> {project.duration}
          </div>
        )}

        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>

        {/* Tools */}
        <div className="project-tools">
          {tools.map((tool, i) => (
            <span key={i} className="project-tool">{tool}</span>
          ))}
        </div>

        {/* Footer links */}
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
