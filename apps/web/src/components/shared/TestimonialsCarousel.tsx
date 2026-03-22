import { useState, useEffect } from 'react'

interface Testimonial {
  id: string
  client_name: string
  client_company?: string | null
  event_type?: string | null
  quote: string
  rating: number
  photo_key?: string | null
}

// Placeholder data until Supabase is connected
const placeholderTestimonials: Testimonial[] = [
  {
    id: '1',
    client_name: 'Sarah Johnson',
    client_company: 'TechCorp India',
    event_type: 'Corporate',
    quote: 'Absolutely phenomenal execution! The team went above and beyond to make our annual gala a huge success. Every detail was perfect.',
    rating: 5,
    photo_key: null,
  },
  {
    id: '2',
    client_name: 'Rahul Sharma',
    client_company: null,
    event_type: 'Wedding',
    quote: 'Our wedding day was a dream come true. The attention to detail, the coordination, and the personal touch made all the difference. We could not have asked for more.',
    rating: 5,
    photo_key: null,
  },
  {
    id: '3',
    client_name: 'Priya Nair',
    client_company: 'Bloom Studios',
    event_type: 'Product Launch',
    quote: 'From concept to execution, the team delivered a stunning product launch event. Professional, creative, and incredibly reliable.',
    rating: 5,
    photo_key: null,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? '' : 'opacity-20'}`}
          style={{ color: i < rating ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsCarousel() {
  const [items, setItems] = useState<Testimonial[]>(placeholderTestimonials)
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-advance
  useEffect(() => {
    if (isPaused || items.length <= 1) return
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPaused, items.length])

  if (items.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
        <p>Testimonials will appear here once added via the admin panel.</p>
      </div>
    )
  }

  const current = items[active]

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main testimonial card */}
      <div
        className="relative p-8 md:p-12 text-center rounded-2xl"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Rating */}
        <div className="flex justify-center mb-6">
          <StarRating rating={current.rating} />
        </div>

        {/* Quote */}
        <blockquote
          className="text-lg md:text-xl lg:text-2xl font-medium leading-relaxed mb-8 transition-opacity duration-500"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}
        >
          &ldquo;{current.quote}&rdquo;
        </blockquote>

        {/* Attribution */}
        <div className="flex items-center justify-center gap-4">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: 'var(--color-primary)' }}
          >
            {current.client_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
              {current.client_name}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {[current.client_company, current.event_type].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active ? 'w-8 h-2' : 'w-2 h-2 opacity-30 hover:opacity-60'
              }`}
              style={{ background: 'var(--color-primary)' }}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
