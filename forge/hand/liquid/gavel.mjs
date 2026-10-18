// forge/hand/liquid/gavel.mjs — a judge's gavel: a coloured glass head, a thick clear handle on a clear diagonal and a glass sound block seated right under the strike end.
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
  const name = (icon && icon.name) || 'gavel'
  // head: 9 x 5.2 block along (1,-1), centre (10,10)
  const c = [10, 10], u = [0.7071, -0.7071], v = [0.7071, 0.7071], hl = 4.6, ht = 2.6
  const P = (a, b) => [r2(c[0] + u[0] * a + v[0] * b), r2(c[1] + u[1] * a + v[1] * b)]
  const q = [P(-hl, -ht), P(hl, -ht), P(hl, ht), P(-hl, ht)]
  const head = 'M' + q.map(p => p.join(' ')).join('L') + 'Z'
  const handle = 'M' + P(0, ht + 0.7).join(' ') + 'L19.2 19.3'
  const hc = cap(...P(0, ht + 0.7), 19.2, 19.3, 1.5)
  const block = 'M3.5 18.5H10.5A1.2 1.2 0 0 1 11.7 19.7V20.3A1.2 1.2 0 0 1 10.5 21.5H3.5A1.2 1.2 0 0 1 2.3 20.3V19.7A1.2 1.2 0 0 1 3.5 18.5Z'
  return build(synth(name, [[handle, 'K'], [block, 'K'], [head, 'A']], [block, head, hc]))
}
