import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import TaskCard from '../components/TaskCard'
import EditModal from '../components/EditModal'
import api from '../api/axios'

export default function Dashboard() {
  const { user, isAdmin, logout } = useAuth()
  const toast    = useToast()
  const navigate = useNavigate()

  const [tasks,   setTasks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [editTask, setEditTask] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium' })
  const [creating, setCreating] = useState(false)

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/v1/tasks')
      setTasks(data.data || [])
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/') }
      else toast('Failed to load tasks', 'error')
    } finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast('Title is required', 'error')
    setCreating(true)
    try {
      await api.post('/v1/tasks', form)
      setForm({ title: '', description: '', status: 'todo', priority: 'medium' })
      toast('Task created!')
      fetchTasks()
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create task', 'error')
    } finally { setCreating(false) }
  }

  const handleUpdate = async (id, updatedData) => {
    try {
      await api.put(`/v1/tasks/${id}`, updatedData)
      toast('Task updated!')
      setEditTask(null)
      fetchTasks()
    } catch (err) {
      toast(err.response?.data?.message || 'Update failed', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await api.delete(`/v1/tasks/${id}`)
      toast('Task deleted')
      fetchTasks()
    } catch (err) {
      toast(err.response?.data?.message || 'Delete failed', 'error')
    }
  }

  const handleLogout = () => { logout(); navigate('/') }
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const username = user?.email?.split('@')[0] || 'User'

  return (
    <div style={s.page}>
      {/* Topbar */}
      <header style={s.topbar}>
        <div style={s.logo}>TaskFlow</div>
        <div style={s.topRight}>
          <div style={s.userBadge}>
            <div style={s.avatar}>{username[0].toUpperCase()}</div>
            <span style={s.username}>{username}</span>
            <span style={{ ...s.rolePill, ...(isAdmin ? s.adminPill : s.userPill) }}>
              {user?.role}
            </span>
          </div>
          <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main style={s.main}>
        {/* Create Task */}
        <div style={s.createCard}>
          <h3 style={s.sectionLabel}>New Task</h3>
          <form onSubmit={handleCreate}>
            <div style={s.field}>
              <label style={s.label}>Title</label>
              <input style={s.input} type="text" placeholder="What needs to be done?" value={form.title} onChange={set('title')} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Description</label>
              <input style={s.input} type="text" placeholder="Optional details..." value={form.description} onChange={set('description')} />
            </div>
            <div style={s.formRow}>
              <div style={s.field}>
                <label style={s.label}>Status</label>
                <select style={s.input} value={form.status} onChange={set('status')}>
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Priority</label>
                <select style={s.input} value={form.priority} onChange={set('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <button type="submit" style={s.createBtn} disabled={creating}>
              {creating ? 'Adding...' : '+ Add Task'}
            </button>
          </form>
        </div>

        {/* Task List */}
        <div style={s.listHeader}>
          <span style={s.listTitle}>Tasks</span>
          <span style={s.listCount}>{tasks.length} total</span>
        </div>

        {loading ? (
          <div style={s.empty}>Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <p>No tasks yet. Create one above!</p>
          </div>
        ) : (
          <div style={s.taskList}>
            {tasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                isAdmin={isAdmin}
                onEdit={setEditTask}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editTask && (
        <EditModal task={editTask} onSave={handleUpdate} onClose={() => setEditTask(null)} />
      )}
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#09090c' },
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 32px', borderBottom: '1px solid #26262f',
    background: '#111116', position: 'sticky', top: 0, zIndex: 100,
  },
  logo: {
    fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800,
    background: 'linear-gradient(135deg, #9b8eff, #6f5ce6)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  topRight: { display: 'flex', alignItems: 'center', gap: 16 },
  userBadge: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#18181f', border: '1px solid #26262f',
    borderRadius: 30, padding: '6px 14px 6px 8px',
  },
  avatar: {
    width: 28, height: 28, background: '#6f5ce6', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 700, color: '#fff',
  },
  username: { fontSize: 13, color: '#eeeaf8' },
  rolePill: { fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
  adminPill: { background: '#6f5ce622', color: '#9b8eff', border: '1px solid #6f5ce6' },
  userPill:  { background: '#1fd6a022', color: '#1fd6a0',  border: '1px solid #1fd6a0' },
  logoutBtn: {
    background: 'transparent', border: '1px solid #26262f',
    borderRadius: 8, color: '#9996b0', fontSize: 13, padding: '7px 14px',
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
  },
  main: { padding: 32, maxWidth: 860, margin: '0 auto' },
  createCard: {
    background: '#111116', border: '1px solid #26262f',
    borderRadius: 18, padding: 24, marginBottom: 28,
  },
  sectionLabel: {
    fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600,
    color: '#55526a', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 16,
  },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 11, color: '#9996b0', marginBottom: 6, letterSpacing: '0.6px', textTransform: 'uppercase' },
  input: {
    width: '100%', background: '#18181f', border: '1px solid #26262f',
    borderRadius: 10, padding: '11px 14px', color: '#eeeaf8', fontSize: 14, outline: 'none',
  },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  createBtn: {
    padding: '11px 24px', background: '#6f5ce6', border: 'none',
    borderRadius: 9, color: '#fff', fontFamily: 'Syne, sans-serif',
    fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4,
  },
  listHeader: { display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 },
  listTitle: { fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700 },
  listCount: { fontSize: 13, color: '#9996b0' },
  taskList: { display: 'flex', flexDirection: 'column', gap: 10 },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#9996b0', fontSize: 14 },
}
