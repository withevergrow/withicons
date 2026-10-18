// forge/hand/bento/ring-box.mjs — an open ring box: a deep velvet base, its satin lid hinged at the back edge and tilted
// back (wider than the ring, its top edge running behind the band), a big bold ring standing in the slot and a cut gem
// that rises clear above the lid, so the box, ring and gem stay three separate shapes at 16px. On the 24 grid, placed
// with the house glyph scale, tile, drop shadow and duotone recipe.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'ring-box'
const id = n => `wg-bento-${NAME}-${n}`
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(i), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'
const ring = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}Z`

// glyph, on the 24 grid
// the lid, tilted back from its hinge on the base's back edge: wider at the top (it leans toward the eye)
const LID = 'M4.25 15L3.4 10.45A1.25 1.25 0 0 1 4.63 9H19.37A1.25 1.25 0 0 1 20.6 10.45L19.75 15Z'
const BASE = 'M3 15H21V19.5A2 2 0 0 1 19 21.5H5A2 2 0 0 1 3 19.5Z'
// the slot in the velvet
const SLOT = 'M5.5 17.25H8.75M15.25 17.25H18.5'
// the ring band, a circle stroked bold (its foot sinks into the base); the hole stays 3.5u wide
const BAND = ring(12, 11.25, 3.25)
const GEM = 'M10 2.25H14L15.75 4.25L12 8L8.25 4.25Z'
const FACET = 'M8.25 4.25H15.75M10.75 4.25L12 7.25L13.25 4.25'

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, 7.77, 0, 17.21, [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
    ]],
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  // soft drop shadow, then a tight contact shadow
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: M(LID + BASE + GEM, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
  }
  // the open lid behind: the pale satin inside, the house duotone mass
  out.push(['path', { d: M(LID), fill: col('shine') }])
  out.push(['path', { d: M(LID), fill: `url(#${id(2)})`, 'fill-opacity': 0.7 }])
  out.push(['path', { d: M(LID), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the ring band: the accent over a deep underline, standing in the slot (A part, it pops)
  out.push(['path', { d: M(BAND), stroke: col('shadow'), 'stroke-width': 1.75, class: 'wm-a' }])
  out.push(['path', { d: M(BAND), stroke: col('accent'), 'stroke-width': 0.95, class: 'wm-a' }])
  // the base: a deeper velvet block in front of the ring's foot
  out.push(['path', { d: M(BASE), fill: col('shine') }])
  out.push(['path', { d: M(BASE), fill: col('c1'), 'fill-opacity': 0.6 }])
  out.push(['path', { d: M(SLOT), stroke: col('shine'), 'stroke-opacity': 0.6, 'stroke-width': 0.45, class: 'wm-shine' }])
  out.push(['path', { d: M(BASE), stroke: col('shadow'), 'stroke-width': T.SW }])
  // the gem: a cut stone set on the band, clear above the lid (S part, it twinkles)
  out.push(['path', { d: M(GEM), fill: col('shine'), class: 'wm-s' }])
  out.push(['path', { d: M(GEM), fill: col('c3'), 'fill-opacity': 0.55, class: 'wm-s' }])
  out.push(['path', { d: M(FACET), stroke: col('shadow'), 'stroke-opacity': 0.55, 'stroke-width': 0.45, class: 'wm-s' }])
  out.push(['path', { d: M(GEM), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-s' }])
  return out
}
