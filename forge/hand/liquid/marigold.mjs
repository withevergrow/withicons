// forge/hand/liquid/marigold.mjs — a marigold as layered glass: eight clear outer petals parted by grooves, a violet
// layer of eight shorter petals peeking out between them (the layer that spins), and one pink bead at the heart.
// The generated flower was a ruffled disc with a dark ringed centre that read as a gear; here every petal is separate
// and the centre is a bright accent bead. Same glass recipe as the generator (_liquid-core.mjs build).
import { setOf, unionSets, differenceSets, strokeSet } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const CX = 12, CY = 12, N = 8
// an ellipse petal on a ray at angle a (radians from straight up): centre at distance d, radial semi r, tangential semi t
function petal(a, d, r, t, n = 48) {
  const ux = Math.sin(a), uy = -Math.cos(a), cx = CX + d * ux, cy = CY + d * uy, ring = []
  for (let i = 0; i < n; i++) {
    const q = i / n * 2 * Math.PI, p = r * Math.cos(q), s = t * Math.sin(q)
    ring.push([cx + p * ux - s * uy, cy + p * uy + s * ux])
  }
  return ring
}
const ang = (k, off = 0) => (k / N + off) * 2 * Math.PI
const disc = (r, n = 40) => Array.from({ length: n }, (_, i) => [CX + r * Math.cos(i / n * 2 * Math.PI), CY + r * Math.sin(i / n * 2 * Math.PI)])

// outer layer (K, clear): eight broad petals, tips at 10.9, notches deep between them
const OUTER0 = unionSets([...Array.from({ length: N }, (_, k) => setOf([petal(ang(k), 6.8, 4.1, 2.7)])), setOf([disc(4.6)])])
// a narrow groove along every notch, from the rim in to the violet layer, parts the petals
const GROOVES = unionSets(Array.from({ length: N }, (_, k) => {
  const a = ang(k, 1 / 16), ux = Math.sin(a), uy = -Math.cos(a)
  return strokeSet([[CX + 5.2 * ux, CY + 5.2 * uy], [CX + 12.5 * ux, CY + 12.5 * uy]], 1.0)
}))
const OUTER = differenceSets(OUTER0, GROOVES)
// middle layer (A, violet): eight shorter petals turned half a step so each points at a notch of the outer layer
const INNER = unionSets([...Array.from({ length: N }, (_, k) => setOf([petal(ang(k, 1 / 16), 4.2, 2.9, 2.55)])), setOf([disc(2.6)])])

function skeleton(name) {
  const lines = [{ pts: disc(6, 40), closed: true, plate: 'K', pathId: 'k' }]
  // a spoke up the middle of every violet petal keeps the A layer attached to its own line
  for (let k = 0; k < N; k++) {
    const a = ang(k, 1 / 16), ux = Math.sin(a), uy = -Math.cos(a)
    lines.push({ pts: [[CX + 1.0 * ux, CY + 1.0 * uy], [CX + 5.2 * ux, CY + 5.2 * uy]], closed: false, plate: 'A', pathId: 'a' + k })
  }
  // the heart: a small accent bead
  lines.push({ pts: disc(0.7, 24), closed: true, plate: 'S', pathId: 's' })
  return {
    name, paths: [], cutouts: [], lines,
    fills: [
      { subs: OUTER.map(r => ({ pts: r, closed: true })), set: OUTER },
      { subs: INNER.map(r => ({ pts: r, closed: true })), set: INNER },
    ],
  }
}

export default function render(icon) {
  return build(skeleton((icon && icon.name) || 'marigold')) || []
}
