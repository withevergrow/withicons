// forge/hand/liquid/gingerbread-man.mjs — a bold gingerbread cookie: one smooth silhouette of capsule limbs, two eye dots, a smile and three button dots cut through the glass.
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
  const name = (icon && icon.name) || 'gingerbread-man'
  const parts = [
    circ(12, 6.5, 3.9),
    cap(12, 9.8, 12, 14.8, 3.4),
    cap(12, 11, 18.7, 9.9, 2.3),
    cap(12, 11, 5.3, 9.9, 2.3),
    cap(10.3, 14.6, 7.5, 19.5, 2.4),
    cap(13.7, 14.6, 16.5, 19.5, 2.4),
  ]
  const cuts = [circ(10.5, 5.8, 0.6), circ(13.5, 5.8, 0.6), 'M10.6 7.9Q12 9 13.4 7.9', circ(12, 11.7, 0.8), circ(12, 13.8, 0.8), circ(12, 15.9, 0.8)]
  return build(synth(name, [], parts, cuts))
}
