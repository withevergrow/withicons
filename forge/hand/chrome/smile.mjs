// forge/hand/chrome/smile.mjs — a polished chrome smiley: a round chrome face with two solid oval eyes and a curved
// smile inlaid as dark metal in a thin light bevel ring (the style's inlay recipe, as in file-json). The generated face
// cut its features in as grooves, so the horizon band ran through the eyes and the mouth and left blank goggles; here the
// features sit as fat solid dark marks, above and below the horizon, and read at 16px like the line smiley. The eyes are
// the part that blinks (wm-a); the mouth stays with the face (wm-k). The disc is the generator's own model and paint
// (_chrome-core.mjs); the marks are traced from the same fields.
import { parsePath, area } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { ringsD } from '../../styles/_chrome-path.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const FACE = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
// two oval eyes (short capsules) and the smile arc
const EYES = [[[9, 8.6], [9, 9.9]], [[15, 8.6], [15, 9.9]]]
const SMILE = 'M7.6 13.5A5.4 5.4 0 0 0 16.4 13.5'

function skeleton(name) {
  const paths = [{ id: 'p0', d: FACE, plate: 'K' }].map(p => ({ ...p, subs: parsePath(p.d) }))
  const subs = parsePath(FACE)
  return {
    name, paths, fills: [{ d: FACE, subs, set: setOf(subs.map(s => s.pts)) }], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const smooth = r => { const n = r.length; return n < 5 ? r : r.map((p, i) => { const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] }) }
const trace = Fd => ringsD(F.contour(F.copy(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth), 0.04, 2)

export default function render(icon) {
  const name = (icon && icon.name) || 'smile'
  const Ls = layers(model(skeleton(name)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  const eyes = EYES.map(pts => ({ pts: pts.map(tf), closed: false }))
  const mouth = parsePath(SMILE).map(s => ({ pts: s.pts.map(tf), closed: false }))
  const mark = (polys, w) => {
    const ring = F.open(F.strokes(polys, w, 0.7), 0.3)
    return [ring, F.offset(F.copy(ring), 0.36)]
  }
  const [eyeRing, eyeCore] = mark(eyes, 2.7)
  const [mouthRing, mouthCore] = mark(mouth, 2.3)
  const id = `wg-chrome-${name}-9`
  const grad = ['linearGradient', { id, x1: 0, y1: 6, x2: 0, y2: 17, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('c3') }],
    ['stop', { offset: 0.5, 'stop-color': col('shadow') }],
    ['stop', { offset: 1, 'stop-color': col('ink') }]]]
  const head = out[0][0] === 'defs' ? [['defs', {}, [...out[0][2], grad]], ...out.slice(1)] : [['defs', {}, [grad]], ...out]
  // keep the glint last so it stays on top of the marks
  const glint = head[head.length - 1]
  const body = head.slice(0, -1)
  return [...body,
    ['path', { d: trace(mouthRing), fill: col('edge'), class: 'wm-k' }],
    ['path', { d: trace(mouthCore), fill: `url(#${id})`, class: 'wm-k' }],
    ['path', { d: trace(eyeRing), fill: col('edge'), class: 'wm-a' }],
    ['path', { d: trace(eyeCore), fill: `url(#${id})`, class: 'wm-a' }],
    glint,
  ]
}
