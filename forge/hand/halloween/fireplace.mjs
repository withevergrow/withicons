// forge/hand/halloween/fireplace.mjs — a hearth: a witch-purple mantel shelf over a pumpkin-brick chimney breast with
// an arched, dark firebox, a big candle-lit flame (c1 -> tint core) and two crossed logs on a purple hearth slab.
// The generated drawing was a dark arch with a tiny drop; here the flame is the focal point and the bricks and
// mantel say "fireplace" at 16px. Roles: bricks c1 -> c2, mantel/hearth c3 -> edge, flame c1/accent/tint.
// Motion: the flame is wm-a (the spec flickers parts.A about [12, 20.5]); logs wm-s (sway); halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'fireplace'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const r = v => Math.round(v * 100) / 100

const mantel = (dx, dy) => { const p = (x, y) => `${r(x + dx)} ${r(y + dy)}`
  return `M${p(4.2, 3.2)}H${r(19.8 + dx)}Q${p(21.6, 3.2)} ${p(21.6, 5)}Q${p(21.6, 6.8)} ${p(19.8, 6.8)}H${r(4.2 + dx)}Q${p(2.4, 6.8)} ${p(2.4, 5)}Q${p(2.4, 3.2)} ${p(4.2, 3.2)}Z` }
const breast = (dx, dy) => { const p = (x, y) => `${r(x + dx)} ${r(y + dy)}`
  return `M${p(4, 6.8)}H${r(20 + dx)}V${r(19.8 + dy)}H${r(4 + dx)}Z` }
const hearth = (dx, dy) => { const p = (x, y) => `${r(x + dx)} ${r(y + dy)}`
  return `M${p(3.8, 19.8)}H${r(20.2 + dx)}Q${p(21.8, 19.8)} ${p(21.8, 20.9)}Q${p(21.8, 22)} ${p(20.2, 22)}H${r(3.8 + dx)}Q${p(2.2, 22)} ${p(2.2, 20.9)}Q${p(2.2, 19.8)} ${p(3.8, 19.8)}Z` }

export default function render() {
  const mouth = 'M7.4 19.8V13.4A4.6 4.6 0 0 1 12 8.8A4.6 4.6 0 0 1 16.6 13.4V19.8Z'
  const flame = 'M12 9.4C12.4 11.6 15 12.6 15.1 15.6C15.2 17.5 13.8 19 12 19C10.2 19 8.8 17.5 8.9 15.6C9 14.2 9.8 13.5 10.4 12.5C10.9 13.3 11 13.7 11.4 13.9C11.6 12.2 11.5 10.8 12 9.4Z'
  const core = 'M12 14.1C12.5 15 13.4 15.7 13.4 16.8C13.4 17.8 12.8 18.5 12 18.5C11.2 18.5 10.6 17.8 10.6 16.8C10.6 15.7 11.5 15.1 12 14.1Z'
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.4, r: 10, fx: 8.8, fy: 9.2, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 12, y1: 3.2, x2: 12, y2: 22, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(1, C.edge)]],
      ['linearGradient', { id: id(2), x1: 12, y1: 8.8, x2: 12, y2: 19.8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shadow), st(1, C.ink)]],
      ['linearGradient', { id: id(3), x1: 12, y1: 9.4, x2: 12, y2: 19, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent), st(0.5, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(4), cx: 12, cy: 12.1, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
      ['radialGradient', { id: id(5), cx: 12, cy: 16, r: 6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.55), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(4), class: 'wm-deco' }],
    ['path', { d: mantel(0.15, 0.85) + breast(0.15, 0.85) + hearth(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // the pumpkin-brick chimney breast with mortar courses
    ['path', { d: breast(0, 0), fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M4 10.8H7.4M16.6 10.8H20M4 14.2H7.4M16.6 14.2H20M4 17.6H7.4M16.6 17.6H20M5.9 10.8V14.2M5.9 17.6V19.8M18.1 10.8V14.2M18.1 17.6V19.8M4 6.8V10.8M6.5 14.2V17.6M17.5 14.2V17.6',
      ...ROUND, stroke: C.ink, 'stroke-opacity': 0.55, 'stroke-width': 0.6, class: 'wm-k' }],
    // the dark firebox, glowing
    ['path', { d: mouth, fill: url(2), ...INK, class: 'wm-k' }],
    ['path', { d: mouth, fill: url(5), class: 'wm-shine' }],
    // the flame (part A): orange body, bright core
    ['path', { d: flame, fill: url(3), stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: core, fill: C.tint, class: 'wm-a' }],
    // two crossed logs
    ['path', { d: 'M8.4 19L15.8 17.6M8.2 17.6L15.6 19', ...ROUND, stroke: C.ink, 'stroke-width': 2.4, class: 'wm-s' }],
    ['path', { d: 'M8.4 19L15.8 17.6M8.2 17.6L15.6 19', ...ROUND, stroke: C.c2, 'stroke-width': 1.3, class: 'wm-s' }],
    // the mantel shelf and the hearth slab
    ['path', { d: mantel(0, 0), fill: url(1), ...INK, class: 'wm-k' }],
    ['path', { d: 'M4.6 4.2H19.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.7, class: 'wm-shine' }],
    ['path', { d: hearth(0, 0), fill: url(1), ...INK, class: 'wm-k' }],
  ]
}
