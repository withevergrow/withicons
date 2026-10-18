// forge/hand/skeuo/file-spreadsheet.mjs — a paper sheet with its fold and a printed green table inset on the lower
// half: a heavy rounded frame split by one rule and one column line into four cells. The generated grid ran thin green
// rules right out through the paper's edges, so at 16px it tangled into a hash. Same model, materials and light as the
// generator (_skeuo-core / _skeuo-mat / _skeuo-render); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_skeuo-core.mjs'
import { materials } from '../../styles/_skeuo-mat.mjs'
import { paint } from '../../styles/_skeuo-render.mjs'

function skeleton(base, paths, fills, cuts) {
  const ps = paths.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  return {
    ...base, paths: ps,
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
    cutouts: cuts.map(d => ({ d, subs: parsePath(d) })),
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}

const PAGE = 'M14 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V7.5Z'
const FOLD = 'M14 2.5V6A1.5 1.5 0 0 0 15.5 7.5H19'
// the table: frame, one row rule, one column line (a narrow label column on the left)
const FRAME = 'M8.25 11H15.75A0.75 0.75 0 0 1 16.5 11.75V18A0.75 0.75 0 0 1 15.75 18.75H8.25A0.75 0.75 0 0 1 7.5 18V11.75A0.75 0.75 0 0 1 8.25 11Z'
const ROW = 'M7.5 14.75H16.5'
const COL = 'M11 11V18.75'

// the detail (whatever the base drawing lacks) moves as motion part A
function tagA(full, base) {
  const seen = new Set(base.map(n => JSON.stringify(n)))
  return full.map(n => seen.has(JSON.stringify(n)) ? n : [n[0], { ...n[1], class: 'wm-a' }, ...n.slice(2)])
}

export default function render(icon) {
  const S = skeleton({ name: 'file-spreadsheet', category: 'files', ...(icon || {}) },
    [{ d: PAGE }, { d: FOLD, plate: 'A' }, { d: FRAME, plate: 'A' }, { d: ROW, plate: 'A' }, { d: COL, plate: 'A' }],
    [PAGE], [FOLD])
  const T = { print: 'green', wPrint: 1.35 }, T0 = { ...T, noInner: true }
  return tagA(paint(build(S, T), materials(S, T), T), paint(build(S, T0), materials(S, T0), T0))
}
