// forge/hand/chrome/rabbit.mjs — a clean chrome rabbit head: the line silhouette (two tall ears, round cheeks) in one
// polished chrome body, with a readable face set on top as flat gunmetal inlays (two glossy eyes, a small nose). The
// generator stroked the face as fat dark tubes that fused into a faceted mask. Chrome model and paint from
// _chrome-core.mjs; only the geometry and the face are drawn here.
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

const HEAD = 'M8.5 11.5 C5.25 13.75 5.25 18 7.5 19.75 C8.75 20.75 10.25 21 12 21 C13.75 21 15.25 20.75 16.5 19.75 C18.75 18 18.75 13.75 15.5 11.5 C17.75 8 18.25 4.5 17.5 3 C16.25 1.25 13.25 4.5 12.5 10 C12.25 10 11.75 10 11.5 10 C10.75 4.5 7.75 1.25 6.5 3 C5.75 4.5 6.25 8 8.5 11.5 Z'
const EYES = [[9.3, 16.1], [14.7, 16.1]]

export default function render(icon) {
  const name = (icon && icon.name) || 'rabbit'
  const Ls = layers(model(skeleton(name, [{ d: HEAD, fill: true }])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  const ink = col('ink'), nose = col('c3')
  // soften the horizon band to gunmetal so it does not frown over the eyes
  for (const n of out) if (n[0] === 'path' && n[1].fill === ink) n[1].fill = col('c3')
  for (const [x, y] of EYES) {
    out.push(['ellipse', { cx: f(x, 0), cy: f(y, 1), rx: r2(1.05 * K.SCALE), ry: r2(1.35 * K.SCALE), fill: ink, class: 'wm-k' }])
    out.push(['circle', { cx: r2(f(x, 0) - 0.3), cy: r2(f(y, 1) - 0.45), r: 0.34, fill: col('shine'), class: 'wm-k' }])
  }
  const nd = `M${f(10.7, 0)} ${f(18.2, 1)}Q${f(12, 0)} ${f(17.8, 1)} ${f(13.3, 0)} ${f(18.2, 1)}Q${f(13.1, 0)} ${f(19.2, 1)} ${f(12, 0)} ${f(19.8, 1)}Q${f(10.9, 0)} ${f(19.2, 1)} ${f(10.7, 0)} ${f(18.2, 1)}Z`
  out.push(['path', { d: nd, fill: nose, class: 'wm-k' }])
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  if (gi >= 0) out.push(out.splice(gi, 1)[0])
  return out
}
