// ANIME render — art-directed exemplars first, then the hand-drawn redraws, then the
// automatic path for everything else (live icons, any future icon).
import * as Prim from './_anime-prim.mjs'
import * as Kit from './_anime-kit.mjs'
import { compose } from './_anime-compose.mjs'
import { REDRAW } from './_anime-redraws.mjs'
import { auto } from './_anime-auto.mjs'
import { EXEMPLAR } from './_anime-exemplars.mjs'
import { cast, M, PALETTE } from './_anime-tune.mjs'

// k: everything a redraw may use (frozen)
export const k = Object.freeze({ ...Prim, ...Kit, cast, M, PALETTE })

export function redrawOf(icon) {
  if (!icon || icon.params) return null
  const f = EXEMPLAR[icon.name] || REDRAW[icon.name]
  return typeof f === 'function' ? f : null
}

export default function render(icon) {
  const f = redrawOf(icon)
  if (f) {
    try {
      const nodes = compose(f(icon, k), { seed: icon.name })
      if (nodes.length) return nodes
    } catch (e) {
      // fall through to the automatic path; ANIME_DEBUG=1 shows why
      if (typeof process !== 'undefined' && process.env && process.env.ANIME_DEBUG) console.error('[anime] redraw ' + icon.name + ' threw:', e)
    }
  }
  return compose(auto(icon), { seed: icon.name })
}
