// forge/hand/gloss/bug.mjs — a glossy beetle: a domed head set off from the body by a clear parting gap, a round
// shell split down the middle into two wing cases, six slim legs that stand clear of one another, and two curling
// antennae. The generated drawing inflated every stroke into one mass, so the legs became webbed stubs and the
// antennae beads on a lump; here each part keeps its own silhouette and the shell carries the style's bean, glint
// dot and shadow-side hairline.

// ---- the style's light and highlight recipe (forge/styles/gloss.mjs) ----
const LIGHT = (() => { const x = -0.55, y = -0.835, l = Math.hypot(x, y); return [x / l, y / l] })()
const f = v => { const r = Math.round(v * 100) / 100; return Object.is(r, -0) ? '0' : String(r) }
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const ring = pts => 'M' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z'
// points + normals along an arc (degrees, screen coordinates)
const arcPts = (cx, cy, r, a0, a1, step = 0.1) => {
  const k = Math.max(2, Math.ceil(Math.abs(a1 - a0) * Math.PI / 180 * r / step)), P = [], Nn = []
  for (let q = 0; q <= k; q++) { const a = (a0 + (a1 - a0) * q / k) * Math.PI / 180; P.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); Nn.push([Math.cos(a), Math.sin(a)]) }
  return [P, Nn]
}
// a tapered highlight along a centreline (the style's profile: sin^0.45, 0.1u tips)
function sweep([cen, nrm], hmax, tip = 0.1) {
  const m = cen.length, L = [], R = []
  cen.forEach((c, q) => {
    const w = tip + (hmax - tip) * Math.pow(Math.max(0, Math.sin(Math.PI * q / (m - 1))), 0.45)
    L.push([c[0] + nrm[q][0] * w, c[1] + nrm[q][1] * w]); R.push([c[0] - nrm[q][0] * w, c[1] - nrm[q][1] * w])
  })
  return ring([...L, ...R.reverse()].filter((p, i) => i % 2 === 0))
}
// reflected light: hairline 0.5u inside an outline arc of radius r, as wide as it faces away from the light
function rimArc(cx, cy, r, a0, a1) {
  const [P, Nn] = arcPts(cx, cy, r - 0.5, a0, a1, 0.2), L = [], R = []
  P.forEach((p, q) => {
    const n = Nn[q], w = Math.max(0.03, 0.15 * sstep(0.3, 0.8, -(n[0] * LIGHT[0] + n[1] * LIGHT[1])))
    L.push([p[0] + n[0] * w, p[1] + n[1] * w]); R.push([p[0] - n[0] * w, p[1] - n[1] * w])
  })
  return ring([...L, ...R.reverse()])
}
const dot = (x, y, r = 0.45) => `M${f(x + r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x - r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x + r)} ${f(y)}Z`
// a round-capped bar a -> b of width w, as a filled outline
const bar = (a, b, w) => {
  const h = w / 2, l = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / l * h, ny = (b[0] - a[0]) / l * h
  return `M${f(a[0] + nx)} ${f(a[1] + ny)}L${f(b[0] + nx)} ${f(b[1] + ny)}A${h} ${h} 0 0 0 ${f(b[0] - nx)} ${f(b[1] - ny)}L${f(a[0] - nx)} ${f(a[1] - ny)}A${h} ${h} 0 0 0 ${f(a[0] + nx)} ${f(a[1] + ny)}Z`
}

// ---- the drawing ------------------------------------------------------------------------------------------------
// shell: one smooth egg about (12 15), 5.75..18.25 wide: a dome of rx 6.25 ry 5.8 (top at y 9.2, only slightly
// flatter than the bottom, under the head gap) on a round bottom r6.25, meeting at the widest point with the same
// vertical tangent, so every leg leaves a continuous curve; split by a 1.6u slot that opens through the bottom (two
// wing cases); the slot's wing tips are eased with r0.4
const R = 6.25, RT = 5.8, CY = 15, S = 0.8, E = 0.4
const tipA = Math.asin((S + E) / (R - E)) * 180 / Math.PI              // where the eased tip's centre sits on the arc
const tc = a => [12 + (R - E) * Math.cos(a * Math.PI / 180), CY + (R - E) * Math.sin(a * Math.PI / 180)]
const tR = tc(90 - tipA), tL = tc(90 + tipA)
const at = (c, r, a) => `${f(c[0] + r * Math.cos(a * Math.PI / 180))} ${f(c[1] + r * Math.sin(a * Math.PI / 180))}`
const SHELL = `M5.75 ${CY}A${R} ${RT} 0 0 1 18.25 ${CY}`
  + `A${R} ${R} 0 0 1 ${at(tR, E, 90 - tipA)}A${E} ${E} 0 0 1 ${f(12 + S)} ${f(tR[1])}`
  + `V13.2A${S} ${S} 0 0 0 ${f(12 - S)} 13.2V${f(tL[1])}A${E} ${E} 0 0 1 ${at(tL, E, 90 + tipA)}`
  + `A${R} ${R} 0 0 1 5.75 15Z`
// head: a dome about (12 7.6) r3.6 on a flat base, its two corners eased r0.7 (parting gap to the shell: 1.6u)
const HEAD = 'M9.19 7.6A0.7 0.7 0 0 1 8.51 6.73A3.6 3.6 0 0 1 15.49 6.73A0.7 0.7 0 0 1 14.81 7.6Z'
const LW = 2.3                                            // leg tube: slimmer than the 2.7u body tube so six legs stay apart
const LEGS = [
  [[6.6, 12], [3.1, 10]], [[6.6, 15.3], [2.6, 15.6]], [[8.4, 19], [5.1, 21.2]],
  [[17.4, 12], [20.9, 10]], [[17.4, 15.3], [21.4, 15.6]], [[15.6, 19], [18.9, 21.2]],
]

export default function render() {
  // shell highlights: one bean round the lit shoulder, its glint dot just past the bean's upper end (toward the
  // light, 1.5u in from the outline), and a hairline on the shadow-side curve only between the middle and rear legs
  // (the legs sit under the shell, so a hairline across a leg would vanish into it and leave slivers)
  const bean = sweep(arcPts(11.8, 15.3, 4.6, 190, 246), 0.5)
  const glint = dot(10.95, 10.85, 0.42)
  const shine = rimArc(12, CY, R, 17, 33)
  // head: plain (a bean on a 7u dome only read as a speck at 24px)
  return [
    ['path', { d: LEGS.map(l => bar(l[0], l[1], LW)).join(''), class: 'wm-k' }],
    ['path', { d: SHELL + bean + glint + shine, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: HEAD, class: 'wm-k' }],
    ['path', { d: 'M10.9 4.8Q10.3 3 8.1 2.1M13.1 4.8Q13.7 3 15.9 2.1', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.85, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
}
