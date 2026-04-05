import { useState, useEffect } from 'react'
import { t } from '../i18n'
import Modal from './Modal'

// Each sub-item maps to an i18n key
const SUB_ITEMS = {
  water: [
    { key: 'iceWater' },
    { key: 'roomWater' },
  ],
  condiments: [
    { key: 'soySauce' },
    { key: 'chiliOil' },
    { key: 'vinegar' },
  ],
  utensils: [
    { key: 'forks' },
    { key: 'spoons' },
    { key: 'chopsticks' },
    { key: 'kidsSetup' },
  ],
  togo: [
    { key: 'smallBox' },
    { key: 'largeBox' },
    { key: 'soupContainer' },
    { key: 'bags' },
  ],
}

const HAS_CUSTOM_NOTE = { condiments: true, togo: true }

function QuantityModal({ isOpen, onClose, category, lang, showToast, table, addRequest }) {
  const items = SUB_ITEMS[category] || []
  const showCustom = HAS_CUSTOM_NOTE[category] || false

  const [quantities, setQuantities] = useState({})
  const [customNote, setCustomNote] = useState('')

  // Reset state when category changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantities(Object.fromEntries(items.map((item) => [item.key, 0])))
      setCustomNote('')
    }
  }, [isOpen, category])

  const adjust = (key, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta),
    }))
  }

  const handleSend = () => {
    const payload = {
      table,
      category,
      items: Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .map(([key, quantity]) => ({ name: t(key, 'en'), quantity })),
      ...(showCustom && customNote.trim() ? { customNote: customNote.trim() } : {}),
      timestamp: new Date().toISOString(),
    }
    console.log('[QuantityModal] Request payload:', JSON.stringify(payload, null, 2))
    showToast(lang === 'en' ? 'Request sent!' : '請求已發送！')
    if (addRequest) {
      payload.items.forEach((item) => addRequest(`${item.name} x${item.quantity}`, { table }))
    }
    onClose()
  }

  const hasAnySelection = Object.values(quantities).some((q) => q > 0) || (showCustom && customNote.trim())
  const title = t(category, lang)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
          >
            <span className="font-medium text-slate-800">{t(item.key, lang)}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjust(item.key, -1)}
                className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-lg font-bold text-slate-600 active:bg-slate-100 cursor-pointer transition-colors"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-lg tabular-nums">
                {quantities[item.key] || 0}
              </span>
              <button
                onClick={() => adjust(item.key, 1)}
                className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-bold active:bg-emerald-700 cursor-pointer transition-colors"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom note for condiments & togo */}
      {showCustom && (
        <div className="mt-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            {t('customNote', lang)}
          </label>
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder={lang === 'en' ? 'e.g. Pizza Box' : '例：披薩盒'}
            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-emerald-600 transition-colors placeholder-slate-400"
          />
        </div>
      )}

      <button
        onClick={handleSend}
        disabled={!hasAnySelection}
        className="w-full py-3.5 mt-5 bg-emerald-600 text-white font-bold rounded-xl cursor-pointer hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('send', lang)}
      </button>
    </Modal>
  )
}

export default QuantityModal
