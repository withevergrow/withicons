// webhook: three bold shaded nodes (top, bottom-left, bottom-right) joined by two-pixel curved links in a loop.
// Hand-drawn 24-grid sprite: ink outline discs with a tone fill and one shine pixel, links bowed outward; the top node is the moving part (wm-a).
import { useGrid, grid, ix, gridD } from '../../styles/_pixel-core.mjs'

const R = 3.9
const NODES = { top: [12, 6], bl: [5.9, 16.2], br: [18.1, 16.2] }
const inDisc = (c, i, j) => (i + 0.5 - c[0]) ** 2 + (j + 0.5 - c[1]) ** 2 <= R * R
// quadratic curve sampled finely; a cell is on the link when within 1 of the curve
function curve(a, b, bulge) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy)
  const cx = mx + (-dy / len) * bulge * 2, cy = my + (dx / len) * bulge * 2
  const pts = []
  for (let t = 0; t <= 1.0001; t += 0.01) {
    pts.push([(1 - t) ** 2 * a[0] + 2 * t * (1 - t) * cx + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * t * (1 - t) * cy + t * t * b[1]])
  }
  return pts
}
const LINKS = [
  curve(NODES.top, NODES.bl, 2.2),
  curve(NODES.top, NODES.br, -2.2),
  curve(NODES.bl, NODES.br, 2.4),
]

export default function render() {
  useGrid(24)
  const L = { ink: grid(), tone: grid(), aInk: grid(), aTone: grid(), shine: grid() }
  const set = (g, i, j) => { g[ix(i, j)] = 1 }
  const nodeOf = (i, j) => Object.keys(NODES).find((k) => inDisc(NODES[k], i, j))
  for (let j = 0; j < 24; j++) for (let i = 0; i < 24; i++) {
    const k = nodeOf(i, j)
    if (k) {
      const c = NODES[k]
      const edge = !(inDisc(c, i + 1, j) && inDisc(c, i - 1, j) && inDisc(c, i, j + 1) && inDisc(c, i, j - 1))
      const g = k === 'top' ? [L.aInk, L.aTone] : [L.ink, L.tone]
      set(edge ? g[0] : g[1], i, j)
      continue
    }
    const x = i + 0.5, y = j + 0.5
    if (LINKS.some((pts) => pts.some((p) => (p[0] - x) ** 2 + (p[1] - y) ** 2 <= 1.5))) set(L.ink, i, j)
  }
  // shine pixel inside each node, upper left of the centre
  for (const k of Object.keys(NODES)) set(L.shine, Math.round(NODES[k][0] - 1.5), Math.round(NODES[k][1] - 1.5))
  for (let n = 0; n < L.shine.length; n++) if (L.shine[n]) { L.ink[n] = 0; L.aInk[n] = 0; L.tone[n] = 0; L.aTone[n] = 0 }
  const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
  const out = []
  const push = (g, attrs, cls) => { const d = gridD(g); if (d) out.push(['path', { d, ...attrs, class: cls }]) }
  push(L.tone, TONE, 'wm-k'); push(L.ink, {}, 'wm-k')
  push(L.aTone, TONE, 'wm-a'); push(L.aInk, {}, 'wm-a')
  push(L.shine, { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine')
  return out
}
