import React, { useEffect, useRef, useState } from 'react'

export default function Slideshow({ images = [], intervalMs = 3500 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const goTo = (index) => {
    const next = (index + images.length) % images.length;
    setCurrentIndex(next);
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [images.length, intervalMs]);

  if (!images.length) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-ink/10 shadow-soft bg-cream">
      <div
        className="relative h-72 sm:h-96 md:h-[28rem]"
        aria-roledescription="carousel"
      >
        {images.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt="Product"
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${i === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-cream/80 hover:bg-cream text-ink rounded-full p-2 shadow"
            onClick={prev}
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6"><path strokeWidth="1.5" d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-cream/80 hover:bg-cream text-ink rounded-full p-2 shadow"
            onClick={next}
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6"><path strokeWidth="1.5" d="M9 6l6 6-6 6"/></svg>
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                className={`h-2.5 w-2.5 rounded-full border border-ink/40 ${i === currentIndex ? 'bg-gold' : 'bg-cream/80 hover:bg-cream'}`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}


