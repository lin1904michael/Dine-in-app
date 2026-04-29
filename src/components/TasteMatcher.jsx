import { useState } from 'react'
import { t } from '../i18n'
import { matchByFlavor } from '../lib/tasteMatch'

const TASTE_OPTIONS = [
  { label: 'Spicy', emoji: '🌶️' },
  { label: 'Savory', emoji: '🥩' },
  { label: 'Light', emoji: '🥬' },
  { label: 'Sweet', emoji: '🍯' },
  { label: 'Sour', emoji: '🍋' },
  { label: 'Umami', emoji: '🍄' },
  { label: 'Smoky', emoji: '🔥' },
  { label: 'Creamy', emoji: '🥛' },
  { label: 'Crunchy', emoji: '🥜' },
]

const LOCAL_FALLBACK = {
  Spicy:   { item_name: 'Kung Pao Chicken',           category: 'Spicy',   price: 22, photo_url: null },
  Savory:  { item_name: 'Sizzling Black Pepper Beef', category: 'Savory',  price: 28, photo_url: null },
  Light:   { item_name: 'Dim Sum Soup Dumplings',     category: 'Light',   price: 16, photo_url: null },
  Sweet:   { item_name: 'Honey Glazed Salmon',        category: 'Sweet',   price: 26, photo_url: null },
  Sour:    { item_name: 'Citrus Shrimp Ceviche',      category: 'Sour',    price: 18, photo_url: null },
  Umami:   { item_name: 'Miso Glazed Eggplant',       category: 'Umami',   price: 17, photo_url: null },
  Smoky:   { item_name: 'BBQ Pork Ribs',              category: 'Smoky',   price: 32, photo_url: null },
  Creamy:  { item_name: 'Truffle Mushroom Risotto',   category: 'Creamy',  price: 24, photo_url: null },
  Crunchy: { item_name: 'Panko Fried Chicken',        category: 'Crunchy', price: 20, photo_url: null },
}

function TasteMatcher({ lang }) {
  const [activeTastes, setActiveTastes] = useState([])
  const [loading, setLoading] = useState(false)
  const [matchResult, setMatchResult] = useState(null)

  const toggleTaste = (label) => {
    setActiveTastes((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
    setMatchResult(null)
  }

  const handleGenerate = async () => {
    if (activeTastes.length === 0) return

    setLoading(true)
    setMatchResult(null)

    const flavorKey = activeTastes.join(',')
    const remote = await matchByFlavor(flavorKey)
    const result = remote || LOCAL_FALLBACK[activeTastes[0]] || null
    setMatchResult(result)
    setLoading(false)
  }

  const formatPrice = (price) => {
    const n = typeof price === 'number' ? price : parseFloat(price)
    return Number.isFinite(n) ? n.toFixed(2) : String(price ?? '')
  }

  return (
    <div className="px-4 mt-4">
      <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5">
        <h3 className="text-blue-600 font-bold mb-3 text-lg">
          ✨ {t('decide', lang)}
        </h3>

        <div className="flex flex-wrap gap-2">
          {TASTE_OPTIONS.map((option) => (
            <button
              key={option.label}
              onClick={() => toggleTaste(option.label)}
              className={`py-2 px-3 rounded-full font-semibold text-sm transition-all cursor-pointer ${
                activeTastes.includes(option.label)
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>

        {activeTastes.length > 0 && (
          <p className="text-xs text-blue-500 mt-2">
            {activeTastes.length} flavor{activeTastes.length > 1 ? 's' : ''} selected
          </p>
        )}

        <button
          onClick={handleGenerate}
          disabled={activeTastes.length === 0 || loading}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4 cursor-pointer hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? (lang === 'en' ? 'Analyzing Flavor Profiles...' : '分析口味中...')
            : t('match', lang)
          }
        </button>

        {matchResult && !loading && (
          <div className="mt-4 bg-white border border-blue-200 rounded-2xl overflow-hidden shadow-sm">
            {matchResult.photo_url && (
              <img
                src={matchResult.photo_url}
                alt={matchResult.item_name}
                className="w-full h-40 object-cover"
                loading="lazy"
              />
            )}
            <div className="p-4">
              <p className="text-lg font-bold text-slate-900">
                🎯 Match Found: {matchResult.item_name}
              </p>
              <p className="text-slate-600 text-sm mt-1">
                {matchResult.category} &middot; ${formatPrice(matchResult.price)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TasteMatcher