// forge/hand/halloween/firecracker-string.mjs — three fat red-orange crackers hanging in a zigzag from a sagging
// string, gold-banded, each with a short fuse and spark below. Crackers wm-k, string wm-a, sparks wm-s, halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'
import { fmt } from '../../kernel/geom.mjs'

const NAME = 'firecracker-string'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
// [centre x, top y] of each cracker; string point above it
const CR = [[5.6, 6.2], [12, 9.4], [18.4, 6.2]]
const W = 4.4, H = 8.2
const rect = (x, y) => `M${fmt(x - W / 2 + 1)} ${fmt(y)}H${fmt(x + W / 2 - 1)}Q${fmt(x + W / 2)} ${fmt(y)} ${fmt(x + W / 2)} ${fmt(y + 1)}V${fmt(y + H - 1)}Q${fmt(x + W / 2)} ${fmt(y + H)} ${fmt(x + W / 2 - 1)} ${fmt(y + H)}H${fmt(x - W / 2 + 1)}Q${fmt(x - W / 2)} ${fmt(y + H)} ${fmt(x - W / 2)} ${fmt(y + H - 1)}V${fmt(y + 1)}Q${fmt(x - W / 2)} ${fmt(y)} ${fmt(x - W / 2 + 1)} ${fmt(y)}Z`
const star = (x, y, r) => { const p = []; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * 0.42 : r; p.push([x + rr * Math.sin(a), y - rr * Math.cos(a)]) } return 'M' + p.map(q => q.map(fmt).join(' ')).join('L') + 'Z' }

export default function render() {
  const bodies = CR.map(([x, y]) => rect(x, y)).join('')
  const shadow = CR.map(([x, y]) => rect(x + 0.5, y + 0.6)).join('')
  const bands = CR.map(([x, y]) => `M${fmt(x - W / 2 + 0.3)} ${fmt(y + 1.5)}H${fmt(x + W / 2 - 0.3)}M${fmt(x - W / 2 + 0.3)} ${fmt(y + H - 1.5)}H${fmt(x + W / 2 - 0.3)}`).join('')
  const shine = CR.map(([x, y]) => `M${fmt(x - 1.1)} ${fmt(y + 2.6)}V${fmt(y + H - 2.6)}`).join('')
  const ties = CR.map(([x, y], i) => `M${fmt(x)} ${fmt(i === 1 ? 5.4 : 3.6)}V${fmt(y)}`).join('')
  const fuses = CR.map(([x, y]) => `M${fmt(x)} ${fmt(y + H)}Q${fmt(x + 0.9)} ${fmt(y + H + 0.9)} ${fmt(x + 0.4)} ${fmt(y + H + 1.7)}`).join('')
  const sparks = CR.map(([x, y]) => star(x + 0.4, Math.min(y + H + 2.6, 22.6), 1.5)).join('')
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 0 }, [st(0, C.c2), st(0.6, C.c2), st(1, C.shadow)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.3), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(1), class: 'wm-deco' }],
    ['path', { d: shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: 'M1.5 2.4Q12 7.6 22.5 2.4', ...ROUND, stroke: C.ink, 'stroke-width': 1.5, class: 'wm-a' }],
    ['path', { d: ties, ...ROUND, stroke: C.ink, 'stroke-width': 1.2, class: 'wm-a' }],
    ['path', { d: bodies, fill: url(0), stroke: C.ink, 'stroke-width': 1, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: bands, ...ROUND, stroke: C.accent, 'stroke-width': 1.1, class: 'wm-k' }],
    ['path', { d: shine, ...ROUND, stroke: C.shine, 'stroke-width': 0.8, 'stroke-opacity': 0.7, class: 'wm-shine' }],
    ['path', { d: fuses, ...ROUND, stroke: C.ink, 'stroke-width': 1, class: 'wm-k' }],
    ['path', { d: sparks, fill: C.accent, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-s' }],
  ]
}
