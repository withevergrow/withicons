// forge/hand/soft3d/map.mjs: a paper tri-fold road map in soft 3D: three zigzag panels (left and right lit, middle folded
// back and shaded), a green park and blue river, a red pin and route, with two pale fold slots between the panels.
const N = 'map'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#F3E7D3'), c2: v('c2', '#4FB463'), c3: v('c3', '#5BB8E8'), acc: v('accent', '#E5483F'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const g = `url(#wg-soft3d-${N}-0)`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P1 = 'M3 6.2L9 3.7V18.2L3 20.7Z', P2 = 'M9 3.7L15 6.2V20.7L9 18.2Z', P3 = 'M15 6.2L21 3.7V18.2L15 20.7Z'
const ALL = 'M3 6.2L9 3.7L15 6.2L21 3.7V18.2L15 20.7L9 18.2L3 20.7Z'
export default function render() {
  return [
    ['defs', {}, [['linearGradient', { id: `wg-soft3d-${N}-0`, x1: 0, y1: 0, x2: 1, y2: 1 }, [
      stop(0, C.shine, 0.45), stop(0.4, C.shine, 0), stop(0.65, C.shadow, 0), stop(1, C.shadow, 0.2)]]]],
    ['ellipse', { cx: 12, cy: 22, rx: 9.6, ry: 1.2, fill: C.shadow, 'fill-opacity': 0.1, class: 'wm-shadow' }],
    ['path', { d: 'M3 7.2L9 4.7L15 7.2L21 4.7V19.2L15 21.7L9 19.2L3 21.7Z', fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-k' }],
    ['path', { d: P1, fill: C.c1, class: 'wm-k' }],
    ['path', { d: P2, fill: C.c1, class: 'wm-k' }],
    ['path', { d: P3, fill: C.c1, class: 'wm-k' }],
    ['path', { d: P2, fill: C.shadow, 'fill-opacity': 0.14, class: 'wm-k' }],
    ['path', { d: 'M4.1 12L7.9 10.4V14.2L4.1 15.8Z', fill: C.c2, class: 'wm-a' }],
    ['path', { d: 'M10 8.2C11.4 11.6 13.2 10.4 14 14.6', stroke: C.c3, 'stroke-width': 1.5, 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }],
    ['path', { d: 'M16.1 15.8L19.9 14.2V17.2L16.1 18.8Z', fill: C.c2, class: 'wm-a' }],
    ['path', { d: 'M18.1 6.4a1.9 1.9 0 1 1-.01 0z', fill: C.acc, class: 'wm-s' }],
    ['path', { d: 'M18.1 7.7a0.7 0.7 0 1 1-.01 0z', fill: C.shine, class: 'wm-s' }],
    ['path', { d: ALL, fill: g, class: 'wm-k' }],
    ['path', { d: 'M9 4.4V17.6M15 6.9V20', stroke: C.shine, 'stroke-width': 0.8, 'stroke-opacity': 0.85, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    ['path', { d: ALL, stroke: C.shadow, 'stroke-width': 0.7, 'stroke-opacity': 0.3, 'stroke-linejoin': 'round', fill: 'none', class: 'wm-k' }],
    ['path', { d: 'M3.6 5.9L8.6 3.9', stroke: C.shine, 'stroke-width': 0.8, 'stroke-opacity': 0.8, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
