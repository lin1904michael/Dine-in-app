# Handoff prompt — GM Dashboard menu photo uploader

Paste the section below into the chat working in `~/Desktop/foodservai-gm-dashboard/`.

---

## Context (paste this verbatim)

I'm working in `~/Desktop/foodservai-gm-dashboard/`. The dine-in app side is fully wired and live. I need to add a **menu photo uploader** to the GM dashboard's Menu Manager so that photos uploaded from the dashboard show up in the dine-in app's gallery automatically.

### Backend is already done — do NOT recreate it

- **n8n endpoint:** `POST https://stocktechnicaltradeassistance.zeabur.app/webhook/menu-photo/upload`
- **Auth:** none (public webhook)
- **Request:** `multipart/form-data` with these fields:
  - `file`        — the image binary (required). Allowed mime: `image/jpeg`, `image/png`, `image/webp`, `image/gif`. Max 10 MB.
  - `menu_item_id` — positive integer FK into `public.menu_items` (required)
  - `sort_order`   — integer, defaults to 0 (optional)
- **Response (200):**
  ```json
  {
    "ok": true,
    "public_url": "https://foodservai-menu-photos.s3.us-east-2.amazonaws.com/menu/<uuid>.jpg",
    "key": "menu/<uuid>.jpg",
    "row": {
      "id": 1,
      "menu_item_id": 1,
      "photo_url": "https://foodservai-menu-photos.s3.us-east-2.amazonaws.com/menu/<uuid>.jpg",
      "sort_order": 0,
      "is_visible": true,
      "created_at": "2026-04-27T06:57:33.435Z"
    }
  }
  ```
- **Validation errors return 200** with `{ ok: false, error: "<message>" }`. Treat `ok===false` as a soft failure.

The workflow uploads the image to S3 (`s3://foodservai-menu-photos/menu/`) AND inserts a row into `public.menu_item_photos` in one shot. The dine-in app's gallery webhook (`GET /webhook/f98134d5-a129-41a1-836c-c046f1b5f88f`) will pick up the new row immediately — no further coordination needed.

There's also a JSON-only fallback endpoint if the dashboard ever wants to register an externally-hosted URL (e.g. legacy CDN) without re-uploading:
- `POST /webhook/menu-photo/insert` body `{menu_item_id, photo_url, sort_order?, is_visible?}` → `{ok, row}`

### What I need built in this repo

1. Add an `uploadMenuPhoto(file: File, menuItemId: number, sortOrder?: number)` function to `src/lib/api.ts` (additive only — do NOT modify existing exports). Return type:
   ```ts
   type MenuPhotoUploadResponse = {
     ok: boolean
     error?: string
     public_url?: string
     key?: string
     row?: { id: number; menu_item_id: number; photo_url: string; sort_order: number; is_visible: boolean; created_at: string }
   }
   ```
   Use `fetch` with a `FormData` body. Base URL: same `VITE_N8N_BASE` env var the rest of `api.ts` already uses.

2. Wire the existing **Menu Manager → "Upload Menu PDF or Food Photos"** UI (the screenshot section the user mentioned earlier) so that when a GM picks a photo:
   - They first pick which `menu_items` row it belongs to (dropdown).
   - On confirm, call `uploadMenuPhoto`.
   - Show a toast on success and refresh the list of photos for that menu item.
   - On `ok===false`, show the `error` string in a toast.

3. (Optional, only if there's already a list of existing menu_item_photos) — add a "Hide" / "Reorder" UI that calls a future `PATCH` endpoint. **Skip this for now** unless the user asks; the dine-in side filters on `is_visible=true` so the row exists in the DB but UI control can come later.

### Constraints (project rules)

- **ADDITIVE ONLY** in both n8n and Postgres — do NOT modify existing workflows, tables, or the `Postgres account` credential. The two webhooks above already exist and are tested; just consume them.
- Match the existing `src/lib/api.ts` style (no class wrappers; named function exports; types in same file; uses the same `VITE_N8N_BASE` env var).
- Touch only the Menu Manager photo-upload section. Don't refactor unrelated dashboard code.
- AWS keys live in n8n credential `HtByymd8zjytf8SB` ("AWS S3 Menu Photos"). Do NOT add AWS SDK or AWS env vars to the dashboard repo — the dashboard never talks to S3 directly, only to the n8n webhook.

### Quick smoke test once wired

```bash
# Should return {ok:true, public_url:..., row:{...}} for a tiny test image
curl -X POST https://stocktechnicaltradeassistance.zeabur.app/webhook/menu-photo/upload \
  -F "file=@/path/to/test.jpg;type=image/jpeg" \
  -F "menu_item_id=1" \
  -F "sort_order=0"

# Then dine-in gallery should show it
curl https://stocktechnicaltradeassistance.zeabur.app/webhook/f98134d5-a129-41a1-836c-c046f1b5f88f
```

### Caveats / things to surface back to me

- IAM keys are still long-lived `AKIA…` keys and were pasted in chat — flag for rotation after the dashboard upload UI is verified.
- Bucket has no lifecycle policy and no max-key cap. If GMs start uploading hundreds of photos, ask whether to add a cleanup policy.
