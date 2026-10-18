// forge/hand/soft3d/radar.mjs — the line drawing's radar as a soft puck: a round screen with a pale range ring, a centre
// dot, a lit sweep wedge with its bright leading edge and one blip, replacing the generated joystick-like stick.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const DISC = v('c1', '#8A66DE'), SWEEP = v('c2', '#EE5A3C'), RING = v('c4', '#BFC7D2')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-radar-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const r2 = n => +n.toFixed(2)
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const circ = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)} A${r} ${r} 0 1 0 ${r2(cx + r)} ${r2(cy)} A${r} ${r} 0 1 0 ${r2(cx - r)} ${r2(cy)} Z`

export default function render() {
  const cx = 12, cy = 11.5, R = 9.4
  const defs = ['defs', {}, [
    // the puck's top: lit from the upper left, turning dark at the lower right
    ['radialGradient', { id: id(0), cx: 0.3, cy: 0.25, r: 1 }, [stop(0, SN, 0.5), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.38)]],
    // the sweep wedge: faint at its trailing edge, bright toward the leading edge
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 0.45 }, [stop(0, SWEEP, 0.35), stop(1, SWEEP, 1)]],
    ['radialGradient', { id: id(2), cx: 0.35, cy: 0.3, r: 0.8 }, [stop(0, SN, 0.8), stop(0.5, SN, 0), stop(1, SH, 0.25)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`, g2 = `url(#${id(2)})`
  // sweep wedge from -105 to -45 degrees, radius 7.4
  const a1 = -105 * Math.PI / 180, a2 = -45 * Math.PI / 180, W = 7.4
  const p1 = [cx + W * Math.cos(a1), cy + W * Math.sin(a1)], p2 = [cx + W * Math.cos(a2), cy + W * Math.sin(a2)]
  const wedge = `M${cx} ${cy} L${r2(p2[0])} ${r2(p2[1])} A${W} ${W} 0 0 0 ${r2(p1[0])} ${r2(p1[1])} Z`
  return [
    defs,
    P('M2.2 21.6 A9.8 1.6 0 1 0 21.8 21.6 A9.8 1.6 0 1 0 2.2 21.6 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M3.8 21.6 A8.2 1.25 0 1 0 20.2 21.6 A8.2 1.25 0 1 0 3.8 21.6 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M5.8 21.6 A6.2 0.9 0 1 0 18.2 21.6 A6.2 0.9 0 1 0 5.8 21.6 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the puck's thickness below the face
    P(circ(cx, cy + 1, R), { fill: DISC }, 'wm-k'),
    P(circ(cx, cy + 1, R), { fill: SH, 'fill-opacity': 0.35 }, 'wm-k'),
    // the face
    P(circ(cx, cy, R), { fill: DISC }, 'wm-k'),
    P(circ(cx, cy, R), { fill: g0 }, 'wm-k'),
    S(circ(cx, cy, 8.2), SN, 0.5, { 'stroke-opacity': 0.35 }, 'wm-shine'),
    // range rings
    S(circ(cx, cy, 5.5), RING, 0.9, { 'stroke-opacity': 0.85 }, 'wm-deco'),
    S(circ(cx, cy, 2.9), RING, 0.7, { 'stroke-opacity': 0.55 }, 'wm-deco'),
    // the sweep: a wedge fanning back from a bright leading edge
    P(wedge, { fill: SWEEP, 'fill-opacity': 0.5 }, 'wm-a'),
    P(wedge, { fill: g1 }, 'wm-a'),
    S(`M${cx} ${cy} L${r2(p2[0])} ${r2(p2[1])}`, SN, 0.9, { 'stroke-opacity': 0.95 }, 'wm-a'),
    // a blip and the centre dot
    P(circ(15.3, 6.5, 0.8), { fill: SN }, 'wm-s'),
    P(circ(cx, cy, 1.35), { fill: SWEEP }, 'wm-k'),
    P(circ(cx, cy, 1.35), { fill: g2 }, 'wm-k'),
    // lit rim on the upper left
    S('M4.6 7.6 C5.6 5 7.9 3.4 10.4 2.9', SN, 0.7, { 'stroke-opacity': 0.8 }, 'wm-shine'),
  ]
}
