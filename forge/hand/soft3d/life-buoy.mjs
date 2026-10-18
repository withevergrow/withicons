// forge/hand/soft3d/life-buoy.mjs — a full lifebuoy: a thick torus seen slightly from above (clear centre hole, inner wall
// showing at the top of it) with four red rope-band pills lying on the ring at the diagonals, like the line drawing.
// Replaces the generated lumpy disc with detached floating pills.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const RING = v('c1', '#EEF1F5'), BAND = v('c2', '#E5483F')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-life-buoy-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const r2 = n => +n.toFixed(2)
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const circ = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)} A${r} ${r} 0 1 0 ${r2(cx + r)} ${r2(cy)} A${r} ${r} 0 1 0 ${r2(cx - r)} ${r2(cy)} Z`
const ringPath = (cx, cy, ro, ri) => circ(cx, cy, ro) + ' ' + circ(cx, cy, ri)

export default function render() {
  const cx = 12, cy = 11.4, RO = 9.5, RI = 4.3
  const defs = ['defs', {}, [
    // the ring's roundness: lit upper left, shaded lower right
    ['radialGradient', { id: id(0), cx: 0.3, cy: 0.25, r: 1 }, [stop(0, SN, 0.5), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.3)]],
    // the bands' roundness: light on the upper edge, dark on the lower edge
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.45), stop(0.4, SN, 0), stop(1, SH, 0.28)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`
  // a rope band: a rounded bar lying across the ring's width at angle a, from radius r0 to r1, half width hw
  const band = (deg, r0, r1, hw) => {
    const a = deg * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux
    const pt = (r, s) => [cx + ux * r + nx * s, cy + uy * r + ny * s]
    const [a0, a1, b1, b0] = [pt(r0, -hw), pt(r1, -hw), pt(r1, hw), pt(r0, hw)]
    const rr = 0.55
    const f = ([x, y]) => `${r2(x)} ${r2(y)}`
    const m = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]
    // rounded rectangle through the four corners with quadratic corners
    const len = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]), wid = hw * 2, t1 = rr / len, t2 = rr / wid
    return `M${f(m(a0, a1, t1))} L${f(m(a1, a0, t1))} Q${f(a1)} ${f(m(a1, b1, t2))} L${f(m(b1, a1, t2))} Q${f(b1)} ${f(m(b1, b0, t1))} L${f(m(b0, b1, t1))} Q${f(b0)} ${f(m(b0, a0, t2))} L${f(m(a0, b0, t2))} Q${f(a0)} ${f(m(a0, a1, t1))} Z`
  }
  const bands = [-45, 45, 135, 225].map(d => band(d, 5.0, 8.8, 1.35))
  return [
    defs,
    P('M2.2 21.7 A9.8 1.6 0 1 0 21.8 21.7 A9.8 1.6 0 1 0 2.2 21.7 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M3.8 21.7 A8.2 1.25 0 1 0 20.2 21.7 A8.2 1.25 0 1 0 3.8 21.7 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M5.8 21.7 A6.2 0.9 0 1 0 18.2 21.7 A6.2 0.9 0 1 0 5.8 21.7 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the ring's thickness, one step lower than its top face (its inner wall peeks into the top of the hole)
    P(ringPath(cx, cy + 1, RO, RI), { fill: RING, 'fill-rule': 'evenodd' }, 'wm-k'),
    P(ringPath(cx, cy + 1, RO, RI), { fill: SH, 'fill-opacity': 0.36, 'fill-rule': 'evenodd' }, 'wm-k'),
    // the ring face
    P(ringPath(cx, cy, RO, RI), { fill: RING, 'fill-rule': 'evenodd' }, 'wm-k'),
    P(ringPath(cx, cy, RO, RI), { fill: g0, 'fill-rule': 'evenodd' }, 'wm-k'),
    // the hole's lit rim and its soft inner shadow
    S(circ(cx, cy, RI + 0.1), SH, 0.6, { 'stroke-opacity': 0.18 }, 'wm-k'),
    // four red bands: a dark underside, the band, a gloss edge
    ...bands.flatMap(d => [
      P(d, { fill: SH, 'fill-opacity': 0.3, 'fill-rule': 'nonzero' }, 'wm-s'),
    ]),
    ...bands.flatMap(d => [
      P(d, { fill: BAND }, 'wm-s'),
      P(d, { fill: g1 }, 'wm-s'),
    ]),
    // rim gloss on the upper left of the ring and a small spark on the upper-left band
    S('M4.2 8.4 C5.1 5.6 7.4 3.7 10.2 3.1', SN, 0.75, { 'stroke-opacity': 0.85 }, 'wm-shine'),
  ]
}
