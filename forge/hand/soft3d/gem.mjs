// forge/hand/soft3d/gem.mjs — a front-on cut gem with the line design structure: flat table, crown facets, girdle line and
// pavilion facets meeting at the point, each facet lit at its own tone so the structure reads at 16px.
const N = 'gem'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C1 = v('c1', '#EE5A3C'), C2 = v('c2', '#FF9A7A')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-${N}-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)

export default function render() {
  const defs = ['defs', {}, [
    ['radialGradient', { id: id(0), cx: 0.32, cy: 0.2, r: 0.95 }, [stop(0, SN, 0.5), stop(0.4, SN, 0.05), stop(0.72, SH, 0), stop(1, SH, 0.22)]],
  ]]
  const g0 = `url(#${id(0)})`
  // facets: [path, base fill, white lift, dark shade]
  const F = [
    ['M7 3.5 H10 L8.5 9 H2.5 Z', C1, 0.18, 0],            // crown left
    ['M10 3.5 H14 L15.5 9 H8.5 Z', C2, 0.3, 0],           // table
    ['M14 3.5 H17 L21.5 9 H15.5 Z', C1, 0, 0.18],         // crown right
    ['M2.5 9 H8.5 L12 21 Z', C1, 0, 0.05],                // pavilion left
    ['M8.5 9 H15.5 L12 21 Z', C2, 0.1, 0],                // pavilion centre
    ['M15.5 9 H21.5 L12 21 Z', C1, 0, 0.28],              // pavilion right
  ]
  const whole = 'M7 3.5 H17 L21.5 9 L12 21 L2.5 9 Z'
  const out = [defs,
    P('M4 22.3 A8 1.2 0 1 0 20 22.3 A8 1.2 0 1 0 4 22.3 Z', { fill: SH, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P('M6 22.3 A6 0.9 0 1 0 18 22.3 A6 0.9 0 1 0 6 22.3 Z', { fill: SH, 'fill-opacity': 0.09 }, 'wm-shadow'),
    P(whole, { fill: C1, stroke: C1, 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, 'wm-k'),
  ]
  for (const [d, f, w, s] of F) {
    out.push(P(d, { fill: f, stroke: f, 'stroke-width': 0.3, 'stroke-linejoin': 'round' }, 'wm-k'))
    if (w) out.push(P(d, { fill: SN, 'fill-opacity': w }, 'wm-k'))
    if (s) out.push(P(d, { fill: SH, 'fill-opacity': s }, 'wm-k'))
  }
  out.push(
    P(whole, { fill: g0 }, 'wm-k'),
    // facet edges
    S('M2.5 9 H21.5 M10 3.5 L8.5 9 L12 21 M14 3.5 L15.5 9 L12 21', SN, 0.7, { 'stroke-opacity': 0.75 }, 'wm-k'),
    S(whole, SH, 0.6, { 'stroke-opacity': 0.25 }, 'wm-k'),
    // glints
    S('M5.8 7.3 L7.6 4.9', SN, 0.7, { 'stroke-opacity': 0.9 }, 'wm-shine'),
    P('M18.2 4.2 L18.6 5.4 L19.8 5.8 L18.6 6.2 L18.2 7.4 L17.8 6.2 L16.6 5.8 L17.8 5.4 Z', { fill: SN, 'fill-opacity': 0.95 }, 'wm-deco'),
  )
  return out
}
