// forge/hand/glass/croissant.mjs — the glass croissant. Generated Glass drew a smooth flat dome with four faint
// ticks, which read as a shell or a hat. Here the croissant is a true crescent of five rolled segments: a plump
// centre, two mid rolls and two tapered horns curling down, the outer edge scalloped where the rolls meet. The frosted
// pane carries the golden body colour; every other roll gets a lighter frost layer so the segments alternate in tone
// at 16px, deep etch grooves with a fine light lip separate them, and a bright arc runs along the top roll.
// Pane is the body (wm-k), rolls and grooves are wm-a (the skeleton's A plate), highlight is wm-shine.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { setOf } from '../../kernel/bool.mjs'

const NAME = 'croissant'
const r2 = v => +v.toFixed(2)
const F = v => r2(12 + (v - 12) * G.SCALE - 0.5)

// crescent centreline: an arc about (12, 18.6), from the lower left horn over the top to the lower right horn
const CX = 12, CY = 16.4, R = 7.0, RY = 0.78
const A0 = Math.PI * 1.3, A1 = -Math.PI * 0.3
const B = [0, 0.17, 0.37, 0.63, 0.83, 1]            // segment boundaries along the crescent
const seg = t => { for (let i = 0; i < 5; i++) if (t <= B[i + 1] + 1e-9) return i; return 4 }
const wob = t => { const i = seg(t), u = (t - B[i]) / (B[i + 1] - B[i]); return 0.66 + 0.34 * Math.pow(Math.sin(Math.PI * u), 0.7) }
const env = t => 0.15 + 9.4 * Math.pow(Math.sin(Math.PI * t), 1.2)
// point at parameter t, offset s along the outward normal (positive = outer edge)
const at = (t, s) => { const a = A0 + (A1 - A0) * t; return [CX + (R + s) * Math.cos(a), CY - (R * RY + s * 0.9) * Math.sin(a)] }
const outerOff = t => 0.6 * env(t) * wob(t) - 0.05
const innerOff = t => -0.4 * env(t) * (0.6 + 0.4 * wob(t))

function ring(t0, t1, k) {
  const o = [], inn = []
  for (let i = 0; i <= k; i++) { const t = t0 + (t1 - t0) * i / k; o.push(at(t, outerOff(t))) }
  for (let i = k; i >= 0; i--) { const t = t0 + (t1 - t0) * i / k; inn.push(at(t, innerOff(t))) }
  return [...o, ...inn].map(p => [r2(p[0]), r2(p[1])])
}
const dOf = (pts, map = v => v) => 'M' + pts.map(p => `${map(p[0])} ${map(p[1])}`).join('L') + 'Z'

export default function render() {
  const whole = ring(0, 1, 90)
  const set = setOf([whole])
  const icon = { name: NAME, paths: [], lines: [], cutouts: [], fills: [{ d: dOf(whole), subs: [{ pts: whole, closed: true }], set }], fillSet: set }
  const L = softLayers(icon)
  if (!L) return null
  L.frost = 0.85; L.edge = 0.3
  const { defs, out } = softPaint(L, NAME)
  const marks = []
  const [bx0, by0, bx1, by1] = L.box
  const gid = `wg-glass-${NAME}-${defs.length}`
  defs.push(['linearGradient', { id: gid, x1: r2(bx0), y1: r2(by0), x2: r2(bx1), y2: r2(by1), gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: 0, 'stop-color': V.c1, 'stop-opacity': 0.4 }], ['stop', { offset: 1, 'stop-color': V.shadow, 'stop-opacity': 0.6 }]]])
  // the golden body colour, in each roll
  for (let i = 0; i < 5; i++) {
    const t0 = B[i], t1 = B[i + 1], k = Math.max(10, Math.round(30 * (t1 - t0) / 0.3))
    marks.push(['path', { d: dOf(ring(t0, t1, k), F), fill: `url(#${gid})`, class: 'wm-a' }])
  }
  // alternate rolls (horns and the centre) get a lighter frost layer, inset from the edge by a hair
  for (const i of [0, 2, 4]) {
    const t0 = B[i], t1 = B[i + 1], k = Math.max(10, Math.round(30 * (t1 - t0) / 0.3))
    const r = ring(t0, t1, k)
    marks.push(['path', { d: dOf(r, F), fill: V.frost, 'fill-opacity': 0.55, class: 'wm-a' }])
  }
  for (const i of [1, 3]) {
    const t0 = B[i], t1 = B[i + 1], k = Math.max(10, Math.round(30 * (t1 - t0) / 0.3))
    marks.push(['path', { d: dOf(ring(t0, t1, k), F), fill: V.shadow, 'fill-opacity': 0.22, class: 'wm-a' }])
  }
  // grooves where the rolls meet: from the scalloped notch in toward the inner edge
  const groove = (off, dt = 0) => [1, 2, 3, 4].map(i => {
    const t = B[i] + dt, a = at(t, outerOff(t) - 0.5 + off), b = at(t, innerOff(t) + 0.6 + off)
    return `M${F(a[0])} ${F(a[1])}L${F(b[0])} ${F(b[1])}`
  }).join('')
  marks.push(['path', { d: groove(0), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.8, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-a' }])
  marks.push(['path', { d: groove(-0.05, -0.012), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.35, 'stroke-linecap': 'round', class: 'wm-a' }])
  // a bright arc along the top roll
  const hl = []
  for (let i = 0; i <= 16; i++) { const t = 0.3 + 0.4 * i / 16, p = at(t, outerOff(t) - 1.1); hl.push(`${F(p[0])} ${F(p[1])}`) }
  marks.push(['path', { d: 'M' + hl.join('L'), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks)
  return [['defs', {}, defs], ...out]
}
