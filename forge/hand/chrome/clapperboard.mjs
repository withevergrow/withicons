// forge/hand/chrome/clapperboard.mjs — a polished chrome film slate: a rounded rectangular body and, hinged at its
// upper-left corner and propped open at a slight tilt, a separate clapper arm with three slanted dark stripes. The
// generated drawing fused arm and body into one broken blob and the chrome horizon swallowed the stripes; here the two
// are separate pieces (the arm sits in front, its dark edge draws the hinge, and the open wedge to its right shows
// the gap), and the stripes are solid dark metal bands cut square into the arm's chrome. The arm is the part that
// snaps (wm-a, about the hinge [3, 11]). Both pieces are the generator's own model and paint (_chrome-core.mjs, fills
// rather than strokes so the silhouettes are exactly as drawn); the stripes are traced from the same fields.
import { parsePath, area } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { ringsD } from '../../styles/_chrome-path.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

// body: rounded rectangle
const BODY = 'M3 13.2A1.8 1.8 0 0 1 4.8 11.4H19.2A1.8 1.8 0 0 1 21 13.2V19.7A1.8 1.8 0 0 1 19.2 21.5H4.8A1.8 1.8 0 0 1 3 19.7Z'
// arm: a bar tilted -10 degrees about its lower-left hinge corner
const ANG = -10 * Math.PI / 180, LEN = 18, THK = 4.8
const D = [Math.cos(ANG), Math.sin(ANG)], N = [Math.sin(ANG), -Math.cos(ANG)] // along, and up
const HINGE = [3, 10.9]
const at = (u, v) => [HINGE[0] + D[0] * u + N[0] * v, HINGE[1] + D[1] * u + N[1] * v]
const f2 = v => Math.round(v * 100) / 100
const poly = pts => 'M' + pts.map(p => f2(p[0]) + ' ' + f2(p[1])).join('L') + 'Z'
const ARM = poly([at(0, 0), at(LEN, 0), at(LEN, THK), at(0, THK)])
// three slanted stripes (leaning like "/"), overshooting the arm's edges (clipped to its chrome core below)
const STRIPES = [1.6, 7.1, 12.6].map(u => poly([at(u, -1), at(u + 3.1, -1), at(u + 3.1 + 2.3, THK + 1), at(u + 2.3, THK + 1)]))

function skeleton(name, d) {
  const subs = parsePath(d)
  return { name, paths: [], fills: [{ d, subs, set: setOf(subs.map(s => s.pts)) }], cutouts: [], lines: [] }
}

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const smooth = r => { const n = r.length; return n < 5 ? r : r.map((p, i) => { const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] }) }
const trace = Fd => ringsD(F.contour(F.copy(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth), 0.04, 2)

export default function render(icon) {
  const name = (icon && icon.name) || 'clapperboard'
  const bodyM = model(skeleton(name, BODY))
  const armM = model(skeleton(name, ARM))
  const body = layers(bodyM), arm = layers(armM)
  for (const L of body.list) if (!L.cls) L.cls = 'wm-k'
  for (const L of arm.list) L.cls = L.cls === 'wm-shadow' ? 'wm-shadow' : L.cls === 'wm-shine' ? 'wm-shine' : 'wm-a'
  const shadows = [...body.list, ...arm.list].filter(L => L.cls === 'wm-shadow')
  const rest = [...body.list.filter(L => L.cls !== 'wm-shadow'), ...arm.list.filter(L => L.cls !== 'wm-shadow')]
  const out = emit({ list: [...shadows, ...rest], glint: null }, name, 0)

  // the stripes: dark bands inside the arm's chrome core
  const bands = F.field(0.7)
  F.region(STRIPES.flatMap(d => parsePath(d).map(s => s.pts.map(tf))), 0.7, bands)
  const core = F.offset(F.copy(armM.K), 0.55)
  F.intersect(bands, core)
  // two title lines on the slate
  const lines = F.strokes([[[6.4, 14.4], [12.6, 14.4]], [[6.4, 18.1], [10.4, 18.1]]].map(pts => ({ pts: pts.map(tf), closed: false })), 1.3, 0.7)
  const id = `wg-chrome-${name}-9`
  const grad = ['linearGradient', { id, x1: 0, y1: 3, x2: 0, y2: 19, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('c3') }],
    ['stop', { offset: 0.5, 'stop-color': col('shadow') }],
    ['stop', { offset: 1, 'stop-color': col('ink') }]]]
  const head = out[0][0] === 'defs' ? [['defs', {}, [...out[0][2], grad]], ...out.slice(1)] : [['defs', {}, [grad]], ...out]
  return [...head, ['path', { d: trace(lines), fill: `url(#${id})`, class: 'wm-k' }], ['path', { d: trace(bands), fill: `url(#${id})`, class: 'wm-a' }], ...(arm.glint ? [['path', { ...arm.glint[1], class: 'wm-a' }]] : [])]
}
