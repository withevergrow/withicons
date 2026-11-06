import { at, icon, INK } from '../../tools/hero-kit.mjs'
import { B, RED, GREEN, BG, LOOK_CSS, tofu } from './_look.mjs'

// One toolbar button in three browser frames: the icon (font loaded), a tofu box with the hex code (font missing),
// and the plain word "home" (ligature font missing).
const W = 440, X = [96, 580, 1064], Y = 150
const frame = (inner) => `<div class="ts-frame"><div class="ts-bar"><i></i><i></i><i></i></div><div class="ts-body"><div class="ts-tools"><span class="ts-dot"></span><span class="ts-dot"></span></div><span class="tq-btn ts-btn">${inner}</span></div></div>`
const STATES = [
  [icon('home', 'line', 120, INK), 'Font loaded', 'check-circle', GREEN],
  [tofu('F015', 128), 'Font missing:<br>a box', 'alert-triangle', RED],
  ['<span class="tq-word ts-word">home</span>', 'Ligature font<br>missing: the word', 'alert-triangle', RED],
]

export default {
  alt: 'Three browser frames showing the same toolbar button: a clean house icon labelled Font loaded, an empty box with the hex code F015 labelled Font missing: a box, and the plain word home labelled Ligature font missing: the word',
  bg: BG,
  art: () => STATES.map(([inner, label, ic, col], i) => [
    at(frame(inner), { x: X[i], y: Y, w: W }),
    at(`<div class="ts-label">${icon(ic, 'line', 44, col)}<span>${label}</span></div>`, { x: X[i] + 10, y: Y + 560, w: W - 20 }),
  ].join('')).join(''),
  css: `${LOOK_CSS}
.ts-frame { border-radius: 30px; overflow: hidden; background: #fff; box-shadow: 0 0 0 2px rgba(17,19,24,.06), 0 40px 70px -36px rgba(17,19,24,.45); }
.ts-bar { display: flex; gap: 10px; padding: 18px 22px; background: #F1EFEA; border-bottom: 1.5px solid rgba(17,19,24,.08); }
.ts-bar i { width: 14px; height: 14px; border-radius: 50%; background: #FF5F57; } .ts-bar i:nth-child(2) { background: #FEBC2E; } .ts-bar i:nth-child(3) { background: #28C840; }
.ts-body { position: relative; height: 440px; display: grid; place-items: center; }
.ts-tools { position: absolute; left: 28px; right: 28px; top: 26px; display: flex; gap: 14px; }
.ts-dot { width: 90px; height: 14px; border-radius: 8px; background: rgba(17,19,24,.1); }
.ts-btn { width: 220px; height: 220px; border-radius: 48px; }
.ts-word { font-size: 64px; }
.ts-label { display: flex; align-items: flex-start; gap: 14px; font: 700 34px/1.15 var(--font-display); letter-spacing: -.02em; color: ${INK}; }
.ts-label .hk-icon { flex: none; margin-top: -2px; }
`,
}
