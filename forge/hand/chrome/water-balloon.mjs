// forge/hand/chrome/water-balloon.mjs: a plump pink enamel water balloon in a chrome bezel (the palette accent) easing up to a small gunmetal tied knot, with a white wavy water line and a highlight across the belly.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const BODY = 'M12 7.4 C10.2 7.9 5 10.6 5 15.6 C5 19.3 8.2 21.7 12 21.7 C15.8 21.7 19 19.3 19 15.6 C19 10.6 13.8 7.9 12 7.4 Z'
const KNOT = 'M10.5 7.6 L9.2 3.6 C10.8 4.5 13.2 4.5 14.8 3.6 L13.5 7.6 Z'

function skeleton(name) {
  const mk = (id, d, plate) => ({ id, d, plate, subs: parsePath(d) })
  const paths = [mk('p0', BODY, 'S'), mk('p1', KNOT, 'A')]
  const fills = [BODY, KNOT].map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'water-balloon'
  const Ls = layers(model(skeleton(name)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  const f = (v, axis) => Math.round(((v - 12) * K.SCALE + 12 + (axis ? K.TY : K.TX)) * 100) / 100
  const P = (x, y) => `${f(x, 0)} ${f(y, 1)}`
  // the water line: a wave across the belly; a highlight along the upper left
  out.push(['path', { d: `M${P(6.8, 16.4)}C${P(8.4, 14.8)} ${P(10.2, 18)} ${P(12, 16.4)}C${P(13.8, 14.8)} ${P(15.6, 18)} ${P(17.2, 16.4)}`, stroke: col('shine'), 'stroke-width': 1, 'stroke-linecap': 'round', fill: 'none', 'stroke-opacity': 0.9, class: 'wm-deco' }])
  out.push(['path', { d: `M${P(7.3, 14)}C${P(7.5, 12.6)} ${P(8.3, 11.6)} ${P(9.6, 10.9)}`, stroke: col('shine'), 'stroke-width': 1.1, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  return out
}
