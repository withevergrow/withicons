// forge/hand/halloween/database-zap.mjs — the database stack in the same midnight-purple tiers and candle-lit top as
// `database`, kept intact, with a compact slime-green bolt badge at the lower right on a clean ink gap.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'database-zap'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const r2 = v => Math.round(v * 100) / 100

const TOP = 'M2.6 5.6A7.6 2.9 0 1 0 17.8 5.6A7.6 2.9 0 1 0 2.6 5.6Z'
const TIER = (y, d = 0) => {
  const a = r2(y + d), b = r2(y + 4 + d), c = r2(y + 5.6 + d), e = r2(y + 6.9 + d), f = r2(y + 1.6 + d), g = r2(y + 2.9 + d)
  return `M2.6 ${a}V${b}C2.6 ${c} 6 ${e} 10.2 ${e}C14.4 ${e} 17.8 ${c} 17.8 ${b}V${a}C17.8 ${f} 14.4 ${g} 10.2 ${g}C6 ${g} 2.6 ${f} 2.6 ${a}Z`
}
const BOLT = 'M19.3 12.4L15.3 17.8H18L17.2 21.6L21.4 16.2H18.7Z'

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 10.2, cy: 12, r: 13, fx: 7.5, fy: 7, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shadow), st(0.45, C.shadow), st(1, C.ink)]],
      ['radialGradient', { id: id(1), cx: 10.2, cy: 5.6, r: 7.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.5, C.accent), st(1, C.c1)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.6, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: 'M2.75 6.45V19.25C2.75 20.85 6.15 22.15 10.35 22.15C14.55 22.15 17.95 20.85 17.95 19.25V6.45Z', fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: TIER(7.6) + TIER(13.8), fill: url(0), ...INK, stroke: C.edge, class: 'wm-k' }],
    ['path', { d: TOP, fill: url(1), ...INK, stroke: C.edge, class: 'wm-k' }],
    ['path', { d: 'M3.8 10.6V12.4M3.8 16.8V18.6', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.35, 'stroke-width': 0.6, class: 'wm-shine' }],
    ['path', { d: BOLT, fill: C.ink, stroke: C.ink, 'stroke-width': 2.4, 'stroke-linejoin': 'round', class: 'wm-s' }],
    ['path', { d: BOLT, fill: C.c4, ...INK, class: 'wm-s' }],
  ]
}
