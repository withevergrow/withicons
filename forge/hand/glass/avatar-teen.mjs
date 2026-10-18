// forge/hand/glass/avatar-teen.mjs — Glass teen in a hoodie, hand-drawn: the earlier drawing read as a purple blob with
// a tiny face. Here the peaked hood runs into broad shoulders as deep violet glass, its opening a dark lining hugging a
// large clear frosted face (solid etch eyes, a smile, a side-swept fringe tuft) with two frosted drawstrings ending in
// pink aglets. Roles: back/shadow body, pane/frost glass, accent glow + aglets, etch face, shine rim.
// Motion: body wm-k, face wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, intersectSets, setOf } from '../../kernel/bool.mjs'

const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.2).map(s => setOf([s.pts])))
const D = (s, t = 0.05) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
const tf = d => d.replace(/([MLHVCQZ])([^MLHVCQZ]*)/g, (m, c, a) => c + (a.match(/-?\d*\.?\d+/g) || []).map(Number).map(X).join(' '))
const oval = (cx, cy, rx, ry = rx) => { const kx = f2(rx * 0.5523), ky = f2(ry * 0.5523); return `M${cx} ${cy - ry} C${cx + kx} ${cy - ry} ${cx + rx} ${cy - ky} ${cx + rx} ${cy} C${cx + rx} ${cy + ky} ${cx + kx} ${cy + ry} ${cx} ${cy + ry} C${cx - kx} ${cy + ry} ${cx - rx} ${cy + ky} ${cx - rx} ${cy} C${cx - rx} ${cy - ky} ${cx - kx} ${cy - ry} ${cx} ${cy - ry} Z` }
const SHOULDERS = 'M3.5 21 C3.5 18.6 5.4 17 7.9 17 C9.4 17 10.6 17.9 12 17.9 C13.4 17.9 14.6 17 16.1 17 C18.6 17 20.5 18.6 20.5 21 C20.5 21.55 20.05 22 19.5 22 H4.5 C3.95 22 3.5 21.55 3.5 21 Z'

// paint a stack of pieces (back to front): [set, kind] with kind skin | hair | lining; returns { out, defs }
function paint(name, P, { glow = [15, 18, 7.5], hairGrad = [3, 2, 20, 18], hairFrost = 0.36 } = {}) {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBack = grad('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: glow[0], cy: glow[1], r: glow[2] }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 5, y1: 3, x2: 18, y2: 21 }, [stop(0, V.frost, 0.7), stop(0.4, V.tint, 0.62), stop(1, V.tint, 0.5)])
  const gHair = grad('linearGradient', { x1: hairGrad[0], y1: hairGrad[1], x2: hairGrad[2], y2: hairGrad[3] }, [stop(0, V.frost, hairFrost), stop(0.5, V.tint, f2(hairFrost * 0.42)), stop(1, V.tint, f2(hairFrost * 0.2))])
  const sets = P.map(([s]) => place(s))
  const vis = sets.map((s, i) => i < sets.length - 1 ? tidy(differenceSets(s, unionSets(sets.slice(i + 1)))) : s)
  const back = s => translateSet(tidy(erode(s, 0.3)), 0.8, 0.8)
  const all = tidy(unionSets(sets.map(back)))
  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.14), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.1), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const bd = D(all, 0.07)
  out.push(['path', { d: bd, fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: bd, fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  vis.forEach((s, i) => {
    const kind = P[i][1]
    if (kind === 'lining') out.push(['path', { d: D(s), fill: V.shadow, 'fill-opacity': 0.5, ...EDGE, 'stroke-opacity': 0.18, 'fill-rule': 'evenodd', class: 'wm-k' }])
    else out.push(['path', { d: D(s), fill: kind === 'skin' ? gPane : gHair, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  })
  vis.forEach((s, i) => { if (P[i][1] !== 'lining') out.push(['path', { d: D(rimOf(s)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }]) })
  return { out, defs, grad }
}
const eyes = (xs, y, rx = 0.78, ry = 0.98) => xs.map(x => ['ellipse', { cx: X(x), cy: X(y), rx, ry, fill: V.etch, 'fill-opacity': 0.92, class: 'wm-a' }])
const smile = (d, extra = {}) => ['path', { d: tf(d), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.85, 'stroke-width': 0.85, 'stroke-linecap': 'round', class: 'wm-a', ...extra }]
const glints = (xs, y) => ['path', { d: tf(xs.map(x => `M${x - 0.25} ${y - 0.35} L${x - 0.2} ${y - 0.4}`).join(' ')), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a' }]

const NAME = 'avatar-teen'
const HOODIE = 'M3.6 21 C3.6 19.5 4.3 18.5 5.6 17.8 C4.1 16 3.3 13.8 3.3 11.7 C3.3 6.9 6.9 3.1 12 2.1 C17.1 3.1 20.7 6.9 20.7 11.7 C20.7 13.8 19.9 16 18.4 17.8 C19.7 18.5 20.4 19.5 20.4 21 C20.4 21.55 19.95 22 19.4 22 H4.6 C4.05 22 3.6 21.55 3.6 21 Z'
const OPENING = oval(12, 11.7, 6.6, 6.9)
const FACE = oval(12, 11.8, 5.75, 6)
const FRINGE = 'M2 2 H22 V8.6 H17 C15.5 8.4 14.3 7.7 13.6 6.8 C12.5 8.5 10.2 9.4 6.5 9.2 L2 9.2 Z'
export default function render(icon) {
  const name = (icon && icon.name) || NAME
  const face = area(FACE), fringe = intersectSets(face, area(FRINGE))
  const P = [
    [area(HOODIE), 'hair'],
    [tidy(differenceSets(area(OPENING), face)), 'lining'],
    [tidy(differenceSets(face, fringe)), 'skin'],
    [fringe, 'hair'],
  ]
  const { out, defs } = paint(name, P, { hairFrost: 0.3, glow: [15, 18.5, 7.5] })
  out.push(...eyes([9.9, 14.1], 12.2, 0.8, 1))
  out.push(glints([9.9, 14.1], 12.2))
  out.push(smile('M10.3 14.8 C11.1 15.7 12.9 15.7 13.7 14.8'))
  // drawstrings: frosted cords with a pink aglet each
  out.push(['path', { d: tf('M10.2 18.5 V20.2 M13.8 18.5 V20.2'), fill: 'none', stroke: V.frost, 'stroke-opacity': 0.95, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-s' }])
  for (const x of [10.2, 13.8]) out.push(['circle', { cx: X(x), cy: X(20.65), r: 0.55, fill: V.accent, class: 'wm-s' }])
  return [['defs', {}, defs], ...out]
}
