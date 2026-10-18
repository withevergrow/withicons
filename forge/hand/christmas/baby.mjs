// forge/hand/christmas/baby.mjs — a round skin-tone baby face with big shining eyes, rosy cheeks and a smile, tiny ears,
// a small bib, and a little cranberry Santa cap with a white fur brim and pom. Red stays on the cap and bib only.
// Roles: skin c1 (lit tint, shaded shadow), cap + bib c4, fur + pom shine->tint, eyes ink. Motion: whole figure rocks.
import { C, num } from '../../styles/_christmas-core.mjs'

const NAME = 'baby'
const id = n => `wg-christmas-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const SKIN = 'var(--with-christmas-c1, #F7D7BE)', SH = 'var(--with-christmas-shadow, #B9876A)', TINT = 'var(--with-christmas-tint, #FFF0E4)'
const CAP = 'var(--with-christmas-c4, #C8203A)'
const discD = (cx, cy, r) => `M${num(cx - r)} ${num(cy)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

const HEAD = discD(12, 12.8, 6.8)
const EARS = discD(5.3, 13.4, 1.5) + discD(18.7, 13.4, 1.5)
const BODY = 'M6.8 22C6.8 20.2 8.8 19.2 12 19.2C15.2 19.2 17.2 20.2 17.2 22Z'
const HAT = 'M5.4 10.4C5.5 6.6 8.4 4.2 12 4.1C15 4 17.6 5 19.6 7.2C19.9 7.8 19.6 8.4 19 8.4C18.4 8.8 18.2 9.6 18.6 10.4Z'
const BRIM = rr(4.9, 9.2, 19.1, 11.5, 1.15)

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 13, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, SH, 0), st(1, SH, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 8.6, x2: 0, y2: 12, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, TINT)]],
    ]],
    ['path', { d: BODY, fill: CAP, ...INK, class: 'wm-k' }],
    ['path', { d: EARS, fill: SKIN, ...INK, class: 'wm-k' }],
    ['path', { d: HEAD, fill: SKIN, ...INK, class: 'wm-k' }],
    ['path', { d: discD(8.2, 16.1, 1.15) + discD(15.8, 16.1, 1.15), fill: CAP, 'fill-opacity': 0.4, class: 'wm-k' }],
    ['path', { d: discD(9.6, 14.4, 1.05) + discD(14.4, 14.4, 1.05), fill: C.ink, class: 'wm-k' }],
    ['path', { d: discD(9.95, 14, 0.38) + discD(14.75, 14, 0.38), fill: C.shine, class: 'wm-k' }],
    ['path', { d: 'M10.6 16.9Q12 18.2 13.4 16.9', fill: 'none', stroke: C.ink, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: HAT, fill: CAP, ...INK, class: 'wm-k' }],
    ['path', { d: HEAD + EARS + BODY + HAT, fill: url(0), class: 'wm-shine' }],
    ['path', { d: BRIM, fill: url(1), ...INK, 'stroke-width': 0.5, class: 'wm-deco' }],
    ['path', { d: discD(19.7, 7.1, 1.5), fill: url(1), ...INK, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
}
