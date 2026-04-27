// ─────────────────────────────────────────────────────────────────────────────
// Customer feedback — posts to n8n `customer_feedback` workflow which inserts
// into public.feedbacks.
//
// Workflow id: LOt1o8950KybMXx9
// Webhook:     /webhook/9bb91dd4-82c2-45aa-9a24-fe39dd64699a  (POST)
// ─────────────────────────────────────────────────────────────────────────────

import { n8nPost } from './n8n'

const PATH = '/webhook/9bb91dd4-82c2-45aa-9a24-fe39dd64699a'

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {}
const DEFAULT_LOCATION_ID =
  env.VITE_LOCATION_ID || '00000000-0000-0000-0000-000000000002'

/**
 * Submit a star rating (1–5). Fire-and-forget.
 *
 * @param {object} fb
 * @param {number} fb.rating
 * @param {string|null} [fb.table]
 * @param {string} [fb.customerName='']  — empty in dine-in app (no login)
 * @param {string} [fb.comment='']
 * @param {string} [fb.locationId]       — defaults to VITE_LOCATION_ID
 */
export function submitFeedback({
  rating,
  table = null,
  customerName = '',
  comment = '',
  locationId = DEFAULT_LOCATION_ID,
}) {
  return n8nPost(PATH, {
    rating: Number(rating) || 0,
    location_id: locationId,
    table_id: table != null ? String(table) : '',
    customer_name: customerName || '',
    comment: comment || '',
  })
}
