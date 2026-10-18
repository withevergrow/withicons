// forge/hand/glass/watch.mjs - a frosted glass wristwatch after the Line design: a round dial pane in the middle, a short
// strap above and below it (each its own glass piece with a rounded end, narrowing away from the case) and the dial face set
// in with etched hour marks and an L-shaped hand pair in deep etch ink on an accent hub. The generated drawing fused case
// and straps into one lumpy outline with a tiny clock inside. Roles: back/shadow body, pane/frost glass, accent, etch, shine.
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

export default function render(icon) {
  const name = (icon && icon.name) || 'watch'
  const C = [11.5, 11.7], R = 6.4
  const dial = disc(C[0], C[1], R)
  // straps: rounded-end bands narrowing away from the case; the visible pane stops where the dial begins
  // a polygon with rounded corners: its inset outline swept by a round pen of radius r
  const rr = (pts, r) => unionSets([setOf([pts]), ...pts.map((q, i) => roundStrokeSet([q, pts[(i + 1) % pts.length]], 2 * r))])
  const bandTop = rr([[10.3, 3.9], [12.7, 3.9], [13.5, 9.5], [9.5, 9.5]], 0.9)
  const bandBot = rr([[9.5, 13.9], [13.5, 13.9], [12.7, 19.5], [10.3, 19.5]], 0.9)
  const gap = dilate(dial, 0.25)
  const strapTop = differenceSets(bandTop, gap), strapBot = differenceSets(bandBot, gap)
  const [defs, out] = paint(name, [
    { set: strapTop, back: backOf(bandTop, 0.4, 0.7), glow: [13, 5, 4], frost: 0.6 },
    { set: strapBot, back: backOf(bandBot, 0.4, 0.7), glow: [13, 19, 4], frost: 0.6, extra: [['circle', { cx: 11.5, cy: 18.6, r: 0.45, fill: V.etch, 'fill-opacity': 0.55 }]] },
    { set: dial, back: backOf(dial, 0.5, 0.8), glow: [15, 15.2, 5.5], frost: 1.1 },
  ])
  const [cx, cy] = C
  out.push(stroke(`M${cx} ${cy - 4.5}V${cy - 3.7}M${cx + 4.5} ${cy}H${cx + 3.7}M${cx} ${cy + 4.5}V${cy + 3.7}M${cx - 4.5} ${cy}H${cx - 3.7}`, 0.75, { 'stroke-opacity': 0.5 }))
  out.push(stroke(`M${cx} ${cy - 3.2}V${cy}L${cx + 2.4} ${cy + 1.6}`, 1.5, { 'stroke-opacity': 1, class: 'wm-a' }))
  out.push(['circle', { cx, cy, r: 0.9, fill: V.accent, stroke: V.etch, 'stroke-width': 0.5, class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
