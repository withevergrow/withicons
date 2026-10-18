// forge/hand/soft3d/file-down.mjs — the teal page with its folded corner and one bold, single-colour down arrow (shaft
// and head as one raised piece, painted light so it stands out from the page); replaces the generated drawing whose
// shaft and head came out in two pale, different colours (sky blue and silver) that sank into the teal page.
// Built with the style's own solid + light engine so it stays in the family.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import { build } from '../../styles/_soft3d-core.mjs'

const PAGE = 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z'
const RAW = {
  paths: [
    { d: PAGE, plate: 'K' },
    { d: 'M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19', plate: 'A' },                       // the fold (c2)
    { d: 'M11.6 10.5V17.6M12.4 10.5V17.6M8.5 14.25L12 17.75L15.5 14.25M9.1 13.65L12 16.6L14.9 13.65', plate: 'A' }, // the arrow (c3): doubled strokes = a bolder shaft and head
  ],
  fills: [PAGE],
  cutouts: ['M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19'],
}

function prep(icon, raw) {
  const paths = raw.paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = raw.cutouts.map(d => ({ d, subs: parsePath(d) }))
  return { ...icon, paths, fills, cutouts,
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: unionSets(fills.map(f => f.set)) }
}

export default function render(icon) {
  const ic = prep(icon, RAW)
  let nodes = null
  for (const lite of [0, 1, 2, 3]) {
    nodes = build(ic, lite)
    if (nodes && JSON.stringify(nodes).length < 17000) break
  }
  // the arrow keeps the role c3 (palettes put their deep colour there: strong on the light page) but defaults to a
  // bright white instead of the pale sky that vanished on the teal page
  const fix = v => typeof v === 'string' ? v.replace(/var\(--with-soft3d-c3, #[0-9A-Fa-f]{6}\)/, 'var(--with-soft3d-c3, #FAFBFD)') : v
  return nodes && nodes.map(n => n[1] && n[0] === 'path' ? [n[0], { ...n[1], fill: fix(n[1].fill), stroke: fix(n[1].stroke) }] : n)
}
