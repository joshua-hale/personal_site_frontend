// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { AuthAPI as api } from '../api/auth.js'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api.me()
      .then(u => !cancelled && setUser(u))
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  async function login(emailOrUsername, password) {
    setError(null)
    const res = await api.login(emailOrUsername, password)
    // assume API returns { user: {...} } or user object directly
    setUser(res.user ?? res)
    return res
  }

  async function logout() {
    try { await api.logout() } catch {}
    setUser(null)
  }

  const value = { user, loading, error, login, logout, setError }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
