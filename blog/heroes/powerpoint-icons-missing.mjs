import { at, chip, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// A top-down desk (laptop, tablet, mouse) under a floating, generic ribbon of icon buttons. One button is missing:
// a puzzle-piece-shaped hole in the ribbon. The orange piece (the Icons button) has dropped onto the tablet below.
const O = C.solid
const RX = 180, RY = 150, RW = 1240, RH = 190, PITCH = 160, T = 112
const HOLE = 3
const slotX = i => RX + 60 + i * PITCH + (PITCH - T) / 2
const BUTTONS = ['table', 'image', 'camera', null, 'chart-bar', 'type', 'layers']

/** A puzzle piece with a knob on top and right and a socket on the left, s px square, drawn from (x, y). */
function piece(x, y, s) {
  const k = s * 0.11, r = s * 0.17, m = s / 2
  return `M${x} ${y} H${x + m - k} A${r} ${r} 0 1 1 ${x + m + k} ${y} H${x + s} V${y + m - k} A${r} ${r} 0 1 1 ${x + s} ${y + m + k} V${y + s} H${x} V${y + m + k} A${r} ${r} 0 1 0 ${x} ${y + m - k} Z`
}
const holeY = RY + (RH - T) / 2 + 10

export default {
  photoFile: 'powerpoint-icons-missing-desk.jpg',
  credit: { by: 'Jakub Zerdzicki', profile: 'https://www.pexels.com/@jakubzerdzicki/', source: 'https://www.pexels.com/photo/laptop-empty-tablet-screen-mockup-top-view-office-desk-28347996/', license: 'Pexels License' },
  alt: 'A top-down desk with a laptop, tablet and mouse under a floating white ribbon of icon buttons with one puzzle-shaped gap, its orange Icons piece lying on the tablet below',
  photo: { filter: 'saturate(.9) brightness(.88)', pos: '50% 50%' },
  overlay: `linear-gradient(180deg, ${rgba('#111318', 0.35)} 0%, ${rgba('#111318', 0.1)} 55%, ${rgba('#111318', 0.25)} 100%)`,
  art: () => [
    // the ribbon, with the hole cut through it
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" class="pm__rib">
      <path fill-rule="evenodd" fill="#fff" d="M${RX + 36} ${RY} H${RX + RW - 36} A36 36 0 0 1 ${RX + RW} ${RY + 36} V${RY + RH - 36} A36 36 0 0 1 ${RX + RW - 36} ${RY + RH} H${RX + 36} A36 36 0 0 1 ${RX} ${RY + RH - 36} V${RY + 36} A36 36 0 0 1 ${RX + 36} ${RY} Z ${piece(slotX(HOLE), holeY, T)}"/>
      <path d="${piece(slotX(HOLE), holeY, T)}" fill="none" stroke="${O.c}" stroke-width="4" stroke-dasharray="10 9"/>
    </svg>`, { x: 0, y: 0 }),
    ...BUTTONS.map((n, i) => n ? at(`<span class="pm__btn">${icon(n, 'line', 58, INK)}</span>`, { x: slotX(i), y: holeY, w: T, h: T }) : ''),
    at('<i class="pm__sep"></i>', { x: slotX(3) - 24, y: RY + 40, h: RH - 70 }),
    at('<i class="pm__sep"></i>', { x: slotX(4) + T + 24, y: RY + 40, h: RH - 70 }),
    // the dotted drop path and the missing piece on the tablet
    at(`<svg width="300" height="300" viewBox="0 0 300 300" fill="none"><path d="M30 8 C 40 120, 140 170, 250 250" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-dasharray="1 22"/><path d="M30 8 C 40 120, 140 170, 250 250" stroke="${O.c}" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 22"/></svg>`, { x: slotX(HOLE) + 26, y: RY + RH + 8 }),
    at(`<div class="pm__piece"><svg width="300" height="300" viewBox="-40 -60 300 300"><path d="${piece(0, 0, 220)}" fill="${O.c}"/><path d="${piece(0, 0, 220)}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="5"/></svg><span class="pm__pi">${icon('shapes', 'solid', 104, '#fff')}<b>Icons</b></span></div>`, { x: 860, y: 470, rot: 14 }),
    chip('greyed out?', { x: 1180, y: 104, tone: 'sun', size: 30, rot: 4, icon: ['search', 'line'] }),
  ].join(''),
  css: `
.pm__rib { display: block; filter: drop-shadow(0 30px 40px rgba(0,0,0,.45)); }
.pm__btn { box-sizing: border-box; height: 100%; display: grid; place-items: center; border-radius: 28px; background: #F3F1EC; border: 2px solid rgba(17,19,24,.06); }
.pm__sep { display: block; width: 3px; height: 100%; border-radius: 3px; background: rgba(17,19,24,.1); }
.pm__piece { position: relative; width: 300px; height: 300px; filter: drop-shadow(0 34px 34px rgba(0,0,0,.45)); }
.pm__piece svg { display: block; overflow: visible; }
.pm__pi { position: absolute; left: 40px; top: 60px; width: 220px; height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
.pm__pi b { font: 800 38px/1 var(--font-display); color: #fff; letter-spacing: -.02em; }
`,
}
