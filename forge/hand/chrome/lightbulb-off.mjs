// forge/hand/chrome/lightbulb-off.mjs: an unlit chrome bulb (plain round glass globe, no filament, a bigger gunmetal screw base
// of two thread bands and a contact tip) muted by one slim mid-tone slash set in a pale gap. The old filament Y read as a
// heart or face and the base was tiny; now it is only globe, base and slash, so it reads at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col, K as KC } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const has = x => x && F.any(x)
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

function compose({ K, Af = null, Ab = null, txt = null }) {
  let K0 = F.copy(K), seam = null
  if (has(Af)) { const g = F.offset(F.copy(Af), -0.42); seam = F.intersect(F.copy(g), K); K0 = minus(K0, g) }
  const sil = F.copy(K)
  if (has(Af)) F.union(sil, Af)
  if (has(Ab)) F.union(sil, Ab)
  const round = x => has(x) ? F.open(F.copy(x), 0.32) : null
  return { T: {}, K: round(K0), Af: round(Af), Ab: round(Ab), S: null, sil, txt, seam }
}

// the glass globe, pinching into a neck
const GLOBE = 'M8.9 15.4C8.9 13.6 4.9 12.4 4.9 8.9A7.1 7.1 0 0 1 19.1 8.9C19.1 12.4 15.1 13.6 15.1 15.4Z'
// the screw base: a collar tucked under the neck, a second thread band and the contact tip
const COLLAR = 'M8.1 14.4H15.9V16.9C15.9 17.5 15.5 17.9 14.9 17.9H9.1C8.5 17.9 8.1 17.5 8.1 16.9Z'
const BAND = 'M8.6 18.9C8.6 18.55 8.9 18.3 9.3 18.3H14.7C15.1 18.3 15.4 18.55 15.4 18.9V19.4C15.4 19.85 15.1 20.1 14.7 20.1H13.5V20.8C13.5 21.5 12.9 22 12 22C11.1 22 10.5 21.5 10.5 20.8V20.1H9.3C8.9 20.1 8.6 19.85 8.6 19.4Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'lightbulb-off'
  const K = F.region(rings(GLOBE), M0)
  const Ab = F.region(rings(COLLAR), M0)
  F.region(rings(BAND), M0, Ab)
  const M = compose({ K, Ab })
  const Ls = layers(M)
    for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const glint = gi >= 0 ? out.splice(gi, 1)[0] : null
  const r2 = v => Math.round(v * 100) / 100
  const f = (v, axis) => r2((v - 12) * KC.SCALE + 12 + (axis ? KC.TY : KC.TX))
  const sl = `M${f(4.4, 0)} ${f(3.6, 1)}L${f(19.6, 0)} ${f(20.4, 1)}`
  out.push(['path', { d: sl, stroke: col('edge'), 'stroke-width': r2(2.7 * KC.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  out.push(['path', { d: sl, stroke: col('c2'), 'stroke-width': r2(1 * KC.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  if (glint) out.push(glint)
  return out
}
