// forge/hand/clay/laugh.mjs — a laughing face in pink clay: a plump round head, two thin inked ^ ^ eyes, and a wide open
// D-shaped mouth with a row of pale teeth along the top and a pink tongue at the bottom. The generated face swallowed
// the mouth in yellow blobs and drew the eyes as fat tubes; here the features are small and inked so they read at 16px.
// Same recipe as the generated clay (radial face tint -> body -> shade, a darker wall under the head, a lit crescent,
// a crisp specular, a soft ground shadow).
const V = (r, h) => `var(--with-clay-${r}, ${h})`
export default function render() {
  const id = i => `wg-clay-laugh-${i}`
  const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const SH = V('shadow', '#6A1041')
  const defs = ['defs', {}, [
    ['radialGradient', { id: id(0), cx: 12, cy: 21.4, r: 8, gradientUnits: 'userSpaceOnUse' }, [stop(0, SH, 0.3), stop(0.55, SH, 0.2), stop(1, SH, 0)]],
    ['radialGradient', { id: id(1), cx: 8.8, cy: 5.2, r: 17, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('tint', '#FFE1EF')), stop(0.45, V('c1', '#FF7AB6')), stop(1, SH)]],
    ['linearGradient', { id: id(2), x1: 5, y1: 4, x2: 19, y2: 21, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('shine', '#FFFFFF'), 0.2), stop(0.5, SH, 0), stop(1, SH, 0.6)]],
    ['linearGradient', { id: id(3), x1: 0, y1: 14.2, x2: 0, y2: 16, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('c1', '#FF7AB6')), stop(1, V('c1', '#FF7AB6'), 0.75)]],
  ]]
  const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const MOUTH = 'M8.4 12.2H15.6A3.6 3.6 0 0 1 8.4 12.2Z'
  return [
    defs,
    ['ellipse', { cx: 12, cy: 21.4, rx: 7.8, ry: 1.3, fill: `url(#${id(0)})`, class: 'wm-shadow' }],
    // wall, then the lit face
    ['circle', { cx: 12.1, cy: 11.7, r: 8.8, fill: SH, 'fill-opacity': 0.6, class: 'wm-k' }],
    ['circle', { cx: 12, cy: 10.8, r: 8.8, fill: `url(#${id(1)})`, stroke: `url(#${id(2)})`, 'stroke-width': 0.42, class: 'wm-k' }],
    // ^ ^ eyes: a soft light lip under each inked arc
    ['path', { d: 'M7.95 9.4A1.4 1.4 0 0 1 10.75 9.4', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': 0.5, 'stroke-width': 1.15, ...round, class: 'wm-shine' }],
    ['path', { d: 'M13.25 9.4A1.4 1.4 0 0 1 16.05 9.4', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': 0.5, 'stroke-width': 1.15, ...round, class: 'wm-shine' }],
    ['path', { d: 'M7.95 9.1A1.4 1.4 0 0 1 10.75 9.1', stroke: V('ink', '#2A1D5C'), 'stroke-width': 1.05, ...round, class: 'wm-a' }],
    ['path', { d: 'M13.25 9.1A1.4 1.4 0 0 1 16.05 9.1', stroke: V('ink', '#2A1D5C'), 'stroke-width': 1.05, ...round, class: 'wm-a' }],
    // open mouth: a dark pit, pale teeth along the flat top, a pink tongue low in it
    ['path', { d: 'M8.4 12.55H15.6A3.6 3.6 0 0 1 8.4 12.55Z', fill: V('shine', '#FFFFFF'), 'fill-opacity': 0.5, stroke: V('shine', '#FFFFFF'), 'stroke-opacity': 0.5, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['path', { d: MOUTH, fill: V('ink', '#2A1D5C'), stroke: V('ink', '#2A1D5C'), 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M8.95 12.2H15.05V12.95Q15.05 13.25 14.75 13.25H9.25Q8.95 13.25 8.95 12.95Z', fill: V('tint', '#FFE1EF'), class: 'wm-a' }],
    ['path', { d: 'M9.9 15.15Q10.5 13.85 12 13.85Q13.5 13.85 14.1 15.15A3.2 3.2 0 0 1 9.9 15.15Z', fill: `url(#${id(3)})`, class: 'wm-a' }],
    ['path', { d: 'M12 14.1V14.9', stroke: SH, 'stroke-opacity': 0.4, 'stroke-width': 0.35, ...round, class: 'wm-a' }],
    // glow and specular
    ['path', { d: 'M5.9 7.4C6.7 5.2 8.5 4 10.6 3.7', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': 0.6, 'stroke-width': 0.8, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['ellipse', { cx: 8.1, cy: 5.4, rx: 1.1, ry: 0.55, fill: V('shine', '#FFFFFF'), 'fill-opacity': 0.85, class: 'wm-shine' }],
  ]
}
