// forge/hand/liquid/ghost.mjs: a clear liquid-glass ghost, a domed sheet with three soft hem lobes, its face inlaid
// in deep glass: two round eyes (wm-a, they blink) and an oval mouth. The generated face was a cluster of small
// holes ringed by pale inlays that did not read as eyes and a mouth.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const BODY = 'M5 19.5V10A7 7 0 0 1 19 10V19.5Q18.3 21.9 17.6 21.9Q16.9 21.9 16.2 19.5Q15.5 17.1 14.8 17.1Q14.1 17.1 13.4 19.5Q12.7 21.9 12 21.9Q11.3 21.9 10.6 19.5Q9.9 17.1 9.2 17.1Q8.5 17.1 7.8 19.5Q7.1 21.9 6.4 21.9Q5.7 21.9 5 19.5Z'

// the glass is drawn at 0.88 about the centre (the style's optical scale), the face follows it
const X = x => Math.round(((x - 12) * 0.88 + 11.8) * 100) / 100, Y = y => Math.round(((y - 12) * 0.88 + 11.5) * 100) / 100, S = v => Math.round(v * 88) / 100
export default function render(icon) {
  const name = (icon && icon.name) || 'ghost'
  const subs = parsePath(BODY)
  const nodes = build({
    name, paths: [],
    lines: subs.map(s => ({ pts: s.pts, closed: s.closed, plate: 'K' })),
    fills: [{ subs }], cutouts: [],
  })
  if (!nodes) return null
  const defs = nodes[0][2]
  const set = (n, ops) => { const g = defs.find(x => x[1].id === `wg-liquid-${name}-${n}`); if (g) g[2].forEach((s, i) => { if (ops[i] !== undefined) s[1]['stop-opacity'] = ops[i] }) }
  set(0, [0.24, 0.48, 0.76])
  for (const n of nodes) if (n[1] && n[1]['stroke-opacity'] === 0.3) n[1]['stroke-opacity'] = 0.45
  const ink = { fill: 'var(--with-liquid-c3, #1C3F9E)' }
  return [...nodes,
    ['circle', { cx: X(9.3), cy: Y(10.6), r: S(1.5), ...ink, class: 'wm-a' }],
    ['circle', { cx: X(14.7), cy: Y(10.6), r: S(1.5), ...ink, class: 'wm-a' }],
    ['ellipse', { cx: X(12), cy: Y(14.6), rx: S(1.15), ry: S(1.5), ...ink, class: 'wm-k' }],
    ['circle', { cx: X(8.8), cy: Y(10.1), r: S(0.45), fill: 'var(--with-liquid-shine, #FFFFFF)', 'fill-opacity': 0.9, class: 'wm-shine' }],
    ['circle', { cx: X(14.2), cy: Y(10.1), r: S(0.45), fill: 'var(--with-liquid-shine, #FFFFFF)', 'fill-opacity': 0.9, class: 'wm-shine' }]]
}
