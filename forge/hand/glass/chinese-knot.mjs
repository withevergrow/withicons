// forge/hand/glass/chinese-knot.mjs: glass Chinese knot: a diamond lattice with two open side loops, a top cord and a tassel.
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, intersectSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const disc = (x, y, r) => setOf([circle(x, y, r, 0.3)])
const ell = (cx, cy, rx, ry) => { const p = []; for (let i = 0; i < 48; i++) { const a = i / 48 * 2 * Math.PI; p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]) } return setOf([p]) }
const poly = pts => setOf([pts])
const soft = (s, r = 0.4) => dilate(erode(s, r), r)
const rrect = (x0, y0, x1, y1, r) => soft(poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]), r)
// a leaf / blade: quadratic sides from base a to tip b, bulging w to each side (bend skews it)
function leaf(a, b, w, bend = 0) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L
  const q = (c, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]]
  const c1 = [mx + nx * (w + bend), my + ny * (w + bend)], c2 = [mx - nx * (w - bend), my - ny * (w - bend)], p = []
  for (let i = 0; i <= 20; i++) p.push(q(c1, i / 20))
  for (let i = 19; i > 0; i--) p.push(q(c2, i / 20))
  return poly(p)
}
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))
const grow = (s, r) => { try { return dilate(s, r) } catch { try { return unionSets(s.map(g => dilate([g], r))) } catch { return s } } }

// groups back to front: { s: set, cls, tint: [colour, opacity] }, then etch ink and extra nodes on top
function build(name, groups, etch, extra = []) {
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => add(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])
  const backs = groups.map(g => backOf(g.s, 0.25, 0.7))
  const allBack = unionSets(backs), all = unionSets(groups.map(g => g.s))
  const out = []
  out.push(['path', { d: D(translateSet(grow(allBack, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(grow(allBack, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const [a, b, c, d] = box(allBack), [x0, y0, x1, y1] = box(all)
  const gBack = lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = add(['radialGradient', { id: id(), cx: f2(c - 4), cy: f2(d - 4), r: 8, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]])
  const gPane = lin(x0, y0, x1, y1, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.5 }
  groups.forEach((g, i) => {
    const k = g.cls ? { class: g.cls } : {}
    out.push(['path', { d: D(backs[i]), fill: gBack, 'fill-rule': 'evenodd', ...k }])
    out.push(['path', { d: D(backs[i]), fill: gGlow, 'fill-rule': 'evenodd', ...k }])
    out.push(['path', { d: D(g.s), fill: gPane, ...edge, 'fill-rule': 'evenodd', ...k }])
    if (g.tint) out.push(['path', { d: D(g.s), fill: g.tint[0], 'fill-opacity': g.tint[1], 'fill-rule': 'evenodd', ...k }])
    out.push(['path', { d: D(rimOf(g.s)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  })
  if (etch) out.push(['path', { d: etch, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.7, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }])
  return [['defs', {}, defs], ...out, ...extra]
}

import { parsePath } from '../../kernel/geom.mjs'
const path = d => setOf(parsePath(d).map(s => s.pts))

export default function render(icon) {
  const dia = (cx, cy, r) => poly([[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]])
  const frame = soft(dia(12, 9.8, 6.3), 0.4)
  const holes = unionSets([[12, 6.7], [8.9, 9.8], [15.1, 9.8], [12, 12.9]].map(([x, y]) => soft(dia(x, y, 1.5), 0.2)))
  const knot = differenceSets(frame, holes)
  const hole = (cx, cy, rx, ry) => ell(cx, cy, rx, ry)
  const loops = unionSets([differenceSets(hole(3.7, 9.8, 2.1, 4), hole(3.7, 9.8, 0.85, 2.7)), differenceSets(hole(20.3, 9.8, 2.1, 4), hole(20.3, 9.8, 0.85, 2.7))])
  const cord = differenceSets(disc(12, 2.2, 1.5), disc(12, 2.2, 0.6))
  const tassel = unionSets([disc(12, 17.5, 1.2), soft(poly([[10.6, 18.5], [13.4, 18.5], [15.2, 22.9], [8.8, 22.9]]), 0.3)])
  return build((icon && icon.name) || 'chinese-knot', [
    { s: loops, cls: 'wm-k', tint: [V.accent, 0.18] },
    { s: knot, cls: 'wm-k' },
    { s: cord, cls: 'wm-k' },
    { s: tassel, cls: 'wm-a', tint: [V.accent, 0.5] },
  ], 'M11.2 20.2L10.9 22.2M12 20.2V22.4M12.8 20.2L13.1 22.2')
}
