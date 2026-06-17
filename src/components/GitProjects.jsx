import React, { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import {
  FiExternalLink, FiGithub, FiChevronLeft, FiChevronRight,
  FiAlertCircle, FiRefreshCw, FiPackage
} from 'react-icons/fi'
import './GitProjects.css'

const SLIDE_AT = 3

function parseLanguages(t) {
  if (!t) return []
  if (Array.isArray(t)) return t
  try {
    const parsed = JSON.parse(t)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    if (typeof t === 'string') {
      return t.split(',').map(s => s.trim()).filter(Boolean)
    }
    return []
  }
}

async function fetchGitProjects() {
  try {
    const { data, error } = await supabase
      .from('github')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    return data ?? []
  } catch (err) {
    console.error('GitProjects fetch error:', err)
    throw err
  }
}

export default function GitProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchErr, setFetchErr] = useState(null)
  const [cur, setCur] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)

  const load = useCallback(() => {
    setLoading(true)
    setFetchErr(null)
    fetchGitProjects()
      .then(data => {
        setProjects(data)
        setFetchErr(null)
      })
      .catch(err => {
        setFetchErr(err.message || 'Failed to load GitHub projects')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Real-time subscription
  useEffect(() => {
    const ch = supabase
      .channel('github-real-time')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'github' },
        () => {
          load()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(ch)
    }
  }, [load])

  const slide = projects.length > SLIDE_AT

  const next = useCallback(() => {
    if (slide) setCur(c => (c + 1) % projects.length)
  }, [slide, projects.length])

  const prev = useCallback(() => {
    if (slide) setCur(c => (c - 1 + projects.length) % projects.length)
  }, [slide, projects.length])

  useEffect(() => {
    if (!slide || paused) return
    timer.current = setInterval(next, 1500)
    return () => clearInterval(timer.current)
  }, [slide, paused, next])

  const visible3 = () => {
    const v = []
    for (let o = -1; o <= 1; o++) {
      const i = (cur + o + projects.length) % projects.length
      v.push({ p: projects[i], pos: o })
    }
    return v
  }

  return (
    <div className="git-projects">
      <div className="container">
        <div className="section-label">GitHub Repository</div>
        <h2 className="section-title">
          My <span>Git Projects</span>
        </h2>

        {loading ? (
          <div className="git-skel-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="git-skel" />
            ))}
          </div>
        ) : fetchErr ? (
          <div className="git-error">
            <FiAlertCircle />
            <p>Could not load GitHub projects.</p>
            <p className="git-error-detail">{fetchErr}</p>
            <button className="btn-outline git-retry" onClick={load}>
              <FiRefreshCw /> Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="git-empty">
            <FiPackage />
            <p>No GitHub projects yet. Add projects to the Supabase 'github' table!</p>
          </div>
        ) : slide ? (
          <div
            className="git-slide-wrap"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="git-stage">
              {visible3().map(({ p, pos }) => (
                <GitProjCard key={`${p.id}-${pos}`} project={p} pos={pos} />
              ))}
            </div>
            <button
              className="slide-arrow left"
              onClick={() => {
                prev()
                setPaused(true)
              }}
            >
              <FiChevronLeft />
            </button>
            <button
              className="slide-arrow right"
              onClick={() => {
                next()
                setPaused(true)
              }}
            >
              <FiChevronRight />
            </button>
            <div className="slide-dots">
              {projects.map((_, i) => (
                <button
                  key={i}
                  className={`sd${i === cur ? ' on' : ''}`}
                  onClick={() => {
                    setCur(i)
                    setPaused(true)
                  }}
                />
              ))}
            </div>
            {!paused && (
              <div className="slide-prog">
                <div className="slide-prog-bar" key={cur} />
              </div>
            )}
          </div>
        ) : (
          <div className="git-grid">
            {projects.map((p, i) => (
              <GitProjCard key={p.id} project={p} index={i} grid />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function GitProjCard({ project: p, index = 0, pos = 0, grid = false }) {
  const languages = parseLanguages(p.languages)
  const pc = pos === -1 ? 'sl-left' : pos === 1 ? 'sl-right' : 'sl-center'

  return (
    <div
      className={`git-card glass-card${grid ? ` fade-in` : ` sl-card ${pc}`}`}
      style={grid ? { animationDelay: `${index * 0.11}s` } : {}}
    >
      <div className="git-header">
        <div className="git-icon">
          <FiGithub />
        </div>
        <h3 className="git-title">{p.title || 'Untitled'}</h3>
      </div>

      <div className="git-body">
        {p.description && <p className="git-desc">{p.description}</p>}

        {languages.length > 0 && (
          <div className="git-langs">
            {languages.slice(0, 4).map((lang, i) => (
              <span key={i} className="git-lang-badge">
                {lang}
              </span>
            ))}
            {languages.length > 4 && (
              <span className="git-lang-more">+{languages.length - 4}</span>
            )}
          </div>
        )}

        <div className="git-links">
          {p.github_link && (
            <a
              href={p.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="git-link-btn"
            >
              <FiGithub /> Repository
            </a>
          )}
        </div>
      </div>

      <div className="git-border-glow" />
    </div>
  )
}
