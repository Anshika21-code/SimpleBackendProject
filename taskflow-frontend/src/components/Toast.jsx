import { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={styles.container}>
        {toasts.map(t => (
          <div key={t.id} style={{ ...styles.toast, ...styles[t.type] }}>
            <span style={styles.icon}>{t.type === 'success' ? '✓' : '✕'}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

const styles = {
  container: {
    position: 'fixed', bottom: 24, right: 24,
    display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9999,
  },
  toast: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 18px',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    background: '#1a1a22',
    border: '1px solid #2a2a35',
    color: '#eeeaf8',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    animation: 'slideUp 0.3s cubic-bezier(.34,1.56,.64,1)',
    minWidth: 220,
  },
  success: { borderColor: '#1fd6a0', color: '#1fd6a0' },
  error:   { borderColor: '#f05a5a', color: '#f05a5a' },
  icon: { fontSize: 13, fontWeight: 700 },
}
