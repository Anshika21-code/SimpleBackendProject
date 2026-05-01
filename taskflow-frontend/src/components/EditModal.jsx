import { useState, useEffect } from 'react'

export default function EditModal({ task, onSave, onClose }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) setForm({ title: task.title, description: task.description || '', status: task.status, priority: task.priority })
  }, [task])

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    await onSave(task._id, form)
    setLoading(false)
  }

  if (!task) return null

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <span style={s.title}>Edit Task</span>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <Field label="Title" type="text" value={form.title} onChange={set('title')} placeholder="Task title" required />
          <Field label="Description" type="text" value={form.description} onChange={set('description')} placeholder="Optional description" />
          <div style={s.row}>
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
          <div style={s.actions}>
            <button type="button" style={s.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={s.saveBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
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
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(4px)', zIndex: 500,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  modal: {
    background: '#111116', border: '1px solid #26262f',
    borderRadius: 20, padding: 32, width: '100%', maxWidth: 460,
    animation: 'popIn 0.2s cubic-bezier(.34,1.56,.64,1)',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700 },
  closeBtn: {
    background: 'transparent', border: 'none', color: '#9996b0',
    fontSize: 16, cursor: 'pointer', padding: 4,
  },
  field: { marginBottom: 14 },
  label: { display: 'block', fontSize: 11, color: '#9996b0', marginBottom: 6, letterSpacing: '0.6px', textTransform: 'uppercase' },
  input: {
    width: '100%', background: '#18181f', border: '1px solid #26262f',
    borderRadius: 10, padding: '11px 14px', color: '#eeeaf8', fontSize: 14, outline: 'none',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  actions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 },
  cancelBtn: {
    padding: '10px 20px', background: 'transparent', border: '1px solid #26262f',
    borderRadius: 9, color: '#9996b0', fontSize: 14, cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
  },
  saveBtn: {
    padding: '10px 24px', background: '#6f5ce6', border: 'none',
    borderRadius: 9, color: '#fff', fontFamily: 'Syne, sans-serif',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
}
