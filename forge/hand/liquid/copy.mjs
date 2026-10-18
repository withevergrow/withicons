// forge/hand/liquid/copy.mjs — two sheets of glass: a clear blue front sheet, and a violet back
// sheet peeking out at its top-left, parted from the front by a clean 1.3u gap (cut with a boolean, not a moat that
// merges into the rim). The generated copy let the two squares touch, so they blurred into one shape.
// Same glass recipe as the generator (_liquid-core.mjs build); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, dilate, differenceSets } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const shape = d => setOf(parsePath(d, 0.04).map(s => s.pts))
const cx = r => [r.reduce((a, p) => a + p[0], 0) / r.length, r.reduce((a, p) => a + p[1], 0) / r.length]
// a skeleton the liquid model expects: each piece's fill is its exact shape, its (hidden) line sits inside it
function skeleton(name, parts, cutLines = []) {
  const lines = [], fills = []
  for (const p of parts) {
    // the hidden line sits well inside the fill (the stroke then adds nothing): the ring pulled halfway in, or a given polyline
    const rings = p.line ? [p.line] : p.set.map(r => { const c = cx(r); return r.map(q => [c[0] + (q[0] - c[0]) * 0.5, c[1] + (q[1] - c[1]) * 0.5]) })
    for (const r of rings) lines.push({ pts: r, closed: !p.line, plate: p.plate, pathId: 'p' })
    fills.push({ subs: p.set.map(r => ({ pts: r, closed: true })), set: p.set })
  }
  const cutouts = cutLines.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths: [], cutouts, lines, fills }
}

// front sheet (K): 13 x 13 with 2.8u corners at the bottom right
const FRONT = shape('M11.3 8.5H18.7A2.8 2.8 0 0 1 21.5 11.3V18.7A2.8 2.8 0 0 1 18.7 21.5H11.3A2.8 2.8 0 0 1 8.5 18.7V11.3A2.8 2.8 0 0 1 11.3 8.5Z')
// back sheet (A): the same square up-left, minus the front sheet grown by the gap
const BACK = differenceSets(shape('M5.3 2.5H12.7A2.8 2.8 0 0 1 15.5 5.3V12.7A2.8 2.8 0 0 1 12.7 15.5H5.3A2.8 2.8 0 0 1 2.5 12.7V5.3A2.8 2.8 0 0 1 5.3 2.5Z'), dilate(FRONT, 1.3))

const LINES = []

export default function render(icon) {
  return build(skeleton((icon && icon.name) || 'copy', [{ set: FRONT, plate: 'K' }, { set: BACK, plate: 'A', line: [[13.8, 4.85], [4.85, 4.85], [4.85, 13.8]] }], LINES))
}
