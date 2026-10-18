// forge/hand/chrome/trash.mjs: a chrome bin in two clear pieces, a thick lid slab with its own mirror horizon over a
// tapered body with two deep slots, and a gunmetal handle behind the lid. The generated lid was a thin pale tube
// fused to the body, so at 16px the bin lost its lid and faded into a light background.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

const LID = 'M4.25 5.25H19.75A.75 .75 0 0 1 20.5 6V6.5A.75 .75 0 0 1 19.75 7.25H4.25A.75 .75 0 0 1 3.5 6.5V6A.75 .75 0 0 1 4.25 5.25Z'
const BODY = 'M5.75 10.5H18.25L17.4 19.4A1.75 1.75 0 0 1 15.65 21H8.35A1.75 1.75 0 0 1 6.6 19.4Z'
const HANDLE = 'M9.25 5V4A1.5 1.5 0 0 1 10.75 2.5H13.25A1.5 1.5 0 0 1 14.75 4V5'
const SLOTS = ['M10.25 13.25V18.25', 'M13.75 13.25V18.25']

function skeleton(name) {
  const paths = [[LID, 'K'], [BODY, 'K'], [HANDLE, 'A']].map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(LID), fill(BODY)], cutouts: SLOTS.map(d => ({ d, subs: parsePath(d) })),
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'trash'
  const Ls = layers(model(skeleton(name)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
