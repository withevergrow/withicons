// forge/hand/soft3d/clipboard-check.mjs — the hand-drawn clipboard (wooden board, raised white sheet, silver clip standing
// proud of the top edge) carrying a bold green check raised on the sheet. The generated drawing was a leather bag shape
// with the check hidden; here the board, the clip and the tick all read face-on at 16px.
import { build } from '../../styles/_soft3d-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

function skel(name, category, { paths, fills, cutouts }) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name, category, paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

const BOARD = 'M7 4.5 H17 A2.5 2.5 0 0 1 19.5 7 V19 A2.5 2.5 0 0 1 17 21.5 H7 A2.5 2.5 0 0 1 4.5 19 V7 A2.5 2.5 0 0 1 7 4.5 Z'
const HEAD = 'M10.5 2.75 H13.5 A1 1 0 0 1 14.5 3.75 V5 H9.5 V3.75 A1 1 0 0 1 10.5 2.75 Z'
const SHEET = 'M7.75 8 H16.25 V11 H7.75 Z M7.75 11 H16.25 V13.5 H7.75 Z M7.75 13.5 H16.25 V16 H7.75 Z M7.75 16 H16.25 V18 H7.75 Z'
const CLIP = 'M8.75 6.25 H15.25 M11 3.75 H13 M11 4.75 H13'
const TICK = 'M9.5 14 L11.4 16 L15 11.25'
const GREEN = 'var(--with-soft3d-c4, #3FAE5C)'

export default function render(icon) {
  const nodes = build(skel(icon.name || 'clipboard-check', icon.category || 'files', { paths: [[BOARD, 'K'], [SHEET, 'A'], [CLIP, 'A'], [TICK, 'A']], fills: [BOARD, HEAD], cutouts: [] }))
  return nodes.map(([tag, a, kids]) => {
    if (tag === 'defs') return [tag, a, kids]
    const b = { ...a }
    for (const k of ['fill', 'stroke']) if (/--with-soft3d-c4,/.test(String(b[k] || ''))) b[k] = GREEN
    return [tag, b]
  })
}
