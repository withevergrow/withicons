// forge/hand/glass/water-balloon.mjs: glass water balloon: a round water-filled sack with the knot on top, a wavy water line (wm-a) and a glossy highlight.
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
  const body = path('M12 5.6C12.7 8.2 19.5 10 19.5 15.4C19.5 19.5 16.2 22.3 12 22.3C7.8 22.3 4.5 19.5 4.5 15.4C4.5 10 11.3 8.2 12 5.6Z')
  const knot = soft(poly([[10.5, 4.2], [13.5, 4.2], [13, 6.4], [11, 6.4]]), 0.45)
  const wave = [[2, 24], [2, 16.2]]
  for (let i = 0; i <= 28; i++) { const x = 2 + i * 20 / 28; wave.push([x, 16.4 + 1.1 * Math.sin((x - 2) / 20 * 3 * Math.PI)]) }
  wave.push([22, 24])
  const wl = 'M' + wave.slice(7, 22).map(p => f2(p[0]) + ' ' + f2(p[1])).join('L')
  const water = intersectSets(erode(body, 0.8), poly(wave))
  return build((icon && icon.name) || 'water-balloon', [
    { s: body, cls: 'wm-k' },
    { s: knot, cls: 'wm-k', tint: [V.accent, 0.35] },
    { s: water, cls: 'wm-a', tint: [V.accent, 0.5] },
  ], wl, [
    ['path', { d: 'M12 4.2Q12.2 2.4 13.8 2Q15.6 1.6 16.2 3.2', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.7, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: 'M7.4 15C7.4 12.9 8.5 11.4 10 10.6', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.95, 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ])
}
