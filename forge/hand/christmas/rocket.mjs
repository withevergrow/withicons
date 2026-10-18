// forge/hand/christmas/rocket.mjs — a cranberry rocket with a snow-cream nose cone, a gold porthole, pine fins and a
// gold-and-cream flame, with a little snow on its upper flank. The generated drawing painted the whole hull cream with
// thin red fins, so on a cream page it read as a white blob; the hull is now a strong coloured silhouette.
import { C, loopsD, num } from '../../styles/_christmas-core.mjs'

const N = 'rocket'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const sparkle = (x, y, r) => { const q = r * 0.22, P = (a, b) => `${num(a)} ${num(b)}`; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }

function snowCap(top, xa, xb, { up = 1.3, dn = 0.85, drips = [], ph = 0.7, ph2 = 2.1, taper = 1.2 } = {}) {
  const U = [], D = []
  for (let x = xa; x <= xb + 1e-6; x += 0.25) {
    const s = Math.abs(top(x + 0.4) - top(x - 0.4)) / 0.8
    const e = Math.max(0, Math.min(1, (x - xa) / taper, (xb - x) / taper))
    const q = Math.sqrt(Math.max(0, Math.min(1, 1 - (s - 0.5) / 1.1)) * e * e * (3 - 2 * e))
    let d = dn * q * (1 + 0.18 * Math.sin(x * 2.1 + ph2))
    for (const p of drips) { const u = (x - p.x) / p.w; if (Math.abs(u) < 1) d = Math.max(d, dn * q + p.l * q * Math.sqrt(1 - u * u)) }
    U.push([x, top(x) - up * q * (1 + 0.1 * Math.sin(x * 1.4 + ph))]); D.push([x, top(x) + d])
  }
  return {
    cap: loopsD([[...U, ...D.slice().reverse()]]),
    shadow: loopsD([[...U.map(([x]) => [x, top(x) + 0.05]), ...D.map(([x, y]) => [x, y + 0.42]).reverse()]]),
  }
}

// hull: two arcs meeting at the tip (21,3), straight flanks parallel to the 45-degree axis, flat tail
const RA = 11.01
const CA = [18.78, 13.78] // centre of the upper-left arc (11,6)->(21,3)
const CB = [10.22, 5.22]  // centre of the lower-right arc (21,3)->(18,13), its mirror across x + y = 24
function arcPts(c, a, b, n = 18) {
  let t0 = Math.atan2(a[1] - c[1], a[0] - c[0]), t1 = Math.atan2(b[1] - c[1], b[0] - c[0])
  if (t1 < t0) t1 += 2 * Math.PI
  if (t1 - t0 > Math.PI) t1 -= 2 * Math.PI
  const P = []
  for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; P.push([c[0] + RA * Math.cos(t), c[1] + RA * Math.sin(t)]) }
  return P
}
const HULL = [[8.5, 10], ...arcPts(CA, [11, 6], [21, 3]), ...arcPts(CB, [21, 3], [18, 13]).slice(1), [14, 15.5]]
// the nose cone: the part of the hull beyond the seam x - y = K
const K = 11.5
function clip(poly, f) {
  const out = []
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b)
    if (fa >= 0) out.push(a)
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]) }
  }
  return out
}
const NOSE = clip(HULL, p => p[0] - p[1] - K)
const seamEnds = NOSE.filter(p => Math.abs(p[0] - p[1] - K) < 1e-6)

const FIN_L = 'M12 6.25Q6.25 6 2.25 11.25Q5.5 10.25 8.25 9.75Z'
const FIN_R = 'M17.75 12Q18 17.75 12.75 21.75Q13.75 18.5 14.25 15.75Z'
const FLAME = 'M8 11.5C5 13.5 4 17 3.5 20.5C7 20 10.5 19 12.5 16Z'
const CORE = 'M9.25 13.25C7.25 14.75 6.25 16.75 6 18C7.25 17.75 9.25 16.75 10.75 14.75Z'
const WX = 14.75, WY = 9.25
const flank = x => CA[1] - Math.sqrt(Math.max(0, RA * RA - (x - CA[0]) ** 2))

export default function render() {
  const hull = loopsD([HULL]), nose = loopsD([NOSE])
  const snow = snowCap(flank, 11.6, 14.6, { up: 1.05, dn: 0.7, drips: [{ x: 12.6, w: 0.55, l: 0.4 }], taper: 0.9 })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2.25, y1: 3, x2: 12.5, y2: 21.75, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.6, x2: 0, y2: 6.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 13, y1: 7.5, x2: 16.5, y2: 11, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shine, 0.9), st(0.5, C.tint, 0.3), st(1, C.tint, 1)]],
      ['linearGradient', { id: id(3), x1: 17, y1: 3, x2: 21, y2: 9, gradientUnits: 'userSpaceOnUse' }, [st(0.3, C.tint, 0), st(1, C.tint, 0.8)]],
    ]],
    // the flame out of the tail
    ['path', { d: FLAME, fill: C.c3, ...INK, class: 'wm-a' }],
    ['path', { d: CORE, fill: C.c4, class: 'wm-a' }],
    // fins behind the hull
    ['path', { d: FIN_L + FIN_R, fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: FIN_L + FIN_R, fill: url(0), class: 'wm-shine' }],
    // the hull and its cream nose cone
    ['path', { d: hull, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: nose, fill: C.c4, class: 'wm-k' }],
    ['path', { d: nose, fill: url(3), class: 'wm-shine' }],
    ['path', { d: hull, fill: url(0), class: 'wm-shine' }],
    ['path', { d: hull, ...INK, class: 'wm-k' }],
    ['path', { d: `M${num(seamEnds[0][0])} ${num(seamEnds[0][1])}L${num(seamEnds[1][0])} ${num(seamEnds[1][1])}`, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-k' }],
    // the porthole: gold rim, frosty glass
    ['path', { d: discD(WX, WY, 2.3), fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: discD(WX, WY, 1.4), fill: C.c4, stroke: C.ink, 'stroke-width': 0.5, class: 'wm-k' }],
    ['path', { d: discD(WX, WY, 1.4), fill: url(2), class: 'wm-shine' }],
    // snow on the upper flank
    ['path', { d: snow.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: sparkle(4.5, 3.75, 1.4), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
