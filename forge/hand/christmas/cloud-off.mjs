// forge/hand/christmas/cloud-off.mjs — the cream snow cloud of cloud-download (cool frost tint underneath, 0.6 ink
// outline) cut by a clean crimson slash with a thin cream gap each side; no sparkle or holly so it stays crisp at 16px.
import { C, num } from '../../styles/_christmas-core.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { setOf, differenceSets } from '../../kernel/bool.mjs'

const N = 'cloud-off'
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const P = (a, b) => `${num(a)} ${num(b)}`
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }
// the style's holly sprig: two wavy pointed leaves, three berries, one glint
function holly(x, y, s) {
  const leaf = dir => {
    const a = dir > 0 ? -0.32 : Math.PI + 0.32, ca = Math.cos(a), sa = Math.sin(a), L = 2.05 * s, W = 0.62 * s
    const p0 = [x + ca * 0.25 * s, y + sa * 0.25 * s], tip = [x + ca * L, y + sa * L]
    const pt = (t, side) => { const w = W * Math.sin(Math.PI * t) * (1 + 0.28 * Math.cos(t * Math.PI * 4)); return [p0[0] + (tip[0] - p0[0]) * t - sa * w * side, p0[1] + (tip[1] - p0[1]) * t + ca * w * side] }
    const pts = []
    for (let k = 0; k <= 8; k++) pts.push(pt(k / 8, 1))
    for (let k = 7; k >= 1; k--) pts.push(pt(k / 8, -1))
    return 'M' + pts.map(p => P(p[0], p[1])).join('L') + 'Z'
  }
  const b = 0.46 * s
  return [
    ['path', { d: leaf(1) + leaf(-1), fill: C.c2, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: discD(x - 0.42 * s, y + 0.18 * s, b) + discD(x + 0.42 * s, y + 0.18 * s, b) + discD(x, y - 0.42 * s, b), fill: C.c1, stroke: C.ink, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['path', { d: discD(x - 0.12 * s, y - 0.58 * s, 0.13 * s), fill: C.shine, class: 'wm-deco' }],
  ]
}
// a capsule (round-capped bar) between two points
function capsule(x1, y1, x2, y2, h) {
  const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L * h, ny = (x2 - x1) / L * h
  return `M${P(x1 + nx, y1 + ny)}L${P(x2 + nx, y2 + ny)}A${num(h)} ${num(h)} 0 0 0 ${P(x2 - nx, y2 - ny)}L${P(x1 - nx, y1 - ny)}A${num(h)} ${num(h)} 0 0 0 ${P(x1 + nx, y1 + ny)}Z`
}

const CLOUD = 'M7 19A4.5 4.5 0 0 1 5.9 10.15A6.2 6.2 0 0 1 18.1 10.6A4.25 4.25 0 0 1 17.75 19Z'
const SLASH = [3, 3, 21, 21], HW = 1.15, GAP = 1.35

export default function render() {
  const cloud = setOf(parsePath(CLOUD, 0.12).map(s => s.pts))
  const band = setOf(parsePath(capsule(...SLASH, HW + GAP), 0.12).map(s => s.pts))
  const D = setD(differenceSets(cloud, band), 0.02)
  const S = capsule(...SLASH, HW)
  return [
    ['defs', {}, [
      // frost pooling in the underside of the cloud
      ['linearGradient', { id: id(0), x1: 0, y1: 6, x2: 0, y2: 19, gradientUnits: 'userSpaceOnUse' }, [st(0.3, C.tint, 0), st(1, C.tint, 0.85)]],
      // the style's warm light from the upper left, shade pooling low
      ['linearGradient', { id: id(1), x1: 3, y1: 3, x2: 13, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: D, fill: C.c4, ...INK, class: 'wm-k' }],
    ['path', { d: D, fill: url(0), class: 'wm-shine' }],
    // a highlight on the crown
    ['path', { d: 'M7.3 9.6A5.4 5.4 0 0 1 12.6 5.75', stroke: C.shine, 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-shine' }],
    // the slash
    ['path', { d: S, fill: C.c1, ...INK, class: 'wm-s' }],
    ['path', { d: S, fill: url(1), class: 'wm-s' }],
  ]
}
