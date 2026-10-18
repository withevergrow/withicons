// forge/hand/bento/mosque.mjs: a compact hall whose walls rise straight into a pointed onion dome (one stroke at the
// join), a solid arched door, a thin finial rod carrying a solid accent crescent, and a solid free-standing minaret with
// a dark gallery band, kept 2u+ clear of the hall; the generated glyph packed a hairline minaret against the hall, a
// pinhole door and a looped crescent, so it shrank to a smudge in its tile at 16px.
import { squircle, col, T } from '../../styles/_bento-core.mjs'
import { mapPath } from '../../styles/_bento-path.mjs'

const NAME = 'mosque'
const r2 = v => +v.toFixed(2)
const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (i, x1, y1, x2, y2, stops) => ['linearGradient', { id: `wg-bento-${NAME}-${i}`, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const url = i => `url(#wg-bento-${NAME}-${i})`
// skeleton coordinates (24 grid) -> the glyph area of the tile, exactly as the generated bento glyphs
const M = (d, dy = 0) => mapPath(d, T.S, [12, 12], 0, T.CY - 12 + dy)
const J = (ds, dy = 0) => ds.map(d => M(d, dy)).join('')
const TOP = 'M2.55 9.62C2.55 4.39 4.39 2.55 9.62 2.55H14.38C19.61 2.55 21.45 4.39 21.45 9.62'

// a filled crescent: circle (ax, ay, ra) minus circle (bx, by, rb), opening toward b
function crescent(ax, ay, ra, bx, by, rb) {
  const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy)
  const a = (ra * ra - rb * rb + d * d) / (2 * d), h = Math.sqrt(ra * ra - a * a)
  const mx = ax + (a * dx) / d, my = ay + (a * dy) / d
  const p = [mx + (h * dy) / d, my - (h * dx) / d], q = [mx - (h * dy) / d, my + (h * dx) / d]
  return `M${r2(p[0])} ${r2(p[1])}A${ra} ${ra} 0 1 0 ${r2(q[0])} ${r2(q[1])}A${rb} ${rb} 0 0 1 ${r2(p[0])} ${r2(p[1])}Z`
}

// geometry (skeleton units: 2u strokes). Hall x3-13 (outer edge x14), minaret outer edge x17.25, gallery cap x16.25.
// hall walls rise into the dome: one open outline, so the dome/hall join is a single stroke, not a double band
const SHELL = 'M3 21.5V16.5A1.5 1.5 0 0 1 4.5 15H5.25' +
  'C4 13.25 4.25 11 6.5 9.75C7.5 9.2 7.95 8.5 8 7.25' + // left flank into a sharp ogee point
  'C8.05 8.5 8.5 9.2 9.5 9.75C11.75 11 12 13.25 10.75 15' + // right flank
  'H11.5A1.5 1.5 0 0 1 13 16.5V21.5'
const DOOR = 'M6.5 21.5V18.5C6.5 17.6 7.25 16.9 8 16.25C8.75 16.9 9.5 17.6 9.5 18.5V21.5Z'
const TOWER = 'M18.25 21.5V11.5L19.5 5.25L20.75 11.5V21.5Z'
const GALLERY = 'M17.25 11.5H21.75'
const GROUND = 'M2 21.5H22'
const STEM = 'M8 7.25V4.5'
const MOON = crescent(8.5, 3, 1.75, 9.45, 2.2, 1.45)

export default function render() {
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [
    ['defs', {}, [
      lin(0, 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
      lin(1, T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
      lin(2, 0, r2(T.CY - 7 * T.S), 0, r2(T.CY + 9 * T.S), [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)]),
    ]],
    // tile
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: TOP, stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  // the glyph's soft lift: a wide pass and a tight contact pass, offset down
  const masses = [SHELL + 'Z', TOWER, MOON], lines = [SHELL, TOWER, GALLERY, GROUND, STEM]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: J(masses, dy), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: J(lines, dy), stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  out.push(
    // hall and dome: the house duotone mass
    ['path', { d: M(SHELL + 'Z'), fill: col('shine') }],
    ['path', { d: M(SHELL + 'Z'), fill: url(2) }],
    // lines: the building in the deep shade; the finial rod is thinner so the crescent floats above the point
    ['path', { d: J([SHELL, GROUND]), stroke: col('shadow'), 'stroke-width': T.SW }],
    ['path', { d: M(STEM), stroke: col('shadow'), 'stroke-width': r2(T.SW * 0.55) }],
    // the door: a solid arch in the minaret's colour (no sliver of a counter)
    ['path', { d: M(DOOR), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': 0.3, class: 'wm-a' }],
    ['path', { d: M(DOOR), fill: col('c1'), stroke: col('c1'), opacity: 0.72, 'stroke-width': 0.3, class: 'wm-a' }],
    // minaret: one solid A mass (shaft and spire), c1 over a dark underlayer
    ['path', { d: M(TOWER), fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }],
    ['path', { d: M(TOWER), fill: col('c1'), stroke: col('c1'), opacity: 0.72, 'stroke-width': T.SW, class: 'wm-a' }],
    // the gallery: a dark band that overhangs the shaft on both sides
    ['path', { d: M(GALLERY), stroke: col('shadow'), 'stroke-width': T.SW, class: 'wm-a' }],
    // crescent finial: a solid accent moon over the ink, rounded by a hairline of itself
    ['path', { d: M(MOON), fill: col('ink'), stroke: col('ink'), 'stroke-width': 0.35, class: 'wm-s' }],
    ['path', { d: M(MOON), fill: col('accent'), stroke: col('accent'), 'stroke-width': 0.35, opacity: 0.85, class: 'wm-s' }],
  )
  return out
}
