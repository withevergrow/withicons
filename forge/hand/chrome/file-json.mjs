// forge/hand/chrome/file-json.mjs — a polished chrome page with its dog-eared fold and a pair of tall, fat curly braces
// inlaid in its face as solid dark metal in a thin light bevel ring (the style's inlay recipe, as in file-pdf's tag).
// The generated drawing cut the braces in as grooves holding hairline inlays, small and broken by the chrome horizon,
// so at 16px they melted into the page; a first redraw made them hot-pink enamel, which clashed with the file family's
// dark marks, and a gunmetal tube left them hollow. Here the braces fill most of the face as two fat solid dark tubes,
// the dominant mark at every size. They are the part that moves, so they carry wm-a for the spec's parts.A wiggle.
// The page is the generator's own model and paint (_chrome-core.mjs); the braces are traced from the same fields.
import { parsePath, area } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { ringsD } from '../../styles/_chrome-path.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const PAGE = 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z'
const FOLD = 'M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19'
const GROOVE = 'M14 1.5V6A1.5 1.5 0 0 0 15.5 7.5H20.5'
// the braces: tall, with a sharp centre point, mirrored about x = 12
const LEFT = 'M10.25 10A1.25 1.25 0 0 0 9 11.25V13.5L7.5 14.75L9 16V18.25A1.25 1.25 0 0 0 10.25 19.5'
const RIGHT = 'M13.75 10A1.25 1.25 0 0 1 15 11.25V13.5L16.5 14.75L15 16V18.25A1.25 1.25 0 0 1 13.75 19.5'

function skeleton(name) {
  const paths = [{ id: 'p0', d: PAGE, plate: 'K' }, { id: 'p1', d: FOLD, plate: 'A' }].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  const cut = d => ({ d, subs: parsePath(d) })
  return {
    name, paths, fills: [fill(PAGE)], cutouts: [cut(GROOVE)],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const smooth = r => { const n = r.length; return n < 5 ? r : r.map((p, i) => { const a = r[(i - 1 + n) % n], b = r[(i + 1) % n]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] }) }
const trace = Fd => ringsD(F.contour(F.copy(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth), 0.04, 2)

export default function render(icon) {
  const name = (icon && icon.name) || 'file-json'
  const Ls = layers(model(skeleton(name)))
  const out = emit(Ls, name, 0)
  const polys = [LEFT, RIGHT].flatMap(d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: false })))
  const ring = F.open(F.strokes(polys, 2.45, 0.7), 0.3)
  const core = F.offset(F.copy(ring), 0.38)
  const id = `wg-chrome-${name}-9`
  const grad = ['linearGradient', { id, x1: 0, y1: 9.4, x2: 0, y2: 18.6, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('c3') }],
    ['stop', { offset: 0.5, 'stop-color': col('shadow') }],
    ['stop', { offset: 1, 'stop-color': col('ink') }]]]
  const head = out[0][0] === 'defs' ? [['defs', {}, [...out[0][2], grad]], ...out.slice(1)] : [['defs', {}, [grad]], ...out]
  return [...head,
    ['path', { d: trace(ring), fill: col('edge'), class: 'wm-a' }],
    ['path', { d: trace(core), fill: `url(#${id})`, class: 'wm-a' }],
  ]
}
