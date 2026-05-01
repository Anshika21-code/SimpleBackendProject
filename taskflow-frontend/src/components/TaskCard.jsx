const STATUS_COLORS = {
  'todo':        { bg: '#ffffff0d', color: '#9996b0' },
  'in-progress': { bg: '#f0a83022', color: '#f0a830' },
  'done':        { bg: '#1fd6a022', color: '#1fd6a0' },
}
const PRIORITY_COLORS = {
  low:    { bg: '#1fd6a011', color: '#1fd6a088' },
  medium: { bg: '#f0a83011', color: '#f0a83088' },
  high:   { bg: '#f05a5a11', color: '#f05a5a88' },
}

export default function TaskCard({ task, isAdmin, onEdit, onDelete }) {
  const sc = STATUS_COLORS[task.status]   || STATUS_COLORS['todo']
  const pc = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS['medium']
  const date = new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div style={s.card}>
      <div style={s.body}>
        <div style={s.title}>{task.title}</div>
        {task.description && <div style={s.desc}>{task.description}</div>}
        <div style={s.meta}>
          <span style={{ ...s.pill, background: sc.bg, color: sc.color }}>{task.status}</span>
          <span style={{ ...s.pill, background: pc.bg, color: pc.color }}>{task.priority}</span>
          <span style={s.date}>{date}</span>
        </div>
      </div>
      <div style={s.actions}>
        <button style={s.iconBtn} onClick={() => onEdit(task)} title="Edit">✏️</button>
        {isAdmin && (
          <button style={{ ...s.iconBtn, ...s.delBtn }} onClick={() => onDelete(task._id)} title="Delete">🗑️</button>
        )}
      </div>
    </div>
  )
}

const s = {
  card: {
    background: '#111116', border: '1px solid #26262f',
    borderRadius: 16, padding: '18px 20px',
    display: 'flex', alignItems: 'flex-start', gap: 16,
    transition: 'border-color 0.2s, transform 0.15s',
    animation: 'fadeUp 0.25s ease forwards',
  },
  body: { flex: 1, minWidth: 0 },
  title: {
    fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 600,
    marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  desc: { fontSize: 13, color: '#9996b0', marginBottom: 10, lineHeight: 1.5 },
  meta: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  pill: { fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, textTransform: 'capitalize' },
  date: { fontSize: 11, color: '#45436a' },
  actions: { display: 'flex', gap: 8, flexShrink: 0 },
  iconBtn: {
    width: 34, height: 34, borderRadius: 8,
    border: '1px solid #26262f', background: 'transparent',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, transition: 'all 0.2s',
  },
  delBtn: {},
}
