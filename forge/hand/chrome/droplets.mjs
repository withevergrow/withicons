// forge/hand/chrome/droplets.mjs — two polished chrome water drops, a big one and a small one up to its right, both in
// the bright silver chrome with a softened horizon and a white water highlight curving inside the big drop's lower left.
// The generated drawing made the small drop dark gunmetal and cut a black groove into the big one beside a hard dark
// horizon, so the pair read as heavy dark metal blobs rather than water. Painted with the style's own layer recipe
// (_chrome-core); the small drop keeps the motion part class wm-a.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const r2 = v => Math.round(v * 100) / 100

const BIG = 'M9.25 5.5C11.4 8.5 15.25 11.75 15.25 15.6A6 6 0 0 1 3.25 15.6C3.25 11.75 7.1 8.5 9.25 5.5Z'
const SMALL = 'M17.6 2.25C18.9 4.1 21.25 6.15 21.25 8.55A3.65 3.65 0 0 1 13.95 8.55C13.95 6.15 16.3 4.1 17.6 2.25Z'
const HORIZON = 0.45   // the dark horizon band, softened so the drops read as water

// the water highlight: a tapered crescent hugging the lower left inside the big drop (skeleton units)
function highlight() {
  const cx = 9.25, cy = 15.6, out = [], inn = []
  for (let i = 0; i <= 12; i++) {
    const a = (96 + 86 * i / 12) * Math.PI / 180, w = 0.7 * Math.sin(Math.PI * i / 12)
    out.push(tf([cx + (4 + w) * Math.cos(a), cy + (4 + w) * Math.sin(a)]))
    inn.push(tf([cx + (4 - w) * Math.cos(a), cy + (4 - w) * Math.sin(a)]))
  }
  const P = [...out, ...inn.reverse()]
  return 'M' + P.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z'
}

function paintOf(d, cls) {
  const Kf = F.region(rings(d), M0)
  const Ls = layers({ T: {}, K: F.open(F.copy(Kf), 0.32), Af: null, Ab: null, S: null, sil: Kf, txt: null, seam: null })
  for (const L of Ls.list) {
    if (!L.cls || cls === 'wm-a' && L.cls !== 'wm-shadow') L.cls = cls
    if (L.fill === col('ink')) L.op = HORIZON
  }
  return Ls
}

export default function render(icon) {
  const name = (icon && icon.name) || 'droplets'
  const a = paintOf(SMALL, 'wm-a'), k = paintOf(BIG, 'wm-k')
  // both cast shadows first, then the small drop behind the big one
  const shadow = L => L.cls === 'wm-shadow'
  const Ls = { list: [...a.list.filter(shadow), ...k.list.filter(shadow), ...a.list.filter(L => !shadow(L)), ...k.list.filter(L => !shadow(L))], glint: k.glint }
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return [...out, ['path', { d: highlight(), fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-shine' }]]
}
