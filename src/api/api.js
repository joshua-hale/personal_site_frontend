// src/api/api.js
const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080'

async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = data?.message || data?.error || `HTTP ${res.status}`
    throw new Error(message)
  }
  return data
}

export const api = {
  login: (emailOrUsername, password) =>
    request('/auth/login', { method: 'POST', body: { emailOrUsername, password } }),

  me: () => request('/auth/me'),        // adjust to your backend if needed
  logout: () => request('/auth/logout', { method: 'POST' }),
}
