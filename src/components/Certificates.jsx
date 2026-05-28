// src/components/Certificates.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import {
  FiAward, FiX, FiExternalLink, FiZoomIn,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi'
import './Certificates.css'

const BUCKET   = 'Portfolio'
const FOLDER   = 'certificates_image'
const SLIDE_AT = 3

function imgUrl(item) {
  if (!item?.image_url) return null
  if (item.image_url.startsWith('http')) return item.image_url
  return supabase.storage
    .from(BUCKET)
    .getPublicUrl(`${FOLDER}/${item.image_url}`)
    .data.publicUrl
}

async function fetchCerts() {
  const { data, error } = await supabase
    .from('certificate')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    console.error('Certificates fetch error:', error.message, error.details, error.hint)
    return []
  }
  console.log('Certificates fetched:', data?.length ?? 0)
  return data ?? []
}

export default function Certificates() {
  const [certs,   setCerts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(null)
  const [cur,     setCur]     = useState(0)
  const [paused,  setPaused]  = useState(false)
  const timer = useRef(null)

  // Initial load
  useEffect(() => {
    fetchCerts()
      .then(setCerts)
      .finally(() => setLoading(false))
  }, [])

  // Realtime subscription — reflects add/update/delete instantly
  useEffect(() => {
    const channel = supabase
      .channel('certificate-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'certificate' },
        payload => {
          console.log('Realtime certificate event:', payload.eventType)
          fetchCerts().then(setCerts)
        }
      )
      .subscribe(status => {
        console.log('Certificates realtime status:', status)
      })

    return () => { supabase.removeChannel(channel) }
  }, [])

  // Close lightbox on Escape
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') setPreview(null) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const slide = certs.length > SLIDE_AT
  const next  = useCallback(() => { if (slide) setCur(c => (c + 1) % certs.length) }, [slide, certs.length])
  const prev  = useCallback(() => { if (slide) setCur(c => (c - 1 + certs.length) % certs.length) }, [slide, certs.length])

  useEffect(() => {
    if (!slide || paused) return
    timer.current = setInterval(next, 3600)
    return () => clearInterval(timer.current)
  }, [slide, paused, next])

  const vis3 = () => {
    const v = []
    for (let o = -1; o <= 1; o++) {
      const i = (cur + o + certs.length) % certs.length
      v.push({ c: certs[i], pos: o })
    }
    return v
  }

  return (
    <div className="certs">
      <div className="container">
        <div className="section-label">Achievements</div>
        <h2 className="section-title">My <span>Certificates</span></h2>

        {loading ? (
          <div className="cert-skel-grid">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="cert-skel" />)}
          </div>
        ) : certs.length === 0 ? (
          <div className="cert-empty">
            <FiAward />
            <p>Certificates coming soon!</p>
          </div>
        ) : slide ? (
          <div className="cert-slide-wrap"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}>
            <div className="cert-stage">
              {vis3().map(({ c, pos }) => (
                <CertCard
                  key={`${c.id}-${pos}`}
                  cert={c}
                  pos={pos}
                  onPreview={pos === 0 ? () => setPreview(c) : undefined} />
              ))}
            </div>
            <button className="cert-arrow left"
              onClick={() => { prev(); setPaused(true) }}>
              <FiChevronLeft />
            </button>
            <button className="cert-arrow right"
              onClick={() => { next(); setPaused(true) }}>
              <FiChevronRight />
            </button>
            <div className="cert-dots">
              {certs.map((_, i) => (
                <button key={i}
                  className={`csd${i === cur ? ' on' : ''}`}
                  onClick={() => { setCur(i); setPaused(true) }} />
              ))}
            </div>
            {!paused && (
              <div className="cert-prog">
                <div className="cert-prog-bar" key={cur} />
              </div>
            )}
          </div>
        ) : (
          <div className="cert-grid">
            {certs.map((c, i) => (
              <CertCard
                key={c.id}
                cert={c}
                index={i}
                pos={0}
                onPreview={() => setPreview(c)} />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {preview && (
        <div className="cert-lightbox" onClick={() => setPreview(null)}>
          <div className="cert-lb-inner" onClick={e => e.stopPropagation()}>
            <button className="cert-lb-close" onClick={() => setPreview(null)}>
              <FiX />
            </button>
            {imgUrl(preview)
              ? <img src={imgUrl(preview)} alt={preview.title} className="cert-lb-img" />
              : (
                <div className="cert-lb-ph">
                  <FiAward /><p>{preview.title}</p>
                </div>
              )}
            <div className="cert-lb-info">
              <h3>{preview.title}</h3>
              {preview.authority    && <p className="cert-lb-auth">Issued by {preview.authority}</p>}
              {preview.description  && <p className="cert-lb-desc">{preview.description}</p>}
              {preview.verification_url && (
                <a href={preview.verification_url} target="_blank" rel="noopener noreferrer"
                   className="btn-primary" style={{ width: 'fit-content', marginTop: 8 }}>
                  <FiExternalLink />Verify
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CertCard({ cert: c, index = 0, pos = 0, onPreview }) {
  const src   = imgUrl(c)
  const pc    = pos === -1 ? 'cs-left' : pos === 1 ? 'cs-right' : 'cs-center'
  const isGrid = onPreview && typeof index === 'number'

  return (
    <div
      className={`cert-card glass-card${isGrid ? ` fade-in` : ` cs-card ${pc}`}`}
      style={isGrid ? { animationDelay: `${index * 0.08}s` } : {}}
      onClick={onPreview}
      role={onPreview ? 'button' : undefined}
      tabIndex={onPreview ? 0 : undefined}
      onKeyDown={onPreview ? e => e.key === 'Enter' && onPreview() : undefined}>
      <div className="cert-img-wrap">
        {src
          ? <img src={src} alt={c.title} className="cert-img" loading="lazy" />
          : <div className="cert-img-ph"><FiAward /></div>}
        {onPreview && <div className="cert-zoom"><FiZoomIn /></div>}
      </div>
      <div className="cert-body">
        {c.authority  && <div className="cert-auth">{c.authority}</div>}
        <h3 className="cert-title">{c.title}</h3>
        {c.description && <p className="cert-desc">{c.description}</p>}
      </div>
    </div>
  )
}