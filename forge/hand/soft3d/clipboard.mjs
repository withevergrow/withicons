// forge/hand/soft3d/clipboard.mjs — a wooden board carrying a raised white sheet and a silver clip on top, so the
// soft 3D solid reads as a clipboard instead of the generated plain brown slab with a white blob (it read as a bag).
import { build } from '../../styles/_soft3d-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

// a prepared skeleton (as forge/lib/load.mjs prepares one), named after the icon so the style's palette, mode and ids apply
function skel(name, category, { paths, fills, cutouts }) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name, category, paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

const BOARD = 'M7 4.5 H17 A2.5 2.5 0 0 1 19.5 7 V19 A2.5 2.5 0 0 1 17 21.5 H7 A2.5 2.5 0 0 1 4.5 19 V7 A2.5 2.5 0 0 1 7 4.5 Z'
// the clip's head rises above the board: the mass carries it so the raised clip can stand proud of the top edge
const HEAD = 'M10.5 2.75 H13.5 A1 1 0 0 1 14.5 3.75 V5 H9.5 V3.75 A1 1 0 0 1 10.5 2.75 Z'
// the sheet as four stacked strips: each is small enough to be filled solid, together they are one raised white sheet
// (the style rounds them 1u outward: the sheet spans 6.75..17.25 x 7..19)
const SHEET = 'M7.75 8 H16.25 V11 H7.75 Z M7.75 11 H16.25 V13.5 H7.75 Z M7.75 13.5 H16.25 V16 H7.75 Z M7.75 16 H16.25 V18 H7.75 Z'
// the clip as two round-capped bars (the style strokes them 2u wide): the jaw across the sheet's top and a wide head above it
const CLIP = 'M8.75 6.25 H15.25 M11 3.75 H13 M11 4.75 H13'

export default function render() {
  // part order sets the roles: the sheet takes c2 (white), the clip c3 (silver)
  return build(skel('clipboard', 'actions', { paths: [[BOARD, 'K'], [SHEET, 'A'], [CLIP, 'A']], fills: [BOARD, HEAD], cutouts: [] }))
}
