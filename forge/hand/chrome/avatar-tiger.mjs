// forge/hand/chrome/avatar-tiger.mjs: a chrome tiger cub built in layers: two round chrome ears behind with dark
// gunmetal inner ears, the wide round chrome head in front, and the line design's face on top: a trio of tapered
// forehead stripes, two tapered stripes on each cheek, two bright-ringed eyes, a pale muzzle with a dark nose.
// Every mark is ink on a pale ring where the chrome horizon could swallow it, so it reads as a tiger and not a
// monkey or bear (the generated head stacked bars into one grey mass).
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7, f = v => Math.round(v * 100) / 100
const ell = (x, y, rx, ry) => `M${x + rx} ${y}A${rx} ${ry} 0 1 1 ${x - rx} ${y}A${rx} ${ry} 0 1 1 ${x + rx} ${y}Z`

const HEAD = ell(12, 14.2, 7.9, 6.6)
const EARS = [[5.9, 8.5], [18.1, 8.5]], ER = 3.5
const INNER = [[5.9, 8.7], [18.1, 8.7]], IR = 1.5
const EYES = [[8.9, 12.2], [15.1, 12.2]]
const NOSE = [[10.8, 15.6], [13.2, 15.6], [12, 17.0]]
const STRIPES = [
  [[11.35, 7.55], [12.65, 7.55], [12, 10.5]],
  [[8.4, 8.5], [9.8, 8.0], [10.5, 10.1]],
  [[15.6, 8.5], [14.2, 8.0], [13.5, 10.1]],
  [[4.9, 10.6], [4.9, 12.5], [7.0, 11.6]],
  [[5.1, 15.5], [5.4, 17.5], [7.6, 16.6]],
  [[19.1, 10.6], [19.1, 12.5], [17.0, 11.6]],
  [[18.9, 15.5], [18.6, 17.5], [16.4, 16.6]],
]
const poly = pts => 'M' + pts.map(p => tf(p).map(f).join(' ')).join('L') + 'Z'

// the layers of one chrome piece, ids renumbered to follow `base` gradients already taken
function piece(name, region, base, glint) {
  const K = F.open(F.region(rings(region), M0), 0.32)
  const Ls = layers({ T: {}, K, Af: null, Ab: null, S: null, sil: F.copy(K), txt: null, seam: null })
  for (const l of Ls.list) if (!l.cls) l.cls = 'wm-k'
  const g = Ls.glint
  Ls.glint = null
  const out = emit(Ls, name, 0)
  const defs = out[0] && out[0][0] === 'defs' ? out.shift()[2] : []
  const re = s => typeof s === 'string' ? s.replace(/(wg-chrome-.+?-)(\d+)/g, (m, a, k) => a + (+k + base)) : s
  for (const gr of defs) gr[1].id = re(gr[1].id)
  for (const n of out) if (n[1] && n[1].fill) n[1].fill = re(n[1].fill)
  return { defs, out, glint: glint ? g : null }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-tiger'
  const defs = [], nodes = []
  const add = p => { defs.push(...p.defs); nodes.push(...p.out) }
  for (const [i, [x, y]] of EARS.entries()) {
    add(piece(name, ell(x, y, ER, ER), defs.length))
    const [ix, iy] = tf(INNER[i]), g = `wg-chrome-${name}-${defs.length}`
    defs.push(['linearGradient', { id: g, x1: 0, y1: f(iy - IR * S), x2: 0, y2: f(iy + IR * S), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': col('c2') }], ['stop', { offset: 0.55, 'stop-color': col('c3') }], ['stop', { offset: 1, 'stop-color': col('ink') }]]])
    nodes.push(['circle', { cx: f(ix), cy: f(iy), r: f(IR * S + 0.5), fill: col('edge'), class: 'wm-k' }])
    nodes.push(['circle', { cx: f(ix), cy: f(iy), r: f(IR * S + 0.15), fill: col('shadow'), class: 'wm-k' }])
    nodes.push(['circle', { cx: f(ix), cy: f(iy), r: f(IR * S - 0.1), fill: `url(#${g})`, class: 'wm-k' }])
  }
  const head = piece(name, HEAD, defs.length, true)
  add(head)

  // stripes: ink wedges
  for (const s of STRIPES) nodes.push(['path', { d: poly(s), fill: col('ink'), class: 'wm-k' }])
  // pale muzzle
  const [mx, my] = tf([12, 17.6])
  nodes.push(['ellipse', { cx: f(mx), cy: f(my), rx: f(3.5 * S + 0.3), ry: f(2.3 * S + 0.3), fill: col('shadow'), class: 'wm-k' }])
  nodes.push(['ellipse', { cx: f(mx), cy: f(my), rx: f(3.5 * S), ry: f(2.3 * S), fill: col('edge'), class: 'wm-k' }])
  nodes.push(['path', { d: poly(NOSE), fill: col('ink'), class: 'wm-k' }])
  nodes.push(['ellipse', { cx: f(tf([11.4, 15.9])[0]), cy: f(tf([11.4, 15.9])[1]), rx: 0.4, ry: 0.22, fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-shine' }])
  for (const [x, y] of EYES) {
    const [ex, ey] = tf([x, y])
    nodes.push(['circle', { cx: f(ex), cy: f(ey), r: 1.6, fill: col('edge'), class: 'wm-a' }])
    nodes.push(['circle', { cx: f(ex), cy: f(ey), r: 1.05, fill: col('ink'), class: 'wm-a' }])
    nodes.push(['circle', { cx: f(ex - 0.32), cy: f(ey - 0.34), r: 0.3, fill: col('shine'), class: 'wm-shine' }])
  }
  if (head.glint) nodes.push(head.glint)
  return [['defs', {}, defs], ...nodes]
}
