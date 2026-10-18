// forge/hand/christmas/coins.mjs — a short stack of flat gold coins with a coin standing in front of it, face on, with
// a ring and a spark struck into it: bright gold faces, a darker edge band, a drift of snow on the stack. The generated
// drawing read as a red cake because the coins carried the cranberry body and a holly topping.
import { C } from '../../styles/_christmas-core.mjs'

const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const n = v => Math.round(v * 100) / 100
const RX = 6.4, RY = 2.4, H = 1.9, CX = 8.6

// a lying coin: edge band (cylinder side) and top face at height cy
const side = cy => `M${n(CX - RX)} ${cy}A${RX} ${RY} 0 0 0 ${n(CX + RX)} ${cy}V${n(cy + H)}A${RX} ${RY} 0 0 1 ${n(CX - RX)} ${n(cy + H)}Z`
const face = (cy, rx = RX, ry = RY) => `M${n(CX - rx)} ${cy}a${rx} ${ry} 0 1 0 ${n(2 * rx)} 0a${rx} ${ry} 0 1 0 ${n(-2 * rx)} 0z`
const disc = (cx, cy, r) => `M${n(cx - r)} ${cy}a${r} ${r} 0 1 0 ${n(2 * r)} 0a${r} ${r} 0 1 0 ${n(-2 * r)} 0z`

export default function render(icon) {
  const name = icon.name || 'coins'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const Y = [16.4, 14.0, 11.6]
  const SX = 17.2, SY = 14.8, SR = 5.3
  const nodes = [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 7, x2: 16, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 6.4, x2: 0, y2: 10, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
  ]
  Y.forEach((cy, i) => {
    const cls = i === 2 ? 'wm-a' : 'wm-k'
    nodes.push(['path', { d: side(cy), fill: C.c3, ...INK, class: cls }])
    nodes.push(['path', { d: side(cy), fill: C.shadow, 'fill-opacity': 0.28, class: cls }])
    nodes.push(['path', { d: face(cy), fill: C.accent, ...INK, class: cls }])
    nodes.push(['path', { d: face(cy, 4.1, 1.5), fill: C.c3, stroke: C.ink, 'stroke-width': 0.35, 'stroke-opacity': 0.65, class: cls }])
  })
  // the standing coin: a thin edge on its right, the round face with a raised rim, a ring and a spark struck in
  nodes.push(['path', { d: disc(SX + 0.9, SY + 0.3, SR), fill: C.c3, ...INK, class: 'wm-k' }])
  nodes.push(['path', { d: disc(SX + 0.9, SY + 0.3, SR), fill: C.shadow, 'fill-opacity': 0.34, class: 'wm-k' }])
  nodes.push(['path', { d: disc(SX, SY, SR), fill: C.accent, ...INK, class: 'wm-k' }])
  nodes.push(['path', { d: disc(SX, SY, 3.7), fill: C.c3, stroke: C.ink, 'stroke-width': 0.38, 'stroke-opacity': 0.7, class: 'wm-k' }])
  nodes.push(['path', { d: `M${SX} ${SY - 2.2}Q${SX + 0.35} ${SY - 0.35} ${SX + 2.2} ${SY}Q${SX + 0.35} ${SY + 0.35} ${SX} ${SY + 2.2}Q${SX - 0.35} ${SY + 0.35} ${SX - 2.2} ${SY}Q${SX - 0.35} ${SY - 0.35} ${SX} ${SY - 2.2}Z`, fill: C.c4, stroke: C.ink, 'stroke-width': 0.35, 'stroke-linejoin': 'round', class: 'wm-k' }])
  // the shared light
  nodes.push(['path', { d: side(Y[0]) + side(Y[1]) + side(Y[2]) + face(Y[2]) + disc(SX + 0.9, SY + 0.3, SR), fill: url(0), 'fill-rule': 'nonzero', class: 'wm-shine' }])
  nodes.push(['path', { d: 'M13.5 11.4Q14.6 9.9 16.4 9.7', stroke: C.shine, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }])
  // a drift of snow on the top coin
  const SNOW = 'M4.2 11.7C3.9 9.6 5.5 8.2 7.3 8.6C8.2 7.7 10.2 8 10.5 9.6C11.8 9.6 12.1 11 11.1 11.8C10.2 12.4 9.2 11.6 8.4 12C7.6 12.4 6.6 12.1 6.1 11.7Q4.6 12.1 4.2 11.7Z'
  nodes.push(['path', { d: SNOW, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  // sparkle
  nodes.push(['path', { d: 'M5 2.8Q5.2 4 6.4 4.2Q5.2 4.4 5 5.6Q4.8 4.4 3.6 4.2Q4.8 4 5 2.8Z', fill: C.accent, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  return nodes
}
