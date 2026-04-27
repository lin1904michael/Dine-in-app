// ─────────────────────────────────────────────────────────────────────────────
// Dine-in service request — posts to n8n `Dine_in_requests` workflow which
// inserts into public.dine_in_requests and surfaces the row on the GM Live
// Floor pad.
//
// Workflow id: BJ1suT78WmoNNi3y
// Webhook:     /webhook/dadc0fd4-159d-479b-8c69-f93e5b716a04  (POST)
// ─────────────────────────────────────────────────────────────────────────────

import { n8nPost } from './n8n'

const PATH = '/webhook/dadc0fd4-159d-479b-8c69-f93e5b716a04'

/**
 * Submit a dine-in request (water, check, napkins, issue, paid order, …).
 * Fire-and-forget — never throws, UI keeps working offline.
 *
 * @param {object} req
 * @param {string|null} [req.phone]    — diner phone (digits only)
 * @param {string|null} [req.table]    — table id (e.g. "12")
 * @param {string} [req.mode='full']   — 'full' | 'qsr'
 * @param {string} req.title           — request title shown on Live Floor card
 * @param {string} [req.status='pending']
 * @param {number} [req.totalPrice=0]  — 0 for non-paid; > 0 for paid items
 */
export function submitDineInRequest({
  phone = null,
  table = null,
  mode = 'full',
  title,
  status = 'pending',
  totalPrice = 0,
}) {
  return n8nPost(PATH, {
    phone_number: phone || '',
    table_id: table != null ? String(table) : '',
    mode,
    title: title || 'Request',
    status,
    total_price: Number(totalPrice) || 0,
  })
}
