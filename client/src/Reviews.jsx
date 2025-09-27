import React, { useEffect, useState } from 'react'

export default function Reviews({ items = [] }) {
  const [openUrl, setOpenUrl] = useState('')
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') setOpenUrl('') }
    if (openUrl) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [openUrl])
  if (!items.length) return null
  return (
    <section id="reviews" className="py-16 md:py-24 bg-white/60">
      <div className="container-p">
        <div className="text-center max-w-3xl mx-auto">
          <div className="uppercase tracking-[0.2em] text-ink/60 text-xs">What customers are saying</div>
          <h2 className="font-display text-3xl md:text-5xl mt-2">Reviews</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {items.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-soft border border-ink/5 flex flex-col items-center text-center">
              {r.imageUrl && (
                <button className="mb-4" onClick={()=>setOpenUrl(r.imageUrl)} aria-label="Open image">
                  <img src={r.imageUrl} alt={r.author || 'Customer'} className="h-20 w-20 rounded-full object-cover border border-ink/10" />
                </button>
              )}
              <div className="text-ink/80">“{r.text}”</div>
              {r.author && <div className="mt-3 font-semibold">— {r.author}</div>}
            </div>
          ))}
        </div>
      </div>
      {openUrl && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setOpenUrl('')} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative max-w-5xl w-full bg-white rounded-2xl shadow-soft overflow-hidden border border-ink/10">
              <button className="absolute top-2 right-2 p-1 rounded bg-white/90" onClick={()=>setOpenUrl('')} aria-label="Close">✕</button>
              <img src={openUrl} alt="Review" className="w-full h-auto object-contain max-h-[80vh]" />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}


