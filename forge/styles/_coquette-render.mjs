// COQUETTE render: exemplar, then hand-composed redraw, then the automatic path.
import * as Kit from './_coquette-kit.mjs'
import { auto } from './_coquette-auto.mjs'
import { paint } from './_coquette-paint.mjs'
import { redrawOf } from './_coquette-redraws.mjs'
import { people, recolor } from './_coquette-people.mjs'

// the kit handed to every redraw: shapes, materials, ornaments, plus auto(icon, opts)
export const KIT = Object.freeze({ ...Kit, auto })

export default function render(icon) {
  // people avatars: skin, hair and clothes in their own satin (_coquette-people.mjs)
  try {
    const ps = people(icon)
    if (ps) { const nodes = paint(ps, { cast: 'ink' }); if (nodes.length) return recolor(nodes, icon) }
  } catch (e) { if (typeof process !== 'undefined' && process.env && process.env.COQ_DEBUG) console.error('[coquette] ' + icon.name + ': ' + (e && e.stack)) }
  const f = redrawOf(icon)
  if (f) {
    try {
      const parts = [f(icon, KIT)].flat(Infinity).filter(Boolean)
      const nodes = paint(parts)
      if (nodes.length) return nodes
    } catch (e) { if (typeof process !== 'undefined' && process.env && process.env.COQ_DEBUG) console.error('[coquette] ' + icon.name + ': ' + (e && e.stack)) /* a broken redraw falls back to the automatic path */ }
  }
  return paint(auto(icon))
}
