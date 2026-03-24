import { getAccessToken } from './auth';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
async function getHeaders() {
    const token = await getAccessToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}
export class ApiError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}
async function handleResponse(res) {
    if (!res.ok) {
        const text = await res.text();
        let message = `Request failed with status ${res.status}`;
        try {
            const json = JSON.parse(text);
            message = json.error || message;
        }
        catch { /* use default message */ }
        throw new ApiError(message, res.status);
    }
    return res.json();
}
export async function apiGet(path) {
    const res = await fetch(`${API_URL}${path}`, { headers: await getHeaders() });
    return handleResponse(res);
}
export async function apiPost(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
}
export async function apiPatch(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
        method: 'PATCH',
        headers: await getHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(res);
}
export async function apiDelete(path) {
    const res = await fetch(`${API_URL}${path}`, {
        method: 'DELETE',
        headers: await getHeaders(),
    });
    return handleResponse(res);
}
