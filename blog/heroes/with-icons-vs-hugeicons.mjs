import { at, icon, glow, C, INK, rgba } from '../tools/hero-kit.mjs'
import { N_STYLES } from '../lib/blocks.mjs'

// A balance scale that sits level: on the left pan a heap of many small, same-style outline icons (the huge count),
// on the right pan a few icons each in a different bold style (the many styles). Two deals, weighed.
const VSP_CSS = `
.vsp { display: inline-flex; align-items: center; gap: 14px; padding: 10px 28px 10px 10px; border-radius: 999px; background: ${C.line.c}; color: #fff; font: 800 34px/1 var(--font-display); letter-spacing: -.02em; white-space: nowrap; box-shadow: 0 0 0 6px rgba(255,255,255,.85), 0 30px 60px -18px rgba(17,19,24,.7); }
.vsp i { font-style: normal; width: 58px; height: 58px; border-radius: 50%; background: #fff; color: ${C.line.c}; display: grid; place-items: center; font-size: 28px; letter-spacing: -.04em; }`

const HEAP = ['home', 'bell', 'mail', 'user', 'search', 'heart', 'star', 'camera', 'calendar', 'lock', 'cloud', 'map-pin', 'gift', 'phone', 'settings', 'folder', 'image', 'tag', 'clock', 'trash', 'flag']
const PRIZE = [['rocket', 'soft3d'], ['heart', 'kawaii'], ['star', 'luxe'], ['bell', 'clay'], ['camera', 'retro'], ['gift', 'sticker']]

// stage geometry: pivot at (PX, BY), hangers at PX -/+ ARM, pan rims at RIM
const PX = 960, BY = 250, ARM = 300, RIM = 540
function heap() {
  const out = []
  let k = 0
  ;[6, 5, 4, 3].forEach((n, row) => {
    for (let i = 0; i < n; i++) { const r = ((k * 37) % 9 - 4) * 3; out.push(at(icon(HEAP[k++ % HEAP.length], 'line', 38, '#fff'), { cx: PX - ARM + (i - (n - 1) / 2) * 44, cy: RIM - 26 - row * 44, rot: r })) }
  })
  return out.join('')
}
function prize() {
  const pos = [[-84, 0], [0, 0], [84, 0], [-42, 1], [42, 1], [0, 2]]
  return PRIZE.map(([n, s], i) => at(icon(n, s, 84), { cx: PX + ARM + pos[i][0], cy: RIM - 48 - pos[i][1] * 82 })).join('')
}
const dish = (cx, label, col) => at(`<div class="dish" style="color:${col}">${label}</div>`, { x: cx - 150, y: RIM, w: 300, h: 56 })

export default {
  base: 'huge2',
  alt: 'Glowing blue and purple metallic cubes behind a level balance scale: a heap of small white outline icons on one pan and six with icons in bold 3D, kawaii and retro styles on the other, with a blue vs Hugeicons pill',
  photo: { filter: 'saturate(.9) brightness(.62)', pos: '50% 50%' },
  overlay: `radial-gradient(ellipse at 62% 45%, ${rgba('#111318', 0.15)} 0%, ${rgba('#111318', 0.55)} 75%)`,
  art: () => [
    glow({ cx: PX, cy: 450, r: 340, color: C.line.c, opacity: 0.3 }),
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" class="beam">
      <path d="M${PX} ${BY} L${PX + 46} 760 L${PX - 46} 760 Z" fill="#fff" opacity=".92"/>
      <rect x="${PX - 140}" y="752" width="280" height="34" rx="17" fill="#fff"/>
      <path d="M${PX - ARM} ${BY} L${PX - ARM - 140} ${RIM} M${PX - ARM} ${BY} L${PX - ARM + 140} ${RIM} M${PX + ARM} ${BY} L${PX + ARM - 140} ${RIM} M${PX + ARM} ${BY} L${PX + ARM + 140} ${RIM}" stroke="#fff" stroke-width="4" opacity=".75"/>
      <rect x="${PX - ARM - 40}" y="${BY - 14}" width="${2 * ARM + 80}" height="28" rx="14" fill="#fff"/>
      <circle cx="${PX}" cy="${BY}" r="28" fill="${C.line.c}" stroke="#fff" stroke-width="8"/>
    </svg>`, { x: 0, y: 0 }),
    heap(), prize(), dish(PX - ARM, '6,000 icons', INK), dish(PX + ARM, `${N_STYLES} styles`, C.line.c),
    at(`<span class="vsp"><i>vs</i>Hugeicons</span>`, { x: 170, y: 130 }),
  ].join(''),
  css: `${VSP_CSS}
.beam { display: block; overflow: visible; filter: drop-shadow(0 30px 40px rgba(0,0,0,.45)); }
.dish { box-sizing: border-box; padding-top: 8px; text-align: center; font: 800 30px/1 var(--font-display); letter-spacing: -.02em; width: 100%; height: 100%; border-radius: 0 0 170px 170px / 0 0 64px 64px; background: linear-gradient(#fff, #E6E2DA); box-shadow: 0 30px 50px -20px rgba(0,0,0,.6); }
`,
}
