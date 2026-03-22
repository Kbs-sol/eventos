import { getAccessToken } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

interface UploadResponse {
  presignedUrl: string
  r2Key: string
  publicUrl: string
  headers: Record<string, string>
}

export async function requestUploadUrl(
  filename: string,
  contentType: string,
  folder: string = 'general',
): Promise<UploadResponse> {
  const token = await getAccessToken()
  const res = await fetch(`${API_URL}/admin/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ filename, contentType, folder }),
  })

  if (!res.ok) throw new Error('Failed to get upload URL')
  return res.json() as Promise<UploadResponse>
}

export async function confirmUpload(params: {
  r2Key: string
  folder: string
  originalFilename: string
  mimeType: string
  sizeBytes?: number
  width?: number
  height?: number
}): Promise<void> {
  const token = await getAccessToken()
  const res = await fetch(`${API_URL}/admin/upload/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  })

  if (!res.ok) throw new Error('Failed to confirm upload')
}

export async function uploadFile(
  file: File,
  folder: string = 'general',
): Promise<{ r2Key: string; publicUrl: string }> {
  const { presignedUrl, r2Key, publicUrl, headers } = await requestUploadUrl(
    file.name,
    file.type,
    folder,
  )

  // Upload directly to R2
  await fetch(presignedUrl, {
    method: 'PUT',
    headers,
    body: file,
  })

  // Confirm upload
  await confirmUpload({
    r2Key,
    folder,
    originalFilename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  })

  return { r2Key, publicUrl }
}
