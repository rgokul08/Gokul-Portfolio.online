// src/components/Projects.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import {
  FiExternalLink, FiGithub, FiClock, FiCode,
  FiChevronLeft, FiChevronRight, FiPackage
} from 'react-icons/fi'
import './Projects.css'

const BUCKET   = 'Portfolio'
const FOLDER   = 'projects_image'
const SLIDE_AT = 3   // slideshow when count > this

function imgUrl(item) {
  if (!item?.image_url) return null
  if (item.image_url.startsWith('http')) return item.image_url
  return supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${FOLDER}/${item.image_url}`)
    .data.publicUrl
}

function parseTools(t) {
  if (!t) return []
  if (Array.isArray(t)) return t
  try { return JSON.parse(t) } catch { return t.split(',').map(s => s.trim()) }
}

async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    console.error('Projects fetch error:', error.message, error.details, error.hint)
    return []
  }
  console.log('Projects fetched:', data?.length ?? 0)
  return data ?? []
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('All')
  const [cur,      setCur]      = useState(0)
  const [paused,   setPaused]   = useState(false)
  const timer = useRef(null)

  // Initial load
  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .finally(() => setLoading(false))
  }, [])

  // Realtime subscription — reflects add/update/delete instantly
  useEffect(() => {
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        payload => {
          console.log('Realtime projects event:', payload.eventType)
          fetchProjects().then(setProjects)
        }
      )
      .subscribe(status => {
        console.log('Projects realtime status:', status)
      })

    return () => { supabase.removeChannel(channel) }
  }, [])

  const allTags = ['All', ...new Set(projects.flatMap(p => parseTools(p.tools)))]
  const list    = filter === 'All'
    ? projects
    : projects.filter(p => parseTools(p.tools).includes(filter))
  const slide   = list.length > SLIDE_AT

  const next = useCallback(() => { if (slide) setCur(c => (c + 1) % list.length) }, [slide, list.length])
  const prev = useCallback(() => { if (slide) setCur(c => (c - 1 + list.length) % list.length) }, [slide, list.length])

  useEffect(() => {
    if (!slide || paused) return
    timer.current = setInterval(next, 4000)
    return () => clearInterval(timer.current)
  }, [slide, paused, next])

  useEffect(() => setCur(0), [filter])

  const visible3 = () => {
    const v = []
    for (let o = -1; o <= 1; o++) {
      const i = (cur + o + list.length) % list.length
      v.push({ p: list[i], pos: o })
    }
    return v
  }

  return (
    <div className="projects">
      <div className="container">
        <div className="section-label">My Work</div>
        <h2 className="section-title">Featured <span>Projects</span></h2>

        {!loading && allTags.length > 1 && (
          <div className="proj-filters">
            {allTags.slice(0, 9).map(t => (
              <button key={t}
                className={`pf-btn${filter === t ? ' active' : ''}`}
                onClick={() => setFilter(t)}>
                {t}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="proj-skel-grid">
            {[1, 2, 3].map(i => <div key={i} className="proj-skel" />)}
          </div>
        ) : list.length === 0 ? (
          <div className="proj-empty">
            <FiPackage />
            <p>{projects.length === 0
              ? 'Projects coming soon — check back!'
              : 'No projects match this filter.'}
            </p>
          </div>
        ) : slide ? (
          <div className="proj-slide-wrap"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}>
            <div className="proj-stage">
              {visible3().map(({ p, pos }) => (
                <ProjCard key={`${p.id}-${pos}`} project={p} pos={pos} />
              ))}
            </div>
            <button className="slide-arrow left"
              onClick={() => { prev(); setPaused(true) }}>
              <FiChevronLeft />
            </button>
            <button className="slide-arrow right"
              onClick={() => { next(); setPaused(true) }}>
              <FiChevronRight />
            </button>
            <div className="slide-dots">
              {list.map((_, i) => (
                <button key={i}
                  className={`sd${i === cur ? ' on' : ''}`}
                  onClick={() => { setCur(i); setPaused(true) }} />
              ))}
            </div>
            {!paused && (
              <div className="slide-prog">
                <div className="slide-prog-bar" key={cur} />
              </div>
            )}
          </div>
        ) : (
          <div className="proj-grid">
            {list.map((p, i) => (
              <ProjCard key={p.id} project={p} index={i} grid />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProjCard({ project: p, index = 0, pos = 0, grid = false }) {
  const src   = imgUrl(p)
  const tools = parseTools(p.tools)
  const pc    = pos === -1 ? 'sl-left' : pos === 1 ? 'sl-right' : 'sl-center'

  return (
    <div
      className={`proj-card glass-card${grid ? ` fade-in` : ` sl-card ${pc}`}`}
      style={grid ? { animationDelay: `${index * 0.11}s` } : {}}>
      <div className="proj-img-wrap">
        {src
          ? <img src={src} alt={p.title} className="proj-img" loading="lazy" />
          : <div className="proj-img-ph"><FiCode /></div>}
        <div className="proj-overlay">
          {p.project_link && (
            <a href={p.project_link} target="_blank" rel="noopener noreferrer"
               className="ov-btn">
              <FiExternalLink />Live
            </a>
          )}
          {p.github_link && (
            <a href={p.github_link} target="_blank" rel="noopener noreferrer"
               className="ov-btn ghost">
              <FiGithub />Code
            </a>
          )}
        </div>
      </div>
      <div className="proj-body">
        {p.duration && (
          <div className="proj-dur"><FiClock />{p.duration}</div>
        )}
        <h3 className="proj-title">{p.title}</h3>
        <p className="proj-desc">{p.description}</p>
        <div className="proj-tools">
          {tools.map((t, i) => <span key={i} className="pt">{t}</span>)}
        </div>
        <div className="proj-links">
          {p.project_link && (
            <a href={p.project_link} target="_blank" rel="noopener noreferrer"
               className="pl-btn">
              <FiExternalLink />View Project
            </a>
          )}
          {p.github_link && (
            <a href={p.github_link} target="_blank" rel="noopener noreferrer"
               className="pl-btn ghost">
              <FiGithub />Source
            </a>
          )}
        </div>
      </div>
    </div>
  )
}