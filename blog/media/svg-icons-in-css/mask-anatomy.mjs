import { at, icon, INK, rgba } from '../../tools/hero-kit.mjs'
import { BLUE, BTEXT, BG, CSS } from './_kit.mjs'

// An exploded isometric stack: the empty ::before box at the bottom, the same box filled with currentColor in the
// middle, the external-link SVG as a black stencil on top. Leader lines run to a label for each layer, and on the right
// the flat result: the icon after the words "Read the docs", in the link colour.
const SQ = 250 // layer size before the isometric turn (it projects to about 354 x 177)
const CX = 340
const L = [ // layer centre y, label lines
  [310, '<em>mask:</em> url(icon.svg)'],
  [510, '<em>background-color:</em><br>currentColor'],
  [710, '<em>::before</em>, 1em x 1em'],
]
const HALF = SQ * Math.SQRT1_2 // half the projected width
const LX = 640 // labels start

const layer = (cls, inner = '') => `<div class="iso ${cls}">${inner}</div>`

export default {
  alt: 'Exploded isometric diagram of a CSS mask icon: an empty ::before box at the bottom, the same box filled with currentColor in the middle and the with icons external-link icon as a black stencil on top, beside the result: Read the docs with the icon in the link colour',
  bg: BG,
  art: () => [
    // dashed drop lines joining the layers' corners
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" stroke="${rgba(INK, 0.25)}" stroke-width="3" stroke-dasharray="8 10">
      <path d="M${CX - HALF} ${L[0][0]} V${L[2][0]} M${CX + HALF} ${L[0][0]} V${L[2][0]} M${CX} ${L[0][0] + HALF / 2} V${L[2][0] + HALF / 2}"/>
    </svg>`, { x: 0, y: 0 }),
    at(layer('is-box'), { cx: CX, cy: L[2][0], z: 1 }),
    at(layer('is-fill'), { cx: CX, cy: L[1][0], z: 2 }),
    at(layer('is-stencil', `<div class="flat">${icon('external-link', 'line', Math.round(SQ * 0.74), INK)}</div>`), { cx: CX, cy: L[0][0], z: 3 }),
    // leader lines + labels
    at(`<svg width="1600" height="1000" viewBox="0 0 1600 1000" fill="none" stroke="${BLUE}" stroke-width="3">${L.map(([y]) => `<path d="M${CX + HALF + 14} ${y} H${LX - 18}"/><circle cx="${CX + HALF + 14}" cy="${y}" r="7" fill="${BLUE}"/>`).join('')}</svg>`, { x: 0, y: 0, z: 4 }),
    ...L.map(([y, t]) => at(`<span class="k-lbl">${t}</span>`, { x: LX, y: y - (t.includes('<br>') ? 39 : 20), z: 4 })),
    // the result
    at(`<span class="k-hand">the result</span>`, { x: 1110, y: 340 }),
    at(`<div class="k-card res"><a>Read the docs<span class="ext"></span></a></div>`, { x: 1080, y: 410, w: 456, h: 200 }),
  ].join(''),
  css: `${CSS}
.iso { width: ${SQ}px; height: ${SQ}px; box-sizing: border-box; border-radius: 40px; transform: rotateX(60deg) rotateZ(-45deg); }
.iso.is-box { border: 5px dashed ${rgba(INK, 0.45)}; background: ${rgba('#ffffff', 0.7)}; }
.iso.is-fill { background: ${BLUE}; box-shadow: 0 0 0 4px #fff; }
.iso.is-stencil { background: repeating-conic-gradient(${rgba(INK, 0.08)} 0 25%, ${rgba('#ffffff', 0.85)} 0 50%) 0 0 / 34px 34px; border: 3px solid ${rgba(INK, 0.2)}; }
.iso .flat { width: 100%; height: 100%; display: grid; place-items: center; }
.res { display: grid; place-items: center; }
.res a { display: inline-flex; align-items: baseline; gap: 10px; font: 600 50px/1 var(--font-display); color: ${BTEXT}; text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 8px; letter-spacing: -.02em; }
.res .ext { display: inline-block; width: .9em; height: .9em; vertical-align: -0.1em; background-color: currentColor; -webkit-mask: url("data:image/svg+xml,${encodeURIComponent(icon('external-link', 'line', 24).replace(/^<span[^>]*>|<\/span>$/g, ''))}") center / contain no-repeat; mask: url("data:image/svg+xml,${encodeURIComponent(icon('external-link', 'line', 24).replace(/^<span[^>]*>|<\/span>$/g, ''))}") center / contain no-repeat; }
`,
}
