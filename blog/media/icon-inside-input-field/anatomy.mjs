import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BLUE, CYAN, BG, CSS } from './_kit.mjs'

// One search field pulled apart into three tilted layers on a blueprint sheet. Bottom: the wrapper (dashed), which
// holds the position. Middle: the input, with its start padding hatched in cyan. Top: the search icon alone, which
// lets clicks through: a cursor arrow and a dotted path drop straight through it to the input. Leader lines name
// each layer with the one CSS rule that matters.
const W = 620, H = 130 // a layer before the tilt
const CX = 450
const L = [ // layer centre y, label
  [290, '<em>position:</em> absolute<br>+ <em>pointer-events:</em> none'],
  [500, '<em>padding-inline-start:</em> 40px'],
  [710, '.field { <em>position:</em> relative }'],
]
const LX = 830
const TILT = 'rotateX(50deg) rotateZ(-9deg)'

const layer = (cls, inner = '') => `<div class="ly ${cls}">${inner}</div>`

export default {
  alt: 'Blueprint diagram of a search field pulled apart into three tilted layers: the dashed wrapper with position relative at the bottom, the input with a hatched start padding in the middle, and the with icons search icon on top with pointer-events none, a cursor arrow passing straight through it to the input',
  bg: BG,
  art: () => [
    // corner drop lines
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" stroke="${rgba(CYAN, 0.35)}" stroke-width="2.5" stroke-dasharray="7 9">
      <path d="M${CX - 300} ${L[0][0] + 22} V${L[2][0] + 22} M${CX + 300} ${L[0][0] - 22} V${L[2][0] - 22}"/>
    </svg>`, { x: 0, y: 0 }),
    at(layer('is-wrap'), { cx: CX, cy: L[2][0], z: 1 }),
    at(layer('is-input', `<div class="padz"></div><span class="ph">Search icons</span>`), { cx: CX, cy: L[1][0], z: 2 }),
    at(layer('is-icon'), { cx: CX, cy: L[0][0], z: 3 }),
    // the icon itself, drawn upright over the start of its plane
    at(`<span class="ic">${icon('search', 'line', 96, '#fff')}</span>`, { cx: 214, cy: 300, z: 4 }),
    // the click falling through the icon to the input
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none"><path d="M236 222 V 500" stroke="#fff" stroke-width="4" stroke-dasharray="3 12" stroke-linecap="round"/><circle cx="236" cy="516" r="12" fill="#00728A" stroke="#fff" stroke-width="4"/><circle cx="236" cy="516" r="28" fill="none" stroke="#00728A" stroke-width="4"/></svg>`, { x: 0, y: 0, z: 4 }),
    at(`<span class="ptr">${icon('cursor', 'solid', 64, '#fff')}</span>`, { x: 222, y: 150, z: 5 }),
    // leader lines + labels
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" stroke="${CYAN}" stroke-width="3">${L.map(([y]) => `<path d="M${CX + 330} ${y} H${LX - 16}"/><circle cx="${CX + 330}" cy="${y}" r="7" fill="${CYAN}"/>`).join('')}</svg>`, { x: 0, y: 0, z: 4 }),
    ...L.map(([y, t]) => at(`<span class="k-lbl">${t}</span>`, { x: LX, y: y - (t.includes('<br>') ? 37 : 18), z: 4 })),
  ].join(''),
  css: `${CSS}
.ly { box-sizing: border-box; width: ${W}px; height: ${H}px; border-radius: ${H / 2}px; transform: ${TILT}; position: relative; display: flex; align-items: center; }
.ly.is-wrap { width: ${W + 50}px; height: ${H + 50}px; border-radius: ${(H + 50) / 2}px; border: 4px dashed ${rgba('#ffffff', 0.7)}; background: ${rgba('#ffffff', 0.05)}; }
.ly.is-input { background: #fff; overflow: hidden; box-shadow: 0 0 0 4px ${BLUE}; }
.padz { flex: none; width: 140px; height: 100%; background: repeating-linear-gradient(-45deg, ${rgba(BLUE, 0.35)} 0 10px, ${rgba(BLUE, 0.12)} 10px 20px); border-right: 3px solid ${BLUE}; }
.ph { margin-left: 22px; font: 600 48px/1 var(--font-display); color: #8A909C; letter-spacing: -.02em; white-space: nowrap; }
.ly.is-icon { border: 2px solid ${rgba(CYAN, 0.45)}; background: ${rgba(CYAN, 0.06)}; }
.ic { display: block; line-height: 0; filter: drop-shadow(0 10px 18px rgba(0,0,0,.45)); }
.ptr { display: block; line-height: 0; filter: drop-shadow(0 0 2px ${INK}) drop-shadow(0 8px 14px rgba(0,0,0,.5)); }
`,
}
