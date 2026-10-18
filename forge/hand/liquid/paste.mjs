// forge/hand/liquid/paste.mjs: a clipboard (clear board, violet glass clip on top) with a separate sheet pulled across
// its lower right corner. A wide cut parts the sheet from the board, so the clip, the board and the sheet read as
// three pieces, and the page lines are grooves in the sheet.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a prepared skeleton in the shape model() expects: lines, fills (subs), cutouts (subs)
function skeleton(name, parts, cuts = []) {
  const lines = [], fills = []
  for (const p of parts) {
    const subs = parsePath(p.d)
    if (p.line !== false) for (const s of subs) lines.push({ pts: s.pts, closed: s.closed, plate: p.plate || 'K' })
    if (p.fill) fills.push({ subs })
  }
  return { name, paths: [], lines, fills, cutouts: cuts.map(d => ({ subs: parsePath(d) })) }
}

const BOARD = 'M5 4.5H8V3.5A1 1 0 0 1 9 2.5H12A1 1 0 0 1 13 3.5V4.5H15A2 2 0 0 1 17 6.5V9H12.5A4 4 0 0 0 8.5 13V20H5A2 2 0 0 1 3 18V6.5A2 2 0 0 1 5 4.5Z'
const CLIP = 'M7.5 2.5H13.5A1 1 0 0 1 14.5 3.5V5.5A1 1 0 0 1 13.5 6.5H7.5A1 1 0 0 1 6.5 5.5V3.5A1 1 0 0 1 7.5 2.5Z'
const SHEET = 'M12.5 11H19A2 2 0 0 1 21 13V19.5A2 2 0 0 1 19 21.5H12.5A2 2 0 0 1 10.5 19.5V13A2 2 0 0 1 12.5 11Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'paste'
  return build(skeleton(name, [
    { d: BOARD, plate: 'K', fill: true },
    { d: CLIP, plate: 'A', fill: true },
    { d: SHEET, plate: 'K', fill: true },
  ], [
    'M9 21V13A3.5 3.5 0 0 1 12.5 9.5H18',
    'M13.5 14.75H18',
    'M13.5 18H16.5',
  ])) || []
}
