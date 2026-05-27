// src/components/Certificates.jsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { FiAward, FiX, FiExternalLink, FiZoomIn } from 'react-icons/fi'
import './Certificates.css'

const BUCKET = 'Portfolio'
const FOLDER = 'certificates_image'

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
  const [preview, setPreview] = useState(null) // lightbox

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

  // Close lightbox on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setPreview(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

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
        ) : (
          <div className="certs-grid">
            {certs.map((cert, i) => (
              <CertCard
                key={cert.id}
                cert={cert}
                index={i}
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
            <button className="cert-lightbox-close" onClick={() => setPreview(null)}>
              <FiX />
            </button>
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

function CertCard({ cert, index, onPreview }) {
  const imgSrc = getImageUrl(cert)

  return (
    <div
      className="cert-card glass-card fade-in"
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={onPreview}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onPreview()}
    >
      <div className="cert-image-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={cert.title} className="cert-image" loading="lazy" />
        ) : (
          <div className="cert-placeholder">
            <FiAward />
          </div>
        )}
        <div className="cert-zoom-hint"><FiZoomIn /></div>
      </div>

      <div className="cert-body">
        {cert.authority && (
          <div className="cert-authority">{cert.authority}</div>
        )}
        <h3 className="cert-title">{cert.title}</h3>
        {cert.description && (
          <p className="cert-desc">{cert.description}</p>
        )}
      </div>
    </div>
  )
}
