// forge/hand/chrome/north-star.mjs — a fat, four-point chrome star with one long ray down, instead of the generated thin
// diamond with a hole and four gunmetal tick marks. The points are thickened (waist pulled out so each ray is a real
// wedge, not a needle), the diamond cutout and the diagonal ticks are gone, so the whole star is one polished body
// with the style's sky / horizon / ground reflection. The style's own model/paint recipe (_chrome-core) does the
// modelling; this file supplies the skeleton, a bright specular star on the shoulder, and two small twinkles (the
// moving part, wm-a) in the empty corners.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col } from '../../styles/_chrome-core.mjs'

const D = 'M12 2 Q13.9 9.1 20.5 11 Q13.9 12.9 12 22.2 Q10.1 12.9 3.5 11 Q10.1 9.1 12 2 Z'
const f = v => String(Math.round(v * 100) / 100)

function skeleton(name) {
  const subs = parsePath(D)
  return { name, paths: [{ id: 'p0', d: D, plate: 'K', subs }], fills: [{ d: D, subs, set: setOf(subs.map(s => s.pts)) }], cutouts: [],
    lines: subs.map(x => ({ pts: x.pts, closed: x.closed, plate: 'K', pathId: 'p0' })) }
}

// a four-point star
const star = (x, y, r, w) =>
  `M${f(x)} ${f(y - r)}Q${f(x + w)} ${f(y - w)} ${f(x + r)} ${f(y)}Q${f(x + w)} ${f(y + w)} ${f(x)} ${f(y + r)}` +
  `Q${f(x - w)} ${f(y + w)} ${f(x - r)} ${f(y)}Q${f(x - w)} ${f(y - w)} ${f(x)} ${f(y - r)}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'north-star'
  const out = emit(layers(model(skeleton(name))), name, 0)
  // two small twinkles beside the star: dark steel edge, steel core
  const tw = (x, y, r) => [
    ['path', { d: star(x, y, r + 0.55, 0.62), fill: col('shadow'), class: 'wm-a' }],
    ['path', { d: star(x, y, r, 0.5), fill: col('c1'), class: 'wm-a' }],
  ]
  const hasDefs = out[0][0] === 'defs'
  out.splice(hasDefs ? 1 : 0, 0, ...tw(19.2, 4.4, 1.45), ...tw(4.8, 17.4, 1.2))
  // a bright specular star on the upper-left shoulder of the body
  out.push(['path', { d: star(9.1, 7.6, 1.5, 0.34), fill: col('shine'), class: 'wm-shine' }])
  return out
}
