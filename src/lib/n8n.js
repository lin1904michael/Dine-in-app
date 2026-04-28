// ─────────────────────────────────────────────────────────────────────────────
// Low-level n8n client — shared base URL + uniform GET / POST.
//
// All dine-in app backend calls go through this. Reads return parsed JSON or
// null on failure; writes are fire-and-forget (resolve void, never throw) so
// the UI keeps rendering optimistically when n8n is unreachable.
//
// Env knobs (.env.local — defaults baked in so the app runs without one):
//   VITE_N8N_BASE  — n8n base URL
// ─────────────────────────────────────────────────────────────────────────────

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {}

export const N8N_BASE =
  (env.VITE_N8N_BASE || 'https://stocktechnicaltradeassistance.zeabur.app').replace(/\/$/, '')

function buildUrl(path, params) {
  const url = new URL(path.startsWith('/') ? path : `/${path}`, N8N_BASE)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

/**
 * GET an n8n webhook. Returns parsed JSON, or null on any failure.
 * Never throws.
 */
export async function n8nGet(path, params) {
  try {
    const res = await fetch(buildUrl(path, params), { method: 'GET' })
    if (!res.ok) {
      console.warn('[n8n GET]', path, 'HTTP', res.status)
      return null
    }
    return await res.json()
  } catch (err) {
    console.warn('[n8n GET]', path, 'network error', err)
    return null
  }
}

/**
 * POST JSON to an n8n webhook. Fire-and-forget. Never throws.
 */
export async function n8nPost(path, body) {
  try {
    const res = await fetch(buildUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    })
    if (!res.ok) {
      console.warn('[n8n POST]', path, 'HTTP', res.status, await res.text())
    }
  } catch (err) {
    console.warn('[n8n POST]', path, 'network error', err)
  }
}
