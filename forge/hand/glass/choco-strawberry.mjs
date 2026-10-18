// forge/hand/glass/choco-strawberry.mjs — Glass chocolate-dipped strawberry, hand-drawn: the generated drawing was one
// pale frosted heart with a zigzag etch drizzle, so the berry faded into white and the drizzle turned to noise at 16px.
// Here the berry is a tapered strawberry cone washed in the pink accent (the strawberry cue) with bright shine seeds,
// the lower half is dipped in solid glossy chocolate glass with one calm two-drip edge, and five flat pointed violet
// glass sepals with a short thick stem cap it, so "strawberry dipped in chocolate" reads at a glance on white and dark.
// Roles: accent/shadow berry flesh, pane/frost glass, shadow -> etch chocolate, back calyx + etch edge, shine seeds + rims.
// Motion: berry + dip wm-k (the whole icon sways from the stem at 12 3), calyx + stem wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, intersectSets, erode, dilate, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'choco-strawberry'
const S = 0.94
const f2 = v => +v.toFixed(2)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const P = d => place(area(d))
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, dx = 0.3, dy = 0.45) => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, dx, dy)) }
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const oval = (x, y, rx, ry) => `M${f2(x - rx)} ${f2(y)}A${f2(rx)} ${f2(ry)} 0 1 0 ${f2(x + rx)} ${f2(y)}A${f2(rx)} ${f2(ry)} 0 1 0 ${f2(x - rx)} ${f2(y)}Z`
const X = v => f2(12 + (v - 12) * S - 0.5)
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

// skeleton coordinates: a strawberry cone, 13.5u across the shoulders, straight-ish sides to a point at 12 21.5
const BERRY = 'M12 21.5 C10.6 20.7 8.4 18.6 7.1 16.4 C5.95 14.5 5.25 12.5 5.25 10.8 C5.25 8.6 7.9 7.4 12 7.4 C16.1 7.4 18.75 8.6 18.75 10.8 C18.75 12.5 18.05 14.5 16.9 16.4 C15.6 18.6 13.4 20.7 12 21.5 Z'
// the chocolate: everything below one smooth two-drip edge
const DIP = 'M3 13.9 C5.5 13.65 6.75 14.15 7.5 15.9 C8 17.25 9.6 17.25 10.1 15.9 C10.75 14.25 13.25 14.25 13.9 15.9 C14.4 17.25 16 17.25 16.5 15.9 C17.25 14.15 18.5 13.65 21 13.9 V23 H3 Z'
// five flat pointed sepals radiating from the calyx centre, 9.5u across
const CX = 12, CY = 7.5
const TIPS = [[7.25, 9.1], [9.3, 10.75], [12, 11.3], [14.7, 10.75], [16.75, 9.1]]
const sepal = ([tx, ty], w = 1.05) => {
  const dx = tx - CX, dy = ty - CY, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L
  const mx = CX + dx * 0.42, my = CY + dy * 0.42
  return `M${f2(CX + nx * w * 0.6)} ${f2(CY + ny * w * 0.6)}Q${f2(mx + nx * w * 1.25)} ${f2(my + ny * w * 1.25)} ${f2(tx)} ${f2(ty)}Q${f2(mx - nx * w * 1.25)} ${f2(my - ny * w * 1.25)} ${f2(CX - nx * w * 0.6)} ${f2(CY - ny * w * 0.6)}Z`
}
const CAP = oval(12, 7.5, 2.3, 1.15)
const STEM = [[12, 7.2], [12.05, 5.2], [12.4, 3.6], [13, 2.9]]

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const out = []

  const berry = P(BERRY)
  const dip = tidy(intersectSets(berry, P(DIP)))
  const top = tidy(differenceSets(berry, dip))
  const back = translateSet(tidy(erode(berry, 0.3)), 0.8, 0.8)
  const calyx = tidy(unionSets([P(CAP), ...TIPS.map(t => P(sepal(t)))]))
  const stem = place(roundStrokeSet(STEM, 1.4))
  const cap = tidy(unionSets([calyx, stem]))

  // soft diffuse shadow
  out.push(['path', { d: D(translateSet(dilate(back, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(back, 0.35), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])

  // the pink colour body behind: accent flesh deepening to shadow at the point
  const [a, b, c, d] = box(back)
  out.push(['path', { d: D(back), fill: grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c), y2: f2(d + 2) }, [stop(0, V.accent), stop(0.55, V.accent), stop(1, V.shadow)]), class: 'wm-k' }])

  // the frosted berry pane, then a strong pink wash on its upper half so the berry reads as a strawberry
  out.push(['path', { d: D(berry), fill: grad('linearGradient', { x1: 5, y1: 7, x2: 17, y2: 21 }, [stop(0, V.frost, 0.55), stop(0.4, V.tint, 0.4), stop(1, V.tint, 0.3)]), ...EDGE, class: 'wm-k' }])
  out.push(['path', { d: D(top), fill: grad('linearGradient', { x1: 6, y1: 8, x2: 15, y2: 16 }, [stop(0, V.accent, 0.62), stop(1, V.accent, 0.92)]), class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(berry)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // bright seeds over the pink in two staggered rows
  const seeds = [[7.1, 12.4], [16.9, 12.4], [9.6, 13.1], [14.4, 13.1], [12, 12.6], [8.1, 10.9], [15.9, 10.9]]
  out.push(['path', { d: seeds.map(([x, y]) => oval(X(x), X(y), 0.34, 0.5)).join(''), fill: V.shine, 'fill-opacity': 0.92, class: 'wm-k' }])

  // the chocolate dip: solid deep glass, a hairline edge, a glossy lit lip along the drip edge and one soft gloss
  const [p, q, r, s] = box(dip)
  out.push(['path', { d: D(translateSet(dip, 0.3, 0.45)), fill: V.etch, 'fill-opacity': 0.35, class: 'wm-k' }])
  out.push(['path', { d: D(dip), fill: grad('linearGradient', { x1: f2(p), y1: f2(q), x2: f2(r - 2), y2: f2(s) }, [stop(0, V.shadow), stop(1, V.etch)]), stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(dip, 0, 0.42)), fill: V.shine, 'fill-opacity': 0.55, class: 'wm-shine' }])
  out.push(['path', { d: `M${X(7.4)} ${X(17.3)}C${X(7.9)} ${X(18.2)} ${X(8.6)} ${X(19)} ${X(9.4)} ${X(19.6)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }])

  // the calyx and stem: violet glass body, a frost pane with an etched edge, a lit top
  out.push(['path', { d: D(translateSet(cap, 0.25, 0.4)), fill: V.shadow, 'fill-opacity': 0.45, class: 'wm-a' }])
  out.push(['path', { d: D(cap), fill: grad('linearGradient', { x1: 9, y1: 3, x2: 14, y2: 11 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-a' }])
  out.push(['path', { d: D(cap), fill: V.frost, 'fill-opacity': 0.22, stroke: V.etch, 'stroke-opacity': 0.6, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(cap, 0.2, 0.35)), fill: V.shine, 'fill-opacity': 0.8, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
