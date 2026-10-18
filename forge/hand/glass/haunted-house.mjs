// forge/hand/glass/haunted-house.mjs — a lopsided haunted house (a gabled house with a tall pointed tower), glowing deep
// windows and an arched door cut into the frosted pane, and a big accent crescent moon over the roof, larger windows and door that survive 16px; the generated
// drawing turned the moon into a round blob at the corner and had no real windows.
import { softLayers, softPaint } from '../../styles/_glass-soft.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const MAIN = 'M5 20.5 A1.5 1.5 0 0 1 3.5 19 V10.5 L10 4.5 L16.5 10.5 V19 A1.5 1.5 0 0 1 15 20.5 Z'
const TOWER = 'M14.5 20.5 V9.5 L17.5 3.4 L20.5 9.5 V20.5 Z'
const OUT = 'M5 20.5 A1.5 1.5 0 0 1 3.5 19 V10.5 L10 4.5 L14.5 8.6 M17.5 3.4 L14.5 9.5 V20.5 H20.5 V9.5 L17.5 3.4'
const DOOR = 'M7 20.5 V16.5 A2.25 2.25 0 0 1 11.5 16.5 V20.5 Z'
const ATTIC = 'M11.15 10.4 A1.9 1.9 0 1 1 7.35 10.4 A1.9 1.9 0 1 1 11.15 10.4 Z'
const TWIN = 'M16.25 16 V14.5 A1.75 1.75 0 0 1 19.75 14.5 V16 Z'

const AC = 'var(--with-glass-accent, #F2679E)', SN = 'var(--with-glass-shine, #FFFFFF)'
// crescent: outer disc minus an inner disc pushed up and to the right (big, so it reads at 16px)
const f2 = v => +v.toFixed(2)
function crescent(c1, r1, c2, r2) {
  const dx = c2[0] - c1[0], dy = c2[1] - c1[1], d = Math.hypot(dx, dy)
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(r1 * r1 - a * a)
  const mx = c1[0] + a * dx / d, my = c1[1] + a * dy / d
  const p1 = [mx + h * dy / d, my - h * dx / d], p2 = [mx - h * dy / d, my + h * dx / d]
  const q = p => f2(p[0]) + ' ' + f2(p[1])
  return 'M' + q(p1) + ' A' + r1 + ' ' + r1 + ' 0 1 0 ' + q(p2) + ' A' + r2 + ' ' + r2 + ' 0 0 1 ' + q(p1) + ' Z'
}
const MOON = crescent([4.7, 4.5], 3, [6.2, 3.5], 2.55)

function skel(paths, fills, cutouts) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name: 'haunted-house', paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

export default function render() {
  const L = softLayers(skel([[OUT, 'K']], [MAIN, TOWER], [DOOR, ATTIC, TWIN]))
  const { defs, out } = softPaint(L, 'haunted-house')
  const g = ['linearGradient', { id: 'wg-glass-haunted-house-10', x1: '2', y1: '1.5', x2: '7', y2: '7', gradientUnits: 'userSpaceOnUse' },
    [['stop', { offset: '0', 'stop-color': SN, 'stop-opacity': '0.75' }], ['stop', { offset: '1', 'stop-color': SN, 'stop-opacity': '0' }]]]
  const moon = [
    ['path', { d: MOON, fill: AC, stroke: 'currentColor', 'stroke-opacity': '0.12', 'stroke-width': '0.4', class: 'wm-s' }],
    ['path', { d: MOON, fill: 'url(#wg-glass-haunted-house-10)', class: 'wm-s' }],
    ['path', { d: 'M2.26 3.61 A2.6 2.6 0 0 1 3.81 2.06', fill: 'none', stroke: SN, 'stroke-opacity': '0.9', 'stroke-width': '0.6', 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M12.4 2.2 L12.65 2.95 L13.4 3.2 L12.65 3.45 L12.4 4.2 L12.15 3.45 L11.4 3.2 L12.15 2.95 Z', fill: AC, class: 'wm-deco' }],
  ]
  return [['defs', {}, [...defs, g]], ...out, ...moon]
}
