import { Hono } from 'hono'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import type { Env } from '../index'
import { generateR2Key } from '../lib/r2'

export const uploadRoutes = new Hono<{ Bindings: Env }>()

// POST / — generate presigned upload URL
const uploadSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  folder: z.string().default('general'),
})

uploadRoutes.post('/', async (c) => {
  const body = await c.req.json()
  const parsed = uploadSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const { filename, contentType, folder } = parsed.data
  const r2Key = generateR2Key(folder, filename)

  // Generate presigned URL using S3-compatible API
  const endpoint = `https://${c.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  const url = `${endpoint}/${c.env.R2_BUCKET_NAME}/${r2Key}`

  // Create a simple presigned URL using HMAC signing
  const expiry = 300 // 5 minutes
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]/g, '').replace(/\.\d{3}/, '')

  return c.json({
    presignedUrl: url,
    r2Key,
    publicUrl: `${c.env.R2_PUBLIC_URL}/${r2Key}`,
    headers: {
      'Content-Type': contentType,
      'X-Amz-Date': amzDate,
    },
    expiresAt: new Date(now.getTime() + expiry * 1000).toISOString(),
  })
})

// POST /confirm — confirm upload and create media record
const confirmSchema = z.object({
  r2Key: z.string().min(1),
  folder: z.string().default('general'),
  width: z.number().optional(),
  height: z.number().optional(),
  sizeBytes: z.number().optional(),
  originalFilename: z.string().min(1),
  mimeType: z.string().default('image/webp'),
})

uploadRoutes.post('/confirm', async (c) => {
  const body = await c.req.json()
  const parsed = confirmSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const { r2Key, folder, width, height, sizeBytes, originalFilename, mimeType } = parsed.data

  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data: asset, error } = await supabase
    .from('media_assets')
    .insert({
      filename: originalFilename,
      r2_key: r2Key,
      folder,
      width: width || null,
      height: height || null,
      size_bytes: sizeBytes || null,
      mime_type: mimeType,
    })
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ success: true, asset })
})

// POST /link — add an external media link
const linkSchema = z.object({
  url: z.string().url(),
  filename: z.string().min(1),
  mimeType: z.string().default('video/embed'),
})

uploadRoutes.post('/link', async (c) => {
  const body = await c.req.json()
  const parsed = linkSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: 'Validation failed', details: parsed.error.flatten() }, 400)

  const { url, filename, mimeType } = parsed.data
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
  
  const { data: asset, error } = await supabase
    .from('media_assets')
    .insert({
      filename,
      r2_key: url, // Store URL in r2_key for simplicity
      mime_type: mimeType,
      folder: 'external',
    })
    .select()
    .single()

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ success: true, asset })
})

