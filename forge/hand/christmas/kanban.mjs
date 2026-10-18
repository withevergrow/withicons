// forge/hand/christmas/kanban.mjs — a kanban board: a cream board with a snow cap and three columns of cards of
// different lengths (three cranberry, two pine, one gold), each column topped with its first card, so it reads as a
// task board and not a barcode or a plain column chart. Cards share one warm light and a 0.45 ink outline.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

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

const COLS = [[4.1, 3, C.c1], [9.7, 2, C.c2], [15.3, 1, C.c3]] // lane x, card count, fill
const LANE_W = 4.6, LANE_Y0 = 6.4, LANE_Y1 = 19.4, PAD = 0.7, CARD_H = 3.4, GAP = 0.8

export default function render(icon) {
  const name = icon.name || 'kanban'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const BOARD = rr(2.5, 3, 21.5, 21, 2.4)
  const out = [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 0.55, y2: 1 },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.8, x2: 0, y2: 4.8, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 2.5, y1: 3, x2: 12.9, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.2), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.3)]],
    ]],
    ['path', { d: BOARD, fill: C.c2, ...INK, class: 'wm-k' }],
    ['path', { d: BOARD, fill: url(2), class: 'wm-shine' }],
  ]
  for (const [x] of COLS) out.push(['path', { d: rr(x, LANE_Y0, x + LANE_W, LANE_Y1, 1.2), fill: C.c4, class: 'wm-k' }])
  for (const [x, count, fill] of COLS) {
    for (let i = 0; i < count; i++) {
      const y = LANE_Y0 + PAD + i * (CARD_H + GAP), d = rr(x + PAD, y, x + LANE_W - PAD, y + CARD_H, 0.8)
      out.push(['path', { d, fill, ...INK, 'stroke-width': 0.42, class: 'wm-a' }])
      out.push(['path', { d, fill: url(0), class: 'wm-shine' }])
    }
  }
  const drips = [{ x: 6.8, w: 0.8, l: 0.55 }, { x: 16.4, w: 0.85, l: 0.7 }]
  out.push(['path', { d: snowD(3, 21, 3.42, 2.4, 1.1, 0.6, drips), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }])
  out.push(['path', { d: snowD(2.5, 21.5, 3, 2.4, 1.15, 0.6, drips), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  return out
}
