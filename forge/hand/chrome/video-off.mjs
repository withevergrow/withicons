// forge/hand/chrome/video-off.mjs: the whole chrome video camera (body + lens wedge, the same drawing family as video-call)
// crossed by one slim gunmetal slash with a clean pale gap either side, the way camera-off, bell-off and cloud-off do it.
// The generated version laid a pink enamel slash over a washed-out, half-cut camera body and haloed it.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate || 'K', pathId: p.id }))) }
}
const r2 = v => Math.round(v * 100) / 100
const f = (v, axis) => r2((v - 12) * K.SCALE + 12 + (axis ? K.TY : K.TX))
const TD = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(+x, 0)} ${f(+y, 1)}`)

const BODY = 'M4 5.5 H13.5 A2 2 0 0 1 15.5 7.5 V16.5 A2 2 0 0 1 13.5 18.5 H4 A2 2 0 0 1 2 16.5 V7.5 A2 2 0 0 1 4 5.5 Z'
const LENS = 'M16.4 10.4 L21.8 7.2 V16.8 L16.4 13.6 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'video-off'
  const Ls = layers(model(skeleton(name, [{ d: BODY, fill: true }, { d: LENS, plate: 'A', fill: true }], [])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  const s = 'M3.5 3.2 20.5 20.8'
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const glint = gi >= 0 ? out.splice(gi, 1)[0] : null
  out.push(['path', { d: TD(s), stroke: col('edge'), 'stroke-width': r2(2.6 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  out.push(['path', { d: TD(s), stroke: col('c3'), 'stroke-width': r2(1.3 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  if (glint) out.push(glint)
  return out
}
