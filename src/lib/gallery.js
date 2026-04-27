// ─────────────────────────────────────────────────────────────────────────────
// Menu gallery photos — GM-curated photos shown in VisualMenu.
//
// Workflow id: nAkDE8BlWTPxkavg  (Dine_in_gallery_list, additive — created 2026-04-26)
// Webhook:     /webhook/f98134d5-a129-41a1-836c-c046f1b5f88f  (GET)
//
// Returns visible photos joined with their menu_items, sorted by sort_order.
// While AWS S3 isn't wired into the GM upload yet the table will be empty;
// VisualMenu falls back to placeholder cards in that case.
// ─────────────────────────────────────────────────────────────────────────────

import { n8nGet } from './n8n'

const PATH = '/webhook/f98134d5-a129-41a1-836c-c046f1b5f88f'

/**
 * @returns {Promise<Array<{id:number, menu_item_id:number, item_name:string,
 *                          photo_url:string, sort_order:number}>>}
 *   — empty array on failure (never throws).
 */
export async function fetchGallery() {
  const data = await n8nGet(PATH)
  return Array.isArray(data) ? data : []
}
