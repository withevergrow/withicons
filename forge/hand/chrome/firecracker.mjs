// forge/hand/chrome/firecracker.mjs — an upright chrome cylinder with two band grooves, a gunmetal fuse and a pink enamel spark burst at top right.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const run = (name, parts, cuts) => {
  const Ls = layers(model(skeleton(name, parts, cuts)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}

const star = (cx, cy, R, r, n) => {
  let d = ''
  for (let i = 0; i < n * 2; i++) {
    const a = Math.PI * i / n - Math.PI / 2, q = i % 2 ? r : R
    d += (i ? 'L' : 'M') + Math.round((cx + q * Math.cos(a)) * 100) / 100 + ' ' + Math.round((cy + q * Math.sin(a)) * 100) / 100
  }
  return d + 'Z'
}
export default function render(icon) {
  return run((icon && icon.name) || 'firecracker', [
    { d: 'M7 8.2A2.75 1.3 0 0 1 12.5 8.2V21.3A2.75 1.3 0 0 1 7 21.3Z', plate: 'K', fill: true },
    { d: 'M9.75 7.2C9.75 4.6 12 3.8 14.8 4.6', plate: 'A' },
    { d: star(18.4, 4.4, 3.6, 1.3, 4), plate: 'S' },
  ], ['M7 14.6A2.75 0.8 0 0 0 12.5 14.6'])
}
