import { useState } from 'react'
import { t } from '../i18n'
import Modal from './Modal'

const CONDIMENT_ITEMS = [
  { key: 'soySauce' },
  { key: 'chiliOil' },
  { key: 'vinegar' },
]

function CondimentsModal({ isOpen, onClose, lang, showToast, table, addRequest }) {
  const [selected, setSelected] = useState(new Set())
  const [customNote, setCustomNote] = useState('')

  const toggleItem = (key) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const handleSend = () => {
    const payload = {
      table,
      category: 'condiments',
      items: Array.from(selected).map((key) => t(key, 'en')),
      ...(customNote.trim() ? { customNote: customNote.trim() } : {}),
      timestamp: new Date().toISOString(),
    }
    console.log('[CondimentsModal] Request payload:', JSON.stringify(payload, null, 2))
    showToast(lang === 'en' ? 'Request sent!' : '請求已發送！')
    if (addRequest) addRequest('Condiments', { table })
    setSelected(new Set())
    setCustomNote('')
    onClose()
  }

  const hasAny = selected.size > 0 || customNote.trim()

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); setSelected(new Set()); setCustomNote('') }} title={t('condiments', lang)}>
      <div className="flex flex-wrap gap-2">
        {CONDIMENT_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => toggleItem(item.key)}
            className={`px-5 py-3 rounded-full font-semibold text-sm transition-all cursor-pointer ${
              selected.has(item.key)
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-emerald-400'
            }`}
          >
            {t(item.key, lang)}
          </button>
        ))}
      </div>

      {/* Custom note */}
      <div className="mt-4">
        <label className="block text-sm font-semibold text-slate-700 mb-1">
          {t('customNote', lang)}
        </label>
        <input
          type="text"
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          placeholder={lang === 'en' ? 'e.g. Extra Ranch' : '例：額外牧場醬'}
          className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-emerald-600 transition-colors placeholder-slate-400"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={!hasAny}
        className="w-full py-3.5 mt-5 bg-emerald-600 text-white font-bold rounded-xl cursor-pointer hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t('send', lang)}
      </button>
    </Modal>
  )
}

export default CondimentsModal
