// forge/hand/chrome/file-audio.mjs — a polished chrome page (sky, horizon and ground like file-json) with its dog-eared
// fold and a big dark gunmetal eighth note on its face: a solid tilted oval head, a straight stem and a tapered flag.
// The generated drawing cut the note in as a hollow groove ring and a hairline flag that vanished at 16px; here the
// note is the darkest mass on the icon (an ink-dark core under its bevel rim), set off from the page by its parting
// seam, so it reads against the bright sky and the warm ground at every size. Same model and paint as the generator
// (_chrome-core.mjs); only the geometry and the note's core tone are set here. The note carries wm-a (parts.A beat).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col } from '../../styles/_chrome-core.mjs'

const PAGE = 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z'
const FOLD = 'M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19'
const GROOVE = 'M14 1.5V6A1.5 1.5 0 0 0 15.5 7.5H20.5'
// the head: an oval rx 2.4 ry 1.9 about (9.75, 17.25), tilted -20 degrees (baked into the arc)
const HEAD = 'M12.01 16.43A2.4 1.9 -20 1 1 7.49 18.07A2.4 1.9 -20 1 1 12.01 16.43Z'
// the stem: a straight bar up the head's right side
const STEM = 'M11.25 17V9.5'
const STEM_FILL = 'M10.5 9.25H12V17H10.5Z'
// the flag: from the stem top, sweeping right and tapering to (16, 14.25)
const FLAG = 'M11.25 9.5C12 11.25 15.75 11.25 16 14.25'
const FLAG_FILL = 'M10.5 9.25H12C12.75 10.75 16.25 11 16 14.25C15.25 12.75 12.75 12.75 10.5 12Z'

function skeleton(name) {
  const paths = [
    { id: 'p0', d: PAGE, plate: 'K' }, { id: 'p1', d: FOLD, plate: 'A' },
    { id: 'p2', d: HEAD, plate: 'A' }, { id: 'p3', d: STEM, plate: 'A' }, { id: 'p4', d: FLAG, plate: 'A' },
  ].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  const cut = d => ({ d, subs: parsePath(d) })
  return {
    name, paths, fills: [fill(PAGE), fill(HEAD), fill(STEM_FILL), fill(FLAG_FILL)], cutouts: [cut(GROOVE)],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'file-audio'
  const Ls = layers(model(skeleton(name)))
  // the note's core in the darkest metal: gunmetal above its own horizon, ink below, so it is the darkest mass
  for (const L of Ls.list) {
    if (L.cls !== 'wm-a' || !Array.isArray(L.fill)) continue
    if (L.fill[0] === 'metalSky') L.fill = col('c3')
    else if (L.fill[0] === 'metalGround') L.fill = col('ink')
  }
  return emit(Ls, name, 0)
}
