// forge/hand/glass/rose.mjs — Glass rose, hand-drawn: the generated drawing was a pale frosted bloom with a faint
// etched loop on a thin rod, so the flower fused into one soft blob with a stick and lost its petals at 16px. Here the
// bloom is a vivid colour-washed glass cup with three even petal tips, two frosted side petals wrapping it and
// overlapping in a shallow V at the front, a bold etched curl, on a clear glass stem with two broad dense leaves
// whose pointed tips clear the bloom, so it reads as a rose on any ground.
// Roles: back/shadow bloom + body, pane/frost glass, accent glow, etch curl + veins, shine rims.
// Motion: bloom wm-k (the whole rose sways from 12 21.5), stem + leaves wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, intersectSets, erode, dilate, translateSet, setOf, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'rose'
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
const X = v => f2(12 + (v - 12) * S - 0.5)
// skeleton-coord path (absolute M L C Q Z only) -> glass front frame
const tf = d => d.replace(/([MLCQZ])([^MLCQZ]*)/g, (m, c, a) => c + (a.match(/-?\d*\.?\d+/g) || []).map(Number).map(X).join(' '))
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

// skeleton coordinates: a cup with three even rounded petal tips and two smooth notches
const BLOOM = 'M12 13.4 C8.3 13.4 6 11.1 6 7.9 C6 7.2 6 6.7 6.05 6.2 C6.1 4.6 6.8 3.5 7.9 3.5 C8.85 3.5 9.45 4.1 9.8 4.9 C10.2 3.8 11 3.1 12 3.1 C13 3.1 13.8 3.8 14.2 4.9 C14.55 4.1 15.15 3.5 16.1 3.5 C17.2 3.5 17.9 4.6 17.95 6.2 C18 6.7 18 7.2 18 7.9 C18 11.1 15.7 13.4 12 13.4 Z'
// two side petals wrapping the cup, overlapping at the front in a shallow V below the curl
const PET_L = 'M6.2 8 C8.6 7.75 11 8.75 12.6 10.9 L12.6 12.8 C12.4 13.2 12.2 13.4 12 13.4 C8.6 13.4 6.3 11.3 6.2 8 Z'
const PET_R = 'M17.8 8 C15.4 7.75 13 8.75 11.4 10.9 L11.4 12.8 C11.6 13.2 11.8 13.4 12 13.4 C15.4 13.4 17.7 11.3 17.8 8 Z'
const SWIRL = 'M10.35 6.35 C10.1 4.95 11.15 4.05 12.35 4.1 C13.55 4.15 14.15 5.15 13.8 6.05 C13.45 6.85 12.4 6.9 12.15 6.1'
const LEAF_L = 'M11.9 19.5 C8.2 19.9 5.2 17.6 4.85 14.35 C8.8 13.75 11.55 16 11.9 19.5 Z'
const LEAF_R = 'M12.1 17.6 C15.3 18 17.85 16.6 18.2 14.2 C15.1 13.55 12.6 15 12.1 17.6 Z'
const STEM = [[12, 12.6], [12, 21.6]]

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const out = []

  const bloom = P(BLOOM)
  const stem = place(roundStrokeSet(STEM, 1.7))
  const leaves = tidy(unionSets([P(LEAF_L), P(LEAF_R)]))
  const green = tidy(differenceSets(unionSets([stem, leaves]), dilate(bloom, 0.05)))
  const bloomB = translateSet(tidy(erode(bloom, 0.3)), 0.8, 0.8)
  const greenB = translateSet(tidy(erode(unionSets([stem, leaves]), 0.1)), 0.5, 0.5)
  const all = tidy(unionSets([bloomB, greenB]))

  // soft diffuse shadow
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])

  const [a, b, c, d] = box(all)
  const gBack = grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [stop(0, V.c1), stop(1, V.shadow)])
  const gPane = grad('linearGradient', { x1: 5, y1: 2.5, x2: 17, y2: 21 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])

  // stem and leaves: glass over a dense colour body, a c1 wash so they keep their mass, an etched midrib in each leaf
  out.push(['path', { d: D(greenB), fill: gBack, class: 'wm-a' }])
  out.push(['path', { d: D(green), fill: gPane, ...EDGE, class: 'wm-a' }])
  out.push(['path', { d: D(green), fill: grad('linearGradient', { x1: 6, y1: 13, x2: 14, y2: 21 }, [stop(0, V.c1, 0.5), stop(1, V.c1, 0.75)]), class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(green, 0.25, 0.35)), fill: V.shine, 'fill-opacity': 0.8, class: 'wm-shine' }])
  out.push(['path', { d: tf('M10.9 18.2 C9.6 16.8 8.2 15.8 6.5 15.2 M13.1 16.4 C14.4 15.4 15.6 14.8 17.1 14.5'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-a' }])

  // the bloom: colour body + accent glow behind, a frosted cup in front washed with colour so it reads vivid
  out.push(['path', { d: D(bloomB), fill: gBack, class: 'wm-k' }])
  out.push(['path', { d: D(bloomB), fill: grad('radialGradient', { cx: 15, cy: 11, r: 6 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', { d: D(bloom), fill: gPane, ...EDGE, class: 'wm-k' }])
  out.push(['path', { d: D(bloom), fill: grad('linearGradient', { x1: 6, y1: 3, x2: 15, y2: 13 }, [stop(0, V.c1, 0.5), stop(1, V.c1, 0.85)]), class: 'wm-k' }])
  // the bold etched curl of the bud at the heart of the cup
  out.push(['path', { d: tf(SWIRL), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.8, 'stroke-width': 0.95, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(bloom)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the two side petals: left first, right overlapping it; each its own frost pane with a lit upper lip
  const inner = tidy(erode(bloom, 0.12))
  const petL = tidy(intersectSets(P(PET_L), inner))
  const petR = tidy(intersectSets(P(PET_R), inner))
  const petal = (set, lip) => {
    out.push(['path', { d: D(set), fill: V.frost, 'fill-opacity': 0.42, stroke: 'currentColor', 'stroke-opacity': 0.18, 'stroke-width': 0.35, 'stroke-linejoin': 'round', class: 'wm-k' }])
    out.push(['path', { d: tf(lip), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-shine' }])
  }
  petal(petL, 'M6.9 8.3 C8.8 8.3 10.7 9.1 12.1 10.8')
  out.push(['path', { d: D(translateSet(petR, -0.25, 0.3)), fill: V.shadow, 'fill-opacity': 0.18, class: 'wm-k' }])
  petal(petR, 'M17.1 8.3 C15.2 8.3 13.3 9.1 11.9 10.8')
  return [['defs', {}, defs], ...out]
}
