import React, { useEffect } from 'react'

export default function OrderModal({ open, onClose, src }) {
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-soft overflow-hidden border border-ink/10">
          <div className="flex items-center justify-between px-5 py-3 border-b border-ink/10 bg-cream">
            <div className="font-semibold">Order Bonefied Broth</div>
            <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6"><path strokeWidth="1.5" d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <div className="h-[78vh]">
            <iframe
              title="Order Form"
              src={src}
              className="w-full h-full"
              frameBorder="0"
              allow="clipboard-write; encrypted-media;"
            />
          </div>
        </div>
      </div>
    </div>
  )
}


