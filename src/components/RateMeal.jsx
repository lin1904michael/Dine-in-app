import { useState } from 'react'
import { t } from '../i18n'
import { submitFeedback } from '../lib/feedback'

function RateMeal({ lang, showToast, onOpenIssue, table }) {
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const handleRate = (stars) => {
    setRating(stars)
    setSubmitted(true)

    // Fire-and-forget: persist the rating regardless of the branch below.
    submitFeedback({ rating: stars, table })

    if (stars === 5) {
      // 5 stars → alert redirect to Google Reviews
      setTimeout(() => {
        alert(lang === 'en' ? 'Redirecting to Google Reviews!' : '正在跳轉到 Google 評論！')
        setSubmitted(false)
        setRating(0)
      }, 500)
    } else {
      // 1-4 stars → open Report Issue with pre-filled category
      setTimeout(() => {
        const prefillCategory = stars <= 2 ? 'Food Quality' : 'Service'
        onOpenIssue(prefillCategory)
        setSubmitted(false)
        setRating(0)
      }, 500)
    }
  }

  return (
    <div className="px-4 mt-4">
      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5">
        <h3 className="text-amber-700 font-bold mb-3 text-lg">
          {t('rateMeal', lang)}
        </h3>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              disabled={submitted}
              className={`text-4xl transition-all cursor-pointer active:scale-110 disabled:cursor-not-allowed ${
                star <= rating ? '' : 'opacity-30'
              }`}
            >
              ⭐
            </button>
          ))}
        </div>

        {submitted && rating === 5 && (
          <p className="text-center text-amber-700 font-semibold mt-3 text-sm">
            {lang === 'en' ? 'Thank you! Redirecting...' : '謝謝！正在跳轉...'}
          </p>
        )}
        {submitted && rating > 0 && rating < 5 && (
          <p className="text-center text-amber-700 font-semibold mt-3 text-sm">
            {lang === 'en' ? 'Sorry to hear that. Let us help...' : '很抱歉聽到這個消息。讓我們幫助您...'}
          </p>
        )}
      </div>
    </div>
  )
}

export default RateMeal
