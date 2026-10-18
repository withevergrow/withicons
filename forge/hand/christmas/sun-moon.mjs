// forge/hand/christmas/sun-moon.mjs — a gold sun with five rays on its left nested in the hollow of a frost-white crescent
// moon on its right, so sun plus moon read at 16-24px (the generated drawing was a red/yellow half-disc with no crescent).
// Both bodies carry the deep ink outline of their siblings; one gold sparkle sits above the moon's upper horn.
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'sun-moon'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (a, b) => `${num(a)} ${num(b)}`
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }

const SX = 10.6, SY = 12, SR = 4.8            // sun
const OX = 14.4, OR = 7.4, BR = 6.1           // moon: outer circle and the bite (centred on the sun)
const d = OX - SX, a = (d * d + OR * OR - BR * BR) / (2 * d), h = Math.sqrt(OR * OR - a * a)
const hx = OX - a
const MOON = `M${P(hx, SY - h)}A${OR} ${OR} 0 1 1 ${P(hx, SY + h)}A${BR} ${BR} 0 1 0 ${P(hx, SY - h)}Z`
const SUN = `M${P(SX - SR, SY)}a${SR} ${SR} 0 1 0 ${num(2 * SR)} 0a${SR} ${SR} 0 1 0 ${num(-2 * SR)} 0z`
const RAYS = [140, 170, 190, 220].map(deg => {
  const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t)
  return `M${P(SX + 6.9 * c, SY + 6.9 * s)}L${P(SX + 8.2 * c, SY + 8.2 * s)}`
}).join('')

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 4, x2: 19, y2: 20, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.4), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.3)]],
      // frost pooling in the lower part of the moon
      ['linearGradient', { id: id(1), x1: 0, y1: 5, x2: 0, y2: 19, gradientUnits: 'userSpaceOnUse' }, [st(0.2, C.tint, 0), st(1, C.tint, 1)]],
    ]],
    ['path', { d: RAYS, stroke: C.ink, 'stroke-width': 2.6, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: RAYS, stroke: C.c3, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: MOON, fill: C.c4, stroke: C.ink, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: MOON, fill: url(1), class: 'wm-shine' }],
    ['path', { d: SUN, fill: C.c3, stroke: C.ink, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: MOON, fill: url(0), class: 'wm-shine' }],
    ['path', { d: SUN, fill: url(0), class: 'wm-shine' }],
    ['path', { d: `M${P(SX - 3.1, SY - 1.7)}A3.8 3.8 0 0 1 ${P(SX - 0.6, SY - 3.8)}`, stroke: C.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: sparkle(20.4, 3.4, 1.3), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
