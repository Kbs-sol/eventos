import { cors } from 'hono/cors'

export const corsMiddleware = cors({
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
})
