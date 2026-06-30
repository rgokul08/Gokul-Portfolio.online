import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import {
  FiExternalLink, FiGithub, FiClock, FiCode,
  FiChevronLeft, FiChevronRight, FiPackage, FiAlertCircle, FiRefreshCw
} from 'react-icons/fi'

const BUCKET = 'Portfolio'
const FOLDER = 'projects_image'
const SLIDE_AT = 3
const AUTO_INTERVAL = 4000

function imgUrl(item: any) {
  if (!item?.image_url) return null
  if (item.image_url.startsWith('http')) return item.image_url
  return supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${item.image_url}`).data.publicUrl
}
function parseTools(t: any): string[] {
  if (!t) return []
  if (Array.isArray(t)) return t
  try { return JSON.parse(t) } catch { return t.split(',').map((s: string) => s.trim()).filter(Boolean) }
}

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchErr, setFetchErr] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')
  const [cur, setCur] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<number>(0)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setFetchErr(null)
    try {
      const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: false })
      if (error) throw error
      setProjects(data ?? [])
    } catch (err: any) {
      setFetchErr(err.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const ch = supabase.channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [load])

  const allTags = ['All', ...new Set(projects.flatMap(p => parseTools(p.tools)))]
  const list = filter === 'All' ? projects : projects.filter(p => parseTools(p.tools).includes(filter))
  const slide = list.length > SLIDE_AT

  const goTo = useCallback((index: number, fromUser = false) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCur(index)
    if (fromUser) setPaused(true)
    // Allow next transition after CSS transition completes (500ms)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning])

  const next = useCallback(() => {
    if (!slide) return
    const nextIdx = (cur + 1) % list.length
    goTo(nextIdx)
  }, [slide, cur, list.length, goTo])

  const prev = useCallback(() => {
    if (!slide) return
    const prevIdx = (cur - 1 + list.length) % list.length
    goTo(prevIdx)
  }, [slide, cur, list.length, goTo])

  const nextFromUser = useCallback(() => {
    if (!slide) return
    const nextIdx = (cur + 1) % list.length
    goTo(nextIdx, true)
  }, [slide, cur, list.length, goTo])

  const prevFromUser = useCallback(() => {
    if (!slide) return
    const prevIdx = (cur - 1 + list.length) % list.length
    goTo(prevIdx, true)
  }, [slide, cur, list.length, goTo])

  // Auto-play timer
  useEffect(() => {
    if (!slide || paused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    timerRef.current = setInterval(() => {
      setCur(c => (c + 1) % list.length)
    }, AUTO_INTERVAL)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [slide, paused, list.length])

  // Reset cur when filter changes
  useEffect(() => { setCur(0); setIsTransitioning(false) }, [filter])

  // Keyboard navigation
  useEffect(() => {
    if (!slide) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevFromUser()
      if (e.key === 'ArrowRight') nextFromUser()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [slide, prevFromUser, nextFromUser])

  // Touch / swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    // Only swipe if horizontal movement dominates
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) nextFromUser()
      else prevFromUser()
    }
    touchStartX.current = null
    touchStartY.current = null
  }, [nextFromUser, prevFromUser])

  // Compute positions for visible cards: we show 3 (prev, center, next)
  const getCardPos = (index: number): 'center' | 'left' | 'right' | 'hidden' => {
    if (index === cur) return 'center'
    const leftIdx = (cur - 1 + list.length) % list.length
    const rightIdx = (cur + 1) % list.length
    if (index === leftIdx) return 'left'
    if (index === rightIdx) return 'right'
    return 'hidden'
  }

  return (
    <div className="projects">
      <div className="container">
        <div className="section-label">My Work</div>
        <h2 className="section-title">Featured <span>Projects</span></h2>

        {!loading && !fetchErr && allTags.length > 1 && (
          <div className="proj-filters">
            {allTags.slice(0, 9).map(t => (
              <button
                key={t}
                className={`pf-btn${filter === t ? ' active' : ''}`}
                onClick={() => setFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="proj-skel-grid">{[1, 2, 3].map(i => <div key={i} className="proj-skel" />)}</div>
        ) : fetchErr ? (
          <div className="proj-error">
            <FiAlertCircle />
            <p>Could not load projects.</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fetchErr}</p>
            <button className="btn-outline proj-retry" onClick={load}><FiRefreshCw /> Retry</button>
          </div>
        ) : list.length === 0 ? (
          <div className="proj-empty"><FiPackage /><p>Projects coming soon!</p></div>
        ) : slide ? (
          <div
            className="proj-slide-wrap"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="proj-stage" aria-live="polite" aria-atomic="true">
              {list.map((p, index) => {
                const pos = getCardPos(index)
                return (
                  <ProjCard
                    key={p.id}
                    project={p}
                    pos={pos}
                    aria-hidden={pos === 'hidden'}
                  />
                )
              })}
            </div>

            <button
              className="slide-arrow left"
              onClick={prevFromUser}
              aria-label="Previous project"
              disabled={isTransitioning}
            >
              <FiChevronLeft />
            </button>
            <button
              className="slide-arrow right"
              onClick={nextFromUser}
              aria-label="Next project"
              disabled={isTransitioning}
            >
              <FiChevronRight />
            </button>

            <div className="slide-dots" role="tablist" aria-label="Project slides">
              {list.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === cur}
                  aria-label={`Go to project ${i + 1}`}
                  className={`sd${i === cur ? ' on' : ''}`}
                  onClick={() => { goTo(i, true) }}
                />
              ))}
            </div>

            {!paused && (
              <div className="slide-prog">
                <div className="slide-prog-bar" key={`prog-${cur}`} />
              </div>
            )}
          </div>
        ) : (
          <div className="proj-grid">
            {list.map((p, i) => <ProjCard key={p.id} project={p} index={i} grid />)}
          </div>
        )}
      </div>
    </div>
  )
}

function ProjCard({
  project: p,
  index = 0,
  pos = 'center',
  grid = false,
  'aria-hidden': ariaHidden,
}: {
  project: any
  index?: number
  pos?: string
  grid?: boolean
  'aria-hidden'?: boolean
}) {
  const src = imgUrl(p)
  const tools = parseTools(p.tools)

  let posClass = ''
  if (!grid) {
    if (pos === 'left') posClass = 'sl-left'
    else if (pos === 'right') posClass = 'sl-right'
    else if (pos === 'center') posClass = 'sl-center'
    else posClass = 'sl-hidden'
  }

  return (
    <div
      className={`proj-card glass-card${grid ? ' fade-in' : ` sl-card ${posClass}`}`}
      style={grid ? { animationDelay: `${index * 0.11}s` } : {}}
      aria-hidden={ariaHidden}
      tabIndex={ariaHidden ? -1 : 0}
    >
      <div className="proj-img-wrap">
        {src
          ? <img src={src} alt={p.title} className="proj-img" loading="lazy" />
          : <div className="proj-img-ph"><FiCode /></div>
        }
        <div className="proj-overlay">
          {p.project_link && (
            <a
              href={p.project_link}
              target="_blank"
              rel="noopener noreferrer"
              className="ov-btn"
              tabIndex={ariaHidden ? -1 : 0}
            >
              <FiExternalLink />Live
            </a>
          )}
          {p.github_link && (
            <a
              href={p.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="ov-btn ghost"
              tabIndex={ariaHidden ? -1 : 0}
            >
              <FiGithub />Code
            </a>
          )}
        </div>
      </div>
      <div className="proj-body">
        {p.duration && <div className="proj-dur"><FiClock />{p.duration}</div>}
        <h3 className="proj-title">{p.title}</h3>
        <p className="proj-desc">{p.description}</p>
        {tools.length > 0 && (
          <div className="proj-tools">
            {tools.map((t: string, i: number) => <span key={i} className="pt">{t}</span>)}
          </div>
        )}
        <div className="proj-links">
          {p.project_link && (
            <a
              href={p.project_link}
              target="_blank"
              rel="noopener noreferrer"
              className="pl-btn"
              tabIndex={ariaHidden ? -1 : 0}
            >
              <FiExternalLink />View Project
            </a>
          )}
          {p.github_link && (
            <a
              href={p.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="pl-btn ghost"
              tabIndex={ariaHidden ? -1 : 0}
            >
              <FiGithub />Source
            </a>
          )}
        </div>
      </div>
    </div>
  )
}