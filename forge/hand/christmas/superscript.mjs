// forge/hand/christmas/superscript.mjs — a bold cranberry X and a gold superscript 2 wearing a slim snow cap, both with
// the style's deep ink rim, replacing the generated pale cream glyphs that faded into light backgrounds and lost the 2
// at 16px.
import { C, loopsD, num } from '../../styles/_christmas-core.mjs'

const N = 'superscript'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

const X = 'M4 9.25L12 19.75M12 9.25L4 19.75'
const TWO = 'M16.5 5.75A2.25 2.25 0 0 1 21 5.75C21 7.25 19.75 8.25 16.5 11H21'

// the style's gold four-point sparkle
function sparkleD(x, y, r) {
  const q = r * 0.22, n = num
  return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}` +
    `Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}z`
}

// a slim snow cap riding the top of the 2's bowl: a polar band on the rim (radius R), thickest at the crown,
// tapering to nothing at both ends, with a soft wobble on its lower edge
function bowlSnow(cx, cy, R, a0, a1, up, dn) {
  const U = [], D = [], S = []
  const n = 22
  for (let k = 0; k <= n; k++) {
    const t = k / n, a = a0 + (a1 - a0) * t
    const e = Math.min(1, t / 0.3, (1 - t) / 0.3), q = Math.sqrt(e * e * (3 - 2 * e))
    const ca = Math.cos(a), sa = Math.sin(a)
    const ru = R + up * q * (1 + 0.08 * Math.sin(t * 9)), rd = R - dn * q * (1 + 0.22 * Math.sin(t * 14 + 1))
    U.push([cx + ca * ru, cy + sa * ru]); D.push([cx + ca * rd, cy + sa * rd]); S.push([cx + ca * rd, cy + sa * rd + 0.4])
  }
  return {
    cap: loopsD([[...U, ...D.slice().reverse()]]),
    shadow: loopsD([[...U.map(([x, y]) => [x, y + 0.05]), ...S.slice().reverse()]]),
  }
}

export default function render() {
  const snow = bowlSnow(18.75, 5.75, 3.55, Math.PI * 1.13, Math.PI * 1.87, 0.95, 0.75)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2.5, y1: 8, x2: 12, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.38), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 15, y1: 2, x2: 21, y2: 12.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.38), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(2), x1: 0, y1: 1.2, x2: 0, y2: 4.6, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // the base letter X
    ['path', { d: X, stroke: C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: X, stroke: C.c1, 'stroke-width': 2.3, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: X, stroke: url(0), 'stroke-width': 2.3, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // the raised 2
    ['path', { d: TWO, stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: TWO, stroke: C.c3, 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: TWO, stroke: url(1), 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a wm-shine' }],
    ['path', { d: snow.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-a' }],
    ['path', { d: snow.cap, fill: url(2), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: sparkleD(4.75, 4.5, 1.35), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
