import { getAccessToken } from './auth';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
export async function requestUploadUrl(filename, contentType, folder = 'general') {
    const token = await getAccessToken();
    const res = await fetch(`${API_URL}/admin/upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filename, contentType, folder }),
    });
    if (!res.ok)
        throw new Error('Failed to get upload URL');
    return res.json();
}
export async function confirmUpload(params) {
    const token = await getAccessToken();
    const res = await fetch(`${API_URL}/admin/upload/confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
    });
    if (!res.ok)
        throw new Error('Failed to confirm upload');
}
export async function uploadFile(file, folder = 'general') {
    const { presignedUrl, r2Key, publicUrl, headers } = await requestUploadUrl(file.name, file.type, folder);
    // Upload directly to R2
    await fetch(presignedUrl, {
        method: 'PUT',
        headers,
        body: file,
    });
    // Confirm upload
    await confirmUpload({
        r2Key,
        folder,
        originalFilename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
    });
    return { r2Key, publicUrl };
}
