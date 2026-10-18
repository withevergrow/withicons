// forge/hand/christmas/component.mjs — the design-system component mark: four rounded diamonds packed tight round the
// centre (top and bottom cranberry, left and right pine), each lit the same way, one snow cap on the top diamond. Tight
// gaps and a clear ink outline make it one symbol, not a loose gem cluster.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

// diamond of half-diagonal h around (cx, cy); every corner rounded with a quadratic that starts s axis units from the vertex
function dia(cx, cy, h, s) {
  const V = [[cx, cy - h], [cx + h, cy], [cx, cy + h], [cx - h, cy]]
  let d = ''
  for (let i = 0; i < 4; i++) {
    const v = V[i], nx = V[(i + 1) % 4], pv = V[(i + 3) % 4]
    const a = [v[0] + Math.sign(pv[0] - v[0]) * s, v[1] + Math.sign(pv[1] - v[1]) * s]
    const b = [v[0] + Math.sign(nx[0] - v[0]) * s, v[1] + Math.sign(nx[1] - v[1]) * s]
    d += `${i ? 'L' : 'M'}${n(a[0])} ${n(a[1])}Q${n(v[0])} ${n(v[1])} ${n(b[0])} ${n(b[1])}`
  }
  return d + 'Z'
}

const H = 4.7, D = 5.4, S = 0.85
const TOP = dia(12, 12 - D, H, S), BOT = dia(12, 12 + D, H, S), LEFT = dia(12 - D, 12, H, S), RIGHT = dia(12 + D, 12, H, S)
const cy = 12 - D // 6.6, top diamond apex at 1.9
const SNOW = 'M8.95 5Q9 4.3 9.5 3.8L10.6 2.5Q12 .95 13.4 2.5L14.5 3.8Q15 4.3 15.05 5Q14.7 6 13.9 5.6Q13.2 5.2 12.8 6.4Q12 7 11.2 6.4Q10.8 5.2 10.1 5.6Q9.3 6 8.95 5Z'
const SNOWSH = SNOW.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (m, x, y) => `${n(+x + 0.1)} ${n(+y + 0.42)}`)

export default function render(icon) {
  const name = icon.name || 'component'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const body = (d, fill, cls) => [
    ['path', { d, fill, ...INK, class: cls }],
    ['path', { d, fill: url(0), class: 'wm-shine' }],
  ]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 0.55, y2: 1 },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 0.4, x2: 0, y2: 7, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ...body(BOT, C.c1, 'wm-k'),
    ...body(LEFT, C.c2, 'wm-a'),
    ...body(RIGHT, C.c2, 'wm-a'),
    ...body(TOP, C.c1, 'wm-k'),
    ['path', { d: SNOWSH, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: SNOW, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
