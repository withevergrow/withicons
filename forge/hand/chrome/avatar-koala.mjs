// forge/hand/chrome/avatar-koala.mjs: a chrome koala built in layers: two big round chrome ears behind, each a polished
// piece of its own with a dark gunmetal inner ear in a pale bevel ring, and the round chrome head in front, its dark
// steel edge cleanly separating it from the ears. The face is two ink eyes and the koala's big oval nose, each on a
// pale halo so the chrome horizon can never swallow it. The generated head was one grey mass: ears blurred into it and
// the eyes and nose sank into the dark horizon band.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7, f = v => Math.round(v * 100) / 100
const ell = (x, y, rx, ry) => `M${x + rx} ${y}A${rx} ${ry} 0 1 1 ${x - rx} ${y}A${rx} ${ry} 0 1 1 ${x + rx} ${y}Z`

const HEAD = ell(12, 14.4, 7.2, 6.9)
const EARS = [[4.9, 9.2], [19.1, 9.2]], ER = 4.4
const INNER = [[4.5, 8.8], [19.5, 8.8]], IR = 2.0
const EYES = [[8.8, 13.8], [15.2, 13.8]], NOSE = [12, 16.1, 1.85, 2.4]

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
  const name = (icon && icon.name) || 'avatar-koala'
  const defs = [], nodes = []
  const add = p => { defs.push(...p.defs); nodes.push(...p.out) }
  // ears first (behind), then the inner ear of each, then the head over them
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

  // face: pale halo, ink, white catch-light
  const [nx, ny, nrx, nry] = NOSE, [Nx, Ny] = tf([nx, ny])
  nodes.push(['ellipse', { cx: f(Nx), cy: f(Ny), rx: f(nrx * S + 0.5), ry: f(nry * S + 0.5), fill: col('edge'), class: 'wm-k' }])
  nodes.push(['ellipse', { cx: f(Nx), cy: f(Ny), rx: f(nrx * S), ry: f(nry * S), fill: col('ink'), class: 'wm-k' }])
  nodes.push(['ellipse', { cx: f(Nx - 0.45), cy: f(Ny - 0.95), rx: 0.5, ry: 0.28, fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-shine' }])
  for (const [x, y] of EYES) {
    const [ex, ey] = tf([x, y])
    nodes.push(['circle', { cx: f(ex), cy: f(ey), r: 1.45, fill: col('edge'), class: 'wm-a' }])
    nodes.push(['circle', { cx: f(ex), cy: f(ey), r: 0.95, fill: col('ink'), class: 'wm-a' }])
    nodes.push(['circle', { cx: f(ex - 0.3), cy: f(ey - 0.32), r: 0.3, fill: col('shine'), class: 'wm-shine' }])
  }
  if (head.glint) nodes.push(head.glint)
  return [['defs', {}, defs], ...nodes]
}
