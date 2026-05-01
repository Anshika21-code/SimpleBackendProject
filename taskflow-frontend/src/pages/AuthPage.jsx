import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import api from '../api/axios'

export default function AuthPage() {
  const [tab, setTab]         = useState('login')
  const [loading, setLoading] = useState(false)
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'user' })
  const { login }  = useAuth()
  const toast      = useToast()
  const navigate   = useNavigate()

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast('Email & password required', 'error')
    setLoading(true)
    try {
      await api.post('/auth/register', form)
      toast('Account created! Please login.')
      setTab('login')
    } catch (err) {
      toast(err.response?.data?.message || 'Registration failed', 'error')
    } finally { setLoading(false) }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return toast('Fill all fields', 'error')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password })
      const payload = JSON.parse(atob(data.token.split('.')[1]))
      login(data.token, { id: payload.id, role: payload.role, email: form.email })
      toast('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast(err.response?.data?.message || 'Login failed', 'error')
    } finally { setLoading(false) }
  }

  return (
    <div style={s.page}>
      <div style={s.glow} />
      <div style={s.card}>
        <div style={s.logo}>TaskFlow</div>
        <p style={s.sub}>Ship tasks. Not excuses.</p>

        <div style={s.tabRow}>
          <button style={{ ...s.tabBtn, ...(tab === 'login'    ? s.tabActive : {}) }} onClick={() => setTab('login')}>Login</button>
          <button style={{ ...s.tabBtn, ...(tab === 'register' ? s.tabActive : {}) }} onClick={() => setTab('register')}>Register</button>
        </div>

        <form onSubmit={tab === 'login' ? handleLogin : handleRegister}>
          {tab === 'register' && (
            <Field label="Name" type="text" value={form.name} onChange={set('name')} placeholder="Your name" />
          )}
          <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
          <Field label="Password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
          {tab === 'register' && (
            <div style={s.field}>
              <label style={s.label}>Role</label>
              <select style={s.input} value={form.role} onChange={set('role')}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input style={s.input} {...props} />
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'radial-gradient(ellipse 80% 50% at 50% -10%, #1a0f3a 0%, #09090c 65%)',
    padding: 24, position: 'relative', overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
    width: 500, height: 300,
    background: 'radial-gradient(circle, #6f5ce633 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%', maxWidth: 420,
    background: '#111116', border: '1px solid #26262f',
    borderRadius: 24, padding: '40px 36px',
    position: 'relative', zIndex: 1,
  },
  logo: {
    fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800,
    letterSpacing: -1, marginBottom: 6,
    background: 'linear-gradient(135deg, #9b8eff, #6f5ce6)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  sub: { color: '#9996b0', fontSize: 14, marginBottom: 32 },
  tabRow: {
    display: 'flex', background: '#18181f', borderRadius: 10,
    padding: 4, marginBottom: 28, gap: 4,
  },
  tabBtn: {
    flex: 1, padding: '9px 0', border: 'none', background: 'transparent',
    color: '#9996b0', fontSize: 14, fontWeight: 500,
    borderRadius: 7, cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: 'DM Sans, sans-serif',
  },
  tabActive: { background: '#6f5ce6', color: '#fff' },
  field: { marginBottom: 16 },
  label: {
    display: 'block', fontSize: 11, color: '#9996b0',
    marginBottom: 6, letterSpacing: '0.6px', textTransform: 'uppercase',
  },
  input: {
    width: '100%', background: '#18181f', border: '1px solid #26262f',
    borderRadius: 10, padding: '12px 14px', color: '#eeeaf8',
    fontSize: 15, outline: 'none', transition: 'border-color 0.2s',
  },
  submitBtn: {
    width: '100%', marginTop: 8, padding: 13,
    background: '#6f5ce6', border: 'none', borderRadius: 10,
    color: '#fff', fontFamily: 'Syne, sans-serif', fontSize: 15,
    fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s',
  },
}
