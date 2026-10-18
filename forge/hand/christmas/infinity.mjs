// forge/hand/christmas/infinity.mjs — one smooth cranberry tube drawn as a single figure-eight, its crossing merged so
// it reads as the infinity sign, with a thin snow cap on each loop and a star in the corner. Replaces the generated drawing,
// where outlined ribbon ends at the crossing, a holly sprig on the centre and heavy snow made it read as a tied knot.
// Roles: tube c1, outline ink, snow shine->tint, star accent. Motion: the whole loop breathes (wm-k).
import { C, num } from '../../styles/_christmas-core.mjs'

const NAME = 'infinity'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const poly = P => 'M' + P.map(([x, y]) => `${num(x)} ${num(y)}`).join('L') + 'Z'
function snow(xa, xb, top, { up = 1.3, dn = 0.85, drips = [], ph = 0, maxDn = 9 } = {}) {
  const n = 28, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = xa + (xb - xa) * t, e = Math.pow(Math.sin(Math.PI * t), 0.45)
    let d = dn * e * (1 + 0.16 * Math.sin(x * 2.1 + ph))
    for (const [cx, w, l] of drips) { const u = (x - cx) / w; if (Math.abs(u) < 1) d = Math.max(d, (dn + l * Math.sqrt(1 - u * u)) * e) }
    U.push([x, top(x) - up * e * (1 + 0.08 * Math.sin(x * 1.4 + ph))]); L.push([x, top(x) + Math.min(d, maxDn)])
  }
  return [...U, ...L.reverse().slice(1, -1)]
}

const INK_W = 3.25, COL_W = 2.05, HALF = INK_W / 2
// loop arcs centred at x 7 / 17 with r 3.35: the ink edge sits at x 2.03 and 21.98, inside the [2, 22] live area
const LOOP = 'M12 12C14 9.6 15.3 8.65 17 8.65A3.35 3.35 0 0 1 17 15.35C15.3 15.35 14 14.4 12 12' +
  'C10 9.6 8.7 8.65 7 8.65A3.35 3.35 0 0 0 7 15.35C8.7 15.35 10 14.4 12 12Z'
const SPARK = 'M20.4 1.75Q20.75 2.9 21.85 3.25Q20.75 3.6 20.4 4.75Q20.05 3.6 18.95 3.25Q20.05 2.9 20.4 1.75Z'

// the upper edge of the right loop's outline: centre line sampled, then the offset envelope at the tube's half width
const bez = (p0, p1, p2, p3, t) => { const u = 1 - t; return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3 }
const SAMPLES = []
for (let i = 0; i <= 40; i++) { const t = i / 40; SAMPLES.push([bez(12, 14, 15.3, 17, t), bez(12, 9.6, 8.65, 8.65, t)]) }
for (let i = 1; i <= 30; i++) { const a = Math.PI / 2 - (i / 30) * (Math.PI / 2); SAMPLES.push([17 + 3.35 * Math.cos(a), 12 - 3.35 * Math.sin(a)]) }
const rightTop = x => {
  let y = 99
  for (const [sx, sy] of SAMPLES) { const dx = x - sx; if (Math.abs(dx) < HALF) y = Math.min(y, sy - Math.sqrt(HALF * HALF - dx * dx)) }
  return y
}
const leftTop = x => rightTop(24 - x)

export default function render() {
  const capR = snow(14.5, 19.9, rightTop, { up: 1.05, dn: 0.7, ph: 0.4, drips: [[17.3, 0.75, 0.4]], maxDn: 1.25 })
  const capL = snow(4.1, 9.5, leftTop, { up: 1.05, dn: 0.7, ph: 2.1, drips: [[6.7, 0.75, 0.4]], maxDn: 1.25 })
  const caps = poly(capL) + poly(capR)
  const line = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 5, x2: 13, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 5.8, x2: 0, y2: 8.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // one ink tube under one colour tube: the crossing merges into a clean X
    ['path', { d: LOOP, ...line, stroke: C.ink, 'stroke-width': INK_W, class: 'wm-k' }],
    ['path', { d: LOOP, ...line, stroke: C.c1, 'stroke-width': COL_W, class: 'wm-k' }],
    ['path', { d: LOOP, ...line, stroke: url(0), 'stroke-width': COL_W, class: 'wm-shine' }],
    // a highlight running along the top of each loop
    ['path', { d: 'M15.5 9.4C16 9.25 16.5 9.2 17 9.2M8.5 9.4C8 9.25 7.5 9.2 7 9.2', ...line, stroke: C.shine, 'stroke-width': 0.55, 'stroke-opacity': 0.6, class: 'wm-shine' }],
    // thin snow on the two loop tops
    ['path', { d: poly(capL.map(([x, y]) => [x, y + 0.4])) + poly(capR.map(([x, y]) => [x, y + 0.4])), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: caps, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: SPARK, fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
