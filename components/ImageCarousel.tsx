'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  if (!images.length) {
    return (
      <div className="aspect-[16/9] bg-fleet-card border border-fleet-border rounded-xl flex items-center justify-center">
        <Image src="/images/error_image.jpg" alt="Geen afbeelding" width={80} height={80} className="opacity-20 object-contain" />
      </div>
    )
  }

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1))

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div
        className="relative aspect-[16/9] bg-fleet-bg rounded-xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image src={images[index]} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors"
            >
              <FiChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                i === index ? 'border-fleet-red' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={url} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
