// ─────────────────────────────────────────────────────────────────────────────
// Service Request — n8n webhook client (dine-in app side)
//
// Posts customer-initiated requests (water, check, napkins, condiments,
// utensils, togo, issues, order_more, qsr_order …) to the FoodServAI
// service_requests table via the n8n webhook.  These then surface on the
// Live Floor pad in the GM dashboard.
//
// Env knobs (set in the dine-in app's .env.local):
//   VITE_SERVICE_REQUEST_BASE  — n8n base URL (default points at zeabur)
//   VITE_ORG_UUID              — organization uuid for this restaurant
//   VITE_LOCATION_UUID         — location uuid for this floor
// ─────────────────────────────────────────────────────────────────────────────

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {}

const SERVICE_REQUEST_BASE =
  env.VITE_SERVICE_REQUEST_BASE ||
  'https://stocktechnicaltradeassistance.zeabur.app/webhook/service-request'

export const ORG_UUID =
  env.VITE_ORG_UUID || '00000000-0000-0000-0000-000000000001'
export const LOCATION_UUID =
  env.VITE_LOCATION_UUID || '00000000-0000-0000-0000-000000000002'

// Stable per-tab session id so the GM can group requests from one diner.
function sessionId() {
  try {
    let id = sessionStorage.getItem('foodservai_dinein_session')
    if (!id) {
      id =
        'dinein-' +
        Date.now().toString(36) +
        '-' +
        Math.random().toString(36).slice(2, 8)
      sessionStorage.setItem('foodservai_dinein_session', id)
    }
    return id
  } catch {
    return 'dinein-anon'
  }
}

// Decide a default severity from the request_type so the LF card colors
// itself correctly without each call site having to think about it.
function severityFor(type) {
  if (type === 'check' || type === 'water') return 'critical'
  if (type === 'issue') return 'warning'
  return 'info'
}

/**
 * Fire-and-forget POST. Resolves on success, never throws — UI keeps working
 * even if n8n is unreachable.
 *
 * @param {object} req
 * @param {string} req.request_type      one of: water, check, napkins,
 *                                       condiments, utensils, togo, issue,
 *                                       order_more, qsr_order, custom
 * @param {string} req.request_title     human label rendered on Live Floor card
 * @param {string|null} [req.table_label] e.g. 'TABLE 12' (omit for QSR)
 * @param {object|null} [req.details]    extra payload (items, category, etc.)
 * @param {string} [req.severity]        override auto-pick
 * @param {string} [req.source]          'dine_in_app' | 'qsr_kiosk'
 * @param {string|null} [req.customer_phone]
 * @param {string} [req.customer_lang]
 */
export async function postServiceRequest(req) {
  const payload = {
    organization_id: ORG_UUID,
    location_id: LOCATION_UUID,
    table_label: req.table_label ?? null,
    request_type: req.request_type,
    request_title: req.request_title,
    severity: req.severity || severityFor(req.request_type),
    details: req.details ?? null,
    source: req.source || 'dine_in_app',
    customer_phone: req.customer_phone ?? null,
    customer_session_id: sessionId(),
    customer_lang: req.customer_lang || null,
  }

  try {
    const res = await fetch(`${SERVICE_REQUEST_BASE.replace(/\/$/, '')}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn('[serviceRequest] HTTP', res.status, await res.text())
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[serviceRequest] network error', err)
  }
}
