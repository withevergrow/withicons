// forge/hand/liquid/git-merge.mjs — two branches joining: hollow glass nodes, a thick main line and a thick merge curve that runs clearly into the main line (replaces the faint diagonal and blob nodes).
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
  const name = (icon && icon.name) || 'git-merge'
  const ring = (cx, cy) => circ(cx, cy, 2.8)
  return build(synth(name, [
    [ring(6, 5.5), 'K'], [ring(6, 18.5), 'K'], [ring(18, 12), 'K'],
    ['M6 9V15', 'K'],
    ['M7.6 7.9C9 11 11.6 12 15 12', 'A'],
  ]))
}
