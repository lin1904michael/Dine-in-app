import { t } from '../i18n'

function YelpInterceptor({ lang, onOpen }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[90%] z-[100]">
      <button
        onClick={onOpen}
        className="w-full bg-rose-600 border border-rose-700 text-white rounded-full py-4 font-bold shadow-lg shadow-rose-600/20 active:scale-95 transition-transform flex justify-center items-center cursor-pointer"
      >
        🚨 {t('issue', lang)}
      </button>
    </div>
  )
}

export default YelpInterceptor
