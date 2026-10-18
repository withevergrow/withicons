// forge/hand/christmas/user-cog.mjs: the gingerbread-gold person with a snow-capped head and holly, and a light
// cream eight-tooth gear with a real hub hole at the lower right. The torso is bitten out around the gear so a clear
// gap separates the two. Replaces the generated dark pine gear blob that sat directly on the body.
import { C, num } from '../../styles/_christmas-core.mjs'
import { circle, setD } from '../../kernel/geom.mjs'
import { setOf, differenceSets } from '../../kernel/bool.mjs'

const N = 'user-cog'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const sh = (d, dy) => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${x} ${Math.round((+y + dy) * 100) / 100}`)
const disc = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

const HEAD = disc(8.5, 7.5, 4.55)
const GX = 17.2, GY = 17.2
const TORSO = 'M1.1 20.4V19.5A5.4 5.4 0 0 1 6.5 14.1H10.5A5.4 5.4 0 0 1 15.9 19.5V20.4Q15.9 21.9 14.4 21.9H2.6Q1.1 21.9 1.1 20.4Z'
const SNOW = 'M4 5.8C4.2 3.25 6.2 1.55 8.5 1.55C10.8 1.55 12.8 3.25 13 5.8C12.6 6.2 12.15 6.05 11.95 5.55C11.7 5.05 11.1 5.05 10.85 5.55' +
  'C10.35 6.75 9.05 6.75 8.7 5.75C8.45 5.15 7.85 5.05 7.45 5.55C7.05 6.05 6.3 6.05 6.05 5.45C5.85 5 5.2 5 4.9 5.5C4.65 5.85 4.2 6.1 4 5.8Z'

// eight chunky teeth: tip radius 5.3, root radius 4.0
function gear() {
  const T = 8, pts = []
  for (let k = 0; k < T; k++) {
    const a0 = k * 2 * Math.PI / T
    for (const [da, r] of [[-0.3, 4.0], [-0.17, 5.3], [0.17, 5.3], [0.3, 4.0]]) {
      const a = a0 + da * 2 * Math.PI / T * 1.0 + Math.PI / 8
      pts.push([GX + r * Math.cos(a), GY + r * Math.sin(a)])
    }
  }
  return 'M' + pts.map(([x, y]) => `${num(x)} ${num(y)}`).join('L') + 'Z' + disc(GX, GY, 1.9)
}

function holly(x, y, s = 1) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a)
    const L = 2.05 * s, W = 0.62 * s
    const p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L], nx = -sa, ny = ca
    const pt = (t, side) => {
      const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4))
      return [p0[0] + (tip[0] - p0[0]) * t + nx * w * side, p0[1] + (tip[1] - p0[1]) * t + ny * w * side]
    }
    const P = []
    for (let k = 0; k <= 8; k++) P.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) P.push(pt(k / 8, -1))
    return 'M' + P.map(p => num(p[0]) + ' ' + num(p[1])).join('L') + 'Z'
  }
  const b = 0.46 * s
  return [
    ['path', { d: leaf(1) + leaf(-1), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(x - 0.42 * s, y + 0.18 * s, b) + disc(x + 0.42 * s, y + 0.18 * s, b) + disc(x, y - 0.42 * s, b), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: disc(x - 0.12 * s, y - 0.58 * s, 0.13 * s), fill: C.shine, class: 'wm-deco' }],
  ]
}

export default function render() {
  const ink = C.ink
  const out = { stroke: ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  // the torso with a gap bitten out around the gear
  const bite = circle(GX, GY, 6.5)
  const arc = (cx, cy, r, a0, a1, n = 10) => Array.from({ length: n + 1 }, (_, k) => { const a = (a0 + (a1 - a0) * k / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)] })
  const ring = [...arc(6.5, 19.5, 5.4, 180, 270), ...arc(10.5, 19.5, 5.4, 270, 360), ...arc(14.4, 20.4, 1.5, 0, 90, 4), ...arc(2.6, 20.4, 1.5, 90, 180, 4)]
  const TORSO_CUT = setD(differenceSets(setOf([ring]), setOf([bite])))
  const GEAR = gear()
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0.8, y1: 2.65, x2: 9.8, y2: 22.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.55, x2: 0, y2: 6.6, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 12, y1: 12, x2: 22.4, y2: 22.4, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: TORSO_CUT + HEAD, fill: C.c3, ...out, class: 'wm-k' }],
    ['path', { d: TORSO_CUT + HEAD, fill: url(0), class: 'wm-shine' }],
    ['path', { d: sh(SNOW, 0.45), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: SNOW, fill: url(1), stroke: ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ...holly(8.5, 1.9, 1.15),
    ['path', { d: GEAR, fill: C.c4, 'fill-rule': 'evenodd', ...out, class: 'wm-a' }],
    ['path', { d: GEAR, fill: url(2), 'fill-rule': 'evenodd', class: 'wm-a wm-shine' }],
  ]
}
