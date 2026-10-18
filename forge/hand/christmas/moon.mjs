// forge/hand/christmas/moon.mjs — the common crescent (a full disc bitten by a smaller one, opening to the upper right) in
// warm gold with the deep ink outline and upper-left light of its siblings; a soft snow cap rests along the outer rim below
// the upper horn with two drips, and a small gold star sits in the bite. Roles: moon c3, snow shine->tint, star accent.
import { C, num } from '../../styles/_christmas-core.mjs'

const NAME = 'moon'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (a, b) => `${num(a)} ${num(b)}`
const poly = pts => 'M' + pts.map(([x, y]) => P(x, y)).join('L') + 'Z'
const MOON = 'M21 13A9 9 0 1 1 11 3A7.1 7.1 0 0 0 21 13Z'

// the rim circle (centre of the 9u arc through (21,13) and (11,3))
const CX = 12, CY = 12, R = Math.hypot(21 - CX, 13 - CY)
const rim = (a, r) => [CX + r * Math.cos(a), CY + r * Math.sin(a)]

function cap(a0, a1, up, dn, drips) {
  const n = 40, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = a0 + (a1 - a0) * t, e = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 0.5) * (t > 0.87 ? Math.sin((1 - t) / 0.13 * Math.PI / 2) : 1)
    let d = dn * e
    for (const [c, w, l] of drips) { const u = (t - c) / w; if (Math.abs(u) < 1) d = Math.max(d, (dn + l * Math.sqrt(1 - u * u)) * e) }
    U.push(rim(a, R + up * e)); L.push(rim(a, R - Math.min(d, 2.4)))
  }
  return [...U, ...L.reverse().slice(1, -1)]
}
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }
const star = (x, y, r) => {
  const pts = []
  for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.46 : r; pts.push([x + rr * Math.cos(a), y + rr * Math.sin(a)]) }
  return poly(pts)
}

export default function render() {
  const a0 = -Math.PI / 2 - 0.12, a1 = a0 - 1.12
  const snow = cap(a0, a1, 0.9, 0.7, [[0.4, 0.09, 0.8], [0.74, 0.08, 0.55]])
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 18, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2, x2: 0, y2: 8, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ['path', { d: MOON, fill: C.c3, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: MOON, fill: url(0), class: 'wm-shine' }],
    ['path', { d: poly(snow.map(([x, y]) => [x, y + 0.38])), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(snow), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: star(16.9, 8.2, 2.5), fill: C.accent, stroke: C.ink, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: sparkle(21, 3.4, 1.1), fill: C.accent, stroke: C.ink, 'stroke-width': 0.25, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
