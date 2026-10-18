// forge/hand/liquid/skull.mjs: the plain line-version skull as clear liquid glass: domed cranium, narrower jaw,
// two round eye sockets, a nose triangle and two tooth lines, the face inlaid in deep glass. The generated skull
// cut its features out of the glass and they blurred into a wobbly shape at small size.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const BODY = 'M7.5 17C5.25 15.5 4 13.25 4 10.5A8 8 0 0 1 20 10.5C20 13.25 18.75 15.5 16.5 17V19.5A2 2 0 0 1 14.5 21.5H9.5A2 2 0 0 1 7.5 19.5Z'
// the glass is drawn at 0.88 about the centre (the style's optical scale), the face follows it
const X = x => Math.round(((x - 12) * 0.88 + 11.8) * 100) / 100, Y = y => Math.round(((y - 12) * 0.88 + 11.5) * 100) / 100, S = v => Math.round(v * 88) / 100

export default function render(icon) {
  const name = (icon && icon.name) || 'skull'
  const subs = parsePath(BODY)
  const nodes = build({
    name, paths: [],
    lines: subs.map(s => ({ pts: s.pts, closed: s.closed, plate: 'K' })),
    fills: [{ subs }], cutouts: [],
  })
  if (!nodes) return null
  const defs = nodes[0][2]
  const g0 = defs.find(x => x[1].id === `wg-liquid-${name}-0`)
  if (g0) g0[2].forEach((s, i) => { s[1]['stop-opacity'] = [0.24, 0.48, 0.76][i] })
  for (const n of nodes) if (n[1] && n[1]['stroke-opacity'] === 0.3) n[1]['stroke-opacity'] = 0.45
  const c3 = 'var(--with-liquid-c3, #1C3F9E)'
  const shine = { fill: 'var(--with-liquid-shine, #FFFFFF)', 'fill-opacity': 0.85, class: 'wm-shine' }
  const nose = `M${X(12)} ${Y(13.9)}L${X(13.3)} ${Y(16.3)}H${X(10.7)}Z`
  return [...nodes,
    ['circle', { cx: X(8.5), cy: Y(11), r: S(2.3), fill: c3, class: 'wm-k' }],
    ['circle', { cx: X(15.5), cy: Y(11), r: S(2.3), fill: c3, class: 'wm-k' }],
    ['path', { d: nose, fill: c3, stroke: c3, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: `M${X(10.5)} ${Y(18.9)}V${Y(21.4)}M${X(13.5)} ${Y(18.9)}V${Y(21.4)}`, stroke: c3, 'stroke-width': 0.95, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, class: 'wm-k' }],
    ['circle', { cx: X(7.8), cy: Y(10.2), r: S(0.5), ...shine }],
    ['circle', { cx: X(14.8), cy: Y(10.2), r: S(0.5), ...shine }]]
}
