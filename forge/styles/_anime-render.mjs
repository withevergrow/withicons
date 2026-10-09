// ANIME render — art-directed exemplars first, then the hand-drawn redraws, then the
// automatic path for everything else (live icons, any future icon).
import * as Prim from './_anime-prim.mjs'
import * as Kit from './_anime-kit.mjs'
import { compose } from './_anime-compose.mjs'
import { REDRAW } from './_anime-redraws.mjs'
import { auto } from './_anime-auto.mjs'
import { EXEMPLAR } from './_anime-exemplars.mjs'
import { cast, M, PALETTE } from './_anime-tune.mjs'
import { isPerson, tones, adapt, mix } from './_people.mjs'

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
  // people avatars: warm cel-shaded skin (c1, shaded by the shadow role = the skin shade), natural hair (c2, c3 its
  // shade), clothing (c4); the per-person defaults are the fallbacks of the same role variables
  if (isPerson(icon)) {
    const t = adapt(tones(icon), 'vivid')
    // anime black hair is a blue-black: lifted off the ink outline so it reads on a dark page too
    const lum = h => [1, 3, 5].reduce((a, i, k) => a + parseInt(h.slice(i, i + 2), 16) * [0.3, 0.59, 0.11][k], 0)
    if (lum(t.c2) < 42) { t.c2 = mix(t.c2, '#4C4A86', 0.5); t.c3 = mix(t.c3, '#2B2148', 0.3) }
    return compose(auto(icon), { seed: icon.name, hex: { c1: t.c1, tint: t.tint, shadow: t.shadow, c2: t.c2, c3: t.c3, c4: t.c4 } })
  }
  return compose(auto(icon), { seed: icon.name })
}
