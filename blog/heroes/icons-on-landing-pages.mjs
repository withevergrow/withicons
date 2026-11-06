import { at, icon, C, INK, rgba } from '../tools/hero-kit.mjs'

// A landing page sketched in ink on the right page of an open notebook: nav, headline, button and a row of three
// sketch-style icons, with orange handwritten notes and arrows from the left page. Coded SVG strokes, drawn twice
// with a small offset so they read as pen lines.
const O = C.solid
const ink = 'stroke="#1E2230" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"'
const box = (x, y, w, h, r = 14) => [[0, 0], [1.8, -1.2]].map(([dx, dy], i) =>
  `<rect x="${x + dx}" y="${y + dy}" width="${w}" height="${h}" rx="${r}" ${ink} opacity="${i ? 0.45 : 1}"/>`).join('')
const line = (x, y, w, sw = 4) => `<path d="M${x} ${y} q ${w / 2} ${-3} ${w} ${1}" ${ink} stroke-width="${sw}"/>`
const scrib = (x, y, w) => `<path d="M${x} ${y} ${Array.from({ length: Math.floor(w / 24) }, (_, i) => `l 12 ${i % 2 ? 9 : -9} l 12 ${i % 2 ? -9 : 9}`).join(' ')}" ${ink} stroke-width="5"/>`
const FX = 830, FY = 150, FW = 500, FH = 680
const FEAT = ['zap', 'shield-check', 'heart']

const wire = `<svg width="1600" height="1000" viewBox="0 0 1600 1000">
  ${box(FX, FY, FW, FH, 22)}
  ${line(FX, FY + 64, FW, 3)}
  <circle cx="${FX + 42}" cy="${FY + 32}" r="14" ${ink}/>
  ${line(FX + 250, FY + 34, 44, 3)}${line(FX + 310, FY + 34, 44, 3)}${line(FX + 370, FY + 34, 44, 3)}
  ${scrib(FX + 60, FY + 130, 380)}
  ${scrib(FX + 110, FY + 178, 280)}
  ${line(FX + 120, FY + 230, 260, 3)}
  ${box(FX + 170, FY + 264, 160, 56, 28)}
  <path d="M${FX + 186} ${FY + 304} l 128 -32 M${FX + 186} ${FY + 288} l 100 -24 M${FX + 214} ${FY + 312} l 100 -26" stroke="${O.c}" stroke-width="5" stroke-linecap="round" opacity=".85"/>
  ${FEAT.map((_, i) => `${line(FX + 46 + i * 152, FY + 520, 104, 3)}${line(FX + 60 + i * 152, FY + 548, 76, 3)}`).join('')}
  ${line(FX + 40, FY + 610, FW - 80, 3)}
</svg>`
const arrow = (d, head) => `<path d="${d}" stroke="${O.c}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="${head}" stroke="${O.c}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`

export default {
  base: 'sketch0',
  alt: 'An open notebook on a wooden desk with a landing page sketched in ink on the right page, three sketch-style with icons in a row and orange handwritten notes',
  photo: { filter: 'saturate(.9) brightness(1.02)', pos: '50% 50%' },
  overlay: `linear-gradient(90deg, ${rgba('#2B1A10', 0.12)} 0%, transparent 40%, transparent 100%)`,
  art: () => [
    at(wire, { x: 0, y: 0 }),
    ...FEAT.map((n, i) => at(icon(n, 'sketch', 92, INK), { x: FX + 52 + i * 152, y: FY + 390 })),
    at(`<span class="note">one style</span>`, { x: 250, y: 500, rot: -6 }),
    at(`<span class="note">say what it does</span>`, { x: 300, y: 200, rot: -4 }),
    at(`<span class="note">one action</span>`, { x: 440, y: 380, rot: 3 }),
    at(`<svg width="1600" height="1000">
      ${arrow('M530 545 C 640 575, 760 570, 860 555', 'M836 541 L 864 555 L 840 574')}
      ${arrow('M700 230 C 760 230, 790 270, 850 280', 'M826 266 L 852 281 L 828 296')}
      ${arrow('M690 410 C 780 430, 920 470, 990 440', 'M966 430 L 994 438 L 976 462')}
    </svg>`, { x: 0, y: 0, z: 3 }),
  ].join(''),
  css: `
.note { font: 700 58px/1 var(--font-hand); color: ${O.text}; white-space: nowrap; }
`,
}
