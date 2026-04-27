import { useState } from 'react'
import { t } from '../i18n'
import Modal from './Modal'
import CheckoutModal from './CheckoutModal'

const QSR_ITEMS = [
  {
    nameKey: 'chickenBites',
    name: 'Chicken Bites',
    price: 9.00,
    emoji: '🍗',
    subItems: null,
  },
  {
    nameKey: 'extraSauce',
    name: 'Extra Sauce',
    price: 0.50,
    emoji: '🫙',
    subItems: [
      { key: 'houseSauce', price: 0.50 },
      { key: 'spicyMayo', price: 0.50 },
    ],
  },
  {
    nameKey: 'fountainDrink',
    name: 'Fountain Drink',
    price: 2.00,
    emoji: '🥤',
    subItems: [
      { key: 'coke', price: 2.00 },
      { key: 'sprite', price: 2.00 },
    ],
  },
  {
    nameKey: 'sideFries',
    name: 'Side Fries',
    price: 3.00,
    emoji: '🍟',
    subItems: null,
  },
]

function QsrMenu({ lang, showToast, addRequest }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [quantities, setQuantities] = useState({})
  const [simpleQty, setSimpleQty] = useState(0)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const handleClick = (item) => {
    setSelectedItem(item)
    if (item.subItems) {
      const init = {}
      item.subItems.forEach((sub) => { init[sub.key] = 0 })
      setQuantities(init)
    } else {
      setSimpleQty(0)
    }
  }

  const adjustSub = (key, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta),
    }))
  }

  const getTotal = () => {
    if (!selectedItem) return '0.00'
    if (selectedItem.subItems) {
      let sum = 0
      selectedItem.subItems.forEach((sub) => {
        sum += (quantities[sub.key] || 0) * sub.price
      })
      return sum.toFixed(2)
    }
    return (selectedItem.price * simpleQty).toFixed(2)
  }

  const total = getTotal()
  const hasSelection = selectedItem?.subItems
    ? Object.values(quantities).some((q) => q > 0)
    : simpleQty > 0

  // Build checkout items array from current selection
  const buildCheckoutItems = () => {
    if (!selectedItem) return []
    if (selectedItem.subItems) {
      return selectedItem.subItems
        .filter((sub) => (quantities[sub.key] || 0) > 0)
        .map((sub) => ({
          key: sub.key,
          name: t(sub.key, 'en'),
          price: sub.price,
          qty: quantities[sub.key],
        }))
    }
    return [{
      key: selectedItem.nameKey,
      name: selectedItem.name,
      price: selectedItem.price,
      qty: simpleQty,
    }]
  }

  const [checkoutItems, setCheckoutItems] = useState([])

  const handleProceedToCheckout = () => {
    setCheckoutItems(buildCheckoutItems())
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
    setSelectedItem(null)
    setQuantities({})
    setSimpleQty(0)
    setCheckoutItems([])
  }

  const getItemLabel = (item) => {
    if (item.nameKey === 'chickenBites' || item.nameKey === 'sideFries') {
      return t(item.nameKey, lang)
    }
    return `${t(item.nameKey, lang)} ($${item.price.toFixed(2)})`
  }

  return (
    <>
      <div className="px-4 mt-2 mb-2">
        <h3 className="text-lg font-bold text-slate-900 mb-3">
          {lang === 'en' ? 'Add-On Menu' : '加購菜單'}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {QSR_ITEMS.map((item) => (
            <button
              key={item.nameKey}
              onClick={() => handleClick(item)}
              className="aspect-square rounded-3xl bg-slate-100 border border-slate-200 shadow-sm flex flex-col items-center justify-center active:scale-95 transition-transform cursor-pointer hover:border-blue-500/50"
            >
              <span className="text-2xl mb-1.5">{item.emoji}</span>
              <span className="text-sm font-semibold text-slate-900 text-center leading-tight px-1">
                {getItemLabel(item)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Menu / Quantity Selector Modal */}
      {selectedItem && !checkoutOpen && (
        <Modal
          isOpen={true}
          onClose={() => { setSelectedItem(null); setQuantities({}); setSimpleQty(0) }}
          title={t(selectedItem.nameKey, lang)}
        >
          <div className="flex flex-col items-center py-2">
            <span className="text-5xl mb-4">{selectedItem.emoji}</span>

            {selectedItem.subItems ? (
              <div className="w-full space-y-3 mb-6">
                {selectedItem.subItems.map((sub) => (
                  <div
                    key={sub.key}
                    className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
                  >
                    <div>
                      <span className="font-medium text-slate-800">{t(sub.key, lang)}</span>
                      <span className="text-sm text-slate-500 ml-2">${sub.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => adjustSub(sub.key, -1)}
                        className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-lg font-bold text-slate-600 active:bg-slate-100 cursor-pointer transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-lg tabular-nums">
                        {quantities[sub.key] || 0}
                      </span>
                      <button
                        onClick={() => adjustSub(sub.key, 1)}
                        className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-bold active:bg-emerald-700 cursor-pointer transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="text-slate-600 mb-6">${selectedItem.price.toFixed(2)} {lang === 'en' ? 'each' : '每份'}</p>
                <div className="flex items-center gap-6 mb-8">
                  <button
                    onClick={() => setSimpleQty((q) => Math.max(0, q - 1))}
                    className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-600 active:bg-slate-100 cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="text-4xl font-bold tabular-nums w-12 text-center">{simpleQty}</span>
                  <button
                    onClick={() => setSimpleQty((q) => q + 1)}
                    className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold active:bg-emerald-700 cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </>
            )}

            <button
              onClick={handleProceedToCheckout}
              disabled={!hasSelection}
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl cursor-pointer hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              🧾 {lang === 'en' ? `Checkout: $${total}` : `結帳：$${total}`}
            </button>
          </div>
        </Modal>
      )}

      {/* Unified Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={handleCheckoutClose}
        lang={lang}
        showToast={showToast}
        addRequest={addRequest}
        items={checkoutItems}
        onAdjust={handleCheckoutAdjust}
        table={null}
        isQsr={true}
      />
    </>
  )
}

export default QsrMenu
