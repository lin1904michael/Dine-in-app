import { t } from '../i18n'

const links = [
  { emoji: 'ℹ️', key: 'storeInfo' },
  { emoji: '▶️', key: 'story' },
]

function ConnectExplore({ lang }) {
  return (
    <div className="px-4 space-y-3 pb-6 mt-4">
      {links.map((link) => (
        <button
          key={link.key}
          className="h-14 bg-slate-100 rounded-xl flex items-center px-4 font-semibold border border-slate-200 active:bg-slate-200 w-full cursor-pointer transition-colors text-slate-900"
        >
          <span className="mr-3 text-lg">{link.emoji}</span>
          {t(link.key, lang)}
        </button>
      ))}
    </div>
  )
}

export default ConnectExplore
