// forge/hand/christmas/heart-crack.mjs — a cranberry heart broken along a bold zig-zag into two clearly offset halves, the gap
// showing a deep shade so the crack reads at 16px, with a snow tuft on the left lobe. Replaces the generated drawing, a pale
// cream heart whose thin crack vanished on the page. Roles: halves c1, crack shadow, snow shine->tint. Motion: right half wm-a.
import { C } from '../../styles/_christmas-core.mjs'

const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const r2 = v => Math.round(v * 100) / 100
const spark = (x, y, r) => { const q = r * 0.22; return `M${x} ${y - r}Q${x + q} ${y - q} ${x + r} ${y}Q${x + q} ${y + q} ${x} ${y + r}Q${x - q} ${y + q} ${x - r} ${y}Q${x - q} ${y - q} ${x} ${y - r}Z` }
// absolute path from commands whose numbers are shifted by (dx, dy)
const sh = (dx, dy, cmds) => cmds.map(([c, ...v]) => c + v.map((n, i) => r2(n + (i % 2 ? dy : dx))).join(' ')).join('')
const ZIG = [[10.1, 10.2], [13.7, 12.9], [10.9, 16.6]]   // crack points from the top notch (12,6.5) to the tip (12,20.5)

const left = (dx, dy) => sh(dx, dy, [['M', 12, 6.5], ['C', 11.1, 5, 9.6, 4, 7.8, 4], ['C', 5.1, 4, 3, 6.2, 3, 8.9], ['C', 3, 15.2, 12, 20.5, 12, 20.5],
  ['L', ...ZIG[2]], ['L', ...ZIG[1]], ['L', ...ZIG[0]], ['L', 12, 6.5]]) + 'Z'
const right = (dx, dy) => sh(dx, dy, [['M', 12, 6.5], ['C', 12.9, 5, 14.4, 4, 16.2, 4], ['C', 18.9, 4, 21, 6.2, 21, 8.9], ['C', 21, 15.2, 12, 20.5, 12, 20.5],
  ['L', ...ZIG[2]], ['L', ...ZIG[1]], ['L', ...ZIG[0]], ['L', 12, 6.5]]) + 'Z'
const HEART = 'M12 20.5C12 20.5 3 15.2 3 8.9C3 6.2 5.1 4 7.8 4C9.6 4 11.1 5 12 6.5C12.9 5 14.4 4 16.2 4C18.9 4 21 6.2 21 8.9C21 15.2 12 20.5 12 20.5Z'

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const L = left(-1.1, -0.5), R = right(1.1, 0.6)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 4, x2: 14, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2, x2: 0, y2: 5.8, gradientUnits: 'userSpaceOnUse' }, [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    // the dark gap: the whole heart in deep shade, the halves slide apart over it
    ['path', { d: HEART, fill: C.shadow, ...INK, class: 'wm-k' }],
    ['path', { d: L, fill: C.c1, ...INK, class: 'wm-k' }],
    ['path', { d: R, fill: C.c1, ...INK, class: 'wm-a' }],
    ['path', { d: L, fill: url(0), class: 'wm-shine' }],
    ['path', { d: R, fill: url(0), class: 'wm-shine' }],
    ['path', { d: 'M5.2 8.9Q5.2 7 6.8 6.4', fill: 'none', stroke: C.shine, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.8, class: 'wm-shine' }],
    // snow on the left lobe
    ['path', { d: 'M4.3 5.3Q5.8 2.6 8.2 3.1Q9.8 2.9 10.7 4.3Q10.5 5.2 9.8 5Q9.2 5.7 8.5 5.2Q7.8 5.9 7.1 5.3Q6.4 5.8 5.8 5.4Q5.3 5.9 4.3 5.3Z', fill: url(1), stroke: C.ink, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: spark(20.4, 3.4, 1.7), fill: C.accent, stroke: C.ink, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
