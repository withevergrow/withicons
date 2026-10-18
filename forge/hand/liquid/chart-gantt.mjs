// forge/hand/liquid/chart-gantt.mjs — the project plan as three coloured glass bars staggered across a slim glass rail.
// The generated drawing fused a fat 2.6u axis into the bars' tick marks and packed the bars so close their glass bled
// together. Here the rail is its own thin piece of clear glass (a second build at a 1.5u stroke, gradient ids shifted
// past the bars' so the two share one defs), the bars sit on three evenly spaced rows with a clear gap between rows,
// and each starts a step further right than the one above. Same glass recipe as the generator (_liquid-core.mjs
// build); only the pieces and the stroke of the rail change. The bars are the A part (wm-a), the rail the body.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, L } from '../../styles/_liquid-core.mjs'

function synth(name, paths, fills = []) {
  const ps = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  return {
    name, paths: ps, cutouts: [],
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
  }
}
const bar = (x0, x1, y) => `M${x0 + 1} ${y - 1}H${x1 - 1}A1 1 0 0 1 ${x1 - 1} ${y + 1}H${x0 + 1}A1 1 0 0 1 ${x0 + 1} ${y - 1}Z`

// ids wg-liquid-<name>-<n>: shift every n of one build, and the url(#...) that point at them
function shiftIds(nodes, name, by) {
  const re = new RegExp(`wg-liquid-${name}-([0-9]+)`, 'g')
  const sub = s => typeof s === 'string' ? s.replace(re, (_, n) => `wg-liquid-${name}-${+n + by}`) : s
  return nodes.map(n => {
    if (n[0] === 'defs') return ['defs', n[1], n[2].map(g => [g[0], { ...g[1], id: sub(g[1].id) }, g[2]])]
    const a = { ...n[1] }
    for (const k of ['fill', 'stroke']) a[k] = sub(a[k])
    return [n[0], a]
  })
}

export default function render(icon) {
  const name = (icon && icon.name) || 'chart-gantt'
  const rows = [[7.5, 15, 4.5], [10, 18.5, 12], [13.5, 21, 19.5]]
  const ds = rows.map(([a, b, y]) => bar(a, b, y))
  const bars = build(synth(name, ds.map(d => [d, 'A']), ds))

  const wK = L.WK
  let rail
  try {
    L.WK = 1.7
    rail = build(synth(name, [['M3.5 3.5V20.5', 'K']]))
  } finally { L.WK = wK }
  rail = shiftIds(rail, name, 6)

  const defs = [...bars[0][2], ...rail[0][2]]
  const drop = n => n[0] !== 'defs'
  // the rail's ground shadow would double the bars': keep only the bars' one
  const railBody = rail.filter(drop).filter(n => n[1].class !== 'wm-shadow').map(n => n[1].class ? n : [n[0], { ...n[1], class: 'wm-k' }])
  return [['defs', {}, defs], ...bars.filter(drop), ...railBody]
}
