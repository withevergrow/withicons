// forge/hand/soft3d/apple.mjs — a whole glossy red apple: a round two-lobed body with a soft top dimple, a short brown
// stem and a green leaf with a vein, lit from the upper left with a crisp studio highlight. The generated apple drew
// the skeleton's highlight arc as a cut, so it read as a sliced, half-eaten apple; this one is one unbroken fruit.
// Same studio recipe as the generated soft3d food: contact shadow, a shaded body edge to the lower right, face light.
// Roles (as the apple palettes): skin c1, deep skin c2, leaf c3, stem ink. Motion: apple wm-k, stem + leaf wm-a
// (they sway from the stem top).
const N = 'apple'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = {
  c1: v('c1', '#E5483F'), c2: v('c2', '#B8283A'), c3: v('c3', '#4FB463'), ink: v('ink', '#6B3F2A'),
  shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130'),
}
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const mv = (d, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x) : x + (i % 2 ? dy : dx)).map(f).join(' '))
const wall = (d, dx, dy, n = 4) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')

const BODY = 'M12 8.7C14.7 6.6 20.2 7.3 20.2 13.1C20.2 17.6 17.3 20.9 14.7 20.9C13.6 20.9 13 20.4 12 20.4C11 20.4 10.4 20.9 9.3 20.9C6.7 20.9 3.8 17.6 3.8 13.1C3.8 7.3 9.3 6.6 12 8.7Z'
const LEAF = 'M12.6 6.3C12.9 4.2 14.9 2.9 17.8 3C17.4 5.1 15.4 6.6 12.6 6.3Z'

export default function render() {
  const n = [['defs', {}, [
    ['radialGradient', { id: id(0), cx: 8.6, cy: 11.2, r: 11.6, gradientUnits: 'userSpaceOnUse' }, [stop(0, C.shine, 0.5), stop(0.28, C.shine, 0.06), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.32)]],
    ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.24)]],
  ]]]
  // contact shadow
  n.push(P(ell(12.5, 21.3, 8.8, 1.4), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'))
  n.push(P(ell(12.5, 21.3, 7, 1.1), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'))
  n.push(P(ell(12.5, 21.3, 5.1, 0.8), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'))
  // stem behind the body top
  n.push(P('M12 9.2C12 7.6 11.7 5.6 10.8 3.9', { fill: 'none', stroke: C.ink, 'stroke-width': 1.25, 'stroke-linecap': 'round' }, 'wm-a'))
  n.push(P('M11.55 8.6C11.5 7.3 11.25 5.8 10.6 4.5', { fill: 'none', stroke: C.shine, 'stroke-width': 0.35, 'stroke-opacity': 0.45, 'stroke-linecap': 'round' }, 'wm-shine'))
  // the body's round far side in deep skin, then the skin
  const W = wall(BODY, 0.55, 0.5, 3)
  n.push(P(W, { fill: C.c2 }, 'wm-k'), P(W, { fill: C.shadow, 'fill-opacity': 0.2 }, 'wm-k'))
  n.push(P(BODY, { fill: C.c1 }, 'wm-k'), P(BODY, { fill: url(0) }, 'wm-k'))
  // the top dimple around the stem
  n.push(P('M10.1 8.55C11 9.25 13 9.25 13.9 8.55', { fill: 'none', stroke: C.shadow, 'stroke-width': 0.6, 'stroke-opacity': 0.22, 'stroke-linecap': 'round' }, 'wm-k'))
  // studio highlight and a rim light on the shaded lower right
  n.push(P('M6.3 14.6C6.1 12.2 7.1 10.4 9 9.6', { fill: 'none', stroke: C.shine, 'stroke-width': 1.2, 'stroke-opacity': 0.75, 'stroke-linecap': 'round' }, 'wm-shine'))
  n.push(P(ell(9.9, 9.35, 0.42, 0.42), { fill: C.shine, 'fill-opacity': 0.8 }, 'wm-shine'))
  n.push(P('M18.9 15.8C18.2 17.9 16.7 19.6 15.1 20', { fill: 'none', stroke: C.shine, 'stroke-width': 0.45, 'stroke-opacity': 0.35, 'stroke-linecap': 'round' }, 'wm-shine'))
  // leaf: a little thickness, the face, a vein
  n.push(P(mv(LEAF, 0.3, 0.35), { fill: C.c3 }, 'wm-a'), P(mv(LEAF, 0.3, 0.35), { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-a'))
  n.push(P(LEAF, { fill: C.c3 }, 'wm-a'), P(LEAF, { fill: url(1) }, 'wm-a'))
  n.push(P('M13.3 5.7C14.4 4.8 15.6 4.1 16.8 3.7', { fill: 'none', stroke: C.shine, 'stroke-width': 0.4, 'stroke-opacity': 0.55, 'stroke-linecap': 'round' }, 'wm-shine'))
  return n
}
