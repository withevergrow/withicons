// forge/hand/halloween/git-merge.mjs — two pumpkin-orange branch nodes whose lines run together into a witch-purple merge
// node, thick candle-lit lines joined seamlessly to the nodes, midnight outline, drop shadow and lit shoulders like the other
// git icons. Replaces the generated drawing: washed-out bone nodes, a hairline diagonal and a spider crowding the corner.
// Roles: branches c1 -> c2, merge node c3 -> edge, outline ink, halo accent, shine shine, shadow shadow.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'git-merge'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const f = v => Math.round(v * 100) / 100
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
const arc = (x, y, r, a0, a1) => {
  const p = a => [f(x + r * Math.cos(a * Math.PI / 180)), f(y + r * Math.sin(a * Math.PI / 180))]
  const [x0, y0] = p(a0), [x1, y1] = p(a1)
  return `M${x0} ${y0}A${f(r)} ${f(r)} 0 0 1 ${x1} ${y1}`
}

export default function render() {
  const R = 3.4, W = 2.5
  const orange = [[5, 5.6], [5, 18.4]], purple = [19, 12]
  // main branch down the left, the feature branch curving into the merge node
  const lines = 'M5 5.6V18.4M5 5.6C5 10.6 8.8 12 16 12'
  const sh = 'M5.15 6.45V19.25M5.15 6.45C5.15 11.45 8.95 12.85 16.15 12.85'
  const all = [...orange, purple]
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.46, r: 13.2, fx: 8.8, fy: 8.8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 18, cy: 11, r: 5, fx: 17, fy: 9.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.45, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.75, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: all.map(([x, y]) => disc(x + 0.15, y + 0.85, R)).join(''), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: sh, ...ROUND, stroke: C.shadow, 'stroke-opacity': 0.3, 'stroke-width': W, class: 'wm-shadow' }],
    // ink first (nodes and lines), then the colour on top
    ['path', { d: all.map(([x, y]) => disc(x, y, R + 0.36)).join(''), fill: C.ink, class: 'wm-k' }],
    ['path', { d: lines, ...ROUND, stroke: C.ink, 'stroke-width': W + 0.72, class: 'wm-k' }],
    ['path', { d: lines, ...ROUND, stroke: url(0), 'stroke-width': W - 0.72, class: 'wm-k' }],
    ['path', { d: orange.map(([x, y]) => disc(x, y, R - 0.36)).join(''), fill: url(0), class: 'wm-k' }],
    ['path', { d: disc(purple[0], purple[1], R - 0.36), fill: url(1), class: 'wm-k' }],
    // lit upper-left shoulders
    ['path', { d: all.map(([x, y]) => arc(x, y, R - 1, 185, 265)).join(''), ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M4.55 9.6V14.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.34, class: 'wm-shine' }],
  ]
}
