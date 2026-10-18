// forge/hand/chrome/hard-drive.mjs: one chrome drive case with a sloped top, a seam, a gunmetal label slot and two
// gunmetal LEDs set into the face (the generator's lens-like ring is gone, so it no longer reads as a camera).
// Chrome model and paint from _chrome-core.mjs; only the geometry and the inlays are drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = v => Math.round(v * 100) / 100
const f = (v, axis) => r2((v - 12) * K.SCALE + 12 + (axis ? K.TY : K.TX))
const pillD = (x0, y0, x1, y1, g = (v) => v, s = 1) => {
  const r = (y1 - y0) / 2, x = (v, a) => g(v, a)
  return `M${x(x0 + r, 0)} ${x(y0, 1)} H${x(x1 - r, 0)} A${r2(r * s)} ${r2(r * s)} 0 0 1 ${x(x1 - r, 0)} ${x(y1, 1)} H${x(x0 + r, 0)} A${r2(r * s)} ${r2(r * s)} 0 0 1 ${x(x0 + r, 0)} ${x(y0, 1)} Z`
}
const discD = (cx, cy, r) => `M${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} Z`

const BODY = 'M6.2 4.5 H17.8 Q19 4.5 19.7 5.5 L22 9.5 V17.5 A2 2 0 0 1 20 19.5 H4 A2 2 0 0 1 2 17.5 V9.5 L4.3 5.5 Q5 4.5 6.2 4.5 Z'
const SEAM = 'M2.4 9.6 H21.6'
const SLOT = [4.6, 14.6, 11.6, 16.8]
const LEDS = [[15.6, 15.7], [19, 15.7]]
const LR = 0.85

export default function render(icon) {
  const name = (icon && icon.name) || 'hard-drive'
  const cuts = [SEAM, pillD(...SLOT), ...LEDS.map(([x, y]) => discD(x, y, LR))]
  const Ls = layers(model(skeleton(name, [{ d: BODY, fill: true }], cuts)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  const ink = col('c3')
  out.push(['path', { d: pillD(...SLOT, f, K.SCALE), fill: ink, class: 'wm-k' }])
  for (const [x, y] of LEDS) out.push(['circle', { cx: f(x, 0), cy: f(y, 1), r: r2(LR * K.SCALE), fill: ink, class: 'wm-a' }])
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  if (gi >= 0) out.push(out.splice(gi, 1)[0])
  return out
}
