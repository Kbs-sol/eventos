import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Env } from '../index'
import { sendEmail, buildContactNotificationEmail } from '../lib/resend'
import { rateLimitMiddleware } from '../middleware/rateLimit'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  guestCount: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
  turnstileToken: z.string().min(1, 'Verification required'),
})

export const contactRoutes = new Hono<{ Bindings: Env }>()

contactRoutes.use('*', rateLimitMiddleware(5, 60000))

contactRoutes.post('/', async (c) => {
  // Parse and validate body
  const body = await c.req.json()
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({
      error: 'Validation failed',
      details: parsed.error.flatten().fieldErrors,
    }, 400)
  }

  const data = parsed.data

  // Verify Turnstile token
  const turnstileResponse = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: c.env.TURNSTILE_SECRET_KEY,
        response: data.turnstileToken,
      }),
    },
  )

  const turnstileResult = await turnstileResponse.json() as { success: boolean }
  if (!turnstileResult.success) {
    return c.json({ error: 'Verification failed. Please try again.' }, 400)
  }

  // Insert enquiry into database
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data: enquiry, error } = await supabase
    .from('contact_enquiries')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      event_type: data.eventType || null,
      event_date: data.eventDate || null,
      guest_count: data.guestCount || null,
      budget: data.budget || null,
      message: data.message || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    return c.json({ error: 'Failed to submit enquiry' }, 500)
  }

  // Send email notification (non-blocking)
  sendEmail(c.env, {
    to: c.env.CONTACT_EMAIL,
    subject: `New Event Enquiry from ${data.name}`,
    html: buildContactNotificationEmail(data),
    replyTo: data.email,
  }).catch((err) => console.error('Email notification failed:', err))

  return c.json({ success: true, id: enquiry.id })
})
