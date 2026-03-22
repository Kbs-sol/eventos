import type { Env } from '../index'

interface PresignedUrlParams {
  key: string
  contentType: string
  expiresIn?: number
}

export async function generatePresignedUploadUrl(
  env: Env,
  params: PresignedUrlParams,
): Promise<string> {
  const { key, contentType, expiresIn = 300 } = params
  const endpoint = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  const now = new Date()
  const expiry = new Date(now.getTime() + expiresIn * 1000)

  // Use Cloudflare R2 S3-compatible API to create presigned URL
  const url = new URL(`/${env.R2_BUCKET_NAME}/${key}`, endpoint)

  // For simplicity, return the URL parts needed for client-side upload
  // In production, use AWS SDK v3 or S3 presigned URL generation
  const signedUrl = `${url.toString()}?X-Amz-Expires=${expiresIn}&X-Amz-Date=${now.toISOString().replace(/[:-]/g, '').split('.')[0]}Z&content-type=${encodeURIComponent(contentType)}`

  return signedUrl
}

export function getPublicUrl(env: Env, r2Key: string): string {
  return `${env.R2_PUBLIC_URL}/${r2Key}`
}

export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function generateR2Key(folder: string, filename: string): string {
  const sanitized = sanitizeFilename(filename)
  const uniqueId = crypto.randomUUID().slice(0, 8)
  return `${folder}/${uniqueId}-${sanitized}`
}
