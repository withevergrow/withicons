// forge/hand/liquid/fish.mjs — the line design in glass: a round-bodied fish facing right with a bowtie tail on the
// left, one deep-glass eye drop with a glint, and a curved gill mark. Body and tail are one clear blue glass piece
// (the generator's recipe, _liquid-core.mjs build); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import { build, col, L } from '../../styles/_liquid-core.mjs'

const shape = d => setOf(parsePath(d, 0.04).map(s => s.pts))
const BODY = shape('M6.6 12C8.8 8.1 11.8 6.3 15 6.3C18.6 6.3 21.2 8.9 21.7 12C21.2 15.1 18.6 17.7 15 17.7C11.8 17.7 8.8 15.9 6.6 12Z')
const TAIL = shape('M7.8 12L3.9 8.4C3.2 7.8 2.4 8.2 2.4 9.1V14.9C2.4 15.8 3.2 16.2 3.9 15.6Z')
const FISH = unionSets([BODY, TAIL])

const r2 = v => Math.round(v * 100) / 100
const tf = (x, y) => [r2((x - 12) * L.SCALE + 12 + L.TX), r2((y - 12) * L.SCALE + 12 + L.TY)]
const P = (x, y) => tf(x, y).join(' ')

export default function render(icon) {
  const nodes = build({ name: (icon && icon.name) || 'fish', paths: [], cutouts: [], lines: [], fills: [{ subs: FISH.map(r => ({ pts: r, closed: true })), set: FISH }] })
  // gill: a curved deep-glass groove behind the eye
  const gill = `M${P(12.4, 9.5)}C${P(13.5, 11.1)}${' '}${P(13.5, 12.9)}${' '}${P(12.4, 14.5)}`
  nodes.push(['path', { d: gill, fill: 'none', stroke: col('c3'), 'stroke-opacity': 0.75, 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-k' }])
  nodes.push(['path', { d: `M${P(11.9, 9.8)}C${P(13, 11.2)}${' '}${P(13, 12.8)}${' '}${P(11.9, 14.2)}`, fill: 'none', stroke: col('shine'), 'stroke-opacity': 0.5, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-shine' }])
  // eye: a deep-glass drop with a pin-point glint
  const [ex, ey] = tf(17.2, 10.6), er = r2(1.3 * L.SCALE)
  nodes.push(['circle', { cx: ex, cy: ey, r: er, fill: col('c3'), 'fill-opacity': 0.92, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.22, class: 'wm-k' }])
  nodes.push(['circle', { cx: r2(ex - er * 0.38), cy: r2(ey - er * 0.38), r: r2(er * 0.3), fill: col('shine'), 'fill-opacity': 0.75, class: 'wm-shine' }])
  return nodes
}
