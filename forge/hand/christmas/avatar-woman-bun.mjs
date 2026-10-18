// forge/hand/christmas/avatar-woman-bun.mjs — a woman with golden hair, a centre parting and a distinct bun knotted on
// top, the avatars' ink eyes and smile, a pine jumper; snow on the bun.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

// a snow cap resting on a flat top edge x0..x1 at y (corner radius r): thin over the shoulders, full on the flat,
// a wavy lower edge with soft round drips
function snowD(x0, x1, y, r, up, dn, drips) {
  const xa = x0 + 0.3 * r - 0.1, xb = x1 - 0.3 * r + 0.1, ey = y + 0.3 * r, t = y - up, b = y + dn, mid = (xa + xb) / 2
  let d = `M${n(xa)} ${n(ey)}C${n(xa + 0.35)} ${n(t + 0.3)} ${n(xa + 0.9)} ${n(t)} ${n(xa + 1.7)} ${n(t)}`
  d += `Q${n(mid)} ${n(t - 0.3)} ${n(xb - 1.7)} ${n(t)}C${n(xb - 0.9)} ${n(t)} ${n(xb - 0.35)} ${n(t + 0.3)} ${n(xb)} ${n(ey)}`
  d += `Q${n(xb - 0.6)} ${n(b)} ${n(xb - 1.5)} ${n(b)}`
  let x = xb - 1.5
  for (const p of [...drips].sort((a, c) => c.x - a.x)) {
    const R = p.x + p.w, L = p.x - p.w
    d += `Q${n((x + R) / 2)} ${n(b + 0.28)} ${n(R)} ${n(b)}C${n(R)} ${n(b + p.l * 1.33)} ${n(L)} ${n(b + p.l * 1.33)} ${n(L)} ${n(b)}`
    x = L
  }
  d += `Q${n((x + xa + 1.5) / 2)} ${n(b + 0.28)} ${n(xa + 1.5)} ${n(b)}Q${n(xa + 0.6)} ${n(b)} ${n(xa)} ${n(ey)}Z`
  return d
}
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
const disc = (cx, cy, r) => `M${n(cx - r)} ${cy}a${r} ${r} 0 1 0 ${n(2 * r)} 0a${r} ${r} 0 1 0 ${n(-2 * r)} 0z`
const SKIN = 'var(--with-christmas-c1, #F7D7BE)', HAIR = 'var(--with-christmas-c2, #D7A14A)', TOP = 'var(--with-christmas-c4, #2F7D4F)'
const SH = 'var(--with-christmas-shadow, #B9876A)', TINT = 'var(--with-christmas-tint, #FFF0E4)'

export default function render(icon) {
  const name = icon.name || 'avatar-woman-bun'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const FACE = disc(12, 12.6, 5.6)
  const HAIRD = 'M6.1 13.4C5.6 8.9 8.2 6.4 12 6.4C15.8 6.4 18.4 8.9 17.9 13.4Q17.2 10.1 12 9.2Q6.8 10.1 6.1 13.4Z'
  const BUN = disc(12, 4.4, 2.3)
  const BODY = 'M4.6 22C4.6 19 7.4 17.6 12 17.6C16.6 17.6 19.4 19 19.4 22Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 2, x2: 13, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, SH, 0), st(1, SH, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.4, x2: 0, y2: 3.6, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, TINT)]],
    ]],
    ['path', { d: BODY, fill: TOP, ...INK, class: 'wm-a' }],
    ['path', { d: rr(10.4, 16, 13.6, 18.4, 1), fill: SKIN, ...INK, 'stroke-width': 0.42, class: 'wm-k' }],
    ['path', { d: FACE, fill: SKIN, ...INK, class: 'wm-k' }],
    ['path', { d: BUN, fill: HAIR, ...INK, class: 'wm-k' }],
    ['path', { d: HAIRD, fill: HAIR, ...INK, class: 'wm-k' }],
    ['path', { d: 'M12 6.6V9.1M10.3 4.1Q12 5.2 13.7 4.1', stroke: C.ink, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: FACE + BUN + HAIRD + BODY, fill: url(0), class: 'wm-shine' }],
    ['path', { d: disc(9.7, 13.3, 0.62) + disc(14.3, 13.3, 0.62), fill: C.ink, class: 'wm-k' }],
    ['path', { d: 'M10.2 15.3Q12 16.6 13.8 15.3', stroke: C.ink, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M10.1 3.4C10.4 2.2 11.2 1.6 12 1.6C12.8 1.6 13.6 2.2 13.9 3.4Q12 2.9 10.1 3.4Z', fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
