// forge/hand/halloween/salad.mjs — a footed purple bowl heaped with ONE frilly green lettuce mound (a single scalloped
// silhouette, not separate leaves), two round tomatoes and a pale cucumber slice. Reads as salad at 16px: green heap,
// red dots, bowl. The generated drawing was a cluster of overlapping leaves with a pumpkin face.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), C3 = V('c3', '#8B55E0')
const C4 = V('c4', '#86D13A'), ACCENT = V('accent', '#FFB52E'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const EDGE = V('edge', '#7344C9'), TINT = V('tint', '#E9DDFB')
const id = n => `wg-halloween-salad-${n}`
const r2 = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`
const ink = { stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const stop = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const rnd = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

// the lettuce heap: six round frills along the top, flat underneath (the bowl hides the base)
const HEAP = 'M3.6 13A2.4 2.4 0 0 1 4.2 8.5A2.4 2.4 0 0 1 7.6 6.2A2.5 2.5 0 0 1 12 5.4A2.5 2.5 0 0 1 16.4 6.2A2.4 2.4 0 0 1 19.8 8.5A2.4 2.4 0 0 1 20.4 13Z'
const BOWL = 'M2.5 12.4H21.5C21.5 17 18.2 19.8 14.5 19.8H9.5C5.8 19.8 2.5 17 2.5 12.4Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 10, r: 10, fx: 8, fy: 5.5, gradientUnits: 'userSpaceOnUse' }, [stop(0, C4), stop(0.6, C4), stop(1, C4, 0.82)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 16, r: 11, fx: 7.5, fy: 12.5, gradientUnits: 'userSpaceOnUse' }, [stop(0, C3), stop(0.45, C3), stop(1, EDGE)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12, r: 12, gradientUnits: 'userSpaceOnUse' }, [stop(0, ACCENT, 0.3), stop(0.55, ACCENT, 0.13), stop(1, ACCENT, 0)]],
      // tomatoes
      ['radialGradient', { id: id(3), cx: 8, cy: 10.4, r: 2.6, fx: 7.1, fy: 9.2, gradientUnits: 'userSpaceOnUse' }, [stop(0, ACCENT), stop(0.4, C1), stop(1, C2)]],
      ['radialGradient', { id: id(4), cx: 16.4, cy: 10.2, r: 2.6, fx: 15.5, fy: 9, gradientUnits: 'userSpaceOnUse' }, [stop(0, ACCENT), stop(0.4, C1), stop(1, C2)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(2)})`, class: 'wm-deco' }],
    ['path', { d: 'M3.1 13.2H21.9V13.4C21.9 18 18.6 20.7 14.9 20.7H9.1C5.4 20.7 2.1 18 2.1 13.4Z', fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // lettuce heap
    ['path', { d: HEAP, fill: `url(#${id(0)})`, ...ink, class: 'wm-a' }],
    // frill creases running down from the valleys between the frills
    ['path', { d: 'M5.6 8.9Q6.7 10.2 6.4 12M9.9 6.5Q10.5 8.4 9.6 10M14.1 6.5Q13.5 8.4 14.4 10M18.4 8.9Q17.3 10.2 17.6 12', ...rnd, stroke: EDGE, 'stroke-opacity': 0.75, 'stroke-width': 0.6, class: 'wm-a' }],
    // cucumber slice peeking out of the top: pale rim, green flesh, seed ring
    ['path', { d: disc(12, 8.4, 2.3), fill: SHINE, ...ink, class: 'wm-k' }],
    ['path', { d: disc(12, 8.4, 1.45), fill: C4, stroke: EDGE, 'stroke-width': 0.4, class: 'wm-k' }],
    ['path', { d: 'M11.2 7.6V7.7M12.8 7.6V7.7M12 9.3V9.4', ...rnd, stroke: SHINE, 'stroke-width': 0.7, class: 'wm-k' }],
    // tomatoes
    ['path', { d: disc(8, 10.4, 2.3), fill: `url(#${id(3)})`, ...ink, class: 'wm-k' }],
    ['path', { d: disc(16.4, 10.2, 2.3), fill: `url(#${id(4)})`, ...ink, class: 'wm-k' }],
    ['path', { d: 'M6.9 8.9L8 9.5L9.1 8.9M15.3 8.7L16.4 9.3L17.5 8.7', ...rnd, stroke: INK, 'stroke-width': 0.55, class: 'wm-k' }],
    ['path', { d: 'M6.6 10.5A1.7 1.7 0 0 1 7.4 9.4M15 10.3A1.7 1.7 0 0 1 15.8 9.2', ...rnd, stroke: SHINE, 'stroke-opacity': 0.75, 'stroke-width': 0.5, class: 'wm-shine' }],
    // foot, then the bowl in front of the heap
    ['path', { d: 'M9.5 19.6V21.4H14.5V19.6Z', fill: EDGE, ...ink, class: 'wm-k' }],
    ['path', { d: BOWL, fill: `url(#${id(1)})`, ...ink, class: 'wm-k' }],
    ['path', { d: 'M3.9 13.1H20.1', ...rnd, stroke: SHINE, 'stroke-opacity': 0.45, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M4.5 14.6Q5.3 16.5 7.2 17.6', ...rnd, stroke: SHINE, 'stroke-opacity': 0.45, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
