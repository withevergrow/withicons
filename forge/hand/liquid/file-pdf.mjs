// forge/hand/liquid/file-pdf.mjs — the clear glass page with its folded corner and an accent-glass label bar that juts
// out past the page's left edge, lettered "PDF" in ink like the style's live lettering. The generated drawing cut a lone
// P into the page as a coloured tube, which read as a generic letter, not the document format; the label bar is the
// format's signal even at 16px, where the letters blur into one line. Same glass recipe as the generator
// (_liquid-core.mjs build); only the geometry and the lettering are drawn here. The bar is the S bead (wm-s).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, col, L } from '../../styles/_liquid-core.mjs'
import { shiftD } from '../../styles/_live-text.mjs'

const PAGE = 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z'
const FOLD = 'M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19'
// the label's centre ring: the bead grows about 1.25u round it, to roughly x 2.75-17, y 12-18.75
const LABEL = 'M4.5 13.25H15.25A.5 .5 0 0 1 15.75 13.75V17A.5 .5 0 0 1 15.25 17.5H4.5A.5 .5 0 0 1 4 17V13.75A.5 .5 0 0 1 4.5 13.25Z'
// "PDF", cap height 3.5u on the label
const LETTERS = [
  'M5 17.1V13.6H6.35A1.2 1.2 0 0 1 6.35 16H5',
  'M8.6 13.6V17.1H9.5A1.75 1.75 0 0 0 9.5 13.6Z',
  'M14.6 13.6H12.4V17.1M12.4 15.35H14.1',
]

function skeleton(name) {
  const paths = [
    { id: 'p0', d: PAGE, plate: 'K' }, { id: 'p1', d: FOLD, plate: 'A' }, { id: 'p2', d: LABEL, plate: 'S' },
  ].map(p => ({ ...p, subs: parsePath(p.d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(PAGE), fill(LABEL)], cutouts: [{ d: FOLD, subs: parsePath(FOLD) }],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'file-pdf'
  const out = build(skeleton(name))
  for (const n of out) {
    const a = n[1]
    if (a && a.fill === col('accent')) { a.fill = col('c3'); a['fill-opacity'] = 0.9; a['stroke-opacity'] = 0.45 }
  }
  const d = LETTERS.map(x => shiftD(x, L.TX, L.TY, L.SCALE)).join('')
  out.push(['path', { d, stroke: col('shine'), 'stroke-width': 0.85, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-s' }])
  return out
}
