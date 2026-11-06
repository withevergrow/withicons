import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BLUE, BTEXT, RED, BG, M, badge, CSS } from './_kit.mjs'

// The word "Settings" set at 180 px with line-height 1.6, and six guide lines placed from the font's real metrics:
// line box top, cap height, x-height, baseline, descender, line box bottom. The two bands of spare room (above the
// capitals, below the baseline) are tinted. Two settings icons, 1em each, sit before the word: one standing on the
// baseline (too high, red cross), one centred between cap height and baseline (green tick).
const FS = 180, LH = 1.6
const Y0 = 295 // line box top
const half = (LH - (M.asc + M.desc)) / 2 * FS
const BASE = Y0 + half + M.asc * FS
const Y = {
  top: Y0, cap: BASE - M.cap * FS, x: BASE - M.x * FS, base: BASE, tail: BASE + M.tail * FS, bottom: Y0 + LH * FS,
}
const WX = 800 // the word's left edge
const IA = 360, IB = 580 // icon left edges
const LX = 70, RX = 1536 // guide lines span

const guide = (y, label, below, strong) => [
  at(`<div class="gl${strong ? ' is-strong' : ''}"></div>`, { x: LX, y: y - 1.5, w: RX - LX }),
  at(`<span class="k-lbl gtx">${label}</span>`, { x: LX + 4, y: below ? y + 8 : y - 38 }),
].join('')

export default {
  alt: 'Diagram of the word Settings with guide lines for line box top, cap height, x-height, baseline, descender and line box bottom, tinted empty space above the capitals and below the baseline, and two settings icons: one sitting on the baseline marked with a red cross, one centred between cap height and baseline marked with a green tick',
  bg: BG,
  art: () => [
    // the spare room bands
    at(`<div class="band"></div>`, { x: LX, y: Y.top, w: RX - LX, h: Y.cap - Y.top }),
    at(`<div class="band"></div>`, { x: LX, y: Y.base, w: RX - LX, h: Y.bottom - Y.base }),
    at(`<span class="k-hand">empty space</span>`, { x: 1250, y: Y.top + 18 }),
    at(`<span class="k-hand">empty space</span>`, { x: 1180, y: Y.bottom - 52 }),
    guide(Y.top, 'line box top', false),
    guide(Y.cap, 'cap height', false, true),
    guide(Y.x, 'x-height', true),
    guide(Y.base, 'baseline', false, true),
    guide(Y.tail, 'descender', true),
    guide(Y.bottom, 'line box bottom', true),
    // the word, laid out by the browser at the same metrics
    at(`<div class="word">Settings</div>`, { x: WX, y: Y0 }),
    // icon A: 1em, bottom on the baseline
    at(icon('settings', 'line', FS, INK), { x: IA, y: Y.base - FS }),
    // icon B: 1em, centred between cap height and baseline
    at(icon('settings', 'line', FS, INK), { x: IB, y: (Y.cap + Y.base) / 2 - FS / 2 }),
    at(badge(false), { cx: IA + FS / 2, cy: Y.bottom + 120 }),
    at(badge(true), { cx: IB + FS / 2, cy: Y.bottom + 120 }),
    at(`<span class="k-lbl cap">on the<br>baseline</span>`, { cx: IA + FS / 2, cy: Y.bottom + 205 }),
    at(`<span class="k-lbl cap"><em>centred</em> on<br>the letters</span>`, { cx: IB + FS / 2, cy: Y.bottom + 205 }),
  ].join(''),
  css: `${CSS}
.band { width: 100%; height: 100%; background: repeating-linear-gradient(-45deg, ${rgba(BLUE, 0.13)} 0 10px, ${rgba(BLUE, 0.05)} 10px 20px); }
.gl { height: 3px; background: ${rgba(BLUE, 0.55)}; }
.gl.is-strong { background: ${BLUE}; height: 4px; }
.gtx { font-size: 26px; color: ${BTEXT}; }
.word { font: 800 ${FS}px/${LH} var(--font-display); letter-spacing: -.03em; color: ${INK}; white-space: nowrap; }
.cap { text-align: center; font-size: 26px; }
`,
}
