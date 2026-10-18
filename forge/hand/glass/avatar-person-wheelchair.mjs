// forge/hand/glass/avatar-person-wheelchair.mjs — Glass person in a wheelchair, hand-drawn: the generated drawing had a
// faint thin wheel and a thin figure that broke up at 16px. Here the wheel is a thick deep violet glass ring with a hub,
// the head a solid frosted bead and the torso, seat and leg one bold frosted bar, with a deep caster at the foot, so every
// part holds at 16px. Roles: back/shadow body, pane/frost glass, accent glow, shine rim.
// Motion: wheel, caster and figure are body wm-k.
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

import { circle } from '../../kernel/geom.mjs'
import { roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'avatar-person-wheelchair'
const disc = (x, y, r) => setOf([circle(x, y, r, 0.1)])
const WHEEL = unionSets([differenceSets(disc(9, 16.2, 6), disc(9, 16.2, 3.9)), disc(9, 16.2, 1.3)])
const CASTER = disc(19.4, 19.7, 1.7)
const HEAD = disc(11.2, 4.1, 2.3)
const BAR = roundStrokeSet([[11.2, 8.2], [11.2, 12.9], [14.9, 12.9], [18.7, 17.3]], 2.6)
const ARM = roundStrokeSet([[11.2, 9.6], [15.6, 11.4]], 1.8)
const RING = differenceSets(disc(9, 16.2, 6), disc(9, 16.2, 3.9))
export default function render(icon) {
  const name = (icon && icon.name) || NAME
  const P = [
    [HEAD, 'skin'],
    [unionSets([BAR, ARM]), 'skin'],
  ]
  const { out, defs, grad } = paint(name, P, { glow: [15, 16, 7.5] })
  // the wheel and the caster in deep solid violet glass, behind the figure: a clear lens inside the tyre, a sheen
  const deep = grad('linearGradient', { x1: 3, y1: 10, x2: 15, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const sheen = grad('linearGradient', { x1: 3, y1: 10, x2: 12, y2: 20 }, [stop(0, V.frost, 0.5), stop(0.6, V.frost, 0.08), stop(1, V.frost, 0)])
  const lens = grad('linearGradient', { x1: 5, y1: 12, x2: 13, y2: 21 }, [stop(0, V.frost, 0.62), stop(0.5, V.tint, 0.5), stop(1, V.tint, 0.38)])
  const ring = place(RING), hub = place(disc(9, 16.2, 1.3)), tyre = place(unionSets([RING, disc(9, 16.2, 1.3)]))
  const inner = place(differenceSets(disc(9, 16.2, 3.95), disc(9, 16.2, 1.25)))
  const caster = place(CASTER)
  const wheel = [
    ['path', { d: D(translateSet(dilate(unionSets([tyre, caster]), 0.9), 0, 0.5), 0.14), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }],
    ['path', { d: D(inner), fill: lens, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: D(ring) + D(hub), fill: deep, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.45, 'stroke-linejoin': 'round', 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: D(ring) + D(hub), fill: sheen, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: D(caster), fill: deep, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.45, class: 'wm-k' }],
    ['path', { d: D(rimOf(ring)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }],
    ['path', { d: D(rimOf(caster)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }],
  ]
  // wheel sits behind the figure: after the two shadow layers, before the figure's colour body
  out.splice(2, 0, ...wheel)
  return [['defs', {}, defs], ...out]
}
