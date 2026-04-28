import { useState, useMemo, useCallback, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Toast from './components/Toast'
import { submitDineInRequest } from './lib/dineInRequests'

function App() {
  // Identity gateway removed — diners land directly on the dashboard.
  const [phoneNumber] = useState('')
  const [lang, setLang] = useState('en')
  const [toast, setToast] = useState({ visible: false, message: '' })
  const [currentView, setCurrentView] = useState('dashboard')
  const [activeRequests, setActiveRequests] = useState([])

  // Extract URL params once
  const { table, mode } = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      table: params.get('table') || '12',
      mode: params.get('mode') || 'full',
    }
  }, [])

  // Reward flag was previously set on OTP verify; preserve that behavior so
  // the existing "Bounce-Back Reward" logic keeps unlocking on first load.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('foodservai_reward', 'true')
    }
  }, [])

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'zh' : 'en'))

  const showToast = useCallback((message) => {
    setToast({ visible: true, message })
  }, [])

  const hideToast = useCallback(() => {
    setToast({ visible: false, message: '' })
  }, [])

  const addRequest = useCallback((title, opts = {}) => {
    const isPaid = opts.isPaidOrder || opts.isQsr || false
    const ticketNum = isPaid ? Math.floor(Math.random() * 900) + 100 : null
    setActiveRequests((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: isPaid ? `Ordered: ${title}` : `Requested: ${title}`,
        time: new Date().toLocaleTimeString(),
        table: opts.table || null,
        isPaidOrder: isPaid,
        ticket: ticketNum,
        isQsr: opts.isQsr || false,
      },
    ])

    // Fire-and-forget: push to FoodServAI dine_in_requests so it lands
    // on the GM Live Floor pad. Never throws — UI keeps working offline.
    submitDineInRequest({
      phone: phoneNumber,
      table: opts.table || null,
      mode: opts.isQsr ? 'qsr' : 'full',
      title: isPaid ? `Ordered: ${title}` : title,
      status: 'pending',
      totalPrice: Number(opts.totalPrice) || 0,
    })
  }, [phoneNumber])

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Dashboard
        phoneNumber={phoneNumber}
        table={table}
        mode={mode}
        lang={lang}
        toggleLang={toggleLang}
        showToast={showToast}
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeRequests={activeRequests}
        addRequest={addRequest}
      />
      <Toast message={toast.message} isVisible={toast.visible} onHide={hideToast} />
    </div>
  )
}

export default App
