import { at, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// Treatment: moving day. A room full of cardboard boxes (softly blurred) behind one big open box drawn in SVG, packed
// with icon tiles in many with icons styles, one more tile being lifted in. A struck-out "font.woff" tag on the left
// is left behind; the box carries cyan tape and a shipping label reading SVG. Blueprint cyan (code) accent.
const B = C.blueprint
const KR = '#C9935C', KR2 = '#B07A45', KR3 = '#8A5A2E'
// box geometry (stage px)
const L = 760, R = 1360, TOP = 560, BOT = 880, BL = 800, BR = 1320, BACK = 468
const PACKED = [['home', 'solid', 850, 520, -8], ['heart', 'kawaii', 1000, 500, 5], ['star', 'soft3d', 1150, 515, -4], ['bell', 'glass', 1275, 530, 8]]

function boxBack() {
  return `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none">
    <path d="M${BL} ${BACK} L${BR} ${BACK} L${BR - 30} ${BACK - 120} L${BL + 30} ${BACK - 120} Z" fill="${KR2}"/>
    <path d="M${BL} ${BACK} L${BR} ${BACK} L${R} ${TOP} L${L} ${TOP} Z" fill="${KR3}"/>
  </svg>`
}
function boxFront() {
  return `<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none">
    <defs><linearGradient id="kr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${KR}"/><stop offset="1" stop-color="${KR2}"/></linearGradient></defs>
    <path d="M${L} ${TOP} L${BL} ${BACK} L${BL - 150} ${BACK - 50} L${L - 150} ${TOP - 30} Z" fill="${KR2}"/>
    <path d="M${BR} ${BACK} L${R} ${TOP} L${R + 70} ${TOP - 40} L${BR + 70} ${BACK - 90} Z" fill="#BD8650"/>
    <rect x="${L}" y="${TOP}" width="${R - L}" height="${BOT - TOP}" fill="url(#kr)"/>
    <path d="M${L} ${TOP}H${R}" stroke="${KR3}" stroke-width="4"/>
    <rect x="${(L + R) / 2 - 46}" y="${TOP}" width="92" height="${BOT - TOP}" fill="${B.c}" opacity=".92"/>
    <path d="M${(L + R) / 2 - 46} ${TOP + 2}h92" stroke="#fff" stroke-opacity=".35" stroke-width="4"/>
  </svg>`
}

export default {
  photoFile: 'migrate-icon-font-to-svg-boxes.jpg',
  credit: { by: 'SHVETS production', profile: 'https://www.pexels.com/@shvets-production/', source: 'https://www.pexels.com/photo/pile-of-cardboard-boxes-scattered-on-floor-during-relocation-7203788/', license: 'Pexels License' },
  alt: 'A bright room full of moving boxes behind one big open cardboard box with cyan tape and an SVG shipping label, packed with home, heart, star and bell icon tiles while a rocket tile is lowered in, and a struck-out font.woff tag left behind',
  photo: { filter: 'blur(5px) saturate(.85) brightness(.92)', pos: '50% 55%', scale: 1.04 },
  overlay: `linear-gradient(180deg, ${rgba('#F4EEE6', 0.25)} 0%, ${rgba('#3A2A1C', 0.28)} 100%)`,
  art: () => [
    at(boxBack(), { x: 0, y: 0, z: 1 }),
    ...PACKED.map(([n, s, cx, cy, r]) => at(`<span class="mv__tile">${icon(n, s, 100, s === 'solid' ? C.solid.c : undefined)}</span>`, { cx, cy, rot: r, z: 2 })),
    at(boxFront(), { x: 0, y: 0, z: 3, cls: 'mv__front' }),
    at(`<div class="mv__label"><small>to</small><b>SVG</b></div>`, { x: 850, y: 650, rot: -2, z: 4 }),
    at(`<span class="mv__tile is-lift">${icon('rocket', 'clay', 110)}</span>`, { cx: 1060, cy: 250, rot: 10, z: 5 }),
    at(`<svg width="120" height="150" viewBox="0 0 120 150" fill="none"><path d="M60 140 V20 M24 52 L60 14 L96 52" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>`, { cx: 1215, cy: 300, z: 5, rot: 160, cls: 'mv__up' }),
    at(`<span class="mv__old">${icon('type', 'line', 44, '#8A8F9C')}<s>font.woff</s></span>`, { x: 230, y: 230, rot: -6, z: 4 }),
  ].join(''),
  css: `
.mv__front svg, .hk-at > svg { display: block; overflow: visible; }
.mv__front { filter: drop-shadow(0 40px 50px rgba(40,25,10,.45)); }
.mv__tile { display: grid; place-items: center; width: 168px; height: 168px; border-radius: 46px; background: #fff; box-shadow: 0 2px 0 rgba(17,19,24,.05), 0 30px 50px -22px rgba(17,19,24,.6); }
.mv__tile.is-lift { width: 190px; height: 190px; border-radius: 52px; box-shadow: 0 0 0 8px ${rgba(B.c, 0.25)}, 0 60px 80px -30px rgba(17,19,24,.6); }
.mv__up { filter: drop-shadow(0 6px 10px rgba(0,0,0,.35)); }
.mv__label { display: flex; flex-direction: column; gap: 6px; width: 220px; padding: 22px 26px 28px; border-radius: 18px; background: #fff; color: ${INK}; box-shadow: 0 20px 40px -20px rgba(40,25,10,.6); font-family: var(--font-display); }
.mv__label small { font: 700 34px/1 var(--font-hand); color: #7A6A5A; }
.mv__label b { font: 800 92px/.9 var(--font-display); letter-spacing: -.04em; color: ${B.text}; }
.mv__label span { display: flex; align-items: center; gap: 8px; font: 600 22px/1.1 var(--font-display); color: #4A505C; margin-top: 6px; }
.mv__old { display: inline-flex; align-items: center; gap: 14px; padding: 18px 30px 18px 22px; border-radius: 22px; background: rgba(255,255,255,.88); border: 3px dashed #A7ABB5; box-shadow: 0 24px 40px -22px rgba(17,19,24,.5); }
.mv__old s { font: 700 40px/1 var(--font-mono); color: #6B707C; letter-spacing: -.03em; text-decoration-thickness: 5px; text-decoration-color: ${C.solid.c}; }
`,
}
