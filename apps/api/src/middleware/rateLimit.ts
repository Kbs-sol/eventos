import { createMiddleware } from 'hono/factory'
import type { Env } from '../index'

const requestCounts = new Map<string, { count: number; resetAt: number }>()

export const rateLimitMiddleware = (maxRequests: number = 10, windowMs: number = 60000) => {
  return createMiddleware<{ Bindings: Env }>(async (c, next) => {
    const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'
    const now = Date.now()
    const record = requestCounts.get(ip)

    if (!record || now > record.resetAt) {
      requestCounts.set(ip, { count: 1, resetAt: now + windowMs })
      await next()
      return
    }

    if (record.count >= maxRequests) {
      return c.json({ error: 'Too many requests. Please try again later.' }, 429)
    }

    record.count++
    await next()
  })
}
