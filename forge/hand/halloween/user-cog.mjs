// forge/hand/halloween/user-cog.mjs — a candle-lit pumpkin person (head centred over a symmetric domed bust, the right
// shoulder cut along an arc concentric with the gear for a 2u gap) beside a big slime-green six-tooth gear with a
// glowing hub, all in the midnight outline. Replaces the generated drawing, whose bone-white person washed out on white.
// Roles: person c1 -> c2, gear c4 (shade ink), hub tint -> accent, outline ink, halo accent, shine shine, shadows shadow.
// Motion: person wm-k (floats), gear wm-s (spins about 17.5,16.5).
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'user-cog'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const GX = 17.5, GY = 16.5
// six square-ish teeth on a round body (tip radius R, root radius r), traced clockwise
function gear(dx = 0, dy = 0, R = 5, r = 3.75, n = 6) {
  const cx = GX + dx, cy = GY + dy, P = (rad, deg) => {
    const a = (deg - 90) * Math.PI / 180
    return `${num(cx + rad * Math.cos(a))} ${num(cy + rad * Math.sin(a))}`
  }
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = i * 360 / n
    d += (i ? 'L' : 'M') + P(r, a - 18) + 'L' + P(R, a - 12.5) + 'L' + P(R, a + 12.5) + 'L' + P(r, a + 18)
    d += `A${r} ${r} 0 0 1 ` + P(r, a + 360 / n - 18)
  }
  return d + 'Z'
}
const HEAD = [7, 8.1, 3.4]
// dome bust symmetric about x 7 (x 1.6-12.4, top y 13.2), right shoulder trimmed on a r7 arc about the gear centre
const body = (dx = 0, dy = 0) => { const P = (x, y) => num(x + dx) + ' ' + num(y + dy)
  return 'M' + P(1.6, 21.2) + 'V' + num(18.4 + dy) + 'A5.2 5.2 0 0 1 ' + P(6.8, 13.2) + 'H' + num(7.2 + dx) + 'A5.2 5.2 0 0 1 ' + P(10.76, 14.61) + 'A7 7 0 0 0 ' + P(12.31, 21.2) + 'Z' }
const BODY = body(), BODY_SH = body(0.15, 0.85)

export default function render() {
  const G = gear()
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7, cy: 13.6, r: 10.5, fx: 5.8, fy: 7, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.c1), st(0.5, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: GX, cy: GY + 0.3, r: 2, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.tint), st(0.55, C.accent), st(1, C.c1)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 13, r: 12, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    // drop shadows
    ['circle', { cx: HEAD[0] + 0.15, cy: HEAD[1] + 0.85, r: HEAD[2], fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: BODY_SH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: gear(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    // the person
    ['circle', { cx: HEAD[0], cy: HEAD[1], r: HEAD[2], fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M4.46 7.18A2.7 2.7 0 0 1 6.53 5.44', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.7, class: 'wm-shine' }],
    ['path', { d: BODY, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M2.4 19.6V18.4A4.4 4.4 0 0 1 6.8 14', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.7, class: 'wm-shine' }],
    // the gear: slime body, a shade on its lower half, the glowing hub, a glint on the lit shoulder
    ['path', { d: G, fill: C.c4, ...INK, class: 'wm-s' }],
    ['path', { d: `M${GX - 3.1} ${GY + 0.9}A3.25 3.25 0 0 0 ${GX + 3.1} ${GY + 0.9}`, ...ROUND, stroke: C.ink, 'stroke-opacity': 0.16, 'stroke-width': 1.1, class: 'wm-s' }],
    ['circle', { cx: GX, cy: GY, r: 1.55, fill: url(1), ...INK, class: 'wm-s' }],
    ['path', { d: `M${GX - 2.75} ${GY - 0.6}A2.8 2.8 0 0 1 ${GX - 0.6} ${GY - 2.75}`, ...ROUND, stroke: C.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
  ]
}
