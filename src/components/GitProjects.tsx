import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { FiGithub, FiAlertCircle, FiRefreshCw, FiPackage, FiExternalLink } from 'react-icons/fi'
import { splitRows } from '../utils/splitRows'
import MarqueeRow from './MarqueeRow'

function parseLanguages(t: any): string[] {
  if (!t) return []
  if (Array.isArray(t)) return t
  try {
    const parsed = JSON.parse(t)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    if (typeof t === 'string') return t.split(',').map((s: string) => s.trim()).filter(Boolean)
    return []
  }
}

export default function GitProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchErr, setFetchErr] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true); setFetchErr(null)
    try {
      const { data, error } = await supabase.from('github').select('*').order('id', { ascending: false })
      if (error) throw error
      setProjects(data ?? [])
    } catch (err: any) {
      setFetchErr(err.message || 'Failed to load GitHub projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const ch = supabase.channel('github-real-time')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'github' }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [load])

  /*
   * Dynamic split:
   *  total=20 → row1=10, row2=10
   *  total=21 → row1=11, row2=10
   *  total=7  → row1=4,  row2=3
   *  total=1  → row1=1,  row2=0 (only Row 1 renders)
   * Re-computes on every data change.
   */
  const [row1, row2] = useMemo(() => splitRows(projects), [projects])

  return (
    <div className="git-projects">
      <div className="container">
        <div className="section-label">GitHub Repository</div>
        <h2 className="section-title">My <span>Git Projects</span></h2>

        {loading ? (
          <div className="git-skel-grid">{[1, 2, 3].map(i => <div key={i} className="git-skel" />)}</div>
        ) : fetchErr ? (
          <div className="git-error">
            <FiAlertCircle />
            <p>Could not load GitHub projects.</p>
            <button className="btn-outline git-retry" onClick={load}><FiRefreshCw /> Retry</button>
          </div>
        ) : projects.length === 0 ? (
          <div className="git-empty"><FiPackage /><p>No GitHub projects yet.</p></div>
        ) : (
          <div className="marquee-rows">
            {/* ── ROW 1: first half → scrolls left-to-right ── */}
            <MarqueeRow
              items={row1}
              direction="ltr"
              speed={0.5}
              className="git-row-wrap"
              wrapClass="git-marquee-wrap"
              trackClass="git-marquee-track"
              renderCard={(p, i) => <GitCard key={`r1-${p.id}-${i}`} project={p} />}
            />
            {/* ── ROW 2: second half → scrolls right-to-left ── */}
            <MarqueeRow
              items={row2}
              direction="rtl"
              speed={0.5}
              className="git-row-wrap"
              wrapClass="git-marquee-wrap"
              trackClass="git-marquee-track"
              renderCard={(p, i) => <GitCard key={`r2-${p.id}-${i}`} project={p} />}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function GitCard({ project: p }: { project: any }) {
  const languages = parseLanguages(p.languages)
  return (
    <div className="git-card glass-card">
      <div className="git-header">
        <div className="git-icon"><FiGithub /></div>
        <h3 className="git-title">{p.title || 'Untitled'}</h3>
      </div>
      <div className="git-body">
        {p.description && <p className="git-desc">{p.description}</p>}
        {languages.length > 0 && (
          <div className="git-langs">
            {languages.slice(0, 4).map((lang: string, i: number) => (
              <span key={i} className="git-lang-badge">{lang}</span>
            ))}
            {languages.length > 4 && <span className="git-lang-badge">+{languages.length - 4}</span>}
          </div>
        )}
        <div className="git-links">
          {p.github_link && (
            <a href={p.github_link} target="_blank" rel="noopener noreferrer" className="git-link-btn">
              <FiGithub /> Repository
            </a>
          )}
          {p.live_link && (
            <a href={p.live_link} target="_blank" rel="noopener noreferrer" className="git-link-btn">
              <FiExternalLink /> Live Demo
            </a>
          )}
        </div>
      </div>
      <div className="git-border-glow" />
    </div>
  )
}
