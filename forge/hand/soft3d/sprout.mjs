// forge/hand/soft3d/sprout.mjs — two clear symmetric leaves on a short stem over a flat soil bar, front-on like the line design,
// replacing the generated overlapping tilted leaves on a soil patch.
const N = 'sprout'
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const LEAF = v('c1', '#34A853'), VEIN = v('c2', '#9BE08A'), SOIL = v('c3', '#8A5838')
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const id = n => `wg-soft3d-${N}-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)

export default function render() {
  const defs = ['defs', {}, [
    ['radialGradient', { id: id(0), cx: 0.3, cy: 0.22, r: 0.95 }, [stop(0, SN, 0.55), stop(0.4, SN, 0.05), stop(0.72, SH, 0), stop(1, SH, 0.28)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 0, y2: 1 }, [stop(0, SN, 0.4), stop(0.45, SN, 0), stop(1, SH, 0.3)]],
  ]]
  const g0 = `url(#${id(0)})`, g1 = `url(#${id(1)})`
  const left = 'M12 13.2 C7.2 13.8 2.6 11 2.8 5 C8.2 4.6 11.8 7.6 12 13.2 Z'
  const right = 'M12 13.2 C16.8 13.8 21.4 11 21.2 5 C15.8 4.6 12.2 7.6 12 13.2 Z'
  const soil = 'M6.5 19.6 H17.5 A1 1 0 0 1 18.5 20.6 V20.9 A1 1 0 0 1 17.5 21.9 H6.5 A1 1 0 0 1 5.5 20.9 V20.6 A1 1 0 0 1 6.5 19.6 Z'
  return [
    defs,
    P('M5 22.1 A7 1.2 0 1 0 19 22.1 A7 1.2 0 1 0 5 22.1 Z', { fill: SH, 'fill-opacity': 0.07 }, 'wm-shadow'),
    P('M6.8 22.1 A5.2 0.9 0 1 0 17.2 22.1 A5.2 0.9 0 1 0 6.8 22.1 Z', { fill: SH, 'fill-opacity': 0.1 }, 'wm-shadow'),
    // stem
    S('M12 19.8 V11.5', LEAF, 2, {}, 'wm-k'),
    S('M12 19.8 V11.5', SH, 2, { 'stroke-opacity': 0.22 }, 'wm-k'),
    S('M11.4 19 V12.6', SN, 0.5, { 'stroke-opacity': 0.6 }, 'wm-shine'),
    // leaves
    P(left, { fill: LEAF }, 'wm-a'),
    P(left, { fill: g0 }, 'wm-a'),
    P(right, { fill: LEAF }, 'wm-a'),
    P(right, { fill: g0 }, 'wm-a'),
    S('M11 11.6 C8.8 10.4 6.6 8.6 5.4 6.4', VEIN, 0.8, { 'stroke-opacity': 0.9 }, 'wm-a'),
    S('M13 11.6 C15.2 10.4 17.4 8.6 18.6 6.4', VEIN, 0.8, { 'stroke-opacity': 0.9 }, 'wm-a'),
    S('M4.2 6.4 C5.6 5.6 7.6 5.7 9.2 6.6', SN, 0.5, { 'stroke-opacity': 0.7 }, 'wm-shine'),
    S('M19.8 6.4 C18.4 5.6 16.4 5.7 14.8 6.6', SN, 0.5, { 'stroke-opacity': 0.35 }, 'wm-shine'),
    // soil bar
    P(soil, { fill: SOIL }, 'wm-k'),
    P(soil, { fill: g1 }, 'wm-k'),
    S('M6.8 20.1 H17.2', SN, 0.4, { 'stroke-opacity': 0.55 }, 'wm-shine'),
  ]
}
