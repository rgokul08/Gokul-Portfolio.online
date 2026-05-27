// src/components/Certificates.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { FiAward, FiX, FiExternalLink, FiZoomIn, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './Certificates.css'

const BUCKET = 'Portfolio'
const FOLDER = 'certificates_image'
const SLIDE_THRESHOLD = 3

const FALLBACK_CERTS = [
  { id: 1, title: 'React Developer Certification', description: 'Completed advanced React course covering hooks, context, and modern patterns.', authority: 'Udemy', image_url: null },
  { id: 2, title: 'JavaScript Algorithms & Data Structures', description: 'Earned certification for mastering core algorithms and data structures in JavaScript.', authority: 'freeCodeCamp', image_url: null },
  { id: 3, title: 'Full Stack Web Development', description: 'Comprehensive full-stack course covering Node.js, Express, MongoDB, and React.', authority: 'Coursera', image_url: null },
  { id: 4, title: 'Python for Everybody', description: 'Learned Python fundamentals including data structures, networking, and databases.', authority: 'University of Michigan', image_url: null },
  { id: 5, title: 'UI/UX Design Fundamentals', description: 'Principles of user-centered design, prototyping, and Figma workflows.', authority: 'Google', image_url: null },
  { id: 6, title: 'Cloud Computing Essentials', description: 'Introduction to cloud architecture, AWS services, and deployment strategies.', authority: 'AWS', image_url: null },
]

function getImageUrl(item) {
  if (item.image_url && item.image_url.startsWith('http')) return item.image_url
  if (item.image_url) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${item.image_url}`)
    return data.publicUrl
  }
  return null
}

export default function Certificates() {
  const [certs,   setCerts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(null)
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from('certificate')
          .select('*')
          .order('id', { ascending: false })
        if (error || !data || data.length === 0) setCerts(FALLBACK_CERTS)
        else setCerts(data)
      } catch {
        setCerts(FALLBACK_CERTS)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  // Escape closes lightbox
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setPreview(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const useSlideshow = certs.length > SLIDE_THRESHOLD

  const next = useCallback(() => {
    if (useSlideshow) setCurrent(c => (c + 1) % certs.length)
  }, [useSlideshow, certs.length])

  const prev = useCallback(() => {
    if (useSlideshow) setCurrent(c => (c - 1 + certs.length) % certs.length)
  }, [useSlideshow, certs.length])

  useEffect(() => {
    if (!useSlideshow || paused) return
    timerRef.current = setInterval(next, 3500)
    return () => clearInterval(timerRef.current)
  }, [useSlideshow, paused, next])

  // For slideshow: 3 visible cards centered on current
  const getVisible = () => {
    const vis = []
    for (let offset = -1; offset <= 1; offset++) {
      const idx = (current + offset + certs.length) % certs.length
      vis.push({ cert: certs[idx], pos: offset, idx })
    }
    return vis
  }

  return (
    <div className="certificates">
      <div className="container">
        <div className="section-label">Achievements</div>
        <h2 className="section-title">
          My <span>Certificates</span>
        </h2>

        {loading ? (
          <div className="certs-skeleton-grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="cert-skeleton" />)}
          </div>
        ) : useSlideshow ? (
          /* ── Slideshow mode ── */
          <div
            className="certs-slideshow"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="certs-stage">
              {getVisible().map(({ cert, pos }) => (
                <CertCard
                  key={`${cert.id}-${pos}`}
                  cert={cert}
                  pos={pos}
                  onPreview={pos === 0 ? () => setPreview(cert) : undefined}
                />
              ))}
            </div>

            <button className="cert-slide-btn cert-slide-prev" onClick={() => { prev(); setPaused(true) }} aria-label="Previous">
              <FiChevronLeft />
            </button>
            <button className="cert-slide-btn cert-slide-next" onClick={() => { next(); setPaused(true) }} aria-label="Next">
              <FiChevronRight />
            </button>

            <div className="cert-slide-dots">
              {certs.map((_, i) => (
                <button
                  key={i}
                  className={`cert-slide-dot ${i === current ? 'active' : ''}`}
                  onClick={() => { setCurrent(i); setPaused(true) }}
                  aria-label={`Certificate ${i + 1}`}
                />
              ))}
            </div>

            {!paused && (
              <div className="cert-progress">
                <div className="cert-progress-bar" key={current} />
              </div>
            )}
          </div>
        ) : (
          /* ── Grid mode ── */
          <div className="certs-grid">
            {certs.map((cert, i) => (
              <CertCard
                key={cert.id}
                cert={cert}
                index={i}
                pos={0}
                onPreview={() => setPreview(cert)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {preview && (
        <div className="cert-lightbox" onClick={() => setPreview(null)}>
          <div className="cert-lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="cert-lightbox-close" onClick={() => setPreview(null)}><FiX /></button>
            {getImageUrl(preview) ? (
              <img src={getImageUrl(preview)} alt={preview.title} className="cert-lightbox-img" />
            ) : (
              <div className="cert-lightbox-placeholder">
                <FiAward />
                <p>{preview.title}</p>
              </div>
            )}
            <div className="cert-lightbox-info">
              <h3>{preview.title}</h3>
              {preview.authority && <p className="cert-lightbox-auth">Issued by {preview.authority}</p>}
              {preview.description && <p className="cert-lightbox-desc">{preview.description}</p>}
              {preview.verification_url && (
                <a href={preview.verification_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: 'fit-content', marginTop: 8 }}>
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

function CertCard({ cert, index = 0, pos = 0, onPreview }) {
  const imgSrc = getImageUrl(cert)
  const posClass = pos === -1 ? 'cert-slide-left' : pos === 1 ? 'cert-slide-right' : 'cert-slide-center'

  return (
    <div
      className={`cert-card glass-card ${pos === 0 && onPreview !== undefined ? (index !== undefined ? 'fade-in' : `cert-slide-card ${posClass}`) : `cert-slide-card ${posClass}`}`}
      style={index !== undefined && pos === 0 && onPreview !== undefined && index >= 0 ? { animationDelay: `${index * 0.08}s` } : {}}
      onClick={onPreview}
      role={onPreview ? 'button' : undefined}
      tabIndex={onPreview ? 0 : undefined}
      onKeyDown={onPreview ? e => e.key === 'Enter' && onPreview() : undefined}
    >
      <div className="cert-image-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={cert.title} className="cert-image" loading="lazy" />
        ) : (
          <div className="cert-placeholder"><FiAward /></div>
        )}
        {onPreview && <div className="cert-zoom-hint"><FiZoomIn /></div>}
      </div>
      <div className="cert-body">
        {cert.authority && <div className="cert-authority">{cert.authority}</div>}
        <h3 className="cert-title">{cert.title}</h3>
        {cert.description && <p className="cert-desc">{cert.description}</p>}
      </div>
    </div>
  )
}