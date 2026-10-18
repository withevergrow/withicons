// forge/hand/soft3d/baby-bottle.mjs — a tall baby bottle: a soft rounded teat on top, a thick coloured collar, a
// body with real shoulders and a rounded base, milk inside and three graduation marks down the left side. The generated
// bottle was a boxy, tilted block with a blocky top; here it stands upright and each part is a clear shape.
// Same studio recipe as the generated soft3d objects: contact shadow, wall in shade, face light, lit rim upper left.
// Roles (as the baby-bottle palettes): bottle c1, collar and marks c2, teat c3, milk c4. Motion: bottle wm-k, collar wm-a.
const N = 'baby-bottle'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#EEF1F5'), c2: v('c2', '#5BB8E8'), c3: v('c3', '#F2C27A'), c4: v('c4', '#CFE6F8'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const mv = (d, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x) : x + (i % 2 ? dy : dx)).map(f).join(' '))
const wall = (d, dx, dy, n = 4) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')

const BODY = 'M7.4 11.4C7.4 9.8 8.2 9 9.4 8.8L14.6 8.8C15.8 9 16.6 9.8 16.6 11.4L16.6 18.4A2.2 2.2 0 0 1 14.4 20.6L9.6 20.6A2.2 2.2 0 0 1 7.4 18.4Z'
const MILK = 'M8.3 13.4C10.3 12.6 13.7 12.6 15.7 13.4L15.7 18.2A1.6 1.6 0 0 1 14.1 19.8L9.9 19.8A1.6 1.6 0 0 1 8.3 18.2Z'
const COLLAR = 'M6.6 6.5A1 1 0 0 1 7.6 5.5L16.4 5.5A1 1 0 0 1 17.4 6.5L17.4 8.2A1 1 0 0 1 16.4 9.2L7.6 9.2A1 1 0 0 1 6.6 8.2Z'
const TEAT = 'M9.8 5.8C10.9 5.4 11 4.7 10.9 3.9C10.8 2.7 11.3 1.9 12 1.9C12.7 1.9 13.2 2.7 13.1 3.9C13 4.7 13.1 5.4 14.2 5.8Z'

export default function render() {
  const n = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.2)]],
    ['radialGradient', { id: id(1), cx: 0.36, cy: 0.3, r: 0.78 }, [stop(0, C.shine, 0.6), stop(0.5, C.shine, 0), stop(0.8, C.shadow, 0.05), stop(1, C.shadow, 0.24)]],
  ]]]
  // contact shadow
  n.push(P(ell(12.8, 21.2, 7.6, 1.3), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(12.8, 21.2, 6, 1), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(12.8, 21.2, 4.2, 0.7), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'))
  // teat
  const TW = wall(TEAT, 0.45, 0.4, 3)
  n.push(P(TW, { fill: C.c3 }, 'wm-k'), P(TW, { fill: C.shadow, 'fill-opacity': 0.26 }, 'wm-k'))
  n.push(P(TEAT, { fill: C.c3 }, 'wm-k'), P(TEAT, { fill: url(1) }, 'wm-k'))
  n.push(P('M11.2 5C11.35 4.2 11.2 3.4 11.5 2.9', { fill: 'none', stroke: C.shine, 'stroke-width': 0.45, 'stroke-opacity': 0.8, 'stroke-linecap': 'round' }, 'wm-shine'))
  // bottle: wall, face, milk, marks
  const BW = wall(BODY, 0.8, 0.6)
  n.push(P(BW, { fill: C.c1 }, 'wm-k'), P(BW, { fill: C.shadow, 'fill-opacity': 0.26 }, 'wm-k'))
  n.push(P(BODY, { fill: C.c1 }, 'wm-k'), P(BODY, { fill: url(0) }, 'wm-k'))
  n.push(P(MILK, { fill: C.c4 }, 'wm-k'), P(MILK, { fill: url(0) }, 'wm-k'))
  n.push(P('M8.3 13.4C10.3 12.6 13.7 12.6 15.7 13.4', { fill: 'none', stroke: C.shine, 'stroke-width': 0.5, 'stroke-opacity': 0.7, 'stroke-linecap': 'round' }, 'wm-shine'))
  n.push(P('M7.4 15.4L9.6 15.4M7.4 17.3L9.2 17.3M7.4 19.2L9.6 19.2', { fill: 'none', stroke: C.c2, 'stroke-width': 0.8, 'stroke-linecap': 'round' }, 'wm-s'))
  n.push(P('M8.8 17.8L8.8 11.6C8.8 10.8 9.2 10.2 9.9 10', { fill: 'none', stroke: C.shine, 'stroke-width': 0.6, 'stroke-opacity': 0.75, 'stroke-linecap': 'round' }, 'wm-shine'))
  // collar
  const CW = wall(COLLAR, 0.8, 0.6)
  n.push(P(CW, { fill: C.c2 }, 'wm-a'), P(CW, { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-a'))
  n.push(P(COLLAR, { fill: C.c2 }, 'wm-a'), P(COLLAR, { fill: url(0) }, 'wm-a'))
  n.push(P('M7.8 6.4L16.2 6.4', { fill: 'none', stroke: C.shine, 'stroke-width': 0.5, 'stroke-opacity': 0.6, 'stroke-linecap': 'round' }, 'wm-shine'))
  return n
}
