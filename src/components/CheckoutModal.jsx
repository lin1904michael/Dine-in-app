import { useState, useMemo } from 'react'
import { t } from '../i18n'
import Modal from './Modal'

/**
 * Unified Checkout Modal for both QSR and Full-Service paid orders.
 * Props:
 *   isOpen, onClose, lang, showToast, addRequest
 *   items: [{ key, name, price, qty }]
 *   onAdjust: (key, delta) => void
 *   table: string|null
 *   isQsr: boolean
 */
function CheckoutModal({ isOpen, onClose, lang, showToast, addRequest, items, onAdjust, table, isQsr }) {
  const [paymentMethod, setPaymentMethod] = useState(null) // null | 'apple' | 'card' | 'zelle'
  const [zelleSubmitted, setZelleSubmitted] = useState(false)
  const [processing, setProcessing] = useState(false)

  const orderId = useMemo(() => Math.floor(1000 + Math.random() * 9000), [isOpen])

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2)
  const hasItems = items.some((item) => item.qty > 0)

  const buildPayload = (method) => {
    const ticketNum = Math.floor(Math.random() * 900) + 100
    return {
      order_id: orderId,
      table_number: table || null,
      ticket_number: ticketNum,
      items: items.filter((i) => i.qty > 0).map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      total,
      payment_method: method,
      timestamp: new Date().toISOString(),
      // TODO: TECH TEAM - Replace console.log with actual fetch to n8n webhook endpoint
    }
  }

  const fireWebhook = (method) => {
    const payload = buildPayload(method)
    console.log('SENDING TO N8N WEBHOOK:', payload)
    return payload
  }

  const finishOrder = (payload) => {
    const summary = items
      .filter((i) => i.qty > 0)
      .map((i) => `${i.name} x${i.qty}`)
      .join(', ')
    if (addRequest) {
      addRequest(summary, isQsr ? { isQsr: true } : { isPaidOrder: true, table })
    }
    showToast(lang === 'en' ? `✅ Payment of $${total} confirmed!` : `✅ 已確認付款 $${total}！`)
    resetAndClose()
  }

  const handleApplePay = () => {
    setPaymentMethod('apple')
    setProcessing(true)
    const payload = fireWebhook('apple_pay')
    setTimeout(() => {
      setProcessing(false)
      setTimeout(() => finishOrder(payload), 600)
    }, 1800)
  }

  const handleCardPay = () => {
    setPaymentMethod('card')
    setProcessing(true)
    const payload = fireWebhook('stripe_card')
    setTimeout(() => {
      setProcessing(false)
      setTimeout(() => finishOrder(payload), 600)
    }, 1800)
  }

  const handleZelleSelect = () => {
    setPaymentMethod('zelle')
  }

  const handleZelleConfirm = () => {
    setZelleSubmitted(true)
    fireWebhook('zelle')
    setTimeout(() => {
      finishOrder(buildPayload('zelle'))
    }, 1500)
  }

  const resetAndClose = () => {
    setPaymentMethod(null)
    setZelleSubmitted(false)
    setProcessing(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title={`🧾 ${t('checkout', lang)}`}>
      {/* Processing overlay */}
      {processing && (
        <div className="text-center py-10">
          <div className="text-5xl mb-4 animate-pulse">{paymentMethod === 'apple' ? '🍎' : '💳'}</div>
          <p className="text-lg font-bold text-slate-900">
            {lang === 'en' ? 'Processing Payment...' : '正在處理付款...'}
          </p>
          <p className="text-slate-500 mt-2">${total}</p>
          <div className="mt-4 flex justify-center">
            <div className="h-1.5 w-36 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900 rounded-full animate-progress" />
            </div>
          </div>
        </div>
      )}

      {/* Zelle submitted confirmation */}
      {zelleSubmitted && !processing && (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-lg font-bold text-emerald-600">{t('paymentSuccess', lang)}</p>
        </div>
      )}

      {/* Main checkout view */}
      {!processing && !zelleSubmitted && (
        <div className="space-y-5">
          {/* Order Summary */}
          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
              {t('orderSummary', lang)}
            </h4>
            <div className="space-y-2">
              {items.filter((item) => item.qty > 0).map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100"
                >
                  <div>
                    <span className="font-medium text-slate-800">{item.name}</span>
                    <span className="text-sm text-slate-500 ml-2">${item.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onAdjust(item.key, -1)}
                      className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-lg font-bold text-slate-600 active:bg-slate-100 cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-lg tabular-nums">{item.qty}</span>
                    <button
                      onClick={() => onAdjust(item.key, 1)}
                      className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-lg font-bold active:bg-emerald-700 cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              {!hasItems && (
                <p className="text-center text-slate-400 py-4 text-sm">
                  {lang === 'en' ? 'No items selected' : '尚未選擇品項'}
                </p>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-slate-900 text-white rounded-xl px-5 py-3">
            <span className="font-bold">Total</span>
            <span className="text-xl font-black tabular-nums">${total}</span>
          </div>

          {/* Payment method selection or Zelle form */}
          {paymentMethod === 'zelle' ? (
            /* Zelle details */
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h4 className="font-bold text-purple-800 mb-2">📱 Zelle Payment</h4>
                <div className="space-y-2 text-sm text-purple-900">
                  <p><span className="font-semibold">Account Name:</span> FoodservAI Inc.</p>
                  <p><span className="font-semibold">Contact:</span> pay@foodservai.com</p>
                  <p><span className="font-semibold">Order #:</span> {orderId}</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-900 leading-relaxed">
                  Please send exactly <span className="font-bold">${total}</span> to{' '}
                  <span className="font-bold">pay@foodservai.com</span> with{' '}
                  <span className="font-bold">Order #{orderId}</span> in the memo.
                  For fast in-store service, please show this confirmation screen to your server.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentMethod(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold cursor-pointer hover:bg-slate-50 active:scale-95 transition-all"
                >
                  {lang === 'en' ? 'Back' : '返回'}
                </button>
                <button
                  onClick={handleZelleConfirm}
                  disabled={!hasItems}
                  className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-bold cursor-pointer hover:bg-purple-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t('zelleConfirm', lang)}
                </button>
              </div>
            </div>
          ) : (
            /* Payment method buttons */
            <div className="space-y-3">
              <button
                onClick={handleApplePay}
                disabled={!hasItems}
                className="w-full py-3.5 bg-black text-white font-bold rounded-xl cursor-pointer hover:bg-black/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {t('payApple', lang)}
              </button>
              <button
                onClick={handleCardPay}
                disabled={!hasItems}
                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl cursor-pointer hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {t('payCard', lang)}
              </button>
              <button
                onClick={handleZelleSelect}
                disabled={!hasItems}
                className="w-full py-3.5 bg-purple-600 text-white font-bold rounded-xl cursor-pointer hover:bg-purple-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {t('payZelle', lang)}
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

export default CheckoutModal
