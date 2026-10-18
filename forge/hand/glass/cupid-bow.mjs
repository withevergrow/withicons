// forge/hand/glass/cupid-bow.mjs — Glass Cupid's bow, hand-drawn: the generated drawing was a tangle of thin pale
// frosted rods (bow, string, shaft) with a small heart tip, so it nearly vanished on white and read as a stick figure
// at 16px. Here the bow is one bold violet glass limb with a fine etched string, and the arrow is a single luminous
// accent piece (a long shaft, swept fletching and a big heart head pointing up-right), so the Cupid motif reads first.
// Roles: back/shadow + pane bow, etch string, accent arrow, shine rims. Motion: bow wm-k, arrow wm-a (flies at 315deg).
import { V } from '../../styles/_glass-soft.mjs'
import { setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'cupid-bow'
const S = 0.94
const f2 = v => +v.toFixed(2)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, dx = 0.3, dy = 0.45) => { const e = tidy(erode(F, 0.08)); return differenceSets(e, translateSet(e, dx, dy)) }
const X = v => f2(12 + (v - 12) * S - 0.5)
const seg = pts => 'M' + pts.map(([x, y]) => `${X(x)} ${X(y)}`).join('L')

// the arrow runs along x + y = 24, flying up-right: u along the flight, v across it
const U = [Math.SQRT1_2, -Math.SQRT1_2], W = [Math.SQRT1_2, Math.SQRT1_2]
const at = (o, u, v) => [o[0] + U[0] * u + W[0] * v, o[1] + U[1] * u + W[1] * v]
const TAIL = [2.9, 21.1], HC = [16.9, 7.1], HS = 0.29
// a heart (tip forward), from the classic parametric curve, scaled and turned onto the flight line
function heartRing() {
  const pts = []
  for (let i = 0; i < 96; i++) {
    const t = i / 96 * Math.PI * 2, s = Math.sin(t)
    const x = 16 * s * s * s, y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    pts.push(at(HC, (y - 2) * HS, x * HS))
  }
  return pts
}
// a quadratic limb sampled as a polyline
const quad = (a, c, b, k = 40) => Array.from({ length: k + 1 }, (_, i) => { const t = i / k, m = 1 - t; return [m * m * a[0] + 2 * m * t * c[0] + t * t * b[0], m * m * a[1] + 2 * m * t * c[1] + t * t * b[1]] })
const BA = [3, 11.6], BC = [16.1, 7.9], BB = [12.4, 21]

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const out = []

  const bow = place(roundStrokeSet(quad(BA, BC, BB), 2.5))
  const bowB = translateSet(tidy(erode(bow, 0.25)), 0.45, 0.45)
  const heart = place(setOf([heartRing()]))
  const shaft = place(roundStrokeSet([at(TAIL, 0.4, 0), at(HC, -1.6, 0)], 1.3))
  const vane = s => setOf([[at(TAIL, 1.0, 0), at(TAIL, 0.1, 1.75 * s), at(TAIL, 1.9, 1.75 * s), at(TAIL, 3.1, 0)]])
  const flet = place(unionSets([vane(1), vane(-1)]))
  const arrow = tidy(unionSets([shaft, flet]))

  // soft diffuse shadow under the whole drawing
  const all = tidy(unionSets([bowB, translateSet(arrow, 0.3, 0.3), translateSet(heart, 0.3, 0.3)]))
  out.push(['path', { d: D(translateSet(dilate(all, 0.8), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.3), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])

  // the bow: a bold violet glass limb (colour body behind, frosted pane in front, lit rim)
  out.push(['path', { d: D(bowB), fill: grad('linearGradient', { x1: 3, y1: 8, x2: 14, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: D(bow), fill: grad('linearGradient', { x1: 3, y1: 8, x2: 14, y2: 21 }, [stop(0, V.frost, 0.55), stop(0.45, V.tint, 0.4), stop(1, V.tint, 0.3)]), stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }])
  out.push(['path', { d: D(bow), fill: V.c1, 'fill-opacity': 0.35, class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(bow, 0.25, 0.4)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the string, etched fine between the limb tips
  out.push(['path', { d: seg([[3.35, 12.15], [12, 20.7]]), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.7, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-k' }])

  // the arrow: luminous accent glass with a deep underside and a lit upper face; the heart head is its own piece on
  // top (own hairline) so its cleft stays visible where the shaft meets it
  const gLit = grad('linearGradient', { x1: 12, y1: 3, x2: 17, y2: 11 }, [stop(0, V.shine, 0.6), stop(1, V.shine, 0)])
  for (const part of [arrow, heart]) {
    out.push(['path', { d: D(translateSet(part, 0.3, 0.45)), fill: V.shadow, 'fill-opacity': 0.45, class: 'wm-a' }])
    out.push(['path', { d: D(part), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.22, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }])
    out.push(['path', { d: D(part), fill: gLit, class: 'wm-a' }])
  }
  const g0 = at(HC, -2.7, -2.4), g1 = at(HC, -0.5, -3.7)
  out.push(['path', { d: `M${X(g0[0])} ${X(g0[1])}Q${X(at(HC, -2.3, -3.9)[0])} ${X(at(HC, -2.3, -3.9)[1])} ${X(g1[0])} ${X(g1[1])}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.95, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
