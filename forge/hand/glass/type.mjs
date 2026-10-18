// forge/hand/glass/type.mjs — a frosted glass serif T whose foot serif is its own slab of glass laid across the stem.
// The generator fused the foot into the stem as one pane, so the motion's landing foot (parts.A) had nothing to move,
// and the head's serifs stood as short stubs; here the head carries firm down-serifs, the stem a clean rod, and the
// foot is a second glass slab in front that types on its own beat (wm-a). Same layers and paint as the generator
// (_glass-soft.mjs), built twice: the letter, then the foot.
import { parsePath } from '../../kernel/geom.mjs'
import { softLayers, softPaint } from '../../styles/_glass-soft.mjs'

// a skeleton in the shape softLayers() expects (rods only: no fills, no cutouts)
function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  return { name, paths, fills: [], cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
// one glass build; gradient ids renumbered from n0 so two builds share one defs node
function glass(name, parts, n0, cls) {
  const { defs, out } = softPaint(softLayers(skeleton(name, parts)), name)
  const re = new RegExp(`wg-glass-${name}-(\\d+)`, 'g')
  const rid = s => s.replace(re, (_, k) => `wg-glass-${name}-${+k + n0}`)
  const D = defs.map(([t, a, k]) => [t, { ...a, id: rid(a.id) }, k])
  const O = out.map(([t, a]) => {
    const b = {}
    for (const [key, v] of Object.entries(a)) b[key] = typeof v === 'string' ? rid(v) : v
    if (!b.class || b.class === 'wm-s') b.class = cls
    return [t, b]
  })
  return { defs: D, out: O }
}

const HEAD = 'M4.5 7 V4 H19.5 V7'
const STEM = 'M12 4 V19'
const FOOT = 'M8.5 20 H15.5'

export default function render(icon) {
  const name = (icon && icon.name) || 'type'
  const a = glass(name, [{ d: HEAD }, { d: STEM }], 0, 'wm-k')
  const b = glass(name, [{ d: FOOT }], a.defs.length, 'wm-a')
  return [['defs', {}, [...a.defs, ...b.defs]], ...a.out, ...b.out]
}
