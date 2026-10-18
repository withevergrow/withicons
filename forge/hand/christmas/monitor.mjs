// forge/hand/christmas/monitor.mjs — a gold desktop display with a cool snow-white screen, a slim snow cap and no holly,
// standing on a tall cranberry neck and a wide foot so it can never be taken for the laptop; the generated drawing had a
// short candy-striped stand and a holly-topped snow mound that crowded the frame.
import { C, loopsD, num } from '../../styles/_christmas-core.mjs'

const N = 'monitor'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

// a snow cap resting on the surface y = top(x): thick on flats, thinning on steep sides and at the ends, soft drips
function snowCap(top, xa, xb, { up = 1.3, dn = 0.85, drips = [], ph = 0.7, ph2 = 2.1, taper = 1.2 } = {}) {
  const U = [], D = []
  for (let x = xa; x <= xb + 1e-6; x += 0.25) {
    const s = Math.abs(top(x + 0.4) - top(x - 0.4)) / 0.8
    const e = Math.max(0, Math.min(1, (x - xa) / taper, (xb - x) / taper))
    const q = Math.sqrt(Math.max(0, Math.min(1, 1 - (s - 0.5) / 1.1)) * e * e * (3 - 2 * e))
    let d = dn * q * (1 + 0.18 * Math.sin(x * 2.1 + ph2))
    for (const p of drips) { const u = (x - p.x) / p.w; if (Math.abs(u) < 1) d = Math.max(d, dn * q + p.l * q * Math.sqrt(1 - u * u)) }
    U.push([x, top(x) - up * q * (1 + 0.1 * Math.sin(x * 1.4 + ph))]); D.push([x, top(x) + d])
  }
  return {
    cap: loopsD([[...U, ...D.slice().reverse()]]),
    shadow: loopsD([[...U.map(([x]) => [x, top(x) + 0.05]), ...D.map(([x, y]) => [x, y + 0.42]).reverse()]]),
  }
}
// top edge of a rounded rectangle
const rrTop = (x0, x1, y, r) => x => {
  const dx = x < x0 + r ? x0 + r - x : x > x1 - r ? x - (x1 - r) : 0
  return y + r - Math.sqrt(Math.max(0, r * r - Math.min(dx, r) ** 2))
}
// the style's gold four-point sparkle
function sparkleD(x, y, r) {
  const q = r * 0.22, n = num
  return `M${n(x)} ${n(y - r)}Q${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)}Q${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)}` +
    `Q${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)}Q${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)}z`
}

const FRAME = 'M4 3.5H20A2 2 0 0 1 22 5.5V13.5A2 2 0 0 1 20 15.5H4A2 2 0 0 1 2 13.5V5.5A2 2 0 0 1 4 3.5Z'
const SCREEN = 'M5 5.5H19A1 1 0 0 1 20 6.5V12.5A1 1 0 0 1 19 13.5H5A1 1 0 0 1 4 12.5V6.5A1 1 0 0 1 5 5.5Z'
const NECK = 'M10.75 15H13.25L14 19.5H10Z'
const FOOT = 'M7.5 19H16.5A1 1 0 0 1 16.5 21H7.5A1 1 0 0 1 7.5 19Z'

export default function render() {
  const snow = snowCap(rrTop(2, 22, 3.5, 2), 2.3, 21.7, { up: 1.2, dn: 0.7, drips: [{ x: 6.6, w: 0.8, l: 0.4 }, { x: 15.2, w: 0.75, l: 0.35 }] })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 3.5, x2: 13, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.2, x2: 0, y2: 4.8, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
      ['linearGradient', { id: id(2), x1: 4, y1: 5.5, x2: 12.8, y2: 13.5, gradientUnits: 'userSpaceOnUse' }, [st(0.3, C.tint, 0), st(1, C.tint, 0.75)]],
    ]],
    // the stand: a tall neck behind the display and a wide foot
    ['path', { d: NECK, fill: C.c1, ...INK, class: 'wm-a' }],
    ['path', { d: FOOT, fill: C.c1, ...INK, class: 'wm-a' }],
    // the gold display frame
    ['path', { d: FRAME, fill: C.c3, ...INK, class: 'wm-k' }],
    ['path', { d: FRAME + NECK + FOOT, fill: url(0), class: 'wm-shine' }],
    // the screen: cool snow white, lit from the upper left
    ['path', { d: SCREEN, fill: C.c4, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: SCREEN, fill: url(2), class: 'wm-shine' }],
    ['path', { d: 'M6 11.25L9.25 8M6 9L7 8', stroke: C.shine, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // a slim snow cap on the frame, no holly: the screen stays the subject
    ['path', { d: snow.shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow.cap, fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: sparkleD(20.25, 18.75, 1.35), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
