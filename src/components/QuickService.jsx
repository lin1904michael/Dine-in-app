import { useState } from 'react'
import { t } from '../i18n'
import QuantityModal from './QuantityModal'
import CondimentsModal from './CondimentsModal'
import Modal from './Modal'
import CheckoutModal from './CheckoutModal'

const GRID_ITEMS = [
  { key: 'water', emoji: '💧', modalType: 'quantity' },
  { key: 'napkins', emoji: '🧻', modalType: null },
  { key: 'condiments', emoji: '🧂', modalType: 'condiments' },
  { key: 'utensils', emoji: '🍴', modalType: 'quantity' },
  { key: 'togo', emoji: '📦', modalType: 'quantity' },
  { key: 'check', emoji: '💳', modalType: null },
]

const ORDER_MORE_ITEMS = {
  drinks: [
    { key: 'coke', price: 3.00 },
    { key: 'sprite', price: 3.00 },
    { key: 'icedTea', price: 3.50 },
    { key: 'lemonade', price: 3.50 },
  ],
  appetizers: [
    { key: 'springRolls', price: 8.00 },
    { key: 'edamame', price: 6.00 },
    { key: 'chickenBites', price: 9.00 },
  ],
}

function QuickService({ lang, showToast, table, addRequest }) {
  const [activeModal, setActiveModal] = useState(null)
  const [condimentsOpen, setCondimentsOpen] = useState(false)
  const [orderMoreOpen, setOrderMoreOpen] = useState(false)
  const [orderQuantities, setOrderQuantities] = useState({})
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutItems, setCheckoutItems] = useState([])

  const handleItemClick = (item) => {
    if (item.modalType === 'condiments') {
      setCondimentsOpen(true)
    } else if (item.modalType === 'quantity') {
      setActiveModal(item.key)
    } else if (item.key === 'check') {
      showToast(lang === 'en' ? 'Check requested!' : '已請求結帳！')
      if (addRequest) addRequest('Check', { table })
    } else if (item.key === 'napkins') {
      showToast(lang === 'en' ? 'Napkins on the way!' : '紙巾即將送到！')
      if (addRequest) addRequest('Napkins', { table })
    }
  }

  const openOrderMore = () => {
    const init = {}
    Object.values(ORDER_MORE_ITEMS).flat().forEach((item) => { init[item.key] = 0 })
    setOrderQuantities(init)
    setOrderMoreOpen(true)
  }

  const adjustOrder = (key, delta) => {
    setOrderQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta),
    }))
  }

  const hasOrderItems = Object.values(orderQuantities).some((q) => q > 0)

  const handleProceedToCheckout = () => {
    const items = Object.values(ORDER_MORE_ITEMS).flat()
      .filter((item) => (orderQuantities[item.key] || 0) > 0)
      .map((item) => ({
        key: item.key,
        name: t(item.key, 'en'),
        price: item.price,
        qty: orderQuantities[item.key],
      }))
    setCheckoutItems(items)
    setOrderMoreOpen(false)
    setCheckoutOpen(true)
  }

  const handleCheckoutAdjust = (key, delta) => {
    setCheckoutItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    )
  }

  const handleCheckoutClose = () => {
    setCheckoutOpen(false)
    setCheckoutItems([])
    setOrderQuantities({})
  }

  return (
    <>
      {/* Horizontal scrollable service menu */}
      <div className="overflow-x-auto px-4 py-3">
        <div className="flex gap-3 w-max">
          {GRID_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => handleItemClick(item)}
              className="w-24 h-24 rounded-3xl bg-slate-100 border border-slate-200 shadow-sm flex flex-col items-center justify-center font-semibold active:scale-95 transition-transform cursor-pointer hover:border-emerald-600/50 text-slate-900 shrink-0"
            >
              <span className="text-2xl mb-1.5">{item.emoji}</span>
              <span className="text-xs text-center px-1 leading-tight">{t(item.key, lang)}</span>
            </button>
          ))}
        </div>
      </div>

      {activeModal && (
        <QuantityModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          category={activeModal}
          lang={lang}
          showToast={showToast}
          table={table}
          addRequest={addRequest}
        />
      )}

      <CondimentsModal
        isOpen={condimentsOpen}
        onClose={() => setCondimentsOpen(false)}
        lang={lang}
        showToast={showToast}
        table={table}
        addRequest={addRequest}
      />

      <Modal
        isOpen={orderMoreOpen}
        onClose={() => setOrderMoreOpen(false)}
        title={`🍽️ ${t('orderMore', lang)}`}
      >
        <div className="space-y-5">
          <div>
            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">
              🥤 {t('drinks', lang)}
            </h4>
            <div className="space-y-2">
              {ORDER_MORE_ITEMS.drinks.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
                >
                  <div>
                    <span className="font-medium text-slate-800">{t(item.key, lang)}</span>
                    <span className="text-sm text-slate-500 ml-2">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => adjustOrder(item.key, -1)} className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-lg font-bold text-slate-600 active:bg-slate-100 cursor-pointer transition-colors">-</button>
                    <span className="w-6 text-center font-bold text-lg tabular-nums">{orderQuantities[item.key] || 0}</span>
                    <button onClick={() => adjustOrder(item.key, 1)} className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold active:bg-blue-700 cursor-pointer transition-colors">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">
              🍢 {t('appetizers', lang)}
            </h4>
            <div className="space-y-2">
              {ORDER_MORE_ITEMS.appetizers.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
                >
                  <div>
                    <span className="font-medium text-slate-800">{t(item.key, lang)}</span>
                    <span className="text-sm text-slate-500 ml-2">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => adjustOrder(item.key, -1)} className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-lg font-bold text-slate-600 active:bg-slate-100 cursor-pointer transition-colors">-</button>
                    <span className="w-6 text-center font-bold text-lg tabular-nums">{orderQuantities[item.key] || 0}</span>
                    <button onClick={() => adjustOrder(item.key, 1)} className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold active:bg-blue-700 cursor-pointer transition-colors">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            disabled={!hasOrderItems}
            className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl cursor-pointer hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            🧾 {lang === 'en' ? 'Proceed to Checkout' : '前往結帳'}
          </button>
        </div>
      </Modal>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={handleCheckoutClose}
        lang={lang}
        showToast={showToast}
        addRequest={addRequest}
        items={checkoutItems}
        onAdjust={handleCheckoutAdjust}
        table={table}
        isQsr={false}
      />
    </>
  )
}

export default QuickService