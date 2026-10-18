// forge/hand/chrome/glasses.mjs — chrome sunglasses: two big rounded lenses in fat polished chrome frames, solid dark
// lenses inlaid in a thin light bevel ring, each with a bright glint streak, a thick bridge and short temple arms.
// The generated drawing was a pair of small, low-contrast chrome slits that smudged at 16px; here the lenses fill the
// frame and are the darkest, largest mark, so the pair is unmistakable at any size.
// The frames are the generator's own model and paint (_chrome-core.mjs); the lenses and glints are traced from the same fields.
import { parsePath, area } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { ringsD } from '../../styles/_chrome-path.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const L = 'M4.4 9.6H8.6A2.4 2.4 0 0 1 11 12V13.2A3.4 3.4 0 0 1 7.6 16.6H5.4A3.4 3.4 0 0 1 2 13.2V12A2.4 2.4 0 0 1 4.4 9.6Z'
const R = 'M19.6 9.6H15.4A2.4 2.4 0 0 0 13 12V13.2A3.4 3.4 0 0 0 16.4 16.6H18.6A3.4 3.4 0 0 0 22 13.2V12A2.4 2.4 0 0 0 19.6 9.6Z'
const BRIDGE = 'M11 11.4C11.6 10.6 12.4 10.6 13 11.4'
const ARML = 'M3 10L2 6.6'
const ARMR = 'M21 10L22 6.6'
const GL = 'M4.2 14.6L6.6 12'
const GR = 'M15.2 14.6L17.6 12'

function skeleton(name) {
  const paths = [L, R, BRIDGE, ARML, ARMR].map((d, i) => ({ id: 'p' + i, d, plate: 'K', subs: parsePath(d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(L), fill(R)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const smooth = r => { const n = r.length; return n < 5 ? r : r.map((p, i) => { const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] }) }
const trace = Fd => ringsD(F.contour(F.copy(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth), 0.04, 2)
const pt = p => tf(p).map(v => +v.toFixed(2)).join(' ')

export default function render(icon) {
  const name = (icon && icon.name) || 'glasses'
  const Ls = layers(model(skeleton(name)))
  const out = emit(Ls, name, 0)
  const lens = d => F.region(parsePath(d).map(s => s.pts.map(tf)), 0.7)
  const both = F.union(lens(L), lens(R))
  const ring = F.open(F.offset(F.copy(both), 0.2), 0.3)
  const core = F.offset(F.copy(ring), 0.38)
  const id = `wg-chrome-${name}-9`
  const grad = ['linearGradient', { id, x1: 0, y1: 9.2, x2: 0, y2: 16.2, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('c2') }],
    ['stop', { offset: 0.45, 'stop-color': col('c3') }],
    ['stop', { offset: 1, 'stop-color': col('ink') }]]]
  const head = out[0][0] === 'defs' ? [['defs', {}, [...out[0][2], grad]], ...out.slice(1)] : [['defs', {}, [grad]], ...out]
  const glint = d => { const [a, b] = d.replace(/[ML]/g, ' ').trim().split(/\s+/).reduce((o, v, i, s) => (i % 2 ? o : [...o, [+v, +s[i + 1]]]), []); return `M${pt(a)}L${pt(b)}` }
  return [...head,
    ['path', { d: trace(ring), fill: col('edge') }],
    ['path', { d: trace(core), fill: `url(#${id})` }],
    ['path', { d: glint(GL), fill: 'none', stroke: col('shine'), 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: glint(GR), fill: 'none', stroke: col('shine'), 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
