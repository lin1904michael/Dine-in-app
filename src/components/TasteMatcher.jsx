import { useState } from 'react'
import { t } from '../i18n'

const MENU_ITEMS = [
  { id: 1, name: 'Sizzling Black Pepper Beef', tag: 'Savory', price: 28 },
  { id: 2, name: 'Dim Sum Soup Dumplings', tag: 'Light', price: 16 },
  { id: 3, name: 'Kung Pao Chicken', tag: 'Spicy', price: 22 },
  { id: 4, name: 'Artisanal Pepperoni Pizza', tag: 'Savory', price: 24 },
  { id: 5, name: 'Gourmet Wagyu Burger', tag: 'Savory', price: 32 },
]

const TASTE_OPTIONS = [
  { label: 'Spicy', emoji: '🌶️' },
  { label: 'Savory', emoji: '🥩' },
  { label: 'Light', emoji: '🥬' },
]

function TasteMatcher({ lang }) {
  const [activeTaste, setActiveTaste] = useState(null)
  const [recommendedIds, setRecommendedIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [matchResult, setMatchResult] = useState(null)

  const handleGenerate = () => {
    if (!activeTaste) return

    setLoading(true)
    setMatchResult(null)

    setTimeout(() => {
      const matchingItems = MENU_ITEMS.filter((item) => item.tag === activeTaste)
      const available = matchingItems.find((item) => !recommendedIds.includes(item.id))

      let match
      let newRecommendedIds

      if (available) {
        match = available
        newRecommendedIds = [...recommendedIds, available.id]
      } else {
        match = matchingItems[0]
        newRecommendedIds = [matchingItems[0].id]
      }

      setRecommendedIds(newRecommendedIds)
      setMatchResult(match)
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="px-4 mt-4">
      <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5">
        <h3 className="text-blue-600 font-bold mb-3 text-lg">
          ✨ {t('decide', lang)}
        </h3>

        {/* Taste Toggles */}
        <div className="flex gap-2">
          {TASTE_OPTIONS.map((option) => (
            <button
              key={option.label}
              onClick={() => setActiveTaste(option.label)}
              className={`flex-1 py-2 px-3 rounded-full font-semibold text-sm transition-all cursor-pointer ${
                activeTaste === option.label
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              {option.emoji} {option.label}
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!activeTaste || loading}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4 cursor-pointer hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? (lang === 'en' ? 'Analyzing Flavor Profiles...' : '分析口味中...')
            : t('match', lang)
          }
        </button>

        {/* Result Card */}
        {matchResult && !loading && (
          <div className="mt-4 bg-white border border-blue-200 rounded-2xl p-4 shadow-sm">
            <p className="text-lg font-bold text-slate-900">
              🎯 Match Found: {matchResult.name}
            </p>
            <p className="text-slate-600 text-sm mt-1">
              {matchResult.tag} &middot; ${matchResult.price}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TasteMatcher
