import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { contactRoutes } from './routes/contact'
import { sectionsRoutes } from './routes/sections'
import { portfolioRoutes } from './routes/portfolio'
import { heroRoutes } from './routes/hero'
import { uploadRoutes } from './routes/upload'
import { testimonialsRoutes } from './routes/testimonials'
import { teamRoutes } from './routes/team'
import { statsRoutes } from './routes/stats'
import { enquiriesRoutes } from './routes/enquiries'
import { settingsRoutes } from './routes/settings'
import { razorpayRoutes } from './routes/razorpay'
import { authMiddleware } from './middleware/auth'

export interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  R2_ACCOUNT_ID: string
  R2_ACCESS_KEY_ID: string
  R2_SECRET_ACCESS_KEY: string
  R2_BUCKET_NAME: string
  R2_PUBLIC_URL: string
  RESEND_API_KEY: string
  RESEND_FROM_EMAIL: string
  CONTACT_EMAIL: string
  RAZORPAY_KEY_ID: string
  RAZORPAY_KEY_SECRET: string
  RAZORPAY_WEBHOOK_SECRET: string
  TURNSTILE_SECRET_KEY: string
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Env }>()

// Global middleware
app.use('*', logger())
app.use('*', cors({
  origin: (origin) => {
    const allowed = [
      'http://localhost:4321',
      'http://localhost:5173',
      'http://localhost:3000',
    ]
    if (allowed.includes(origin) || origin.endsWith('.pages.dev')) {
      return origin
    }
    return origin
  },
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Public routes
app.route('/contact', contactRoutes)

// Public data routes (read-only)
app.route('/sections', sectionsRoutes)
app.route('/portfolio', portfolioRoutes)
app.route('/hero', heroRoutes)
app.route('/testimonials', testimonialsRoutes)
app.route('/team', teamRoutes)
app.route('/stats', statsRoutes)

// Protected admin routes
app.use('/admin/*', authMiddleware)
app.route('/admin/upload', uploadRoutes)
app.route('/admin/enquiries', enquiriesRoutes)
app.route('/admin/settings', settingsRoutes)
app.route('/admin/sections', sectionsRoutes)
app.route('/admin/portfolio', portfolioRoutes)
app.route('/admin/testimonials', testimonialsRoutes)
app.route('/admin/team', teamRoutes)
app.route('/admin/stats', statsRoutes)
app.route('/admin/hero', heroRoutes)

// Payment routes
app.route('/razorpay', razorpayRoutes)

// 404 handler
app.notFound((c) => c.json({ error: 'Not found' }, 404))

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

export default app
