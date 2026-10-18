// forge/hand/liquid/folder-minus.mjs — the folder with a slim ink minus: a clear slot cut through the glass face with a thin ink bar sitting in it (no pink bead, no halo).
// Built with the style's own glass model (_liquid-core.mjs build) from a hand-set skeleton so the paint matches its siblings.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, L } from '../../styles/_liquid-core.mjs'

function synth(name, paths, fills = [], cutouts = []) {
  const ps = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  return {
    name, paths: ps,
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
    cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
  }
}
const r2 = n => Math.round(n * 100) / 100
const circ = (cx, cy, r) => `M${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}Z`
function cap(ax, ay, bx, by, r) {
  const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy), nx = -dy / l * r, ny = dx / l * r
  const f = v => r2(v)
  return `M${f(ax + nx)} ${f(ay + ny)}L${f(bx + nx)} ${f(by + ny)}A${r} ${r} 0 0 0 ${f(bx - nx)} ${f(by - ny)}L${f(ax - nx)} ${f(ay - ny)}A${r} ${r} 0 0 0 ${f(ax + nx)} ${f(ay + ny)}Z`
}

export default function render(icon) {
  const name = (icon && icon.name) || 'folder-minus'
  const folder = 'M3 7 A2 2 0 0 1 5 5 H9 L11 7 H19 A2 2 0 0 1 21 9 V18 A2 2 0 0 1 19 20 H5 A2 2 0 0 1 3 18 Z'
  const slot = 'M9 12.15H15A1.35 1.35 0 0 1 15 14.85H9A1.35 1.35 0 0 1 9 12.15Z'
  const nodes = build(synth(name, [[folder, 'K']], [folder], [slot]))
  // ink bar in the slot, in the model's transformed space
  const tf = (x, y) => [(x - 12) * L.SCALE + 12 + L.TX, (y - 12) * L.SCALE + 12 + L.TY]
  const [x0, y0] = tf(9.35, 12.7), [x1, y1] = tf(14.65, 14.3), r = r2((y1 - y0) / 2)
  const bar = 'M' + r2(x0 + r) + ' ' + r2(y0) + 'H' + r2(x1 - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + r2(x1 - r) + ' ' + r2(y1) + 'H' + r2(x0 + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + r2(x0 + r) + ' ' + r2(y0) + 'Z'
  nodes.push(['path', { d: bar, fill: 'currentColor', 'fill-opacity': 0.82, class: 'wm-a' }])
  return nodes
}
