import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BEFORE } from './_bell.mjs'
import { B, RED, BG, LOOK_CSS } from './_look.mjs'

// Four tiles, one per over-eager setting, each a before (green check) and after (red cross) pair:
// removeViewBox (the icon no longer scales), convertColors with currentColor (a two-tone icon goes flat),
// cleanupIds on a sprite (every symbol deleted) and floatPrecision 0 (the bell's real path data rounded to whole
// units, drawn over a faint cyan copy of the original so the drift shows).
const NAVY = '#1E3A8A', SKY = '#38BDF8', AMBER = '#F59E0B'
const ds = [...BEFORE.matchAll(/ d="([^"]+)"/g)].map(m => m[1])
const rounded = ds.map(d => d.replace(/-?\d+\.?\d*/g, n => String(Math.round(+n))))
const bellSvg = (paths, color, w = 2) => `<svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${paths.map(d => `<path d="${d}"/>`).join('')}</svg>`

const panel = (ok, vis) => `<div class="wb-panel"><span class="ok-badge ${ok ? 'is-ok' : 'is-bad'}">${icon(ok ? 'check' : 'close', 'solid', 30, '#fff')}</span><div class="wb-vis">${vis}</div></div>`
const tileHtml = (name, sub, a, b) => `<div class="ok-card wb-tile"><div class="wb-head"><code>${name}</code><span>${sub}</span></div>
  <div class="wb-row">${panel(true, a)}<span class="wb-arrow">${icon('arrow-right', 'line', 44, rgba(INK, 0.45))}</span>${panel(false, b)}</div></div>`
const frame = (inner) => `<div class="wb-frame">${inner}</div>`
const sprite = (full) => `<div class="wb-sprite"><b>sprite.svg</b>${['home', 'bell', 'star'].map(n => full
  ? `<div class="wb-sym">${icon(n, 'line', 40, INK)}<code>#${n}</code></div>`
  : `<div class="wb-sym is-gone"><i></i><i class="w"></i></div>`).join('')}</div>`

export default {
  alt: 'Four tiles of before and after pairs: removeViewBox leaves a home icon small in the corner of its frame, convertColors with currentColor turns a two-tone home icon flat navy, cleanupIds empties a sprite file, and precision 0 makes a bell outline drift',
  bg: BG,
  art: () => [
    at(tileHtml('removeViewBox', 'stops scaling',
      frame(icon('home', 'line', 196, INK)),
      frame(`<span class="wb-raw">${icon('home', 'line', 98, INK)}</span>`)), { x: 64, y: 64, w: 716, h: 420 }),
    at(tileHtml('convertColors', 'currentColor: true',
      `<span style="--with-duo:${SKY};--with-duo-accent:${AMBER};line-height:0">${icon('home', 'duo', 200, NAVY)}</span>`,
      `<span style="--with-duo:${NAVY};--with-duo-accent:${NAVY};line-height:0">${icon('home', 'duo', 200, NAVY)}</span>`), { x: 820, y: 64, w: 716, h: 420 }),
    at(tileHtml('cleanupIds', 'on a sprite', sprite(true), sprite(false)), { x: 64, y: 516, w: 716, h: 420 }),
    at(tileHtml('floatPrecision', '0', bellSvg(ds, INK),
      `<span class="wb-stack"><span>${bellSvg(ds, rgba(B.c, 0.45), 2.6)}</span><span>${bellSvg(rounded, RED)}</span></span>`), { x: 820, y: 516, w: 716, h: 420 }),
  ].join(''),
  css: `${LOOK_CSS}
.wb-tile { padding: 28px 32px 30px; display: flex; flex-direction: column; }
.wb-head { display: flex; align-items: baseline; gap: 16px; padding-bottom: 18px; border-bottom: 2px solid rgba(17,19,24,.07); }
.wb-head code { font: 700 32px/1 var(--font-mono); color: ${B.text}; letter-spacing: -.02em; }
.wb-head span { font: 600 30px/1 var(--font-display); color: #5B6070; letter-spacing: -.01em; }
.wb-row { flex: 1; display: flex; align-items: center; justify-content: space-between; padding-top: 18px; }
.wb-panel { position: relative; width: 286px; height: 262px; border-radius: 26px; background: #F7F5F0; display: grid; place-items: center; }
.wb-panel .ok-badge { position: absolute; left: -12px; top: -12px; z-index: 2; }
.wb-vis { display: grid; place-items: center; line-height: 0; }
.wb-vis svg { max-width: none; }
.wb-frame { position: relative; width: 196px; height: 196px; background: #fff; box-shadow: 0 0 0 7px #3A3F4B, 0 12px 20px -8px rgba(17,19,24,.4); display: grid; place-items: center; }
.wb-raw { position: absolute; left: 0; top: 0; line-height: 0; }
.wb-sprite { width: 220px; box-sizing: border-box; padding: 16px 18px; border-radius: 18px; background: #15171E; color: #F4F0E8; display: flex; flex-direction: column; gap: 12px; }
.wb-sprite > b { font: 700 24px/1 var(--font-mono); opacity: .8; }
.wb-sym { display: flex; align-items: center; gap: 12px; height: 46px; }
.wb-sym .hk-icon { background: ${B.soft}; border-radius: 12px; padding: 3px; }
.wb-sym code { font: 600 26px/1 var(--font-mono); color: #5FD3EA; }
.wb-sym.is-gone i { width: 46px; height: 46px; border-radius: 12px; border: 2.5px dashed rgba(255,255,255,.25); box-sizing: border-box; }
.wb-sym.is-gone i.w { width: 100px; height: 16px; border-radius: 8px; border: none; background: rgba(255,255,255,.08); }
.wb-stack { position: relative; width: 220px; height: 220px; } .wb-stack > span { position: absolute; inset: 0; }
.wb-arrow { line-height: 0; }
`,
}
