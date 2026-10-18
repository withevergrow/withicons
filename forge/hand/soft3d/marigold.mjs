// forge/hand/soft3d/marigold.mjs — a front-facing marigold: a scalloped orange bloom of twelve fat lobes with a raised
// ring of lighter golden petals in the middle and a deep orange centre dot, as in line. The generated flower had a dark
// muddy disc and blotchy body that hid the inner flower; here the outer bloom is one clean orange mass creased between
// the lobes, and the light inner flower is the readable focal shape.
// Same studio recipe as the other soft3d objects: contact shadow, shaded wall to the lower right, lit rim upper left.
// Roles: bloom c1, inner petals c2, centre c3. Motion: bloom wm-k, inner flower + centre wm-a (it spins), shadow wm-shadow.
const N = 'marigold'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#F28A2E'), c2: v('c2', '#FFC21F'), c3: v('c3', '#D9561A'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const mv = (d, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x) : x + (i % 2 ? dy : dx)).map(f).join(' '))
const wall = (d, dx, dy, n = 4) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const slab = (d, col, g, cls, dx = 0.8, dy = 0.65) => {
  const W = wall(d, dx, dy)
  return [P(W, { fill: col }, cls), P(W, { fill: C.shadow, 'fill-opacity': 0.3 }, cls), P(d, { fill: col }, cls), P(d, { fill: url(g) }, cls)]
}
// a scalloped flower: n round lobes, each an arc between neighbouring points on a circle of radius R
const bloom = (cx, cy, R, n, rot = 0) => {
  const pts = Array.from({ length: n }, (_, i) => { const a = rot + i * 2 * Math.PI / n; return [cx + R * Math.cos(a), cy + R * Math.sin(a)] })
  const r = R * Math.sin(Math.PI / n) * 1.04
  return `M${f(pts[0][0])} ${f(pts[0][1])}` + pts.slice(1).concat([pts[0]]).map(p => `A${f(r)} ${f(r)} 0 0 1 ${f(p[0])} ${f(p[1])}`).join('') + 'Z'
}
const valleys = (cx, cy, R0, R1, n, rot) => Array.from({ length: n }, (_, i) => {
  const a = rot + (i + 0.5) * 2 * Math.PI / n
  return `M${f(cx + R0 * Math.cos(a))} ${f(cy + R0 * Math.sin(a))}L${f(cx + R1 * Math.cos(a))} ${f(cy + R1 * Math.sin(a))}`
}).join('')

const CX = 11.7, CY = 11.6
const OUTER = bloom(CX, CY, 7.7, 12, -Math.PI / 2)
const INNER = bloom(CX, CY, 3.9, 8, -Math.PI / 2 + Math.PI / 8)

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.2)]],
      ['radialGradient', { id: id(1), cx: 0.36, cy: 0.3, r: 0.78 }, [stop(0, C.shine, 0.5), stop(0.5, C.shine, 0), stop(0.8, C.shadow, 0.05), stop(1, C.shadow, 0.24)]],
    ]],
    P(ell(12.2, 21.3, 8.6, 1.4), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P(ell(12.2, 21.3, 6.9, 1.1), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P(ell(12.2, 21.3, 5, 0.8), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the bloom: twelve fat lobes creased where they meet
    ...slab(OUTER, C.c1, 1, 'wm-k'),
    S(valleys(CX, CY, 5.4, 7.2, 12, -Math.PI / 2 + Math.PI / 12), C.shadow, 0.55, { 'stroke-opacity': 0.22 }, 'wm-k'),
    S(`M${f(CX - 6.9)} ${f(CY - 2.6)}C${f(CX - 6.2)} ${f(CY - 5.4)} ${f(CX - 3.8)} ${f(CY - 7.1)} ${f(CX - 1)} ${f(CY - 7.3)}`, C.shine, 0.7, { 'stroke-opacity': 0.8 }, 'wm-shine'),
    // the inner ring of light petals and the centre dot
    ...slab(INNER, C.c2, 1, 'wm-a', 0.45, 0.4),
    S(valleys(CX, CY, 1.9, 3.3, 8, -Math.PI / 2 + Math.PI / 4 + Math.PI / 8), C.shadow, 0.4, { 'stroke-opacity': 0.2 }, 'wm-a'),
    P(ell(CX, CY, 1.45, 1.45), { fill: C.c3 }, 'wm-a'),
    P(ell(CX, CY, 1.45, 1.45), { fill: url(0) }, 'wm-a'),
    S(`M${f(CX - 0.7)} ${f(CY - 0.6)}C${f(CX - 0.4)} ${f(CY - 0.9)} ${f(CX)} ${f(CY - 0.95)} ${f(CX + 0.3)} ${f(CY - 0.8)}`, C.shine, 0.35, { 'stroke-opacity': 0.8 }, 'wm-shine'),
    S(`M${f(CX - 3.3)} ${f(CY - 1.4)}C${f(CX - 2.9)} ${f(CY - 2.6)} ${f(CX - 2)} ${f(CY - 3.3)} ${f(CX - 0.9)} ${f(CY - 3.5)}`, C.shine, 0.45, { 'stroke-opacity': 0.9 }, 'wm-shine'),
  ]
}
