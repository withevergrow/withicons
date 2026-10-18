// forge/hand/brutal/sparkler.mjs — a sparkler: a slim grey wand running up to its tip, a fan of six clean round-capped ink
// sparks bursting from the tip, and two small yellow four-point sparkles. Replaces the generated drawing, where every
// spark and sparkle carried its own fat ink shadow and the lot merged into a blob. Here only the wand and the sparkles
// get the hard shadow; the sparks (as on sun) are plain ink lines so they stay separate at 16px.
// Roles: wand c2, sparkles c1, outline and shadow ink. Motion: sparks wm-a (flicker about 15 9), sparkles wm-s.
const INK = 'var(--with-brutal-ink, #16130F)'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #C4C9D1)'
const W = 2.2, OFF = 1.25, BOFF = 0.95
const f = n => +n.toFixed(2)
const line = (w, extra = {}) => ({ stroke: INK, 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...extra })

// wand: a thin slab from lower left up to the burst
const WAND = (dx, dy) => {
  const x0 = 3 + dx, y0 = 19 + dy, x1 = 10.8 + dx, y1 = 11.2 + dy, h = 0.95
  const k = h * Math.SQRT1_2
  return `M${f(x0 - k)} ${f(y0 - k)}L${f(x1 - k)} ${f(y1 - k)}L${f(x1 + k)} ${f(y1 + k)}L${f(x0 + k)} ${f(y0 + k)}Z`
}
// sparks fan out of the burst centre
const CX = 14.6, CY = 7.8
const ANG = [-135, -90, -45, 0, 45, 90]
const rays = o => ANG.map(a => {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180), r0 = 3.6, r1 = a % 90 ? 5.4 : 5.8
  return `M${f(CX + o + c * r0)} ${f(CY + o + s * r0)}L${f(CX + o + c * r1)} ${f(CY + o + s * r1)}`
}).join('')
// concave four-point sparkle
const star = (cx, cy, r, o) => {
  const x = cx + o, y = cy + o, k = r * 0.22
  return `M${f(x)} ${f(y - r)}Q${f(x + k)} ${f(y - k)} ${f(x + r)} ${f(y)}Q${f(x + k)} ${f(y + k)} ${f(x)} ${f(y + r)}` +
    `Q${f(x - k)} ${f(y + k)} ${f(x - r)} ${f(y)}Q${f(x - k)} ${f(y - k)} ${f(x)} ${f(y - r)}Z`
}

// a thin light halo under the whole drawing (the shine role) so the dark ink keeps its edge on dark backgrounds
const SHINE_HALO = 'var(--with-brutal-shine, #FFFDF5)'
const halo = nodes => nodes
  .filter(([, a]) => a.class === 'wm-shadow' || (a.stroke === INK && a['stroke-width'] >= 1.7))
  .map(([t, a]) => [t, { ...a, fill: a.fill === 'none' ? 'none' : SHINE_HALO, stroke: SHINE_HALO, 'stroke-width': +((a['stroke-width'] || 0) + (a.class === 'wm-a' ? 0.9 : 1.8)).toFixed(2), class: 'wm-shadow' }])

export default function render() {
  const nodes = [
    ['path', { d: WAND(OFF, OFF), fill: INK, ...line(1.7), class: 'wm-shadow' }],
    ['path', { d: star(4.8, 5.2, 3.3, BOFF), fill: INK, ...line(1.5), class: 'wm-shadow' }],
    ['path', { d: star(18.8, 17.2, 2.8, BOFF), fill: INK, ...line(1.5), class: 'wm-shadow' }],
    ['path', { d: WAND(0, 0), fill: C2, ...line(1.7), class: 'wm-k' }],
    ['path', { d: rays(0), fill: 'none', ...line(W), class: 'wm-a' }],
    ['path', { d: star(4.8, 5.2, 3.3, 0), fill: C1, ...line(1.5), class: 'wm-s' }],
    ['path', { d: star(18.8, 17.2, 2.8, 0), fill: C1, ...line(1.5), class: 'wm-s' }],
  ]
  return [...halo(nodes), ...nodes]
}
