import { t } from '../i18n'

const MOCK_RESTAURANTS = [
  {
    name: 'Sushi Roku Chino Hills',
    reward: 'Unlock Free Edamame',
    rewardZh: '免費毛豆',
    emoji: '🍣',
    color: 'from-rose-500 to-orange-400',
  },
  {
    name: 'Burger Boss',
    reward: '10% Off Entire Order',
    rewardZh: '全單9折',
    emoji: '🍔',
    color: 'from-amber-500 to-yellow-400',
  },
  {
    name: 'Matcha Cafe',
    reward: 'Buy 1 Get 1 Free Boba',
    rewardZh: '買一送一珍珠奶茶',
    emoji: '🍵',
    color: 'from-emerald-500 to-teal-400',
  },
]

function DiscoveryPortal({ lang, onBack }) {
  return (
    <div className="min-h-screen pb-32">
      {/* Back button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md p-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 font-bold text-sm cursor-pointer hover:text-blue-500 transition-colors"
        >
          ⬅️ {t('back', lang)}
        </button>
      </div>

      {/* Header */}
      <div className="px-4 pt-6 pb-4 text-center">
        <h1 className="text-2xl font-black text-slate-900 mb-1">🌍 City Explorer</h1>
        <p className="text-slate-500 text-sm">
          {lang === 'en' ? 'Discover rewards at nearby restaurants' : '探索附近餐廳的獎勵'}
        </p>
      </div>

      {/* Restaurant Cards */}
      <div className="px-4 space-y-4">
        {MOCK_RESTAURANTS.map((r, i) => (
          <div
            key={i}
            className="rounded-3xl overflow-hidden shadow-lg border border-slate-100"
          >
            {/* Gradient Banner */}
            <div className={`bg-gradient-to-r ${r.color} px-5 py-6 flex items-center gap-4`}>
              <span className="text-5xl">{r.emoji}</span>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">{r.name}</h3>
                <p className="text-white/80 text-sm mt-0.5">
                  {lang === 'en' ? r.reward : r.rewardZh}
                </p>
              </div>
            </div>
            {/* Action */}
            <div className="bg-white px-5 py-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                {lang === 'en' ? '0.3 mi away' : '0.5 公里'}
              </span>
              <button className="px-5 py-2 bg-slate-900 text-white font-bold text-sm rounded-full cursor-pointer hover:bg-slate-800 active:scale-95 transition-all">
                {lang === 'en' ? 'View Offer' : '查看優惠'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DiscoveryPortal
