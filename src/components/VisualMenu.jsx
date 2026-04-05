import { t } from '../i18n'

function VisualMenu({ lang }) {
  const items = [1, 2, 3]

  return (
    <div className="mt-2">
      <h3 className="text-lg font-bold px-4 mb-2 text-slate-900">{t('gallery', lang)}</h3>
      <div className="overflow-x-auto flex gap-4 px-4 pb-4 snap-x">
        {items.map((item) => (
          <div
            key={item}
            className="h-40 w-40 bg-slate-100 rounded-xl flex-shrink-0 snap-center flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm"
          >
            Food Photo
          </div>
        ))}
      </div>
    </div>
  )
}

export default VisualMenu
