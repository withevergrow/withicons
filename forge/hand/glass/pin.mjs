// forge/hand/glass/pin.mjs - a frosted glass pushpin after the Line design: a tilted rounded-square head on a narrow neck
// flaring into the flange as one pane, and a straight diagonal needle as its own slim glass rod below-left, set apart from
// the flange by a clear gap. The generated drawing was a round ball on a vertical T-stem; the head here is a rounded square
// turned 45 degrees, lit with a soft orb of accent light. Roles: back/shadow body, pane/frost glass, accent glow, shine rim.
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD, parsePath, simplify } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'
const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const disc = (x, y, r) => setOf([circle(x, y, r, 0.3)])
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))
const grow = (s, r) => { try { return dilate(s, r) } catch { try { return unionSets(s.map(g => dilate([g], r))) } catch { return s } } }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.28, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

// paint pieces back to front: each is a colour body (soft accent orb inside) and its frosted pane with edge and lit rim
function paint(name, pieces) {
  let n = 0
  const defs = [], out = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const allBack = unionSets(pieces.map(p => p.back))
  out.push(['path', { d: D(translateSet(grow(allBack, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(grow(allBack, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  for (const p of pieces) {
    const [a, b, c, d] = box(p.back), [x0, y0, x1, y1] = box(p.set), k = p.cls || 'wm-k', F = p.frost == null ? 1 : p.frost
    out.push(['path', { d: D(p.back), fill: grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [stop(0, V.c1), stop(1, V.shadow)]), 'fill-rule': 'evenodd', class: k }])
    const [gx, gy, gr] = p.glow || [(a + c) / 2 + 1.5, (b + d) / 2 + 1.5, Math.max(3, Math.min(8, Math.sqrt((c - a) * (d - b)) * 0.55))]
    out.push(['path', { d: D(p.back), fill: grad('radialGradient', { cx: f2(gx), cy: f2(gy), r: f2(gr) }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), 'fill-rule': 'evenodd', class: k }])
    out.push(['path', { d: D(p.set), fill: grad('linearGradient', { x1: f2(x0), y1: f2(y0), x2: f2(x1), y2: f2(y1) }, [stop(0, V.frost, f2(0.6 * F)), stop(0.4, V.tint, f2(0.55 * F)), stop(1, V.tint, f2(0.42 * F))]), ...EDGE, 'fill-rule': 'evenodd', class: k }])
    out.push(['path', { d: D(rimOf(p.set)), fill: V.shine, 'fill-opacity': 0.85, class: k + ' wm-shine' }])
    if (p.extra) out.push(...p.extra)
  }
  return [defs, out]
}
const stroke = (d, w, o = {}) => ['path', { d, fill: 'none', stroke: V.etch, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...o }]

const S = 0.94
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
// the front frame: the Line drawing scaled 0.94 about the centre and lifted 0.5u up-left
const P = ([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5]
const placeSet = set => tidy(set.map(r => r.map(P)))
const area = d => unionSets(parsePath(d, 0.2).map(s => setOf([s.pts])))

const BODY = 'M14.93 3.88 L20.12 9.07 A1.58 1.58 0 0 1 20.12 11.3 A1.58 1.58 0 0 1 17.9 11.3 L14.93 14.27 L14.56 19.1 A1.05 1.05 0 0 1 13.26 19.28 L4.72 10.74 A1.05 1.05 0 0 1 4.9 9.44 L9.73 9.07 L12.7 6.1 A1.58 1.58 0 0 1 12.7 3.88 A1.58 1.58 0 0 1 14.93 3.88 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'pin'
  const body = placeSet(area(BODY))
  const needle = roundStrokeSet([P([9.6, 15.9]), P([3.3, 20.7])], 1.5)
  const [defs, out] = paint(name, [
    { set: needle, back: translateSet(erode(needle, 0.2), 0.5, 0.5), cls: 'wm-a', frost: 1.3, glow: [4, 20, 3] },
    { set: body, back: backOf(body, 0.5, 0.85), glow: [16.5, 8, 6] },
  ])
  return [['defs', {}, defs], ...out]
}
