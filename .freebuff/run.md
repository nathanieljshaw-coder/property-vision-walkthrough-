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
   host, e.g. `id-preview--<project-id>.lovable.app`). It is NOT a secret. It
   activates `@lovable.dev/vite-tanstack-config`'s assets-proxy, which forwards
   `/__l5e/assets-v1/*` requests to the preview host so AI walkthrough videos
   (portfolio) resolve in local dev. `vite.config.ts` surfaces it from the env
   files into `process.env` via `loadEnv` (Vite doesn't do that automatically).
   Without it, portfolio videos 404 locally.

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

Camera style: COMPLETELY STILL — every shot is a fixed, locked-off view (no
bob, no sway, no pan, no zoom); the tour moves between spaces purely through
crossfades. Each video is 8 static views: exterior wide centre + exterior
right + interior 1 (centre/left/right) + interior 2 (centre/left/right), at
4.1s per shot with 0.4s crossfades = exactly 30.0s.

**AI-enhanced pipeline:** the source photos are first upscaled with
Real-ESRGAN (x4 GAN) to synthesize real detail — see below — then the
walkthrough generator uses `crop+scale` (not zoompan; much faster on static
content) to produce each locked-off view at **3840×2160 (4K)** with
`unsharp=5:5:0.5` and `crf 18`. ~70s encode per video. The montage encode
~4 min. The About page's before/after "walkthrough" frame
(`src/assets/portfolio/villa-sereno-walkthrough.jpg`) is extracted from the
4K video — re-extract after regenerating. Tune shots (frame count, views,
fade timing) at the top of `.freebuff/generate-walkthroughs.sh`
(`FRAMES=123` for 4.1s at 30fps; offsets are `n * (shot length − fade)`).
`src/content/portfolio.ts` points each project's `videoUrl` at
`/walkthroughs/<slug>.mp4`.

### Real-ESRGAN AI photo enhancement

Source photos (~1600×900) are AI-upscaled with Real-ESRGAN x4 to synthesize
real detail the originals lack. Two sets are cached:

- `.freebuff/upscaled-8k/` — 7680×4320 (4.8× outscale, then resized)
- `.freebuff/upscaled-4k/` — 3840×2160 (used by the generator)

Both sets are JPEG quality-95. The generator reads from `upscaled-4k/`. To
refresh after changing source photos:

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
4K walkthroughs into one ~178s clip. Rebuild it after regenerating the
walkthroughs:

```sh
./.freebuff/build-hero-montage.sh
```

`src/routes/index.tsx` references it via `<video src="/walkthroughs/hero-montage.mp4">`
(muted, autoplay, loop, playsInline), layered under the existing noise + gradient
overlays so the tagline stays readable.
