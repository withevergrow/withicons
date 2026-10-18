// forge/hand/soft3d/passport.mjs — a closed passport booklet in soft 3D: a deep cover with an embossed gold globe and title
// bar, a pressed spine hinge, and cream page edges with page lines showing on the top and right, so it reads as a booklet
// and not as a phone or card (the generated drawing was a cream slab with a blue disc).
// Roles (as forge/palettes/passport.json): cover c1, gold emblem c2, pages c3, shadow/shine.
// Motion: booklet wm-k, contact shadow wm-shadow, highlights wm-shine (no parts animate).
const N = 'passport'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = {
  c1: v('c1', '#2F5FB8'), c2: v('c2', '#E9B949'), c3: v('c3', '#F3E7D3'),
  shadow: v('shadow', '#1D2130'), shine: v('shine', '#FFFFFF'),
}
const f = n => +(+n).toFixed(2)
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a = 1) => ['stop', a === 1 ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls = 'wm-k') => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`
const rr = (x0, y0, x1, y1, r) => `M${f(x0 + r)} ${f(y0)}H${f(x1 - r)}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(r)}V${f(y1 - r)}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(r)}H${f(x0 + r)}a${f(r)} ${f(r)} 0 0 1 ${f(-r)} ${f(-r)}V${f(y0 + r)}a${f(r)} ${f(r)} 0 0 1 ${f(r)} ${f(-r)}Z`
const rrPts = (x0, y0, x1, y1, r, n = 6) => {
  const out = [], cs = [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]]
  for (const [cx, cy, a0] of cs) for (let i = 0; i <= n; i++) { const a = (a0 + 90 * i / n) * Math.PI / 180; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) }
  return out
}
const hull = pts => {
  const p = pts.map(q => [f(q[0]), f(q[1])]).sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo = [], up = []
  for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q) }
  for (const q of p.slice().reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q) }
  return lo.slice(0, -1).concat(up.slice(0, -1))
}
const poly = pts => 'M' + pts.map(q => `${f(q[0])} ${f(q[1])}`).join('L') + 'Z'
const sh = (pts, o) => pts.map(q => [q[0] + o[0], q[1] + o[1]])


// front cover, thickness vector (the booklet's back goes up and to the right)
const F = [4.6, 4.3, 16.2, 20.6, 1.1], O = [2.5, -1.75]
const G = [11.4, 10.5, 3.35] // globe emblem

export default function render() {
  const defs = ['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.3), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.24)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, C.c3), stop(1, C.c3, 0.85)]],
  ]]
  const n = [defs]
  const edge = { fill: 'none', stroke: C.shadow, 'stroke-opacity': 0.24, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }
  // contact shadow
  n.push(P(ell(12.2, 20.7, 8.4, 1.35), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(12.1, 20.7, 6.6, 1.05), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(12, 20.7, 4.8, 0.78), { fill: C.shadow, 'fill-opacity': 0.12 }, 'wm-shadow'))
  // back cover: the whole extruded silhouette in the cover colour, shaded
  const front = rrPts(...F)
  const sil = hull([...front, ...sh(front, O)])
  n.push(P(poly(sil), { fill: C.c1 }), P(poly(sil), { fill: C.shadow, 'fill-opacity': 0.36 }))
  // the page block between the covers: cream, a lit top edge, page lines on both edges
  const pg = rrPts(F[0] + 0.2, F[1] + 0.3, F[2] - 0.3, F[3] - 0.25, 0.8)
  const a = [O[0] * 0.14, O[1] * 0.14], b = [O[0] * 0.84, O[1] * 0.84]
  const pages = hull([...sh(pg, a), ...sh(pg, b)])
  n.push(P(poly(pages), { fill: C.c3 }), P(poly(pages), { fill: C.shadow, 'fill-opacity': 0.14 }))
  const pt = pg.filter(q => q[1] <= F[1] + 1.11)
  const ptop = hull([...sh(pt, a), ...sh(pt, b)])
  n.push(P(poly(ptop), { fill: C.c3 }), P(poly(ptop), { fill: C.shine, 'fill-opacity': 0.3 }))
  let lines = ''
  for (const t of [0.34, 0.5, 0.66]) {
    const x = F[2] - 0.3 + O[0] * t, y = O[1] * t
    lines += `M${f(x)} ${f(F[1] + 1.4 + y)}V${f(F[3] - 1.2 + y)}M${f(F[0] + 1.3 + O[0] * t)} ${f(F[1] + 0.3 + y)}H${f(x - 1)}`
  }
  n.push(P(lines, { fill: 'none', stroke: C.shadow, 'stroke-opacity': 0.2, 'stroke-width': 0.22, 'stroke-linecap': 'round' }))
  n.push(P(poly(sil), edge))
  // front cover
  const fd = rr(...F)
  n.push(P(fd, { fill: C.c1 }), P(fd, { fill: url(0) }), P(fd, edge))
  n.push(P(`M${f(F[0] + 0.4)} ${f(F[3] - 1.5)}V${f(F[1] + 1.3)}a.9 .9 0 0 1 .9 -.9H${f(F[2] - 1.4)}`, { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.45, 'stroke-linecap': 'round' }, 'wm-shine'))
  n.push(P(`M${f(F[2] - 0.4)} ${f(F[1] + 1.4)}V${f(F[3] - 1.3)}a.9 .9 0 0 1 -.9 .9H${f(F[0] + 1.4)}`, { fill: 'none', stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': 0.45, 'stroke-linecap': 'round' }))
  // spine hinge: a pressed groove near the left edge with a lit lip
  n.push(P(`M6.35 ${f(F[1] + 0.25)}V${f(F[3] - 0.25)}`, { fill: 'none', stroke: C.shadow, 'stroke-opacity': 0.34, 'stroke-width': 0.45 }))
  n.push(P(`M6.8 ${f(F[1] + 0.6)}V${f(F[3] - 0.6)}`, { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.3, 'stroke-width': 0.3 }, 'wm-shine'))
  // embossed gold globe: ring, equator, meridian, two latitudes
  const [gx, gy, gr] = G
  const globe = `M${f(gx - gr)} ${f(gy)}a${gr} ${gr} 0 1 0 ${f(2 * gr)} 0a${gr} ${gr} 0 1 0 ${f(-2 * gr)} 0Z` +
    `M${f(gx - gr)} ${f(gy)}H${f(gx + gr)}` +
    `M${f(gx)} ${f(gy - gr)}a1.45 ${gr} 0 1 0 0 ${f(2 * gr)}a1.45 ${gr} 0 1 0 0 ${f(-2 * gr)}` +
    `M${f(gx - 2.6)} ${f(gy - 1.75)}H${f(gx + 2.6)}M${f(gx - 2.6)} ${f(gy + 1.75)}H${f(gx + 2.6)}`
  const gst = { fill: 'none', 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const gst2 = { ...gst, 'stroke-width': 0.55 }
  const ring = `M${f(gx - gr)} ${f(gy)}a${gr} ${gr} 0 1 0 ${f(2 * gr)} 0a${gr} ${gr} 0 1 0 ${f(-2 * gr)} 0Z`
  const inner = globe.slice(ring.length)
  n.push(P(shiftD(ring), { ...gst, stroke: C.shadow, 'stroke-opacity': 0.35 }))
  n.push(P(shiftD(inner), { ...gst2, stroke: C.shadow, 'stroke-opacity': 0.3 }))
  n.push(P(ring, { ...gst, stroke: C.c2 }), P(inner, { ...gst2, stroke: C.c2 }))
  n.push(P(`M${f(gx - 2.75)} ${f(gy - 1.25)}A${gr} ${gr} 0 0 1 ${f(gx - 0.9)} ${f(gy - 3.1)}`, { fill: 'none', stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.35, 'stroke-linecap': 'round' }, 'wm-shine'))
  // gold title bar and a fine line under it
  n.push(P(rr(8.25, 16.15, 14.55, 17.15, 0.5), { fill: C.shadow, 'fill-opacity': 0.3 }))
  n.push(P(rr(8.15, 15.95, 14.45, 16.95, 0.5), { fill: C.c2 }), P(rr(8.15, 15.95, 14.45, 16.95, 0.5), { fill: url(0) }))
  n.push(P(rr(9.4, 18.0, 13.2, 18.6, 0.3), { fill: C.c2, 'fill-opacity': 0.7 }))
  return n
}
const shiftD = d => d.replace(/M(-?[\d.]+) (-?[\d.]+)/g, (m, x, y) => `M${f(+x + 0.12)} ${f(+y + 0.22)}`)
