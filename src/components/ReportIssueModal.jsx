import { useState, useEffect } from 'react'
import { t } from '../i18n'
import Modal from './Modal'

const CATEGORIES = [
  { key: 'foodQuality' },
  { key: 'service' },
  { key: 'other' },
]

function ReportIssueModal({ isOpen, onClose, lang, showToast, table, defaultCategory, addRequest }) {
  const [category, setCategory] = useState(defaultCategory || '')
  const [details, setDetails] = useState('')
  const [file, setFile] = useState(null)

  // Sync category when defaultCategory changes (e.g. from RateMeal pre-fill)
  useEffect(() => {
    if (defaultCategory) setCategory(defaultCategory)
  }, [defaultCategory])

  const handleSubmit = () => {
    const payload = {
      table,
      category,
      details,
      hasPhoto: !!file,
      photoName: file?.name || null,
      timestamp: new Date().toISOString(),
    }
    console.log('[ReportIssue] Payload:', JSON.stringify(payload, null, 2))
    showToast(lang === 'en' ? 'Report submitted to manager' : '報告已提交給經理')
    if (addRequest) addRequest(`Issue: ${category}`, { table })
    setCategory('')
    setDetails('')
    setFile(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'en' ? '🚨 Report an Issue' : '🚨 反應用餐問題'}
    >
      <div className="space-y-4">
        {/* Category Select */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            {lang === 'en' ? 'Issue Category' : '問題類別'}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-rose-500 transition-colors cursor-pointer appearance-none"
          >
            <option value="">{lang === 'en' ? 'Select a category...' : '選擇類別...'}</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.key} value={t(cat.key, 'en')}>
                {t(cat.key, lang)}
              </option>
            ))}
          </select>
        </div>

        {/* Details Textarea */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            {lang === 'en' ? 'Details' : '詳情'}
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={lang === 'en' ? 'Tell us what happened...' : '請告訴我們發生了什麼...'}
            rows={4}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:border-rose-500 transition-colors placeholder-slate-400 resize-none"
          />
        </div>

        {/* Camera Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            {lang === 'en' ? 'Photo (optional)' : '照片（選填）'}
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-rose-100 file:text-rose-600 file:font-semibold file:cursor-pointer"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!category || !details.trim()}
          className="w-full py-3.5 bg-rose-600 text-white font-bold rounded-xl cursor-pointer hover:bg-rose-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {lang === 'en' ? 'Submit to Manager' : '提交給經理'}
        </button>
      </div>
    </Modal>
  )
}

export default ReportIssueModal
