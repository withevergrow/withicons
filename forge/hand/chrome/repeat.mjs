// forge/hand/chrome/repeat.mjs — two chrome loop halves, each one inflated tube that ends in its own solid arrowhead,
// so the loop is two clean pieces with clear air between them. The generated drawing laid separate gunmetal chevrons
// over the tube ends, and the overlapping rims tangled into knots at 24 and 16px.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const TOP = 'M4.5 12V10A3.5 3.5 0 0 1 8 6.5H16'
const TOP_HEAD = 'M15.5 3L20.5 6.5L15.5 10Z'
const BOT = 'M19.5 12V14A3.5 3.5 0 0 1 16 17.5H8'
const BOT_HEAD = 'M8.5 14L3.5 17.5L8.5 21Z'

function skeleton(name) {
  const paths = [TOP, TOP_HEAD, BOT, BOT_HEAD].map((d, i) => ({ id: 'p' + i, d, plate: 'K', subs: parsePath(d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(TOP_HEAD), fill(BOT_HEAD)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'repeat'
  const Ls = layers(model(skeleton(name)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
