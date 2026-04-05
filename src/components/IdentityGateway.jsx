import { useState } from 'react'
import LogoEvolution from './LogoEvolution'

function IdentityGateway({ onJoin }) {
  const [step, setStep] = useState('phone') // 'phone' | 'otp'
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const digits = phone.replace(/\D/g, '')
  const isPhoneValid = /^\d{10}$/.test(digits)
  const isOtpValid = /^\d{4}$/.test(otp)

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    if (!isPhoneValid) {
      setError('Please enter exactly 10 digits')
      return
    }
    setError('')
    // Simulated Twilio OTP request webhook
    try {
      await fetch('https://webhook.site/twilio-otp-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits }),
      })
    } catch (err) {
      console.log('[OTP Request] Webhook simulated (network may block):', err.message)
    }
    setStep('otp')
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    if (!isOtpValid) {
      setError('Please enter a 4-digit code')
      return
    }
    setError('')
    // Simulated Twilio OTP verify webhook
    try {
      await fetch('https://webhook.site/twilio-otp-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: digits, code: otp }),
      })
    } catch (err) {
      console.log('[OTP Verify] Webhook simulated (network may block):', err.message)
    }
    // Mark reward as unlocked in localStorage
    localStorage.setItem('foodservai_reward', 'true')
    onJoin(digits)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <LogoEvolution />

      <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 tracking-widest animate-pulse mt-3 mb-6 text-center">
        FoodServAI
      </h1>

      {step === 'phone' ? (
        <form onSubmit={handlePhoneSubmit} className="w-full flex flex-col items-center">
          <input
            type="tel"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError('') }}
            className={`h-14 text-center text-xl bg-slate-100 border-2 rounded-xl w-full max-w-xs mb-1 outline-none text-slate-900 placeholder-slate-400 transition-colors ${
              error ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-600'
            }`}
          />
          {error && <p className="text-rose-500 text-sm mb-2 font-medium">{error}</p>}
          {!error && (
            <p className="text-slate-400 text-xs mb-2">{digits.length}/10 digits</p>
          )}
          <button
            type="submit"
            disabled={!isPhoneValid}
            className="w-full max-w-xs h-14 font-bold text-lg rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Join & Enter
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="w-full flex flex-col items-center">
          <p className="text-slate-600 text-sm mb-3 text-center">
            We sent a code to ({digits.slice(0,3)}) {digits.slice(3,6)}-{digits.slice(6)}
          </p>
          <input
            type="tel"
            placeholder="4-digit code"
            value={otp}
            onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 4)); setError('') }}
            maxLength={4}
            className={`h-14 text-center text-2xl tracking-[0.5em] bg-slate-100 border-2 rounded-xl w-full max-w-xs mb-1 outline-none text-slate-900 placeholder-slate-400 transition-colors font-bold ${
              error ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-600'
            }`}
          />
          {error && <p className="text-rose-500 text-sm mb-2 font-medium">{error}</p>}
          {!error && (
            <p className="text-slate-400 text-xs mb-2">Enter 4-Digit SMS Code</p>
          )}
          <button
            type="submit"
            disabled={!isOtpValid}
            className="w-full max-w-xs h-14 font-bold text-lg rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Verify & Continue
          </button>
          <button
            type="button"
            onClick={() => { setStep('phone'); setOtp(''); setError('') }}
            className="mt-3 text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            Change phone number
          </button>
        </form>
      )}
    </div>
  )
}

export default IdentityGateway
