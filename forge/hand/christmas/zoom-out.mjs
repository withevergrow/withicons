// forge/hand/christmas/zoom-out.mjs — a magnifier: pine-green rim round a frosted glass lens with a fat cranberry minus,
// a candy-cane handle and a snow cap on the rim. Replaces the generated drawing, where the lens was a solid green disc
// with a thin slot for a minus and a holly sprig crowded its top.
// Roles: rim c2, glass tint/shine, minus c1, handle c4 with c1 stripes, outline ink. Motion: minus + handle wm-a.
import { C, num } from '../../styles/_christmas-core.mjs'

const NAME = 'zoom-out'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const poly = P => 'M' + P.map(([x, y]) => `${num(x)} ${num(y)}`).join('L') + 'Z'
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
function snow(xa, xb, top, { up = 1.3, dn = 0.85, drips = [], ph = 0, maxDn = 9 } = {}) {
  const n = 32, U = [], L = []
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = xa + (xb - xa) * t, e = Math.pow(Math.sin(Math.PI * t), 0.45)
    let d = dn * e * (1 + 0.16 * Math.sin(x * 2.1 + ph))
    for (const [cx, w, l] of drips) { const u = (x - cx) / w; if (Math.abs(u) < 1) d = Math.max(d, (dn + l * Math.sqrt(1 - u * u)) * e) }
    U.push([x, top(x) - up * e * (1 + 0.08 * Math.sin(x * 1.4 + ph))]); L.push([x, top(x) + Math.min(d, maxDn)])
  }
  return [...U, ...L.reverse().slice(1, -1)]
}

const CX = 10.5, CY = 10.5, RO = 7.25, RI = 5.1
// the handle: a capsule along the diagonal from the rim to (20.4, 20.4)
const A0 = 14.6, A1 = 20.4, HW = 1.65
// the point on the diagonal x = y = s, moved v across it
const P = (s, v) => { const k = 0.7071; return [s + v * k, s - v * k] }
function handle() {
  const a = P(A0, HW), b = P(A1, HW), c = P(A1, -HW), d = P(A0, -HW)
  return `M${num(a[0])} ${num(a[1])}L${num(b[0])} ${num(b[1])}A${HW} ${HW} 0 0 1 ${num(c[0])} ${num(c[1])}L${num(d[0])} ${num(d[1])}A${HW} ${HW} 0 0 1 ${num(a[0])} ${num(a[1])}Z`
}
function stripes() {
  const out = [], w = 0.62, k = 0.55
  for (const s of [16.3, 17.95, 19.6]) out.push(poly([P(s - w + k, HW), P(s + w + k, HW), P(s + w - k, -HW), P(s - w - k, -HW)]))
  return out.join('')
}
const RIM = disc(CX, CY, RO) + disc(CX, CY, RI)
const top = x => CY - Math.sqrt(Math.max(0, RO * RO - (x - CX) ** 2))

export default function render() {
  const cap = snow(5.1, 15.9, top, { up: 1.35, dn: 0.95, ph: 0.6, maxDn: 1.5 })
  const shade = cap.map(([x, y]) => [x, y + 0.4])
  const glint = `M${num(CX - 3.6)} ${num(CY - 0.4)}A3.6 3.6 0 0 1 ${num(CX - 1.2)} ${num(CY - 3.4)}`
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3.25, y1: 3.25, x2: 13.28, y2: 21.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2, x2: 0, y2: 5.2, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 6.5, y1: 6, x2: 14, y2: 15.5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shine), st(1, C.tint)]],
    ]],
    // the candy-cane handle, tucked under the rim
    ['path', { d: handle(), fill: C.c4, class: 'wm-a' }],
    ['path', { d: stripes(), fill: C.c1, class: 'wm-a' }],
    ['path', { d: handle(), fill: url(0), class: 'wm-shine' }],
    ['path', { d: handle(), fill: 'none', ...INK, class: 'wm-a' }],
    // the frosted glass and the rim
    ['path', { d: disc(CX, CY, RI), fill: url(2), class: 'wm-k' }],
    ['path', { d: glint, fill: 'none', stroke: C.shine, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: RIM, fill: C.c2, 'fill-rule': 'evenodd', ...INK, class: 'wm-k' }],
    ['path', { d: RIM, fill: url(0), 'fill-rule': 'evenodd', class: 'wm-shine' }],
    // the minus, bold on the glass
    ['path', { d: 'M8 9.15H13A1.35 1.35 0 0 1 13 11.85H8A1.35 1.35 0 0 1 8 9.15Z', fill: C.c1, ...INK, class: 'wm-a' }],
    // snow on the rim
    ['path', { d: poly(shade), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: poly(cap), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
