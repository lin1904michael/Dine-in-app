import { useEffect, useState } from 'react'
import { t } from '../i18n'
import { fetchGallery } from '../lib/gallery'

function VisualMenu({ lang }) {
  // null = still loading; [] = loaded but empty; [...] = loaded with photos
  const [photos, setPhotos] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchGallery().then((rows) => {
      if (!cancelled) setPhotos(rows)
    })
    return () => { cancelled = true }
  }, [])

  // While loading, show 3 grey loading placeholders.
  // Once loaded: show one card per dine-in menu item; if it has a photo, render
  // the photo with a name caption; if not, render a name-only placeholder card.
  const isLoading = photos === null
  const items = isLoading ? [{ _placeholder: 1 }, { _placeholder: 2 }, { _placeholder: 3 }] : photos

  return (
    <div className="mt-2">
      <h3 className="text-lg font-bold px-4 mb-2 text-slate-900">{t('gallery', lang)}</h3>
      <div className="overflow-x-auto flex gap-4 px-4 pb-4 snap-x">
        {items.map((item) => {
          const key = item._placeholder ?? item.id ?? item.menu_item_id
          const hasPhoto = !!item.photo_url
          return (
            <div
              key={key}
              className="h-40 w-40 bg-slate-100 rounded-xl flex-shrink-0 snap-center flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm overflow-hidden relative"
            >
              {item._placeholder ? (
                <span className="text-slate-400 text-sm">Loading…</span>
              ) : hasPhoto ? (
                <>
                  <img
                    src={item.photo_url}
                    alt={item.item_name || 'Food'}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  {item.item_name && (
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs font-semibold px-2 py-1 truncate">
                      {item.item_name}
                    </span>
                  )}
                </>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center px-2 bg-gradient-to-br from-slate-50 to-slate-100">
                  <span className="text-3xl mb-2 opacity-30">🍽️</span>
                  <span className="text-xs font-semibold text-slate-700 text-center line-clamp-3">
                    {item.item_name || 'Menu Item'}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default VisualMenu
