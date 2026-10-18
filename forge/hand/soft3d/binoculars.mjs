// forge/hand/soft3d/binoculars.mjs — upright, front-facing twin-barrel binoculars as in the line design: tall barrels with light
// eyepiece caps, big round blue-glass lenses at the bottom and a bridge with a focus wheel between, in soft slate shading.
const N = 'binoculars'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const BODY = v('c1', '#4A5262'), GLASS = v('c2', '#5BB8E8'), CAP = v('c4', '#BFC7D2'), BRIDGE = v('c3', '#7C8798')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-${N}-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const circ = (cx, cy, r) => `M${cx - r} ${cy} A${r} ${r} 0 1 0 ${cx + r} ${cy} A${r} ${r} 0 1 0 ${cx - r} ${cy} Z`

export default function render() {
  const defs = ['defs', {}, [
    ['radialGradient', { id: id(0), cx: 0.3, cy: 0.22, r: 0.95 }, [stop(0, SN, 0.45), stop(0.4, SN, 0.05), stop(0.72, SH, 0), stop(1, SH, 0.3)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, SN, 0.32), stop(0.25, SN, 0.06), stop(0.6, SH, 0), stop(1, SH, 0.3)]],
    // the lens: bright glass at the top-left falling to deep blue
    ['radialGradient', { id: id(2), cx: 0.32, cy: 0.28, r: 0.85 }, [stop(0, SN, 0.7), stop(0.3, SN, 0.12), stop(0.65, SH, 0), stop(1, SH, 0.45)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`, g2 = `url(#${id(2)})`
  const x = (a, dx) => +(a + dx).toFixed(2)
  const barrel = dx => `M${x(2.5, dx)} 17 L${x(4, dx)} 6.5 A1 1 0 0 1 ${x(5, dx)} 5.5 H${x(7, dx)} A1 1 0 0 1 ${x(8, dx)} 6.5 L${x(9.5, dx)} 17 Z`
  const cap = dx => `M${x(3.9, dx)} 7.6 L${x(4, dx)} 6.5 A1 1 0 0 1 ${x(5, dx)} 5.5 H${x(7, dx)} A1 1 0 0 1 ${x(8, dx)} 6.5 L${x(8.1, dx)} 7.6 Z`
  const out = [defs,
    P('M3 22.3 A9 1.3 0 1 0 21 22.3 A9 1.3 0 1 0 3 22.3 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M4.4 22.3 A7.6 1.05 0 1 0 19.6 22.3 A7.6 1.05 0 1 0 4.4 22.3 Z', { fill: SH, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P('M6.4 22.3 A5.6 0.8 0 1 0 17.6 22.3 A5.6 0.8 0 1 0 6.4 22.3 Z', { fill: SH, 'fill-opacity': 0.11 }, 'wm-shadow'),
  ]
  // bridge behind the barrels
  const bridge = 'M8.6 10 H15.4 A0.8 0.8 0 0 1 16.2 10.8 V12.2 A0.8 0.8 0 0 1 15.4 13 H8.6 A0.8 0.8 0 0 1 7.8 12.2 V10.8 A0.8 0.8 0 0 1 8.6 10 Z'
  out.push(P(bridge, { fill: BRIDGE }, 'wm-k'), P(bridge, { fill: g1 }, 'wm-k'))
  for (const [dx, cx] of [[0, 6], [12, 18]]) {
    const b = barrel(dx)
    out.push(
      P(b, { fill: BODY, stroke: BODY, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }, 'wm-k'),
      P(b, { fill: g1 }, 'wm-k'),
      P(cap(dx), { fill: CAP }, 'wm-k'),
      P(cap(dx), { fill: g1 }, 'wm-k'),
      // lens housing and glass
      P(circ(cx, 17, 3.6), { fill: BODY }, 'wm-k'),
      P(circ(cx, 17, 3.6), { fill: g0 }, 'wm-k'),
      P(circ(cx, 17, 2.6), { fill: SH, 'fill-opacity': 0.5 }, 'wm-k'),
      P(circ(cx, 17, 2.35), { fill: GLASS }, 'wm-a'),
      P(circ(cx, 17, 2.35), { fill: g2 }, 'wm-a'),
      S(`M${cx - 1.5} 16.1 A1.9 1.9 0 0 1 ${cx} 15.1`, SN, 0.6, { 'stroke-opacity': 0.9 }, 'wm-shine'),
      S(`M${cx - 3} 14.6 A3.6 3.6 0 0 1 ${cx} 13.5`, SN, 0.45, { 'stroke-opacity': 0.5 }, 'wm-shine'),
    )
  }
  // focus wheel on the bridge
  out.push(
    S('M10.4 11.5 H13.6', SH, 1.1, { 'stroke-opacity': 0.35 }, 'wm-k'),
    S('M9 10.5 H13', SN, 0.4, { 'stroke-opacity': 0.7 }, 'wm-shine'))
  return out
}
