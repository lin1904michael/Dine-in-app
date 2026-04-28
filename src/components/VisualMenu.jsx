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

  // Fall back to 3 placeholder cards while loading or if no photos uploaded.
  const showPlaceholders = !photos || photos.length === 0
  const items = showPlaceholders ? [1, 2, 3] : photos

  return (
    <div className="mt-2">
      <h3 className="text-lg font-bold px-4 mb-2 text-slate-900">{t('gallery', lang)}</h3>
      <div className="overflow-x-auto flex gap-4 px-4 pb-4 snap-x">
        {items.map((item) => (
          <div
            key={showPlaceholders ? item : item.id}
            className="h-40 w-40 bg-slate-100 rounded-xl flex-shrink-0 snap-center flex items-center justify-center text-slate-600 border border-slate-200 shadow-sm overflow-hidden relative"
          >
            {showPlaceholders ? (
              <span>Food Photo</span>
            ) : (
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
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VisualMenu
