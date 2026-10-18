// forge/hand/liquid/reply-all.mjs — two solid violet glass arrowheads pointing left, one behind the other with clear
// air between them, and a clear glass tail sweeping from the front head down to the right (as liquid undo / reply).
// The generated drawing used two thin chevron tubes in the palest corner of the light, the front one knotted into the
// tail's start, so the arrow washed out on white and lost its double head at 16px; here the heads are bold filled
// glass wedges and the glass is a step denser. Same model and light as the generator (_liquid-core.mjs).
// Motion: tail wm-k, both heads wm-a (the spec nudges parts.A to the left).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a skeleton in the shape the liquid model expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

// the tail (K; glass grows 1.3u around it), starting under the front head
const TAIL = 'M12 9.5H14A6.5 6.5 0 0 1 20.5 16V19.5'
// the heads (A; glass grows 1.15u around these outlines): the back one, then the front one clear of it
const BACKH = 'M2.75 9.5L6.5 5.75V13.25Z'
const FRONTH = 'M9.5 9.5L13.25 5.75V13.25Z'

// denser glass: the clear and violet tints a step deeper and a firmer hairline, so the arrow holds on white
function firm(nodes, name) {
  const g0 = `wg-liquid-${name}-0`, g1 = `wg-liquid-${name}-1`, g2 = `wg-liquid-${name}-2`
  const deeper = { [g0]: [0.26, 0.48, 0.74], [g1]: [0.42, 0.86], [g2]: [0.5, 1] }
  return nodes.map(n => {
    if (n[0] === 'defs') {
      return ['defs', {}, n[2].map(g => deeper[g[1].id]
        ? [g[0], g[1], g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': deeper[g[1].id][i] }])]
        : g)]
    }
    const a = n[1]
    if (a['stroke-width'] === 0.22) return [n[0], { ...a, 'stroke-opacity': 0.5, 'stroke-width': 0.3 }]
    return n
  })
}

export default function render(icon) {
  const name = (icon && icon.name) || 'reply-all'
  const nodes = build(skeleton(name, [
    { d: TAIL, plate: 'K' },
    { d: BACKH, plate: 'A', fill: true },
    { d: FRONTH, plate: 'A', fill: true },
  ]))
  return nodes ? firm(nodes, name) : null
}
