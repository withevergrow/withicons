// forge/hand/glass/dumpling.mjs — Glass dumpling, hand-drawn: the generated drawing frosted the pleated top into a lumpy
// bun with three faint seams, so it read as a bread roll or a shell. Here the body is a plump half-moon of glass with a
// clearly crimped crest of five pleat bumps along its top, and firm etched pleat folds fan down from each valley, with
// a lit rim, so the pleats (the dumpling cue) read at 16px.
// Roles: back/shadow body, pane/frost glass, accent glow, etch pleats, shine rim. Motion: all wm-k (breathe / jelly).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify, circle, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'dumpling'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2 && Math.abs(ringArea(r)) > 0.15)
const place = set => tidy(set.map(r => r.map(([x, y]) => [X(x), X(y)])))
const area = d => unionSets(parsePath(d, 0.25).map(s => setOf([s.pts])))
const D = (s, t = 0.07) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const round = (set, r) => tidy(dilate(tidy(erode(set, r)), r))
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
const tf = d => d.replace(/([MLHVCQZ])([^MLHVCQZ]*)/g, (m, c, a) => c + (a.match(/-?\d*\.?\d+/g) || []).map(n => X(+n)).join(' '))
const ETCH = (w, op) => ({ fill: 'none', stroke: V.etch, 'stroke-opacity': op, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' })

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  // skeleton coords: a half-moon belly (flat-ish base 2.5..21.5) under a crest of five pleat bumps
  const belly = area('M1.8 16 C2.6 11.6 6.6 8.6 12 8.6 C17.4 8.6 21.4 11.6 22.2 16 C20.8 19.2 16.9 20.6 12 20.6 C7.1 20.6 3.2 19.2 1.8 16 Z')
  const bumps = [[6.4, 9.9, 1.35], [9.6, 8.1, 1.45], [12, 7.6, 1.5], [14.4, 8.1, 1.45], [17.6, 9.9, 1.35]]
  const body = round(place(unionSets([belly, ...bumps.map(([x, y, r]) => setOf([circle(x, y, r, 0.25)]))])), 0.3)
  const B = translateSet(tidy(erode(body, 0.35)), 0.8, 0.8)

  const out = []
  out.push(['path', { d: D(translateSet(dilate(B, 0.9), 0, 0.5), 0.25), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(B, 0.35), 0, 0.5), 0.2), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const gBack = grad('linearGradient', { x1: 2, y1: 6, x2: 23, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 17.5, cy: 17, r: 8 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 1.5, y1: 5, x2: 21, y2: 20 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])

  out.push(['path', { d: D(B), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(B), fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(body), fill: gPane, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(body)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // pleat folds: from each crest valley, fanning down into the belly
  out.push(['path', { d: tf('M8 9.6 C8.6 11.4 9.3 12.6 10.2 13.4 M10.8 8.4 C11.2 10.2 11.5 11.6 11.9 12.8 M13.2 8.4 C12.8 10.2 12.5 11.6 12.1 12.8 M16 9.6 C15.4 11.4 14.7 12.6 13.8 13.4'), ...ETCH(1, 0.75) }])
  return [['defs', {}, defs], ...out]
}
