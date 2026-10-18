// forge/hand/glass/avatar-woman.mjs — Glass woman with long hair, hand-drawn: the old drawing's centre-parted fringe cut the face
// into a faceless water drop. Here a deep violet glass hair dome sweeps over a side-parted fringe and falls in two long locks past
// the chin onto the shoulders, framing a clear frosted oval face (solid etch eyes, a smile) over its own shoulder pane.
// Roles: back/shadow body, pane/frost glass, accent glow, etch face, shine rim. Motion: body wm-k, face wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, intersectSets, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const area = d => unionSets(parsePath(d, 0.2).map(s => setOf([s.pts])))
const D = (s, t = 0.05) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
const oval = (cx, cy, rx, ry = rx) => { const kx = f2(rx * 0.5523), ky = f2(ry * 0.5523); return `M${cx} ${cy - ry} C${cx + kx} ${cy - ry} ${cx + rx} ${cy - ky} ${cx + rx} ${cy} C${cx + rx} ${cy + ky} ${cx + kx} ${cy + ry} ${cx} ${cy + ry} C${cx - kx} ${cy + ry} ${cx - rx} ${cy + ky} ${cx - rx} ${cy} C${cx - rx} ${cy - ky} ${cx - kx} ${cy - ry} ${cx} ${cy - ry} Z` }
const mir = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, a, b) => `${f2(24 - a)} ${b}`)
// placement of skeleton coordinates onto the page (scale about the centre, nudged up-left to leave room for the offset colour body)
const mk = (S, ox = 0.5, oy = 0.5) => {
  const X = v => f2(12 + (v - 12) * S - ox), Y = v => f2(12 + (v - 12) * S - oy)
  const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - ox, 12 + (y - 12) * S - oy])))
  const tf = d => { let i = 0; return d.replace(/([MLHVCQZ])([^MLHVCQZ]*)/g, (m, c, a) => { const n = (a.match(/-?\d*\.?\d+/g) || []).map(Number); if (c === 'H') return c + n.map(X).join(' '); if (c === 'V') return c + n.map(Y).join(' '); return c + n.map((v, k) => k % 2 ? Y(v) : X(v)).join(' ') }) }
  return { X, Y, place, tf }
}
// paint a stack of pieces (back to front): [set, kind], kind = skin | hair | accent
function paint(name, P, place, { glow = [15, 18, 7.5], hairGrad = [3, 2, 20, 18], hairFrost = 0.3 } = {}) {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBack = grad('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: glow[0], cy: glow[1], r: glow[2] }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 5, y1: 3, x2: 18, y2: 21 }, [stop(0, V.frost, 0.7), stop(0.4, V.tint, 0.62), stop(1, V.tint, 0.5)])
  const gHair = grad('linearGradient', { x1: hairGrad[0], y1: hairGrad[1], x2: hairGrad[2], y2: hairGrad[3] }, [stop(0, V.frost, hairFrost), stop(0.5, V.tint, f2(hairFrost * 0.42)), stop(1, V.tint, f2(hairFrost * 0.2))])
  const gAcc = grad('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 23 }, [stop(0, V.accent, 0.95), stop(1, V.accent, 0.75)])
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
  const fillOf = k => k === 'skin' ? gPane : k === 'accent' ? gAcc : gHair
  vis.forEach((s, i) => out.push(['path', { d: D(s), fill: fillOf(P[i][1]), ...EDGE, 'fill-rule': 'evenodd', class: P[i][1] === 'accent' ? 'wm-s' : 'wm-k' }]))
  vis.forEach((s, i) => { if (P[i][1] !== 'accent') out.push(['path', { d: D(rimOf(s)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }]) })
  return { out, defs }
}
const stroke = (d, extra = {}) => ['path', { d, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }]

const NAME = 'avatar-woman'
const { X, Y, place, tf } = mk(0.94)
const SHOULDERS = 'M3.5 21 C3.5 18.6 5.4 17 7.9 17 C9.4 17 10.6 17.9 12 17.9 C13.4 17.9 14.6 17 16.1 17 C18.6 17 20.5 18.6 20.5 21 C20.5 21.55 20.05 22 19.5 22 H4.5 C3.95 22 3.5 21.55 3.5 21 Z'
const FACE = oval(12, 12.2, 5.6, 6.0)
const HAIR = unionSets([area(oval(12, 9.2, 7.9, 6.9)), area(oval(5.9, 14.2, 1.95, 5.9)), area(oval(18.1, 14.2, 1.95, 5.9))])
const FRINGE = 'M2 2 H22 V9.6 C18.5 10.6 15.2 9.6 12.8 8.6 C11.2 10.4 8 11.2 2 10.8 Z'
export default function render(icon) {
  const name = (icon && icon.name) || NAME
  const face = area(FACE), fringe = intersectSets(face, area(FRINGE))
  const P = [
    [area(SHOULDERS), 'skin'],
    [unionSets([HAIR, fringe]), 'hair'],
    [tidy(differenceSets(face, fringe)), 'skin'],
  ]
  const { out, defs } = paint(name, P, place, { hairFrost: 0.26 })
  for (const x of [9.7, 14.3]) out.push(['ellipse', { cx: X(x), cy: Y(12.7), rx: 0.78, ry: 0.98, fill: V.etch, 'fill-opacity': 0.92, class: 'wm-a' }])
  out.push(stroke(tf('M9.45 12.35 L9.5 12.3 M14.05 12.35 L14.1 12.3'), { stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, class: 'wm-a' }))
  out.push(stroke(tf('M10.4 15.7 C11.3 16.6 12.7 16.6 13.6 15.7'), { stroke: V.etch, 'stroke-opacity': 0.85, 'stroke-width': 0.85, class: 'wm-a' }))
  return [['defs', {}, defs], ...out]
}
