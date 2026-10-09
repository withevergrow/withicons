// PLUSH render: the art director's exemplars first, then the hand-composed redraws, then
// the automatic stuffed-toy maker for everything else (any future icon). Live icons go through
// _plush-live.mjs (family dress-up + generator-specific toys over the automatic path).
import * as Prim from './_plush-prim.mjs'
import * as Kit from './_plush-kit.mjs'
import * as F from './_plush-field.mjs'
import { compose, judge, samplesOf } from './_plush-compose.mjs'
import { REDRAW } from './_plush-redraws.mjs'
import { build } from './_plush-auto.mjs'
import { schemeOf } from './_plush-tune.mjs'
import { EXEMPLAR } from './_plush-exemplars.mjs'
import { liveOf } from './_plush-live.mjs'
import { labelText } from './_plush-text.mjs'
import { isPerson } from './_people.mjs'
import { personize, recolor } from './_plush-people.mjs'

export { EXEMPLAR }
const BASE = Object.freeze({ ...Prim, ...Kit })

// the context every redraw receives: prim + kit, plus the icon's own automatic pieces and scheme
export function ctxOf(icon) {
  let cache = null
  return Object.freeze({
    ...BASE,
    icon,
    scheme: schemeOf(icon && icon.name, icon && icon.category),
    auto: () => (cache || (cache = build(icon))),
  })
}

export function redrawOf(icon) {
  if (!icon || icon.params) return null
  const f = EXEMPLAR[icon.name] || REDRAW[icon.name]
  return typeof f === 'function' ? f : null
}

// Motion safety net (forge/MOTION.md, Parts choreography). When the skeleton has an A or S plate
// that no piece of a redraw carries, the pieces tagged K are measured against the skeleton and
// the ones that sit on that plate take it back; a one-panel stuffed arrow made by Kit.arrow has
// its head sewn off as an A piece. Pieces that already say A, S or deco are never touched.
export function restoreParts(pieces, icon) {
  const list = [pieces].flat(Infinity).filter(p => p && typeof p === 'object' && p.kind)
  const want = new Set((icon && icon.lines || []).map(l => l.plate).filter(p => p === 'A' || p === 'S'))
  if (!want.size) return list
  const have = () => new Set(list.map(p => p.part))
  let missing = [...want].filter(x => !have().has(x))
  if (!missing.length) return list
  const J = judge(icon)
  if (!J) return list
  let out = list.map(p => {
    if (p.kind === 'cut' || (p.part && p.part !== 'K')) return p
    const m = J(samplesOf(p))
    return missing.includes(m.plate) && m.on >= 0.5 ? { ...p, part: m.plate } : p
  })
  if (missing.includes('A') && !out.some(p => p.part === 'A')) {
    out = out.flatMap(p => {
      if (!p.arrowParts || (p.part && p.part !== 'K')) return [p]
      const { arrowParts, F: _f, ...rest } = p
      return [
        { ...rest, F: arrowParts.shaft },
        { ...rest, F: arrowParts.head, part: 'A', seam: null, stitch: 'auto', stitchMin: 1.3, inset: 0.8 },
      ]
    })
  }
  return out
}

export default function render(icon) {
  const f = redrawOf(icon)
  if (f) {
    try {
      const nodes = compose(restoreParts(f(icon, ctxOf(icon)), icon), icon)
      if (nodes.length) return nodes
    } catch (e) { if (globalThis.process?.env?.PLUSH_DEBUG) throw e /* a broken redraw falls back to the automatic path */ }
  }
  if (icon && icon.params) {
    const g = liveOf(icon)
    if (g) {
      try {
        const nodes = compose(labelText(g(icon), icon.name, icon.params), icon)
        if (nodes.length) return nodes
      } catch (e) { if (globalThis.process?.env?.PLUSH_DEBUG) throw e }
    }
  }
  if (isPerson(icon)) return recolor(compose(personize(build(icon), icon), icon), icon)
  return compose(icon && icon.params ? labelText(build(icon), icon.name, icon.params) : build(icon), icon)
}
