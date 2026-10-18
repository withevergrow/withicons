// forge/hand/christmas/clipboard.mjs — a pine board holding a cream sheet of ruled lines, with a gold metal clip clamped
// across the top (slot cut in it) and a little snow on the clip, so it reads as a clipboard and not a gift or a box.
// Roles: board c2, paper c4, clip c3, lines + slot ink, snow shine->tint, sparkle accent. Motion: clip wm-a (nods about 12,4.5).
import { C, num } from '../../styles/_christmas-core.mjs'

const NAME = 'clipboard'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const P = (a, b) => `${num(a)} ${num(b)}`
const poly = pts => 'M' + pts.map(([x, y]) => P(x, y)).join('L') + 'Z'
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }
// a snow cap resting on a flat top: thick in the middle, thinning to nothing at the ends, one soft drip
function snow(xa, xb, y, { up = 1, dn = 0.7, drip = null } = {}) {
  const n = 24, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = xa + (xb - xa) * t, e = Math.pow(Math.sin(Math.PI * t), 0.45)
    let d = dn * e * (1 + 0.14 * Math.sin(x * 2.3))
    if (drip) { const u = (x - drip[0]) / drip[1]; if (Math.abs(u) < 1) d = Math.max(d, (dn + drip[2] * Math.sqrt(1 - u * u)) * e) }
    U.push([x, y - up * e]); L.push([x, y + d])
  }
  return [...U, ...L.reverse().slice(1, -1)]
}

const BOARD = rr(4.5, 4.5, 19.5, 21.5, 2.2)
const PAPER = rr(6.5, 7, 17.5, 19.5, 1)
const CLIP = 'M8.4 7V4.1A1.7 1.7 0 0 1 10.1 2.4H13.9A1.7 1.7 0 0 1 15.6 4.1V7Z'
const SLOT = rr(10.6, 4.4, 13.4, 5.5, 0.55)

export default function render() {
  const cap = snow(9.1, 14.9, 2.4, { up: 1, dn: 0.75, drip: [13.7, 0.5, 0.5] })
  const lines = { fill: 'none', stroke: C.ink, 'stroke-width': 1, 'stroke-linecap': 'round', 'stroke-opacity': 0.55 }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4.5, y1: 2.4, x2: 13, y2: 21.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.2, x2: 0, y2: 3.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: BOARD, fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: PAPER, fill: C.c4, ...INK, 'stroke-width': 0.45, class: 'wm-k' }],
    ['path', { d: 'M8.9 11.2H15.1M8.9 14.1H15.1M8.9 17H12.7', ...lines, class: 'wm-k' }],
    ['path', { d: BOARD, fill: url(0), class: 'wm-shine' }],
    // the clip
    ['path', { d: CLIP, fill: C.c3, ...INK, class: 'wm-a' }],
    ['path', { d: SLOT, fill: C.ink, class: 'wm-a' }],
    ['path', { d: CLIP, fill: url(0), class: 'wm-shine' }],
    ['path', { d: poly(cap.map(([x, y]) => [x, y + 0.36])), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: sparkle(20.6, 3.9, 1.5), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
