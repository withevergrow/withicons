// COQUETTE redraw registry: every hand-composed icon, gathered from the chunk files, and
// the art director's EXEMPLAR map, which wins over a chunk entry of the same name.
import { R as R1 } from './_coquette-redraw-1.mjs'
import { R as R2 } from './_coquette-redraw-2.mjs'
import { R as R3 } from './_coquette-redraw-3.mjs'
import { R as R4 } from './_coquette-redraw-4.mjs'
import { R as R5 } from './_coquette-redraw-5.mjs'
import { EXEMPLAR } from './_coquette-exemplars.mjs'

export { EXEMPLAR }
export const REDRAW = Object.assign(Object.create(null), R1, R2, R3, R4, R5)

// the hand-composed function for an icon, or null (Live icons always go automatic)
export function redrawOf(icon) {
  if (!icon || icon.params) return null
  const f = EXEMPLAR[icon.name] || REDRAW[icon.name]
  return typeof f === 'function' ? f : null
}
