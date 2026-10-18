// forge/hand/glass/gulal.mjs — a frosted bowl with a clear, peaked heap of pink powder rising out of it (the heap sits
// behind the bowl's translucent front so it reads as inside), and three crisp four-point sparkles; the generated drawing
// left the powder as vague pink blobs on a bare bowl.
import { softLayers, softPaint } from '../../styles/_glass-soft.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const BOWL = 'M2.5 12.5 H21.5 C21.5 17.5 17.5 21.5 12 21.5 C6.5 21.5 2.5 17.5 2.5 12.5 Z'
const MOUND = 'M3.9 13.2 C4.6 10.4 7.6 7.2 9.8 6.1 C11.2 5.4 12.8 5.4 14.2 6.1 C16.4 7.2 19.4 10.4 20.1 13.2 Z'

const AC = 'var(--with-glass-accent, #F2679E)', SN = 'var(--with-glass-shine, #FFFFFF)', FR = 'var(--with-glass-frost, #FFFFFF)'
const star = (cx, cy, r) => {
  const k = r * 0.22, f = v => +v.toFixed(2)
  return `M${f(cx)} ${f(cy - r)} Q${f(cx + k)} ${f(cy - k)} ${f(cx + r)} ${f(cy)} Q${f(cx + k)} ${f(cy + k)} ${f(cx)} ${f(cy + r)} Q${f(cx - k)} ${f(cy + k)} ${f(cx - r)} ${f(cy)} Q${f(cx - k)} ${f(cy - k)} ${f(cx)} ${f(cy - r)} Z`
}

function skel(paths, fills, cutouts) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name: 'gulal', paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

export default function render() {
  const L = softLayers(skel([[BOWL, 'K']], [BOWL], ['M3.2 15.2 C3.6 15.8 4.1 16.4 4.8 17']))
  const { defs, out } = softPaint(L, 'gulal')
  const gid = 'wg-glass-gulal-10', gid2 = 'wg-glass-gulal-11'
  const g = ['linearGradient', { id: gid, x1: '12', y1: '5', x2: '12', y2: '13.5', gradientUnits: 'userSpaceOnUse' },
    [['stop', { offset: '0', 'stop-color': AC }], ['stop', { offset: '1', 'stop-color': AC, 'stop-opacity': '0.72' }]]]
  const g2 = ['linearGradient', { id: gid2, x1: '4', y1: '5', x2: '12', y2: '13', gradientUnits: 'userSpaceOnUse' },
    [['stop', { offset: '0', 'stop-color': SN, 'stop-opacity': '0.7' }], ['stop', { offset: '1', 'stop-color': SN, 'stop-opacity': '0' }]]]
  const mound = [
    ['path', { d: MOUND, fill: `url(#${gid})`, stroke: 'currentColor', 'stroke-opacity': '0.14', 'stroke-width': '0.4', class: 'wm-a' }],
    ['path', { d: 'M5.6 12 C6.4 10 8 8.4 9.8 7.3 C10.4 6.9 10.9 6.7 11.4 6.6', fill: 'none', stroke: SN, 'stroke-opacity': '0.8', 'stroke-width': '0.9', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: MOUND, fill: `url(#${gid2})`, class: 'wm-a' }],
  ]
  const sparks = [[5, 5.2, 2], [19.2, 5.8, 2.4], [14.6, 2.4, 1.5]].flatMap(([x, y, r]) => [
    ['path', { d: star(x, y, r), fill: AC, stroke: 'currentColor', 'stroke-opacity': '0.12', 'stroke-width': '0.4', class: 'wm-s' }],
    ['circle', { cx: x, cy: y, r: +(r * 0.2).toFixed(2), fill: SN, 'fill-opacity': '0.9', class: 'wm-s' }],
  ])
  // the heap goes behind the bowl's frosted front pane
  const at = out.findIndex(n => n[1].stroke === 'currentColor')
  return [['defs', {}, [...defs, g, g2]], ...out.slice(0, at), ...mound, ...out.slice(at), ...sparks]
}
