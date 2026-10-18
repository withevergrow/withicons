// forge/hand/chrome/image-off.mjs — a polished chrome picture plate carrying a dark inlaid mountain and sun, struck
// through corner to corner by a hot-pink enamel slash in its chrome bezel. The generated drawing broke the frame into
// two loose corner pieces and showed the mountain and sun as pale rings; here the plate is whole, the two inlays are
// solid gunmetal-dark shapes in a thin light bevel ring (the style's inlay recipe, as in folder-minus), and the slash
// cuts them with one even moat. The mountain and sun are the moving part (parts.A): wm-a; the slash is wm-s.
// Body and slash are the generator's own model and paint (_chrome-core.mjs); the inlays are traced from the same fields.
import { parsePath, area } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { ringsD } from '../../styles/_chrome-path.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const FRAME = 'M4 4H20A2 2 0 0 1 22 6V18A2 2 0 0 1 20 20H4A2 2 0 0 1 2 18V6A2 2 0 0 1 4 4Z'
const SLASH = 'M3 3L21 21'
const MOUNT = 'M4.4 17.6L8.4 12.4C8.6 12.1 9 12.1 9.2 12.4L13 17.6Z'
const SUN = 'M19.2 9A2.2 2.2 0 1 1 14.8 9A2.2 2.2 0 1 1 19.2 9Z'

function skeleton(name) {
  const paths = [{ id: 'p0', d: FRAME, plate: 'K' }, { id: 'p1', d: SLASH, plate: 'S' }].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(FRAME)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const smooth = r => { const n = r.length; return n < 5 ? r : r.map((p, i) => { const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] }) }
const trace = Fd => ringsD(F.contour(F.copy(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth), 0.04, 2)

export default function render(icon) {
  const name = (icon && icon.name) || 'image-off'
  const M = model(skeleton(name))
  const Ls = layers(M)
  const out = emit(Ls, name, 0)
  // the inlays: both shapes, minus the slash's moat, fused to the plate
  const moat = F.offset(F.copy(M.S), -(K.MOAT + 0.05))
  const shape = d => { const f = F.region(parsePath(d).map(s => s.pts.map(tf)), 0.7); return F.subtract(f, moat) }
  const A = F.union(shape(MOUNT), shape(SUN))
  const A0 = F.open(F.copy(A), 0.3)
  const inner = F.offset(F.copy(A0), 0.4)
  const id = `wg-chrome-${name}-9`
  const grad = ['linearGradient', { id, x1: 0, y1: 8.5, x2: 0, y2: 17.5, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('c3') }],
    ['stop', { offset: 0.55, 'stop-color': col('shadow') }],
    ['stop', { offset: 1, 'stop-color': col('ink') }]]]
  const inlay = [
    ['path', { d: trace(A0), fill: col('edge'), class: 'wm-a' }],
    ['path', { d: trace(inner), fill: `url(#${id})`, class: 'wm-a' }],
  ]
  const head = out[0][0] === 'defs' ? [['defs', {}, [...out[0][2], grad]], ...out.slice(1)] : [['defs', {}, [grad]], ...out]
  // inlays go in front of the plate, behind the slash (the enamel jewel is the last piece painted)
  const k = head.findIndex((n, i) => i > 0 && n[1].class === 'wm-s')
  return k < 0 ? [...head, ...inlay] : [...head.slice(0, k), ...inlay, ...head.slice(k)]
}
