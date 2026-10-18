// forge/hand/chrome/sleigh.mjs — a chrome sleigh body (tall backrest, low seat, curled prow knob) riding on a heavy
// gunmetal runner that curls up at the front, held by two short struts. The generated runner sat almost on the body,
// so the struts vanished and the thin runner melted into the body's shadow at 16px, leaving a tub. Here the runner is
// dropped a step and inflated, with clear air under the body. Same model and paint as the generator (_chrome-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

// a skeleton in the shape model() expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = [], T = {}) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))), ...T }
}
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// body: backrest on the left, the seat dipping to a swan-neck prow ending in a round knob
const BODY = 'M3.75 14.5V7.25A2 2 0 0 1 5.75 5.25H6.5A2 2 0 0 1 8.5 7.25V10.25H13.75C15.75 10.25 16.75 7.75 19.25 7.75' +
  'A1.85 1.85 0 0 1 19.25 11.45C17.5 11.45 17.75 16 14.25 16H5.25A1.5 1.5 0 0 1 3.75 14.5Z'
// runner: a long flat skid that curls up in front, and two struts down to it
const RUNNER = 'M2.5 20.5H17.25C19.75 20.5 21.5 19.25 21.5 16.75'
const STRUTS = 'M7 16V20.5M13.75 16V20.5'
// one side groove along the panel
const GROOVE = 'M8.5 13.25H14'

export default function render(icon) {
  const name = (icon && icon.name) || 'sleigh'
  const Ls = layers(model(skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: RUNNER, plate: 'A' },
    { d: STRUTS, plate: 'A' },
  ], [GROOVE])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 9000; t++) out = emit(Ls, name, t)
  return out
}
