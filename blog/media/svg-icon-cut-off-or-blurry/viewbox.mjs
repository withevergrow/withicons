import { at, icon, INK } from '../../tools/hero-kit.mjs'
import { B, RED, BG, grid, LOOK_CSS } from './_look.mjs'

// Three cards, left to right: the viewBox as 24-unit graph paper; the same drawing in 16, 24 and 48 px frames
// (width / height), each scaling to fill; and a 48 px frame with no viewBox, where the drawing stays at its raw 24 px
// in the top-left corner. Frames are drawn at 3.75x so the sizes compare.
const K = 3.75, U = 14 // frame scale; graph-paper px per unit
const frame = (s, o = {}) => `<div class="vb-fr" style="width:${s * K}px;height:${s * K}px;${grid(s * K / 24, 0.12)}">${o.small ? `<span class="vb-raw">${icon('home', 'line', 24 * K, INK)}</span>` : icon('home', 'line', s * K, INK)}</div>`
const card = (vis, h, m, hand, cls = '') => `<div class="lk-card ${cls}"><div class="lk-vis">${vis}</div><div class="lk-h">${h}</div><div class="lk-m">${m}</div><div class="lk-hand">${hand}</div></div>`

export default {
  alt: 'Three cards: a home icon on a 24 by 24 cyan grid labelled viewBox, the same icon filling picture frames of 16, 24 and 48 px labelled width and height, and a 48 px frame with the icon stuck small in its corner labelled no viewBox',
  bg: BG,
  art: () => [
    at(card(`<div class="vb-paper">
        <span class="lk-num vb-n0">0</span><span class="lk-num vb-n24">24</span><span class="lk-num vb-n24b">24</span>
        <div class="vb-sheet" style="${grid(U, 0.28)}">${icon('home', 'line', 24 * U, INK)}</div>
      </div>`, 'viewBox', '0 0 24 24', 'the graph paper'), { x: 64, y: 64, w: 464, h: 872 }),
    at(card(`<div class="vb-row">${[16, 24, 48].map(s => `<div class="vb-col">${frame(s)}<span class="lk-num">${s}</span></div>`).join('')}</div>`,
      'width / height', 'width="48"', 'the frame'), { x: 568, y: 64, w: 464, h: 872 }),
    at(card(`<div class="vb-row"><div class="vb-col">${frame(48, { small: true })}<span class="lk-num" style="color:${RED}">48, no viewBox</span></div></div>`,
      'no viewBox', 'nothing scales', 'stuck at its raw size', 'lk-bad'), { x: 1072, y: 64, w: 464, h: 872 }),
  ].join(''),
  css: `${LOOK_CSS}
.vb-paper { position: relative; padding: 44px 0 0 50px; }
.vb-sheet { width: ${24 * U}px; height: ${24 * U}px; background-color: #F6FCFD; box-shadow: inset 0 0 0 3px ${B.c}; border-radius: 4px; }
.vb-n0 { position: absolute; left: 22px; top: 6px; } .vb-n24 { position: absolute; right: -8px; top: 6px; } .vb-n24b { position: absolute; left: 0; bottom: -6px; }
.vb-row { display: flex; align-items: flex-end; gap: 36px; }
.vb-col { display: flex; flex-direction: column; align-items: center; gap: 26px; }
.vb-fr { position: relative; background-color: #fff; box-shadow: 0 0 0 8px #3A3F4B, 0 0 0 11px #9AA0AE, 0 18px 26px -10px rgba(17,19,24,.45); }
.vb-fr .hk-icon { display: grid; }
.vb-raw { position: absolute; left: 0; top: 0; line-height: 0; }
.lk-bad .vb-fr { box-shadow: 0 0 0 8px #3A3F4B, 0 0 0 11px ${RED}, 0 18px 26px -10px rgba(17,19,24,.45); }
`,
}
