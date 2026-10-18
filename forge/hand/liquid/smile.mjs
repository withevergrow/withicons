// forge/hand/liquid/smile.mjs: a clear liquid-glass disc (the style's own optics) with a happy face in deep glass
// ink: two round dot eyes and one clean upturned smile arc. The generated outlines blurred into a frog-like tangle;
// here the features are solid dark dots and one rounded stroke, so it reads as a smile at 16-24px.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const rings = d => parsePath(d).map(s => s.pts)
// a capsule ring from a to b with radius r (skeleton units)
function capsule(a, b, r, n = 12) {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), out = []
  for (let i = 0; i <= n; i++) { const t = ang - Math.PI / 2 - Math.PI * i / n; out.push([a[0] + r * Math.cos(t), a[1] + r * Math.sin(t)]) }
  for (let i = 0; i <= n; i++) { const t = ang + Math.PI / 2 - Math.PI * i / n; out.push([b[0] + r * Math.cos(t), b[1] + r * Math.sin(t)]) }
  return out
}

// a stronger tint on the clear glass (0), a deeper coloured glass (1) and a firmer ink hairline
function tune(nodes, name, { k, a, ink }) {
  const defs = nodes[0] && nodes[0][0] === 'defs' ? nodes[0][2] : []
  const set = (n, ops) => {
    const g = defs.find(x => x[1].id === `wg-liquid-${name}-${n}`)
    if (g) g[2].forEach((s, i) => { if (ops[i] !== undefined) s[1]['stop-opacity'] = ops[i] })
  }
  set(0, k); set(1, a)
  for (const n of nodes) if (n[1] && n[1]['stroke-opacity'] === 0.3) n[1]['stroke-opacity'] = ink
  return nodes
}

const RING = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'smile'
  const ico = {
    name,
    paths: [],
    lines: [
      ...lines(RING, 'K'),
    ],
    fills: [
      { set: rings(RING) },
    ],
    cutouts: [],
  }
  const nodes = build(ico)
  if (!nodes) return null
  const out = tune(nodes, name, { k: [0.2, 0.44, 0.7], a: [0.62, 1], ink: 0.42 })
  // an inner glass rim and a soft lower-right bounce, so the disc has the same weight as its siblings
  out.push(['circle', { cx: 12, cy: 12, r: 8.1, stroke: 'var(--with-liquid-edge, #B9E6FF)', 'stroke-opacity': 0.55, 'stroke-width': 0.4, class: 'wm-shine' }])
  out.push(['path', { d: 'M17.9 14.6A6.6 6.6 0 0 1 14.2 18.2', stroke: 'var(--with-liquid-shine, #FFFFFF)', 'stroke-opacity': 0.5, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  // the face: ink-coloured (currentColor) so it holds contrast on light and dark; two dot eyes with a glint, one smile arc
  const ink = 'currentColor'
  const eye = cx => ['circle', { cx, cy: 9.2, r: 1.4, fill: ink, class: 'wm-a' }]
  const glint = cx => ['circle', { cx: cx - 0.45, cy: 8.75, r: 0.38, fill: 'var(--with-liquid-shine, #FFFFFF)', class: 'wm-a' }]
  out.push(eye(8.9), eye(15.1), glint(8.9), glint(15.1))
  out.push(['path', { d: 'M8.1 13.3A4.6 4.6 0 0 0 15.9 13.3', stroke: ink, 'stroke-width': 1.7, 'stroke-linecap': 'round', class: 'wm-a' }])
  return out
}
