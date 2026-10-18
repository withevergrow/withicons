// forge/hand/glass/pandal.mjs: hand-drawn glass pandal (frosted panes over colour bodies, separated parts, etch detail).
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

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

export default function render(icon) {
  const val = [[2.4, 8.4], [11.5, 2.2], [20.6, 8.4], [20.6, 10]]
  for (let k = 3; k >= 0; k--) for (let i = 1; i <= 10; i++) { const a = Math.PI * i / 10, cx = 2.4 + 4.55 * k + 2.27; val.push([cx + 2.27 * Math.cos(a), 10 + 1.5 * Math.sin(a)]) }
  const roof = soft(poly(val), 0.3)
  const pillars = unionSets([rrect(4.2, 12.6, 7, 19.6, 0.5), rrect(16, 12.6, 18.8, 19.6, 0.5)])
  const base = rrect(2.6, 19.3, 20.4, 21.6, 0.6)
  const fin = disc(11.5, 1.8, 0.9)
  return build((icon && icon.name) || 'pandal', [
    { s: base, cls: 'wm-k' },
    { s: pillars, cls: 'wm-k' },
    { s: unionSets([roof, fin]), cls: 'wm-a', tint: [V.accent, 0.3] },
  ], 'M4.4 8.6H18.6')
}
