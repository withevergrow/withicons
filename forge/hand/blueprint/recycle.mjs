// forge/hand/blueprint/recycle.mjs — three bent arrows chasing round an even triangle (the generated drawing tangled
// open arcs with chevrons and put dimension ticks on the top arrow): each arrow starts mid-edge, turns the corner on a
// round bend and ends in a closed arrowhead; the dimension baseline sits clear underneath.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const f = n => String(+n.toFixed(2))
const P = (x, y) => `${f(x)} ${f(y)}`

const C = [12, 12.2], R = 10
const V = [-90, 30, 150].map(a => [C[0] + R * Math.cos(a * Math.PI / 180), C[1] + R * Math.sin(a * Math.PI / 180)])
const unit = (a, b) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l, l] }
const at = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const T = 0.52, S = 0.72, TAN = 2.6

export default function render() {
  const shafts = [], heads = []
  for (let i = 0; i < 3; i++) {
    const a = V[i], b = V[(i + 1) % 3], c = V[(i + 2) % 3]
    const [d0x, d0y, l0] = unit(a, b), [d1x, d1y] = unit(b, c)
    const start = at(a, b, S - 0.0 > 1 ? 1 : S)
    const A = [b[0] - d0x * TAN, b[1] - d0y * TAN], B = [b[0] + d1x * TAN, b[1] + d1y * TAN]
    const tip = at(b, c, T), base = tip
    shafts.push(`M${P(...start)}L${P(...A)}A1.5 1.5 0 0 1 ${P(...B)}L${P(...base)}`)
    const k = 3.3, ca = Math.cos(0.7) * k, sa = Math.sin(0.7) * k, nx = -d1y, ny = d1x
    heads.push(`M${P(tip[0] - d1x * ca + nx * sa, tip[1] - d1y * ca + ny * sa)}L${P(...tip)}L${P(tip[0] - d1x * ca - nx * sa, tip[1] - d1y * ca - ny * sa)}`)
  }
  return [
    ['path', { d: 'M3.4 22.5H20.6M3.4 21.6V23.4M20.6 21.6V23.4', ...con(0.5) }],
    ['path', { d: 'M2.75 23.15L4.05 21.85M19.95 23.15L21.25 21.85', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: shafts.join(''), class: 'wm-k' }],
    ['path', { d: heads.join(''), 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
