// forge/hand/liquid/git-compare.mjs — two branches swapping: hollow glass nodes of one weight, thick equal links and bold coloured arrowheads (replaces the thin pale lines and blob nodes).
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
  const name = (icon && icon.name) || 'git-compare'
  const ring = (cx, cy) => circ(cx, cy, 2.8)
  return build(synth(name, [
    [ring(5, 6), 'K'], [ring(19, 18), 'K'],
    ['M19 15V8.5A2.5 2.5 0 0 0 16.5 6H12.6', 'K'], ['M15 3.6L12.6 6L15 8.4', 'A'],
    ['M5 9V15.5A2.5 2.5 0 0 0 7.5 18H11.4', 'K'], ['M9 15.6L11.4 18L9 20.4', 'A'],
  ]))
}
