import { useState } from 'react'

interface PortfolioEvent {
  id: string
  title: string
  event_type?: string | null
  location?: string | null
  cover_image?: string | null
  description?: string | null
}

interface Props {
  featured?: boolean
  limit?: number
}

// Placeholder data until Supabase is connected
const placeholderEvents: PortfolioEvent[] = [
  { id: '1', title: 'Annual Corporate Gala', event_type: 'Corporate', location: 'The Taj, Bengaluru', cover_image: null, description: 'An elegant evening celebrating company milestones.' },
  { id: '2', title: 'Lakeside Wedding', event_type: 'Wedding', location: 'Nandi Hills Resort', cover_image: null, description: 'A beautiful outdoor wedding with 200 guests.' },
  { id: '3', title: 'Product Launch 2024', event_type: 'Corporate', location: 'ITC Windsor', cover_image: null, description: 'A dynamic product launch event for tech startup.' },
  { id: '4', title: 'Charity Fundraiser', event_type: 'Social', location: 'Leela Palace', cover_image: null, description: 'Raising funds for children\'s education.' },
]

export default function PortfolioGrid({ featured = false, limit = 6 }: Props) {
  const [events] = useState<PortfolioEvent[]>(placeholderEvents.slice(0, limit))
  const [activeFilter, setActiveFilter] = useState<string>('All')

  const types = ['All', ...new Set(events.map((e) => e.event_type).filter(Boolean))]
  const filtered = activeFilter === 'All' ? events : events.filter((e) => e.event_type === activeFilter)

  return (
    <div>
      {/* Filter tabs */}
      {!featured && types.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type as string)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === type
                  ? 'text-white shadow-md'
                  : 'hover:opacity-80'
              }`}
              style={{
                background: activeFilter === type ? 'var(--color-primary)' : 'var(--color-surface)',
                color: activeFilter === type ? 'var(--color-secondary)' : 'var(--color-text-muted)',
                border: `1px solid ${activeFilter === type ? 'var(--color-primary)' : 'var(--color-border)'}`,
              }}
            >
              {type}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className={`grid gap-6 ${featured ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {filtered.map((event) => (
          <div
            key={event.id}
            className="group relative rounded-xl overflow-hidden cursor-pointer"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* Image */}
            <div className="aspect-[4/3] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--color-secondary), var(--color-primary))' }}>
              {event.cover_image ? (
                <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
                    <svg className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Type badge */}
              {event.event_type && (
                <div className="absolute top-3 left-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-sm"
                    style={{ background: 'rgba(var(--color-primary-rgb), 0.9)', color: 'var(--color-secondary)' }}
                  >
                    {event.event_type}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-5">
              <h3 className="font-semibold text-base mb-1 group-hover:text-[var(--color-primary)] transition-colors" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
                {event.title}
              </h3>
              {event.location && (
                <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
