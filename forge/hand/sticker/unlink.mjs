// forge/hand/sticker/unlink.mjs — two separate die-cut chain links pulled apart along the diagonal, each with its own
// paper border, and two small separation ticks cut as their own little stickers; replaces the generated drawing,
// where one shared border and the ticks' casing fused everything into a cross-shaped blob.
const f = v => +v.toFixed(2)
const INK = 'var(--with-sticker-ink, #1D1530)'
const EDGE = 'var(--with-sticker-edge, #FFFFFF)'
const SHINE = 'var(--with-sticker-shine, #FFFFFF)'
const SHADOW = 'var(--with-sticker-shadow, #1D1530)'
const LINK = 'var(--with-sticker-bubblegum, #FF6FB5)'
const SLOT = 'var(--with-sticker-lemon, #FFD43B)'
const TICK = 'var(--with-sticker-peach, #FF9563)'

// a capsule between two cap centres (a, b) with radius r, as straight sides and two half-circle caps
function capsule([ax, ay], [bx, by], r) {
  const L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L
  const nx = -uy * r, ny = ux * r
  const P = (x, y) => f(x) + ' ' + f(y)
  return `M${P(ax + nx, ay + ny)}L${P(bx + nx, by + ny)}A${f(r)} ${f(r)} 0 0 0 ${P(bx - nx, by - ny)}L${P(ax - nx, ay - ny)}A${f(r)} ${f(r)} 0 0 0 ${P(ax + nx, ay + ny)}Z`
}

// the two links lie on the anti-diagonal with a clear gap between their tips; the whole drawing is set a touch smaller
// about the centre so each paper border stays apart from the other
const s = 0.92, c = 12
const Q = (x, y, dx = 0, dy = 0) => [c + (x - c) * s + dx, c + (y - c) * s + dy]
const AFAR = [4.6, 19.4], ANEAR = [7.9, 16.1], BNEAR = [16.1, 7.9], BFAR = [19.4, 4.6]
const links = (r, dx = 0, dy = 0) => capsule(Q(...AFAR, dx, dy), Q(...ANEAR, dx, dy), r * s) + capsule(Q(...BNEAR, dx, dy), Q(...BFAR, dx, dy), r * s)
const seg = (x1, y1, x2, y2, dx = 0, dy = 0) => { const p = Q(x1, y1, dx, dy), q = Q(x2, y2, dx, dy); return `M${f(p[0])} ${f(p[1])}L${f(q[0])} ${f(q[1])}` }
const ticksD = (dx = 0, dy = 0) => seg(9.2, 9.2, 7.4, 7.4, dx, dy) + seg(14.8, 14.8, 16.6, 16.6, dx, dy)

export default function render() {
  const body = links(3.0), slot = links(0.85), ticks = ticksD()
  return [
    // soft offset shadow, the paper hairline and the paper: one border per link, one per tick
    ['path', { d: links(3.0, 0.5, 0.8) + ticksD(0.5, 0.8), fill: SHADOW, stroke: SHADOW, 'stroke-width': 3.4, opacity: 0.22, class: 'wm-shadow' }],
    ['path', { d: body, fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 4.04, opacity: 0.3 }],
    ['path', { d: ticks, stroke: 'currentColor', 'stroke-width': 4.64, opacity: 0.3, class: 'wm-s' }],
    ['path', { d: body, fill: EDGE, stroke: EDGE, 'stroke-width': 3.4 }],
    ['path', { d: ticks, stroke: EDGE, 'stroke-width': 4, class: 'wm-s' }],
    // the links: candy ring, a lemon slot, ink outline
    ['path', { d: body, fill: LINK }],
    ['path', { d: slot, fill: SLOT }],
    ['path', { d: body, stroke: INK, 'stroke-width': 1.2 }],
    // the two ticks of the break
    ['path', { d: ticks, stroke: INK, 'stroke-width': 2.2, class: 'wm-s' }],
    ['path', { d: ticks, stroke: TICK, 'stroke-width': 1, class: 'wm-s' }],
    // gloss on each link
    ['path', { d: seg(3.9, 17.6, 5.2, 16.3) + seg(14.8, 6.3, 16.1, 5), stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.92, class: 'wm-shine' }],
  ]
}
