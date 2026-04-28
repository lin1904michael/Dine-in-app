// ─────────────────────────────────────────────────────────────────────────────
// Taste matcher — picks one menu_items row where ai_promo = true and (when
// possible) matches the requested flavor on category/name. No LLM.
//
// Workflow id: 9rDyWoh5AOixKpuM  (Dine_in_taste_match, additive — created 2026-04-26)
// Webhook:     /webhook/67e17c28-2212-4e6b-89ab-7b64793d58e9?flavor=<text>  (GET)
//
// Returns null when no ai_promo dishes exist at all (caller falls back to a
// local hint).
// ─────────────────────────────────────────────────────────────────────────────

import { n8nGet } from './n8n'

const PATH = '/webhook/67e17c28-2212-4e6b-89ab-7b64793d58e9'

/**
 * @param {string} flavor  e.g. 'Spicy', 'Savory', 'Light'.
 * @returns {Promise<{id:number,item_name:string,price:string|number,
 *                    category:string,photo_url:string|null} | null>}
 */
export async function matchByFlavor(flavor) {
  const data = await n8nGet(PATH, { flavor: flavor || '' })
  if (!Array.isArray(data) || data.length === 0) return null
  const row = data[0]
  if (!row || !row.id) return null
  return row
}
