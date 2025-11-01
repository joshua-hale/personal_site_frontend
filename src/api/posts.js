// src/api/posts.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const BASE = `${API_BASE}/api/posts`;

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    if (contentType.includes("text/html") || text.startsWith("<!DOCTYPE")) {
      throw new Error(`Got HTML instead of JSON. Check that ${url} points to your backend and that you're logged in.`);
    }
    throw new Error(text || `${res.status} ${res.statusText}`);
  }

  return contentType.includes("application/json") ? res.json() : {};
}

export const PostsAPI = {
  list: () => jsonFetch(`${BASE}`),
  get: (id) => jsonFetch(`${BASE}/${id}`),
  getBySlug: (slug) => jsonFetch(`${BASE}/slug/${slug}`),
  create: (body) => jsonFetch(`${BASE}`, { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) => jsonFetch(`${BASE}/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (id) => jsonFetch(`${BASE}/${id}`, { method: "DELETE" }),
};

export function slugify(str = "") {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}