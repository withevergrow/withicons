// A turning double helix. Six base pairs stacked up the screen; each pair's two beads swing past each other as the
// helix turns, the near bead large and bright, the far one small and dim, and the rung between them stretches and
// shrinks with the turn. Each pair runs a little behind the one above, so a twist travels down the strand.
import { circle, line, solid, stroke, E } from './_kit.mjs'
import { keysOf, named } from './_creative-a.mjs'

const N = 'wl-dna'   // own geometry: a neutral part name (styles draw the dna icon from their own art)

const ROWS = 6, Y0 = 4, DY = 3.2, AMP = 6.5, TWIST = 0.15   // TWIST: lag per row (fraction of a turn)
const rowY = i => Y0 + i * DY
// bead: x = sin of the turn, depth = cos of the turn (near = big + bright). Each strand is drawn twice, a back copy
// under the rungs and a front copy over them; they hand over at the sides, where the beads are far apart.
const bead = front => keysOf(t => {
  const a = t * Math.PI * 2, depth = Math.round(Math.cos(a) * 1e6) / 1e6
  const vis = front ? depth > 0 || (depth === 0 && Math.sin(a) > 0) : depth < 0 || (depth === 0 && Math.sin(a) < 0)
  return { x: AMP * Math.sin(a), s: 0.8 + 0.25 * depth, o: vis ? 0.675 + 0.325 * depth : 0 }
}, 24)
// rung: a bar across the pair whose width follows the beads' spread
const rung = keysOf(t => ({ sx: Math.sin(t * Math.PI * 2) * 0.999 + 0.001, o: 0.5 }), 24)
const copies = off => Array.from({ length: ROWS }, (_, i) => ({ x: 0, y: rowY(i) - Y0, lag: ((i * TWIST + off) % 1 + 1) % 1 }))
export default {
  name: 'dna', title: 'DNA helix', group: 'creative',
  description: 'A double helix turns in place: bead pairs swing past each other, near beads big and bright, with a twist running down.',
  intent: 'life science at work: analysing, sequencing, growing',
  aliases: ['dna-loader', 'double-helix-loader', 'helix-spinner', 'genome-loader', 'sequencing-loader'],
  tags: ['loading', 'science', 'dna', 'biology', 'health'],
  synonyms: ['analysing', 'sequencing', 'genetics', 'biotech', 'health', 'lab'],
  duration: 2.4,
  morph: ['dna'],
  parts: [
    { skel: named(solid(circle(12, Y0, 1.3), 'S'), N), motion: { origin: [12, Y0], keys: bead(false) }, copies: copies(0.5) },
    { skel: named(solid(circle(12, Y0, 1.3)), N), motion: { origin: [12, Y0], keys: bead(false) }, copies: copies(0) },
    { skel: named(stroke(line(12 - AMP + 2, Y0, 12 + AMP - 2, Y0), 'A'), N), motion: { origin: [12, Y0], keys: rung }, copies: copies(0) },
    { skel: named(solid(circle(12, Y0, 1.3), 'S'), N), motion: { origin: [12, Y0], keys: bead(true) }, copies: copies(0.5) },
    { skel: named(solid(circle(12, Y0, 1.3)), N), motion: { origin: [12, Y0], keys: bead(true) }, copies: copies(0) },
  ],
}
