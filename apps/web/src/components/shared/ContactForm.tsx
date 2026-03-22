import { useState } from 'react'

const eventTypes = ['Corporate Event', 'Wedding', 'Conference', 'Product Launch', 'Social Gathering', 'Virtual/Hybrid', 'Other']
const budgetRanges = ['Under ₹1L', '₹1L – ₹3L', '₹3L – ₹5L', '₹5L – ₹10L', '₹10L+', 'Not sure yet']

interface FormData {
  name: string
  email: string
  phone: string
  event_type: string
  event_date: string
  guest_count: string
  budget: string
  message: string
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', event_type: '', event_date: '', guest_count: '', budget: '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const update = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const apiUrl = import.meta.env.PUBLIC_API_URL || import.meta.env.VITE_API_URL || ''
      if (!apiUrl) {
        // In demo mode — just show success
        await new Promise(r => setTimeout(r, 1500))
        setStatus('success')
        return
      }
      const res = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'var(--color-primary-10)' }}>
          <svg className="w-10 h-10" style={{ color: 'var(--color-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>
          Thank You!
        </h3>
        <p className="text-base" style={{ color: 'var(--color-text-muted)' }}>
          We've received your enquiry and will get back to you within 24 hours.
        </p>
      </div>
    )
  }

  const inputClasses = "w-full px-4 py-3 text-sm rounded-xl transition-all duration-200 outline-none focus:ring-2"
  const inputStyle = {
    background: 'var(--color-bg)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    '--tw-ring-color': 'var(--color-primary)',
  } as React.CSSProperties

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error message */}
      {status === 'error' && (
        <div className="p-4 rounded-xl text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
          {errorMsg}
        </div>
      )}

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
            Full Name <span style={{ color: 'var(--color-primary)' }}>*</span>
          </label>
          <input type="text" required placeholder="Your name" value={form.name} onChange={update('name')} className={inputClasses} style={inputStyle} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
            Email <span style={{ color: 'var(--color-primary)' }}>*</span>
          </label>
          <input type="email" required placeholder="you@example.com" value={form.email} onChange={update('email')} className={inputClasses} style={inputStyle} />
        </div>
      </div>

      {/* Phone + Event Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Phone</label>
          <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={update('phone')} className={inputClasses} style={inputStyle} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Event Type</label>
          <select value={form.event_type} onChange={update('event_type')} className={inputClasses} style={inputStyle}>
            <option value="">Select event type</option>
            {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Date + Guest Count + Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Event Date</label>
          <input type="date" value={form.event_date} onChange={update('event_date')} className={inputClasses} style={inputStyle} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Guest Count</label>
          <input type="text" placeholder="~100" value={form.guest_count} onChange={update('guest_count')} className={inputClasses} style={inputStyle} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Budget</label>
          <select value={form.budget} onChange={update('budget')} className={inputClasses} style={inputStyle}>
            <option value="">Select range</option>
            {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
          Tell Us About Your Event
        </label>
        <textarea
          rows={4}
          placeholder="Share your vision, themes, special requirements..."
          value={form.message}
          onChange={update('message')}
          className={`${inputClasses} resize-none`}
          style={inputStyle}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-4 font-semibold text-base rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: 'var(--color-primary)',
          color: 'var(--color-secondary)',
          boxShadow: '0 4px 14px rgba(var(--color-primary-rgb), 0.3)',
        }}
      >
        {status === 'sending' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Enquiry'
        )}
      </button>

      <p className="text-center text-xs" style={{ color: 'var(--color-text-muted)' }}>
        We typically respond within 24 hours.
      </p>
    </form>
  )
}
