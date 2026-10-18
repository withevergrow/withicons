// forge/hand/chrome/bread.mjs: a loaf of bread: a chrome crown that overhangs a darker gunmetal base band (the crust and
// pan), with three dark scoring slashes set in pale channels across the crown. The generated loaf was one flat dome with
// pale slashes, so with no base shelf it read as a helmet.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col, K as KK } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const r2 = v => Math.round(v * 100) / 100
const f = (v, axis) => r2((v - 12) * KK.SCALE + 12 + (axis ? KK.TY : KK.TX))
const TD = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(+x, 0)} ${f(+y, 1)}`)

export default function render(icon) {
  const name = (icon && icon.name) || 'bread'
  // crown: a domed top that overhangs the base on both sides
  const crown = 'M2.4 11.6C2.4 6.8 6.6 4 12 4C17.4 4 21.6 6.8 21.6 11.6C21.6 13.8 20.2 14.8 18.6 14.8H5.4C3.8 14.8 2.4 13.8 2.4 11.6Z'
  // base band: narrower, tucked under the crown
  const base = 'M4.2 14.2C4.2 17.6 5.4 20 8.4 20H15.6C18.6 20 19.8 17.6 19.8 14.2Z'
  const fK = F.strokes(lines(crown), 2.55, M0); F.region(rings(crown), M0, fK)
  const fA = F.strokes(lines(base), 2.25, M0); F.region(rings(base), M0, fA)
  const sil = F.copy(fK); F.union(sil, fA)
  const Ls = layers({ T: {}, K: F.open(fK, 0.32), Af: null, Ab: F.open(fA, 0.32), S: null, sil, txt: null, seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  const glint = Ls.glint
  if (glint) out.pop()
  // darker gunmetal base band: restyle the two base-only gradients (1 body, 2 lower shade)
  const stops = a => a.map(([o, r]) => ['stop', { offset: o, 'stop-color': col(r) }])
  const dark = { 1: [[0, 'c2'], [0.45, 'c3'], [1, 'c2']], 2: [[0.3, 'c3'], [0.75, 'c3'], [1, 'c2']] }
  if (out[0] && out[0][0] === 'defs') for (const g of out[0][2]) {
    const k = +String(g[1].id).split('-').pop()
    if (dark[k]) g[2] = stops(dark[k])
  }
  for (const d of ['M6.2 12 8.7 7.4', 'M10.7 12.2 13.2 7.6', 'M15.2 12 17.7 7.4']) {
    out.push(['path', { d: TD(d), stroke: col('edge'), 'stroke-width': r2(3.5 * KK.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }])
    out.push(['path', { d: TD(d), stroke: col('c3'), 'stroke-width': r2(2.3 * KK.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-a' }])
  }
  if (glint) out.push(glint)
  return out
}
