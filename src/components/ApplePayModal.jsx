import { useState, useEffect } from 'react'
import Modal from './Modal'

function ApplePayModal({ isOpen, onClose, itemName, amount, showToast }) {
  const [processing, setProcessing] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setProcessing(true)
      const timer = setTimeout(() => {
        setProcessing(false)
        setTimeout(() => {
          onClose()
          showToast(`Payment of $${amount} confirmed!`)
        }, 800)
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apple Pay">
      <div className="text-center py-8">
        {processing ? (
          <>
            <div className="text-5xl mb-4 animate-pulse">🍎</div>
            <p className="text-lg font-bold text-slate-900">Processing Apple Pay...</p>
            <p className="text-slate-500 mt-2">{itemName} &mdash; ${amount}</p>
            <div className="mt-4 flex justify-center">
              <div className="h-1 w-32 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-slate-900 rounded-full animate-progress" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">✅</div>
            <p className="text-lg font-bold text-emerald-600">Payment Confirmed!</p>
          </>
        )}
      </div>
    </Modal>
  )
}

export default ApplePayModal
