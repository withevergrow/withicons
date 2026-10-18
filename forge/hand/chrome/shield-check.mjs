// forge/hand/chrome/shield-check.mjs — a polished chrome shield with one fat, solid gunmetal tick laid on it, parted from
// the chrome by a thin light seam. The generated tick was a thin pale groove, and an earlier redraw painted it as a metal
// tube whose bright core and two dark rims read as a hollow outlined check (a grey 'w' smudge at 16px); here the tick is a
// single dark piece, like shield-alert's '!' and lock's keyhole, and the horizon and dark ground stop short of it so it
// always sits on bright chrome. Shield painted with the style's own layer recipe (_chrome-core).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const r2 = v => Math.round(v * 100) / 100
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const SHIELD = 'M12 21.5C7.5 19.8 4.5 16.5 4.5 12V5.5L12 2.5L19.5 5.5V12C19.5 16.5 16.5 19.8 12 21.5Z'
// the tick, a little larger than the skeleton's, its optical centre at the shield's (about y 11.5)
const TICK = [[8.25, 11.75], [11, 14.5], [15.75, 9.25]]
const TW = 2.8          // tick weight in skeleton units (about 2.45 after placement)
const SEAM = 0.55       // light parting seam each side

export default function render(icon) {
  const name = (icon && icon.name) || 'shield-check'
  const Kf = F.strokes(lines(SHIELD), 2.55, M0)
  F.region(rings(SHIELD), M0, Kf)
  const K = F.open(Kf, 0.32)
  const tick = [{ pts: TICK.map(tf), closed: false }]
  // a wide clear field round the tick: the horizon band and the dark ground stay out from under it
  const txt = F.strokes(tick, 6.4, M0)
  const Ls = layers({ T: {}, K, Af: null, Ab: null, S: null, sil: F.copy(Kf), txt, seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  const d = 'M' + TICK.map(tf).map(p => `${r2(p[0])} ${r2(p[1])}`).join('L')
  const w = TW * S
  const cap = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  out.push(['path', { d, ...cap, stroke: 'var(--with-chrome-edge, #F4F7FC)', 'stroke-width': r2(w + 2 * SEAM), class: 'wm-a' }])
  out.push(['path', { d, ...cap, stroke: 'var(--with-chrome-c3, #3E4556)', 'stroke-width': r2(w), class: 'wm-a' }])
  return out
}
