// forge/hand/soft3d/spider.mjs — a dangling spider: a silk thread from the top, a round head with two bright eyes over a
// plump abdomen with an orange mark, and eight long jointed legs bent out and down from the front of the body. The
// generated spider lost its thread and had stubby grey lumps for legs; here the thread is a clear line, the legs are
// long two-segment strokes with real elbows, and the body is two glossy dark spheres so it reads at 16px.
// Same studio recipe as the generated soft3d creatures: contact shadow, shade to the lower right, lit rim upper left.
// Roles (as the spider palettes): body and legs c1, mark c2, thread c4. Motion: legs wm-a, body wm-k.
const N = 'spider'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#4B3F72'), c2: v('c2', '#F28A2E'), c4: v('c4', '#C9CFDA'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const mv = (d, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x) : x + (i % 2 ? dy : dx)).map(f).join(' '))

const ABD = ell(12, 15.4, 3.7, 4.1)
const HEAD = ell(12, 9.6, 2.5, 2.4)
const LEGL = 'M10 10.4L6.6 7L3.6 8.8M9 13.2L4.4 11.6L2.4 14.2M9 16.2L4.6 17L3.2 20.2M10.2 18.6L7.8 20.4L7.2 22'
const LEGR = 'M14 10.4L17.4 7L20.4 8.8M15 13.2L19.6 11.6L21.6 14.2M15 16.2L19.4 17L20.8 20.2M13.8 18.6L16.2 20.4L16.8 22'

export default function render() {
  const n = [['defs', {}, [
    ['radialGradient', { id: id(0), cx: 0.34, cy: 0.3, r: 0.8 }, [stop(0, C.shine, 0.5), stop(0.45, C.shine, 0), stop(0.8, C.shadow, 0.1), stop(1, C.shadow, 0.34)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.3), stop(0.5, C.shine, 0), stop(1, C.shadow, 0.2)]],
  ]]]
  // contact shadow
  n.push(P(ell(12.6, 21.7, 7.4, 1.1), { fill: C.shadow, 'fill-opacity': 0.05 }, 'wm-shadow'))
  n.push(P(ell(12.6, 21.7, 5.4, 0.8), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'))
  // the silk thread
  n.push(P('M12 1.8L12 7.4', { fill: 'none', stroke: C.c4, 'stroke-width': 0.8, 'stroke-linecap': 'round' }, 'wm-k'))
  n.push(P('M11.7 2.4L11.7 6', { fill: 'none', stroke: C.shine, 'stroke-width': 0.3, 'stroke-opacity': 0.8, 'stroke-linecap': 'round' }, 'wm-shine'))
  // legs: shaded underside, then the dark leg, then a soft light along it
  const lg = { fill: 'none', 'stroke-width': 1.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  for (const L of [LEGL, LEGR]) {
    n.push(P(mv(L, 0.35, 0.5), { ...lg, stroke: C.c1 }, 'wm-a'), P(mv(L, 0.35, 0.5), { ...lg, stroke: C.shadow, 'stroke-opacity': 0.4 }, 'wm-a'))
    n.push(P(L, { ...lg, stroke: C.c1 }, 'wm-a'), P(L, { ...lg, stroke: url(1) }, 'wm-a'))
  }
  n.push(P('M9.6 9.8L6.9 7.2M14.4 9.8L17.1 7.2', { fill: 'none', stroke: C.shine, 'stroke-width': 0.4, 'stroke-opacity': 0.5, 'stroke-linecap': 'round' }, 'wm-shine'))
  // abdomen: wall, sphere, mark
  const AW = mv(ABD, 0.35, 0.5) + mv(ABD, 0.7, 1)
  n.push(P(AW, { fill: C.c1 }, 'wm-k'), P(AW, { fill: C.shadow, 'fill-opacity': 0.34 }, 'wm-k'))
  n.push(P(ABD, { fill: C.c1 }, 'wm-k'), P(ABD, { fill: url(0) }, 'wm-k'))
  n.push(P('M12 12.9C13 13.9 13 14.7 12 15.5C11 14.7 11 13.9 12 12.9ZM12 15.9C12.9 16.7 12.9 17.5 12 18.3C11.1 17.5 11.1 16.7 12 15.9Z', { fill: C.c2 }, 'wm-a'))
  n.push(P('M9.5 13.6C9.8 12.7 10.5 12.1 11.4 11.9', { fill: 'none', stroke: C.shine, 'stroke-width': 0.6, 'stroke-opacity': 0.75, 'stroke-linecap': 'round' }, 'wm-shine'))
  // head: wall, sphere, eyes
  const HW = mv(HEAD, 0.3, 0.4) + mv(HEAD, 0.6, 0.8)
  n.push(P(HW, { fill: C.c1 }, 'wm-k'), P(HW, { fill: C.shadow, 'fill-opacity': 0.34 }, 'wm-k'))
  n.push(P(HEAD, { fill: C.c1 }, 'wm-k'), P(HEAD, { fill: url(0) }, 'wm-k'))
  n.push(P(ell(11.1, 9.5, 0.75, 0.85) + ell(12.9, 9.5, 0.75, 0.85), { fill: C.shine }, 'wm-s'))
  n.push(P(ell(11.2, 9.6, 0.32, 0.4) + ell(13, 9.6, 0.32, 0.4), { fill: C.shadow }, 'wm-s'))
  n.push(P('M10.1 8.5C10.4 7.9 10.9 7.6 11.5 7.5', { fill: 'none', stroke: C.shine, 'stroke-width': 0.5, 'stroke-opacity': 0.7, 'stroke-linecap': 'round' }, 'wm-shine'))
  return n
}
