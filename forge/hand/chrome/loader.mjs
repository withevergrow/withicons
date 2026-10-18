// forge/hand/chrome/loader.mjs — eight fat chrome spokes round a clear hub, fading clockwise from the top in three
// steps (full, two-thirds, faint) so the spinner shows which way it runs. Every spoke is the same bright chrome with a
// dark steel edge; the fade is stepped opacity on the whole spoke, never a different metal. The generated spokes were
// thin and alternated chrome with gunmetal, so the diagonals read as dark blobs at 16px.
// Same layer recipe as the generator (_chrome-core.mjs); only the geometry is drawn here.
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K } from '../../styles/_chrome-core.mjs'

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const M0 = 0.7
const r2 = v => Math.round(v * 100) / 100
const R0 = 4.9, R1 = 10, W = 2.7                  // spoke inner and outer radius (skeleton units), tube width
const TIERS = [[0, 1, 2], [3, 4, 5], [6, 7]]
const OPS = [1, 0.66, 0.36]

const spoke = k => {
  const a = (-90 + 45 * k) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
  return { pts: [[12 + R0 * c, 12 + R0 * s], [12 + R1 * c, 12 + R1 * s]].map(tf), closed: false }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'loader'
  const out = []
  const defs = []
  TIERS.forEach((ks, t) => {
    const Kf = F.strokes(ks.map(spoke), W, M0)
    const Ls = layers({ T: { noGlint: true }, K: F.open(Kf, K.ROUND), Af: null, Ab: null, S: null, sil: F.copy(Kf), txt: null, seam: null })
    for (const L of Ls.list) {
      if (!L.cls) L.cls = 'wm-k'
      if (OPS[t] < 1) L.op = r2((L.op == null ? 1 : L.op) * OPS[t])
    }
    // a gradient id is named per tier so the three tiers never collide
    const nodes = emit(Ls, `${name}-t${t}`, 0)
    out.push(...nodes)
  })
  // one defs node first, ids wg-chrome-loader-<n>
  let n = 0
  const rename = new Map()
  for (const node of out) if (node[0] === 'defs') for (const g of node[2]) { const id = `wg-chrome-${name}-${n++}`; rename.set(g[1].id, id); g[1].id = id; defs.push(g) }
  const body = out.filter(n => n[0] !== 'defs').map(([tag, a]) => {
    const f = a.fill && /^url\(#(.+)\)$/.exec(a.fill)
    return [tag, f ? { ...a, fill: `url(#${rename.get(f[1])})` } : a]
  })
  return [['defs', {}, defs], ...body]
}
