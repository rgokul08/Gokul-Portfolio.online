import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { FiAward, FiX, FiExternalLink, FiZoomIn, FiAlertCircle, FiRefreshCw, FiCheckCircle } from 'react-icons/fi'
import { splitRows } from '../utils/splitRows'
import MarqueeRow from './MarqueeRow'

const BUCKET = 'Portfolio'
const FOLDER = 'certificates_image'

function imgUrl(item: any) {
  if (!item?.image_url) return null
  if (item.image_url.startsWith('http')) return item.image_url
  return supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${item.image_url}`).data.publicUrl
}

export default function Certificates() {
  const [certs, setCerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchErr, setFetchErr] = useState<string | null>(null)
  const [preview, setPreview] = useState<any>(null)

  const load = useCallback(async () => {
    setLoading(true); setFetchErr(null)
    try {
      const { data, error } = await supabase.from('certificate').select('*').order('id', { ascending: false })
      if (error) throw error
      setCerts(data ?? [])
    } catch (err: any) {
      setFetchErr(err.message || 'Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const ch = supabase.channel('cert-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'certificate' }, () => load())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [load])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setPreview(null) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  useEffect(() => {
    document.body.style.overflow = preview ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [preview])

  /*
   * Dynamic split:
   *  total=20 → row1=10, row2=10
   *  total=21 → row1=11, row2=10
   *  total=7  → row1=4,  row2=3
   *  total=1  → row1=1,  row2=0 (only Row 1 renders)
   * Re-computes on every data change.
   */
  const [row1, row2] = useMemo(() => splitRows(certs), [certs])

  return (
    <div className="certs">
      <div className="container">
        <div className="section-label">Achievements</div>
        <h2 className="section-title">My <span>Certificates</span></h2>

        {loading ? (
          <div className="cert-skel-grid">{[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="cert-skel" />)}</div>
        ) : fetchErr ? (
          <div className="cert-error">
            <FiAlertCircle />
            <p>Could not load certificates.</p>
            <button className="btn-outline cert-retry" onClick={load}><FiRefreshCw /> Retry</button>
          </div>
        ) : certs.length === 0 ? (
          <div className="cert-empty"><FiAward /><p>Certificates coming soon!</p></div>
        ) : (
          <div className="marquee-rows">
            {/* ── ROW 1: first half → scrolls left-to-right ── */}
            <MarqueeRow
              items={row1}
              direction="ltr"
              speed={0.4}
              className="cert-row-wrap"
              wrapClass="cert-marquee-wrap"
              trackClass="cert-marquee-track"
              renderCard={(c, i) => (
                <CertCard key={`r1-${c.id}-${i}`} cert={c} onPreview={() => setPreview(c)} />
              )}
            />
            {/* ── ROW 2: second half → scrolls right-to-left ── */}
            <MarqueeRow
              items={row2}
              direction="rtl"
              speed={0.4}
              className="cert-row-wrap"
              wrapClass="cert-marquee-wrap"
              trackClass="cert-marquee-track"
              renderCard={(c, i) => (
                <CertCard key={`r2-${c.id}-${i}`} cert={c} onPreview={() => setPreview(c)} />
              )}
            />
          </div>
        )}
      </div>

      {/* Lightbox */}
      {preview && (
        <div className="cert-lightbox" onClick={() => setPreview(null)}>
          <div className="cert-lb-inner" onClick={e => e.stopPropagation()}>
            <button className="cert-lb-close" onClick={() => setPreview(null)} aria-label="Close"><FiX /></button>
            <div className="cert-lb-img-wrap">
              {imgUrl(preview)
                ? <img src={imgUrl(preview)} alt={preview.title} className="cert-lb-img" />
                : <div className="cert-lb-ph"><FiAward /><p>{preview.title}</p></div>}
            </div>
            <div className="cert-lb-info">
              <h3>{preview.title}</h3>
              {preview.authority && <p className="cert-lb-auth">Issued by {preview.authority}</p>}
              {preview.description && <p className="cert-lb-desc">{preview.description}</p>}
              {preview.verification_url && (
                <a href={preview.verification_url} target="_blank" rel="noopener noreferrer" className="btn-primary cert-lb-verify">
                  <FiExternalLink /> Verify Certificate
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CertCard({ cert: c, onPreview }: { cert: any; onPreview: () => void }) {
  const src = imgUrl(c)
  return (
    <div className="cert-card glass-card" onClick={onPreview} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onPreview()}>
      <div className="cert-img-wrap">
        {src ? <img src={src} alt={c.title} className="cert-img" loading="lazy" />
          : <div className="cert-img-ph"><FiAward /></div>}
        <div className="cert-zoom"><FiZoomIn /></div>
      </div>
      <div className="cert-body">
        {c.authority && <div className="cert-auth">{c.authority}</div>}
        <div className="cert-title-row">
          <h3 className="cert-title">{c.title}</h3>
          <span className="cert-verified-badge"><FiCheckCircle /> Verified</span>
        </div>
        {c.description && <p className="cert-desc">{c.description}</p>}
      </div>
    </div>
  )
}
