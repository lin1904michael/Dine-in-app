import { useState } from 'react'
import { t } from '../i18n'
import Modal from './Modal'

const REWARD_TIERS = [
  { key: 'tier50', pts: 50, unlocked: true },
  { key: 'tier150', pts: 150, unlocked: true },
  { key: 'tier300', pts: 300, unlocked: false },
]

const POINTS_BALANCE = 120

function RewardButton({ lang, showToast, onOpenDiscovery }) {
  const [rewardUnlocked, setRewardUnlocked] = useState(
    localStorage.getItem('foodservai_reward') === 'true'
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [unlocking, setUnlocking] = useState(false)

  // Unlock flow (phone entry)
  const handleUnlock = () => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length !== 10) {
      setError(lang === 'en' ? 'Please enter exactly 10 digits' : '請輸入10位數字')
      return
    }
    setError('')
    console.log('[RewardButton] Phone submitted:', digits)
    localStorage.setItem('foodservai_reward', 'true')
    setUnlocking(true)
    setTimeout(() => {
      setRewardUnlocked(true)
      setUnlocking(false)
      setModalOpen(false)
      setPhone('')
      showToast(lang === 'en' ? 'Reward Unlocked!' : '獎勵已解鎖！')
    }, 1200)
  }

  // Redeem a reward
  const handleRedeem = (tier) => {
    if (POINTS_BALANCE < tier.pts) return
    const payload = {
      action: 'redeem_reward',
      reward: tier.key,
      pointsCost: tier.pts,
      timestamp: new Date().toISOString(),
    }
    console.log('[Wallet] Redeem webhook payload:', JSON.stringify(payload, null, 2))
    showToast(lang === 'en' ? `${t(tier.key, lang)} redeemed!` : `${t(tier.key, lang)} 已兌換！`)
    setModalOpen(false)
  }

  const handleDiscoverMore = () => {
    setModalOpen(false)
    if (onOpenDiscovery) {
      onOpenDiscovery()
    } else {
      alert(lang === 'en' ? 'Opening City Portal' : '正在開啟城市門戶')
    }
  }

  const handleAddToWallet = () => {
    console.log('[Wallet] Add to Apple Wallet triggered')
    showToast(lang === 'en' ? 'Added to Apple Wallet!' : '已加入 Apple 錢包！')
  }

  const buttonLabel = rewardUnlocked ? t('claimReward', lang) : t('reward', lang)

  return (
    <>
      <div className="px-4 mt-2">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer hover:bg-emerald-500"
        >
          {buttonLabel}
        </button>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setError(''); setPhone(''); setUnlocking(false) }}
        title={rewardUnlocked ? t('walletTitle', lang) : (lang === 'en' ? 'Claim Your Reward' : '領取您的獎勵')}
      >
        {rewardUnlocked ? (
          /* Premium Digital Wallet View */
          <div className="space-y-5">
            {/* Glassmorphism Credit Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 shadow-2xl">
              {/* Decorative blur circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

              {/* Card content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-400/80">
                    {t('premiumRewards', lang)}
                  </p>
                  <span className="text-2xl">🍳</span>
                </div>

                <div className="text-center mb-6">
                  <p className="text-xs uppercase tracking-wider text-white/50 mb-1">{t('pointsBalance', lang)}</p>
                  <p className="text-5xl font-black text-white tabular-nums">{POINTS_BALANCE}</p>
                  <p className="text-sm text-white/40 mt-1">pts</p>
                </div>

                {/* Add to Apple Wallet */}
                <button
                  onClick={handleAddToWallet}
                  className="w-full py-3 bg-black text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border border-white/10 hover:bg-black/80"
                >
                  {t('addToWallet', lang)}
                </button>
              </div>
            </div>

            {/* Reward Tiers */}
            <div className="space-y-2.5">
              {REWARD_TIERS.map((tier) => {
                const canRedeem = POINTS_BALANCE >= tier.pts
                const progress = Math.min(100, Math.round((POINTS_BALANCE / tier.pts) * 100))
                return (
                  <div
                    key={tier.key}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{canRedeem ? '🔓' : '🔒'}</span>
                        <div>
                          <p className={`font-semibold text-sm ${canRedeem ? 'text-slate-900' : 'text-slate-400'}`}>
                            {t(tier.key, lang)}
                          </p>
                          <p className="text-xs text-slate-500">{tier.pts} pts</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRedeem(tier)}
                        disabled={!canRedeem}
                        className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {t('redeemReward', lang)}
                      </button>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${canRedeem ? 'bg-emerald-500' : 'bg-slate-400'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Discover More */}
            <button
              onClick={handleDiscoverMore}
              className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl cursor-pointer hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {t('discoverRewards', lang)}
            </button>
          </div>
        ) : unlocking ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-xl font-bold text-emerald-600">
              {lang === 'en' ? 'Reward Unlocked!' : '獎勵已解鎖！'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-slate-600 mb-4 text-sm">
              {lang === 'en'
                ? 'Enter your 10-digit phone number to unlock your free reward.'
                : '請輸入您的10位電話號碼以解鎖免費獎勵。'}
            </p>
            <input
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError('') }}
              className="w-full h-14 text-center text-xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-600 rounded-xl outline-none text-slate-900 placeholder-slate-400 transition-colors mb-2"
            />
            {error && <p className="text-rose-500 text-sm mb-2">{error}</p>}
            <button
              onClick={handleUnlock}
              className="w-full py-3.5 mt-2 bg-emerald-600 text-white font-bold rounded-xl cursor-pointer hover:bg-emerald-500 active:scale-95 transition-all"
            >
              {lang === 'en' ? 'Unlock Reward' : '解鎖獎勵'}
            </button>
          </>
        )}
      </Modal>
    </>
  )
}

export default RewardButton
