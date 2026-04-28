import { useState } from 'react'
import { t } from '../i18n'
import LogoEvolution from './LogoEvolution'
import RewardButton from './RewardButton'
import QuickService from './QuickService'
import QsrMenu from './QsrMenu'
import VisualMenu from './VisualMenu'
import TasteMatcher from './TasteMatcher'
import RateMeal from './RateMeal'
import ConnectExplore from './ConnectExplore'
import YelpInterceptor from './YelpInterceptor'
import ReportIssueModal from './ReportIssueModal'
import DiscoveryPortal from './DiscoveryPortal'

function Dashboard({ phoneNumber, table, mode, lang, toggleLang, showToast, currentView, setCurrentView, activeRequests, addRequest }) {
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportDefaultCategory, setReportDefaultCategory] = useState('')

  const openReportIssue = (prefillCategory) => {
    setReportDefaultCategory(prefillCategory || '')
    setReportModalOpen(true)
  }

  const closeReportIssue = () => {
    setReportModalOpen(false)
    setReportDefaultCategory('')
  }

  // Discovery Portal view
  if (currentView === 'discovery') {
    return <DiscoveryPortal lang={lang} onBack={() => setCurrentView('dashboard')} />
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md p-4 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h2 className="text-lg font-bold text-slate-900">Table {table}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">FoodservAI</span>
            <button
              onClick={toggleLang}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'EN | 中文' : '中文 | EN'}
            </button>
          </div>
        </div>
      </header>

      {/* Logo */}
      <LogoEvolution />

      {/* Live Request Tracker */}
      {activeRequests.length > 0 && (
        <div className="mx-4 mt-3 mb-2 bg-slate-800 border border-emerald-500/30 rounded-2xl p-4 shadow-lg shadow-emerald-500/10">
          <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
            📡 {t('activeRequests', lang)}
          </h3>
          <div className="space-y-2">
            {activeRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between bg-slate-700/50 rounded-xl px-3 py-2.5"
              >
                <div>
                  <p className="text-white text-sm font-medium">{req.title}</p>
                  <p className="text-slate-400 text-xs">{req.time}</p>
                  {/* QSR paid order: Pickup Ticket only */}
                  {req.isQsr && req.ticket && (
                    <span className="inline-block mt-1 px-3 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full">
                      🎫 {t('orderTicket', lang)}{req.ticket}
                    </span>
                  )}
                  {/* Full-service paid order: Table + Ticket */}
                  {!req.isQsr && req.isPaidOrder && req.ticket && (
                    <span className="inline-block mt-1 px-3 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full">
                      🪑 Table {req.table} • {t('orderTicket', lang)}{req.ticket}
                    </span>
                  )}
                  {/* Full-service standard request: Table only */}
                  {!req.isQsr && !req.isPaidOrder && req.table && (
                    <span className="inline-block mt-1 px-3 py-0.5 bg-slate-500/20 text-slate-300 text-xs font-bold rounded-full">
                      🪑 Table {req.table}
                    </span>
                  )}
                </div>
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full shrink-0 ml-2">
                  ⏳ {t('pending', lang)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bounce-Back Reward */}
      <RewardButton lang={lang} showToast={showToast} onOpenDiscovery={() => setCurrentView('discovery')} />

      {/* Mode-dependent sections */}
      {mode === 'full' ? (
        <QuickService lang={lang} showToast={showToast} table={table} addRequest={addRequest} />
      ) : (
        <>
          <QsrMenu lang={lang} showToast={showToast} addRequest={addRequest} />
          {/* VIP Lane text below QSR Add-On grid */}
          <div className="px-5 mt-4 mb-1">
            <p className="text-sm text-slate-500 italic text-center">
              {t('vipLane', lang)}
            </p>
          </div>
        </>
      )}

      {/* Visual Menu */}
      <VisualMenu lang={lang} />

      {/* Taste Matcher (full only) or Rate Meal (qsr only) */}
      {mode === 'full' ? (
        <TasteMatcher lang={lang} />
      ) : (
        <RateMeal lang={lang} showToast={showToast} onOpenIssue={openReportIssue} table={table} />
      )}

      {/* Community Group Orders (both modes) */}
      <div className="mx-4 mt-6 mb-2 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          {t('communityGroupOrders', lang)}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {t('groupOrderDesc', lang)}
        </p>
        <button
          onClick={() => window.open('https://foodservai.com/group-order', '_blank')}
          className="w-full py-3 rounded-xl bg-amber-500 text-white font-bold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer hover:bg-amber-400 flex items-center justify-center gap-2"
        >
          🛒 {t('browseGroupBuys', lang)}
        </button>
      </div>

      {/* Connect & Explore */}
      <ConnectExplore lang={lang} />

      {/* Yelp Interceptor */}
      <YelpInterceptor lang={lang} onOpen={() => openReportIssue()} />

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={reportModalOpen}
        onClose={closeReportIssue}
        lang={lang}
        showToast={showToast}
        table={table}
        defaultCategory={reportDefaultCategory}
        addRequest={addRequest}
      />
    </div>
  )
}

export default Dashboard
