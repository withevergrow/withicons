// forge/hand/glass/shankh.mjs — Glass conch: a pointed spire at the upper left (stacked whorls with etched sutures), a swelling
// body whorl with a spiral ridge, and an open mouth at the lower right framed by a flared lip in deeper glass. Roles:
// back/shadow body, pane/frost glass, accent mouth glow, etch ridges, shine rim. Motion: body wm-k, lip + ridges wm-a.
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

const NAME = 'shankh'
const { place, tf } = mk(0.96, 0.4, 0.4)
// a tilted ellipse (long axis running up-right), as a closed cubic path
const tilt = (cx, cy, a, b, deg = -45) => {
  const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t), k = 0.5523
  const P = (x, y) => `${f2(cx + x * c - y * s)} ${f2(cy + x * s + y * c)}`
  return `M${P(a, 0)} C${P(a, b * k)} ${P(a * k, b)} ${P(0, b)} C${P(-a * k, b)} ${P(-a, b * k)} ${P(-a, 0)} C${P(-a, -b * k)} ${P(-a * k, -b)} ${P(0, -b)} C${P(a * k, -b)} ${P(a, -b * k)} ${P(a, 0)} Z`
}
const BODY = 'M2.2 2.6 C5.2 2.8 8 4.2 9.8 6.2 C13.2 5.4 17 7.2 18.6 10.4 C19.6 12.6 19.2 15 17.4 17 C15.6 19.4 12 20.2 9.6 18.8 C6.4 17 4.4 13.8 4.6 10.8 C4.8 8.2 3.4 5.4 2.2 2.6 Z'
const LIP = tilt(16.6, 15.6, 6.4, 3.7)
const MOUTH = tilt(16.4, 15.4, 4.9, 1.9)
export default function render(icon) {
  const name = (icon && icon.name) || NAME
  const P = [[area(BODY), 'skin'], [area(LIP), 'hair']]
  const { out, defs } = paint(name, P, place, { hairFrost: 0.34, glow: [14, 14, 8] })
  // the open mouth: a deep glowing slit inside the flared lip
  out.push(['path', { d: tf(MOUTH), fill: V.accent, 'fill-opacity': 0.82, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(stroke(tf('M13.2 13.2 C15 12.4 17.4 12.8 19 14.2'), { stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.7, class: 'wm-a' }))
  // spiral ridge winding round the body from the shoulder, and sutures across the spire
  out.push(stroke(tf('M9.2 7.4 C12 7 14.6 8 15.8 9.8'), { stroke: V.etch, 'stroke-opacity': 0.7, 'stroke-width': 0.95, class: 'wm-a' }))
  out.push(stroke(tf('M5.2 12.6 C6 15 7.8 16.8 10 17.6'), { stroke: V.etch, 'stroke-opacity': 0.6, 'stroke-width': 0.8, class: 'wm-a' }))
  out.push(stroke(tf('M3.2 4.6 C4.8 4.6 6.6 5.2 7.8 6.4'), { stroke: V.etch, 'stroke-opacity': 0.7, 'stroke-width': 0.8, class: 'wm-a' }))
  out.push(stroke(tf('M4 7.2 C5.6 7.2 7.2 7.8 8.4 9'), { stroke: V.etch, 'stroke-opacity': 0.7, 'stroke-width': 0.8, class: 'wm-a' }))
  return [['defs', {}, defs], ...out]
}
