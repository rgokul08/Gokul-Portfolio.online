import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import {
  FiExternalLink,
  FiGithub,
  FiClock,
  FiCode,
  FiChevronLeft,
  FiChevronRight,
  FiPackage,
  FiAlertCircle,
  FiRefreshCw,
} from 'react-icons/fi'

const BUCKET = 'Portfolio'
const FOLDER = 'projects_image'
const SLIDE_AT = 3
const AUTO_INTERVAL = 4000

function imgUrl(item: any) {
  if (!item?.image_url) return null

  if (item.image_url.startsWith('http')) {
    return item.image_url
  }

  return supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${FOLDER}/${item.image_url}`).data.publicUrl
}

function parseTools(t: any): string[] {
  if (!t) return []

  if (Array.isArray(t)) {
    return t
  }

  try {
    const parsed = JSON.parse(t)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return String(t)
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)
  }
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

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  // --------------------------------------------------
  // LOAD PROJECTS
  // --------------------------------------------------

  const load = useCallback(async () => {
    setLoading(true)
    setFetchErr(null)

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        throw error
      }

      console.log('Projects loaded from Supabase:', data)
      console.log('Total projects:', data?.length)

      setProjects(data ?? [])
    } catch (err: any) {
      console.error('Project loading error:', err)
      setFetchErr(err.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // --------------------------------------------------
  // REALTIME SUPABASE UPDATES
  // --------------------------------------------------

  useEffect(() => {
    const channel = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        () => {
          load()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  // --------------------------------------------------
  // FILTERS
  // --------------------------------------------------

  const allTags = [
    'All',
    ...Array.from(
      new Set(
        projects.flatMap((p) => parseTools(p.tools))
      )
    ),
  ]

  const list =
    filter === 'All'
      ? projects
      : projects.filter((p) =>
          parseTools(p.tools).includes(filter)
        )

  // IMPORTANT:
  // If there are more than 3 projects, slideshow is enabled.
  const slide = list.length > SLIDE_AT

  // --------------------------------------------------
  // RESET SLIDE WHEN FILTER CHANGES
  // --------------------------------------------------

  useEffect(() => {
    setCur(0)
    setIsTransitioning(false)
  }, [filter])

  // --------------------------------------------------
  // SAFETY: KEEP CUR VALID
  // --------------------------------------------------

  useEffect(() => {
    if (list.length === 0) {
      setCur(0)
      return
    }

    if (cur >= list.length) {
      setCur(0)
    }
  }, [list.length, cur])

  // --------------------------------------------------
  // GO TO SLIDE
  // --------------------------------------------------

  const goTo = useCallback(
    (index: number, fromUser = false) => {
      if (!list.length || isTransitioning) return

      const safeIndex =
        ((index % list.length) + list.length) %
        list.length

      setIsTransitioning(true)
      setCur(safeIndex)

      if (fromUser) {
        setPaused(true)
      }

      window.setTimeout(() => {
        setIsTransitioning(false)
      }, 500)
    },
    [list.length, isTransitioning]
  )

  // --------------------------------------------------
  // NEXT
  // --------------------------------------------------

  const next = useCallback(() => {
    if (!slide || list.length === 0) return

    goTo(cur + 1)
  }, [slide, list.length, cur, goTo])

  // --------------------------------------------------
  // PREVIOUS
  // --------------------------------------------------

  const prev = useCallback(() => {
    if (!slide || list.length === 0) return

    goTo(cur - 1)
  }, [slide, list.length, cur, goTo])

  // --------------------------------------------------
  // USER NEXT / PREVIOUS
  // --------------------------------------------------

  const nextFromUser = useCallback(() => {
    if (!slide || list.length === 0) return

    goTo(cur + 1, true)
  }, [slide, list.length, cur, goTo])

  const prevFromUser = useCallback(() => {
    if (!slide || list.length === 0) return

    goTo(cur - 1, true)
  }, [slide, list.length, cur, goTo])

  // --------------------------------------------------
  // AUTO PLAY
  // --------------------------------------------------

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (!slide || paused || list.length <= 1) {
      return
    }

    timerRef.current = setInterval(() => {
      setCur((current) => {
        return (current + 1) % list.length
      })
    }, AUTO_INTERVAL)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [slide, paused, list.length])

  // --------------------------------------------------
  // KEYBOARD
  // --------------------------------------------------

  useEffect(() => {
    if (!slide) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevFromUser()
      }

      if (e.key === 'ArrowRight') {
        nextFromUser()
      }
    }

    window.addEventListener('keydown', handleKey)

    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [slide, prevFromUser, nextFromUser])

  // --------------------------------------------------
  // TOUCH START
  // --------------------------------------------------

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
    },
    []
  )

  // --------------------------------------------------
  // TOUCH END
  // --------------------------------------------------

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (
        touchStartX.current === null ||
        touchStartY.current === null
      ) {
        return
      }

      const dx =
        e.changedTouches[0].clientX -
        touchStartX.current

      const dy =
        e.changedTouches[0].clientY -
        touchStartY.current

      if (
        Math.abs(dx) > Math.abs(dy) &&
        Math.abs(dx) > 40
      ) {
        if (dx < 0) {
          nextFromUser()
        } else {
          prevFromUser()
        }
      }

      touchStartX.current = null
      touchStartY.current = null
    },
    [nextFromUser, prevFromUser]
  )

  // --------------------------------------------------
  // CARD POSITION
  // --------------------------------------------------

  const getCardPos = (
    index: number
  ): 'center' | 'left' | 'right' | 'hidden' => {
    if (list.length === 0) {
      return 'hidden'
    }

    if (index === cur) {
      return 'center'
    }

    const leftIdx =
      (cur - 1 + list.length) % list.length

    const rightIdx =
      (cur + 1) % list.length

    if (index === leftIdx) {
      return 'left'
    }

    if (index === rightIdx) {
      return 'right'
    }

    return 'hidden'
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <section className="projects-section">
      <div className="container">

        <div className="section-heading">
          <span className="section-kicker">
            My Work
          </span>

          <h2>
            Featured Projects
          </h2>
        </div>

        {/* FILTERS */}

        {!loading &&
          !fetchErr &&
          allTags.length > 1 && (
            <div className="proj-filters">
              {allTags.slice(0, 9).map((tag) => (
                <button
                  key={tag}
                  className={`pf-btn ${
                    filter === tag ? 'active' : ''
                  }`}
                  onClick={() => setFilter(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

        {/* LOADING */}

        {loading ? (
          <div className="proj-skel-grid">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="proj-skel"
              />
            ))}
          </div>
        ) : fetchErr ? (
          /* ERROR */

          <div className="proj-error">
            <FiAlertCircle />

            <p>
              Could not load projects.
            </p>

            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
              }}
            >
              {fetchErr}
            </p>

            <button
              className="btn-outline proj-retry"
              onClick={load}
            >
              <FiRefreshCw />
              Retry
            </button>
          </div>
        ) : list.length === 0 ? (
          /* EMPTY */

          <div className="proj-empty">
            <FiPackage />

            <p>
              Projects coming soon!
            </p>
          </div>
        ) : slide ? (
          /* SLIDESHOW */

          <div
            className="proj-slide-wrap"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="proj-stage"
              aria-live="polite"
              aria-atomic="true"
            >
              {list.map((project, index) => {
                const pos =
                  getCardPos(index)

                return (
                  <ProjCard
                    key={project.id}
                    project={project}
                    pos={pos}
                    aria-hidden={
                      pos === 'hidden'
                    }
                  />
                )
              })}
            </div>

            {/* LEFT */}

            <button
              className="slide-arrow left"
              onClick={prevFromUser}
              aria-label="Previous project"
              disabled={isTransitioning}
            >
              <FiChevronLeft />
            </button>

            {/* RIGHT */}

            <button
              className="slide-arrow right"
              onClick={nextFromUser}
              aria-label="Next project"
              disabled={isTransitioning}
            >
              <FiChevronRight />
            </button>

            {/* DOTS */}

            <div
              className="slide-dots"
              role="tablist"
              aria-label="Project slides"
            >
              {list.map((project, index) => (
                <button
                  key={project.id}
                  role="tab"
                  aria-selected={
                    index === cur
                  }
                  aria-label={`Go to project ${
                    index + 1
                  }`}
                  className={`sd ${
                    index === cur ? 'on' : ''
                  }`}
                  onClick={() =>
                    goTo(index, true)
                  }
                />
              ))}
            </div>

            {/* PROGRESS */}

            {!paused && (
              <div className="slide-prog">
                <div
                  className="slide-prog-bar"
                  key={`prog-${cur}`}
                />
              </div>
            )}
          </div>
        ) : (
          /* NORMAL GRID */

          <div className="proj-grid">
            {list.map((project, index) => (
              <ProjCard
                key={project.id}
                project={project}
                index={index}
                grid
              />
            ))}
          </div>
        )}

        {/* DEBUG INFORMATION - REMOVE AFTER TESTING */}

        {!loading && !fetchErr && (
          <div
            style={{
              marginTop: '20px',
              textAlign: 'center',
              fontSize: '12px',
              opacity: 0.6,
            }}
          >
            Showing {list.length} of {projects.length}{' '}
            projects
          </div>
        )}

      </div>
    </section>
  )
}

// ==================================================
// PROJECT CARD
// ==================================================

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
    if (pos === 'left') {
      posClass = 'sl-left'
    } else if (pos === 'right') {
      posClass = 'sl-right'
    } else if (pos === 'center') {
      posClass = 'sl-center'
    } else {
      posClass = 'sl-hidden'
    }
  }

  return (
    <article
      className={`proj-card glass-card ${
        grid
          ? 'fade-in'
          : `sl-card ${posClass}`
      }`}
      style={
        grid
          ? {
              animationDelay: `${index * 0.11}s`,
            }
          : {}
      }
      aria-hidden={ariaHidden}
      tabIndex={ariaHidden ? -1 : 0}
    >

      {/* IMAGE */}

      {src ? (
        <div className="proj-image">
          <img
            src={src}
            alt={p.title || 'Project'}
            loading="lazy"
          />

          <div className="proj-overlay">
            {p.project_link && (
              <a
                href={p.project_link}
                target="_blank"
                rel="noopener noreferrer"
                className="ov-btn"
                tabIndex={
                  ariaHidden ? -1 : 0
                }
              >
                <FiExternalLink />
                Live
              </a>
            )}

            {p.github_link && (
              <a
                href={p.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="ov-btn ghost"
                tabIndex={
                  ariaHidden ? -1 : 0
                }
              >
                <FiGithub />
                Code
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="proj-image no-image">
          <FiCode />
        </div>
      )}

      {/* CONTENT */}

      <div className="proj-content">

        {p.duration && (
          <div className="proj-duration">
            <FiClock />
            {p.duration}
          </div>
        )}

        <h3>
          {p.title}
        </h3>

        {p.description && (
          <p>
            {p.description}
          </p>
        )}

        {/* TOOLS */}

        {tools.length > 0 && (
          <div className="proj-tools">
            {tools.map(
              (tool: string, i: number) => (
                <span key={`${tool}-${i}`}>
                  {tool}
                </span>
              )
            )}
          </div>
        )}

        {/* LINKS */}

        <div className="proj-links">

          {p.project_link && (
            <a
              href={p.project_link}
              target="_blank"
              rel="noopener noreferrer"
              className="pl-btn"
              tabIndex={
                ariaHidden ? -1 : 0
              }
            >
              <FiExternalLink />
              View Project
            </a>
          )}

          {p.github_link && (
            <a
              href={p.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="pl-btn ghost"
              tabIndex={
                ariaHidden ? -1 : 0
              }
            >
              <FiGithub />
              Source
            </a>
          )}

        </div>

      </div>
    </article>
  )
}
