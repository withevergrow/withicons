// forge/hand/christmas/ungroup.mjs: two identical snow-capped cranberry squares, split apart along the diagonal with a
// clear gap, so they read as two matching separate objects instead of a pudding and a box. Same size, fill and snow.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'ungroup'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const sq = (x, y, s, r) => `M${num(x + r)} ${num(y)}H${num(x + s - r)}Q${num(x + s)} ${num(y)} ${num(x + s)} ${num(y + r)}V${num(y + s - r)}Q${num(x + s)} ${num(y + s)} ${num(x + s - r)} ${num(y + s)}H${num(x + r)}Q${num(x)} ${num(y + s)} ${num(x)} ${num(y + s - r)}V${num(y + r)}Q${num(x)} ${num(y)} ${num(x + r)} ${num(y)}Z`

const S = 9.6, R = 2.6
const A = [1.8, 1.8], B = [12.6, 12.6]
// the snow drift of the style's cap (authored on a square at 2.35,3.6 of width 11.3), refitted to a square at (x, y)
const SNOW0 = 'M2.35 6.3C2.55 3.75 4.3 2.15 6.4 2.15H9.6C11.7 2.15 13.45 3.75 13.65 6.3C13.25 6.7 12.8 6.55 12.6 6.05C12.35 5.55 11.75 5.55 11.5 6.05' +
  'C11 7.25 9.7 7.25 9.35 6.25C9.1 5.65 8.5 5.55 8.1 6.05C7.7 6.55 6.95 6.55 6.7 5.95C6.5 5.5 5.85 5.5 5.55 6C5.3 6.35 4.55 6.6 2.35 6.3Z'
const snow = (x, y) => {
  const k = (S + 0.1) / 11.3
  return SNOW0.replace('H9.6', 'L9.6 2.15').replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, px, py) =>
    `${num(x - 0.05 + (+px - 2.35) * k)} ${num(y - 0.35 + (+py - 2.15) * k)}`)
}
const shy = (d, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, px, py) => `${px} ${num(+py + dy)}`)

export default function render() {
  const ink = C.ink
  const out = { stroke: ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  const lit = (x, y) => ['linearGradient', { id: id(0), x1: x, y1: y, x2: x + 6.4, y2: y + S, gradientUnits: 'userSpaceOnUse' },
    [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]]
  const litB = (x, y) => { const g = lit(x, y); g[1] = { ...g[1], id: id(1) }; return g }
  const cap = [['linearGradient', { id: id(2), x1: 0, y1: 1.8, x2: 0, y2: 6.6, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ['linearGradient', { id: id(3), x1: 0, y1: 12.6, x2: 0, y2: 17.4, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]]]
  const unit = (xy, g, c, cls, gs) => {
    const d = sq(xy[0], xy[1], S, R), sn = snow(xy[0], xy[1])
    return [
      ['path', { d, fill: C.c1, ...out, class: cls }],
      ['path', { d, fill: url(g), class: cls + ' wm-shine' }],
      ['path', { d: shy(sn, 0.45), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
      ['path', { d: sn, fill: url(gs), stroke: ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ]
  }
  return [
    ['defs', {}, [lit(A[0], A[1]), litB(B[0], B[1]), ...cap]],
    ...unit(B, 1, C.c1, 'wm-a', 3),
    ...unit(A, 0, C.c1, 'wm-k', 2),
  ]
}
