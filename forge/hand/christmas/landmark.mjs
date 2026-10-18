// forge/hand/christmas/landmark.mjs — one clear bank: a cranberry pediment with a gold emblem and a thin snow line on its
// slopes, an entablature, four even cream marble columns in a deep portico and a solid plinth; the generated drawing buried the pediment
// in a snow mound and striped the columns like candy canes, so it read as a cake or a fence.
import { C, loopsD, num } from '../../styles/_christmas-core.mjs'

const N = 'landmark'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

// a snow cap resting on the surface y = top(x): thick on flats, thinning on steep sides and at the ends
function snowCap(top, xa, xb, { up = 1.3, dn = 0.85, ph = 0.7, ph2 = 2.1, taper = 1.2 } = {}) {
  const U = [], D = []
  for (let x = xa; x <= xb + 1e-6; x += 0.25) {
    const s = Math.abs(top(x + 0.4) - top(x - 0.4)) / 0.8
    const e = Math.max(0, Math.min(1, (x - xa) / taper, (xb - x) / taper))
    const q = Math.sqrt(Math.max(0, Math.min(1, 1 - (s - 0.5) / 1.1)) * e * e * (3 - 2 * e))
    U.push([x, top(x) - up * q * (1 + 0.1 * Math.sin(x * 1.4 + ph))]); D.push([x, top(x) + dn * q * (1 + 0.18 * Math.sin(x * 2.1 + ph2))])
  }
  return {
    cap: loopsD([[...U, ...D.slice().reverse()]]),
    shadow: loopsD([[...U.map(([x]) => [x, top(x) + 0.05]), ...D.map(([x, y]) => [x, y + 0.38]).reverse()]]),
  }
}
// the style's gold four-point sparkle
function sparkleD(x, y, r) {
  const q = r * 0.22, n = num
  return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}` +
    `Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}z`
}

const PEDIMENT = 'M12 3L21.5 8.5H2.5Z'
const BEAM = 'M3.5 8.5H20.5V10.75H3.5Z'
const COLUMNS = [6, 10, 14, 18].map(c => `M${c - 1} 10.5H${c + 1}V17.75H${c - 1}Z`).join('')
const PLINTH = 'M3.5 17.5H20.5A1 1 0 0 1 21.5 18.5V20A1 1 0 0 1 20.5 21H3.5A1 1 0 0 1 2.5 20V18.5A1 1 0 0 1 3.5 17.5Z'
const slope = 5.5 / 9.5

export default function render() {
  const snow = snowCap(x => 3 + Math.abs(x - 12) * slope, 3.4, 20.6, { up: 0.95, dn: 0.55, taper: 1.6 })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2.5, y1: 3, x2: 12.95, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2, x2: 0, y2: 8, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 2.5, y1: 3, x2: 12.95, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0.3, C.tint, 0), st(1, C.tint, 0.75)]],
    ]],
    // the deep portico behind the colonnade, so the cream columns stand out on any background
    ['path', { d: 'M6 10.5H18V17.75H6Z', fill: C.shadow, class: 'wm-k' }],
    // four even marble columns (behind the beam and the plinth, so their ends tuck in cleanly)
    ['path', { d: COLUMNS, fill: C.c4, ...INK, class: 'wm-a' }],
    ['path', { d: COLUMNS, fill: url(2), class: 'wm-shine' }],
    // the plinth, the entablature and the pediment
    ['path', { d: PLINTH, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: BEAM, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: PEDIMENT, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: discD(12, 6.6, 1), fill: C.c3, stroke: C.ink, 'stroke-width': 0.4, class: 'wm-k' }],
    // the shared light over the cranberry stone
    ['path', { d: PEDIMENT + BEAM + PLINTH, fill: url(0), class: 'wm-shine' }],
    // a thin snow line on the pediment's slopes only
    ['path', { d: snow.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: sparkleD(19.75, 3.75, 1.4), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
