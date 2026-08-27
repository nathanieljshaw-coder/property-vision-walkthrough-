# Run doc: property-vision-walkthrough

Vite + TanStack Start app (Lovable `tanstack_start_ts` template), managed with
Bun (`bun.lock` + `bunfig.toml` present). No git repo in this checkout, and the
machine has no system Node/Bun — Bun is vendored project-locally.

## Reproduce artifacts

1. **Bun runtime** (no system Bun/Node exists): download the standalone
   darwin-arm64 binary and place it at `.freebuff/bun`:

   ```sh
   curl -fsSL -o /tmp/bun.zip https://github.com/oven-sh/bun/releases/latest/download/bun-darwin-aarch64.zip
   unzip -q /tmp/bun.zip -d /tmp && mv /tmp/bun-darwin-aarch64/bun .freebuff/bun
   chmod +x .freebuff/bun
   ```

2. **Dependencies**: install with bun, keeping the package cache project-local:

   ```sh
   BUN_INSTALL_CACHE_DIR="$PWD/.freebuff/bun-cache" ./.freebuff/bun install
   ```

3. **Env files**: copy `.env.local` from the main checkout. It holds
   `STRIPE_RESTRICTED_API_KEY` (a Stripe restricted key, server-only — read via
   `process.env` in `src/lib/checkout.server.ts`; Nitro's dev server loads
   `.env` and `.env.local` at startup). The file is gitignored (`*.local`) —
   never commit it and never paste the value into docs. If it's missing, the
   Stripe checkout button fails with "Stripe is not configured." A key-less
   template lives in `.env.example`.

   `.env.local` also holds `LOVABLE_PREVIEW_HOST` (the project's Lovable preview
   host, e.g. `id-preview--<project-id>.lovable.app`). It is NOT a secret.

   Optional `RESEND_API_KEY` (free tier, no card): enables branded HTML order-
   confirmation emails with the LUMEN logo inline (see `src/lib/email.server.ts`).
   Without it, the webhook falls back to the free FormSubmit service (same as the
   contact form) which delivers a plain table email with the logo attached. Both
   paths are free; Resend gives the pretty branded look. Copy the key from the
   main checkout's `.env.local` if it exists there.

   The admin panel's messaging (admin dashboard → "Send Message") has three
   channels, all free and needing no external accounts: **Email** (mailto —
   opens the admin's mail app pre-filled), **WhatsApp** (a `https://wa.me/…`
   link that opens WhatsApp with the message pre-filled), and
   **WhatsApp + Email** (opens both at once). Phone numbers entered are saved
   to the customer record.

   Walkthrough files can be **uploaded** from the admin panel (Walkthrough URL
   section or the "Ready for Review" demo box) — the file is saved to
   `public/walkthroughs/uploads/` and served at `/walkthroughs/uploads/<name>`
   (via `POST /api/admin/upload`). Note: on serverless hosting (Vercel) the
   filesystem is read-only/ephemeral, so uploads only persist on the local
   dev server — for production, uploads should go to object storage (S3/R2)
   instead. It
   activates `@lovable.dev/vite-tanstack-config`'s assets-proxy, which forwards
   `/__l5e/assets-v1/*` requests to the preview host so AI walkthrough videos
   (portfolio) resolve in local dev. `vite.config.ts` surfaces it from the env
   files into `process.env` via `loadEnv` (Vite doesn't do that automatically).
   Without it, portfolio videos 404 locally.

## Order confirmation emails & the admin email preview

When a Stripe checkout completes, the webhook (`POST /api/webhook`) creates the
order — **saving the customer's phone and WhatsApp opt-in on the order record**
(plus the phone on the user record) — then sends an **order confirmation email**:

- **Resend** (if `RESEND_API_KEY` set): branded dark-themed HTML with the LUMEN
  logo (`public/logo.png`) embedded inline. Sent to the admin inbox first
  (always works on the free tier, no domain needed), then best-effort to the
  customer (needs a verified sending domain on the free tier — until one is
  verified, the customer copy is blocked with a 403 and the admin UI reports it
  honestly). Once a domain is verified at resend.com/domains, set
  `RESEND_FROM_EMAIL=hello@lumen.co.uk` (and optionally `RESEND_FROM_NAME`) in
  `.env.local` — that's the only change needed to reach customer inboxes.
- **Brevo fallback for customer copies** (if `BREVO_API_KEY` +
  `BREVO_SENDER_EMAIL` set): when Resend blocks the customer address (no domain
  verified), the customer copy is sent via Brevo instead — free tier (300
  emails/day) reaches any recipient with just a verified sender email, no
  DNS/domain needed. Set up at brevo.com → Senders (verify your sender email
  via the link they email) → SMTP & API → API key.
- **FormSubmit fallback** (no key): table email to
  `hello-lumenexperiences@outlook.com` with the admin CC'd, logo attached.
  First use may require clicking FormSubmit's one-time activation link.

**Demo-ready email:** when the admin marks an order's walkthrough as **Ready
for Review** (with a demo URL), the admin API (`PATCH /api/admin/orders` with
`walkthrough_status: "review"`) emails the customer a branded "your walkthrough
is ready" message with a **Watch Your Walkthrough** button pointing at the
saved demo URL — same delivery paths and logo as the confirmation email above.

**Auto-send emails on status change** (admin order PATCH): moving an order to
**In Progress** auto-sends the *Work started* branded email, and to
**Completed/Delivered** auto-sends *Delivered* (transitions only — never
re-sent on repeat clicks). Walkthrough → **Ready for Review** auto-sends
*Demo ready* (needs a demo URL). Each order has an **Auto-send emails & WhatsApp**
toggle (checkbox in the expanded admin panel, stored as `order.auto_email`,
default on) that silences all auto-sends for that order. All use
`sendBrandedEmail` / `sendDemoReadyEmail` and the same delivery paths as the
manual emails.

## Pay-after-approval flow (checkout without paying)

The checkout page (`/checkout/<slug>`) offers two payment modes:

- **Pay now** — existing Stripe flow (webhook creates the order as `paid`).
- **Pay after you approve the demo** — no payment today. The customer picks a
  name + password, `POST /api/order-place` creates their account (or verifies
  their existing password), auto-logs them in, and creates the order with
  `status: "pending"` and `approval_status: "pending"`. They land on
  `/dashboard`.

When the admin marks the walkthrough **Ready for Review** (with a demo URL) on
a pending order, the demo-ready email adds a line telling the customer to log
into their dashboard to **approve and pay**. The dashboard then shows the demo
with three buttons: **Watch Demo**, **Agree — Pay £X** and **Decline — Request
Changes** (`POST /api/order-decision`):

- **Agree** → `createStripeCheckoutSession` with `metadata[order_id]` set to the
  existing order; `approval_status` becomes `agreed`. When the Stripe
  `checkout.session.completed` webhook arrives, it sees `metadata.order_id` and
  marks THAT order `paid` (saving `stripe_session_id`) instead of creating a
  duplicate.
- **Decline** → `approval_status` becomes `declined` and a note is appended
  ("Customer declined the demo.") so the admin can revise and re-send.

The admin panel shows badges for each state: **Awaiting customer approval**
(yellow), **Approved — pay link sent** (green), **Customer declined demo** (red).
Old orders without the field read `null` and show no badge.

## Auto-send WhatsApp on status change

**Auto-send WhatsApp on status change** (same PATCH, same toggle): when
`WHATSAPP_ACCESS_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` are set, each status change
also sends a WhatsApp message to customers who opted in (`order.whatsapp_opt_in`)
and have a phone number — *Work started* on In Progress, the demo link on Ready
for Review, *Delivered* on Delivered — via Meta's WhatsApp Cloud API
(`src/lib/whatsapp.server.ts`, free tier, no Twilio). Phone numbers are
normalized to E.164 (`normalizePhoneE164`: 0-prefixed UK numbers become +44).
Setup: developers.facebook.com → Business app → WhatsApp → link a WhatsApp
Business number → copy the permanent access token + Phone number ID into
`.env.local`.

**Branded preset emails (admin → order → "Send Message" → Branded Email):**
four presets — **Work started**, **Demo ready**, **Need info**, **Delivered** —
plus any custom message, each sent as a branded HTML email (logo, template
styling, and a CTA: watch link for demo ready, dashboard link for delivered,
reply-to for need info/custom) via `POST /api/admin/send-email`. Same delivery
paths as the other emails (Resend if `RESEND_API_KEY`, else FormSubmit). The
other composer channels (Email mailto, WhatsApp, WhatsApp + Email) are
unchanged.

**Preview the emails without sending:** log in as admin and open
`/api/email-preview` (order confirmation) or `/api/email-preview?type=demo`
(demo ready) — they render the exact HTML the customer gets, with the logo,
using sample data.

The logo itself is the user's own wordmark, converted from a screenshot HEIC to
`public/logo.png` (1018×372, near-black background that the email's `#030304`
body matches).

## Run the server

- Dev script: `bun run dev` → `vite dev`. The Lovable config's sandbox
  detection pins the port to **8080** (not Vite's default 5173). Check the port
  is free first: `lsof -iTCP:8080 -sTCP:LISTEN`.
- Log file: `.freebuff/preview-<id>.log` (per-thread path from the preview state).
- **Detach recipe that works on this machine** (macOS, no `setsid` binary):
  - Plain `nohup ... &` gets reaped — the command runner kills the whole process
    group when the tool call returns (server dies with SIGTERM).
  - `launchctl submit` jobs inherit the app sandbox and cannot write into
    `.freebuff/` (they exit 1/126 before touching the log) — do not use launchd.
  - Working approach: spawn via `python3` calling `os.setsid()`, which moves the
    process into its own session/process group so the runner's group-kill misses
    it:

  ```sh
  ROOT="$PWD"
  LOG="$ROOT/.freebuff/preview-<id>.log"
  cd "$ROOT"
  { nohup /usr/bin/python3 -c "
  import os
  os.setsid()
  os.chdir('$ROOT')
  os.execv('$ROOT/.freebuff/bun', ['bun', 'run', 'dev'])
  " > "$LOG" 2>&1 < /dev/null & echo "pid=$!"; disown; }
  ```

- Verify: after ~5–10 s, `kill -0 <pid>` (should be alive; `ps -p <pid>` should
  show PPID 1 in its own session), then
  `curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/` → 200.
- Stop the server: `kill <pid>`.

## Regenerating the portfolio walkthrough videos

`public/walkthroughs/<slug>.mp4` — the 30-second walkthroughs played from the
portfolio page — are generated from each place's existing photos
(`src/assets/portfolio/<slug>-hero.jpg`, `-1.jpg`, `-2.jpg`) with ffmpeg. They
are NOT the short Lovable AI clips; regenerate or re-tune them with:

```sh
bun add -d ffmpeg-static   # once — vendored ffmpeg binary
./.freebuff/generate-walkthroughs.sh
```

Camera style: DRONE REVEAL — each video opens with ONE slow drone reveal
(14.8s: camera starts tight on the property, zoom 1.45x, and pulls back to
the full wide shot with a gentle orbit rotation, like a drone backing away),
then each part of the property is shown ONCE as a gentle slow push-in
(2 × 8.0s, zoom 1.0x → 1.18x) so the drone feel carries through the whole
video. 3 shots with 0.4s crossfades = exactly 30.0s.

**AI-enhanced pipeline:** the source photos are first upscaled with
Real-ESRGAN (x4 GAN) to synthesize real detail — see below — then the
generator produces each shot at **3840×2160 (4K)** with `unsharp=5:5:0.5`.
The reveal uses `zoompan` (input pre-scaled to 5760×3240 so the tightest
crop samples ≥3840px wide, plus a ±1.2° `rotate` orbit with an overscan
crop to hide corners); the interior shots are gentle `zoompan` push-ins
(1.0x → 1.18x). Shots encode at `crf 18`; the final 3-input xfade concat
uses `preset veryfast crf 20`. ~2-5 min encode per video (machine-load
dependent). The About page's
before/after "walkthrough" frame
(`src/assets/portfolio/villa-sereno-walkthrough.jpg`) is extracted from the
4K video — re-extract after regenerating. Tune shots (frame counts, fade
timing) at the top of `.freebuff/generate-walkthroughs.sh`
(`FRAMES1=444` = 14.8s reveal, `FRAMES2=240` = 8.0s static; xfade offsets
`O1=14.4`, `O2=22.0`). `src/content/portfolio.ts` points each project's
`videoUrl` at `/walkthroughs/<slug>.mp4`.

### Full-property montage (Villa Sereno Full Estate Tour)

`public/walkthroughs/villa-sereno-full.mp4` — a **3-minute (180.0s), 4K**
montage of every room in the villa, built from the owner's two room-collage
images. It opens with the same drone reveal on the exterior, then tours all
**28 rooms** (6.3s each, 0.4s crossfades). Regenerate with:

```sh
./.freebuff/generate-villa-montage.sh   # resumable — re-run until "Done"
```

Pipeline (three stages, all in `.freebuff/`):

1. **Crop** the collages into 28 room photos — `.freebuff/crop-villa-rooms.py`
   (grid math is hard-coded per collage: 4×3 and 4×4).
2. **Upscale** each room with Real-ESRGAN x4 — `.freebuff/upscale-villa-rooms.py`
   → `.freebuff/villa-rooms-4k/` (single pass, ~1168–1336px wide).
3. **Parallax walk-in render** — `.freebuff/parallax-render.py`: MiDaS
   (torch.hub `intel-isl/MiDaS`, `MiDaS_small`; needs `pip install timm` in the
   venv once) estimates a depth map, then per-frame the photo is depth-warped
   (`cv2.remap`) so NEAR objects expand outward faster than the background — a
   true 2.5D "walk into the room", not a flat zoom. Each room encodes in ~27s.

The montage script never wipes its temp clips (`public/walkthroughs/.villa-full/`)
so interrupted runs resume; the final xfade concat writes `villa-sereno-full.mp4`.
`src/content/portfolio.ts` has a second Villa Sereno entry
(`slug: "villa-sereno-full"`) pointing at `/walkthroughs/villa-sereno-full.mp4`.

### Owner-made CapCut walkthroughs (Villa Sereno & Aura Dining)

`public/walkthroughs/villa-sereno-full.mp4` and
`public/walkthroughs/aura-dining-full.mp4` are the owner's OWN CapCut exports
(originally 8K HEVC `.mov` files from `~/Movies/CapCut/`) — NOT generated by
the pipeline above. Browsers can't play 8K HEVC `.mov`, so each was transcoded
to a browser-friendly 4K H.264 mp4 (with `node_modules/ffmpeg-static/ffmpeg`):

```sh
FF="node_modules/ffmpeg-static/ffmpeg"; $FF -y -i "<input>.mov" \
  -vf scale=3840:-2 -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p \
  -c:a aac -movflags +faststart public/walkthroughs/aura-dining-full.mp4
```

(villa-sereno-full is landscape 3840×2160, aura-dining-full is portrait
3840×5692; both ~600 MB at crf 20.) The `.mov` sources stay on the owner's
Mac — only the transcoded mp4 lives in the repo. `src/content/portfolio.ts`
has matching entries (`slug: "villa-sereno-full"`,
`slug: "aura-dining-full"`) pointing at these files.

### Real-ESRGAN AI photo enhancement

Source photos (~1600×900) are AI-upscaled with Real-ESRGAN x4 to synthesize
real detail the originals lack. Two sets are cached:

- `.freebuff/upscaled-8k/` — 7680×4320 (4.8× outscale, then resized)
- `.freebuff/upscaled-4k/` — 3840×2160 (downscale of the 8K set)

Both sets are JPEG quality-95. The generator reads from `upscaled-8k/` (the
reveal's zoom-in needs the extra resolution headroom). To refresh after
changing source photos:

```sh
./.freebuff/venv/bin/python .freebuff/upscale-photos.py   # ~45s per photo on MPS
```

The venv lives at `.freebuff/venv/` (Python 3.9, torch 2.8.0, MPS-accelerated).
basicsr's `degradations.py` was patched for torchvision 0.23 compat (the old
`functional_tensor` import moved to `transforms.functional`). If you recreate
the venv, re-apply that sed fix.

Model weights: `.freebuff/weights/RealESRGAN_x4plus.pth` (64 MB, downloaded
from GitHub releases). The upscale script skips photos already present in the
output directory.

### Home-page hero montage

`public/walkthroughs/hero-montage.mp4` — the looping background video behind the
home hero ("Your Business. Your Story. Your Experience.") — crossfades all six
4K walkthroughs into one ~178s clip, so it inherits the drone-reveal look of
each walkthrough. Rebuild it after regenerating the walkthroughs:

```sh
./.freebuff/build-hero-montage.sh
```

The script encodes to a temp file then `mv`s it into place (a timeout can't
truncate the live hero) and uses `preset veryfast crf 27` to stay under
GitHub's 100 MiB file limit (the drone/push motion inflates bitrate — raise
crf if the file creeps back over). It encodes slower under heavy machine load — if
the encode times out, park the browser preview away from the home page (the
4K hero loop is CPU-hungry) and re-run.

`src/routes/index.tsx` references it via `<video src="/walkthroughs/hero-montage.mp4">`
(muted, autoplay, loop, playsInline), layered under the existing noise + gradient
overlays so the tagline stays readable.
