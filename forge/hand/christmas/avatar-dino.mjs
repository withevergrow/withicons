// forge/hand/christmas/avatar-dino.mjs - the friendly dino bust (neck, head in profile facing right, a row of back
// spikes) in pine green with gold spikes, a cranberry cheek and a santa hat
import { C, num } from '../../styles/_christmas-core.mjs'

const N = 'avatar-dino'
const id = k => `wg-christmas-${N}-${k}`, url = k => `url(#${id(k)})`
const st = (o, c, op) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': op }]
const P = (a, b) => `${num(a)} ${num(b)}`
const sparkle = (x, y, r) => { const q = r * 0.22; return `M${P(x, y - r)}Q${P(x + q, y - q)} ${P(x + r, y)}Q${P(x + q, y + q)} ${P(x, y + r)}Q${P(x - q, y + q)} ${P(x - r, y)}Q${P(x - q, y - q)} ${P(x, y - r)}z` }
const BODY = 'M5.6 21.6C6 18.2 7.4 15.2 8.2 12.6C8.4 8.8 11.2 6 15 6C17.6 6 19.2 7 20.4 8C21.8 8.4 22.4 9.6 22 10.8C21.6 12 20.6 12.7 19.4 13C17.6 13.4 15 13.4 13.8 15.2C12.6 17 12.8 19 13 21.6Z'
const SPIKES = 'M7.3 20.6L3 19.5L6.8 16.7ZM7.1 16.6L3.6 14.2L7.6 12.6ZM8 12.2L4.9 9.4L8.6 8.8ZM9.3 8.2L7.2 5.4L11.2 6.2Z'
const HAT = 'M12.2 6C12.4 3 14.4 1.2 16.8 1.3C18.6 1.4 19.9 2.5 20.5 4C19.3 4.3 18.3 5 18 6Z'
const TRIM = 'M11.5 5.7Q11.5 5.2 12.1 5.2H18.4Q19 5.2 19 5.7V6.9Q19 7.4 18.4 7.4H12.1Q11.5 7.4 11.5 6.9Z'

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 17, y2: 22, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
    ]],
    ['path', { d: SPIKES, fill: C.c3, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: BODY, fill: C.c2, stroke: C.ink, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: BODY, fill: url(0), class: 'wm-shine' }],
    ['path', { d: 'M17.6 11.6a1.3 1 0 1 0 2.6 0a1.3 1 0 1 0-2.6 0z', fill: C.c1, 'fill-opacity': 0.55, class: 'wm-k' }],
    ['path', { d: 'M20.9 9.2h.1M20.6 11.2Q19 12.3 17 11.9', stroke: C.ink, 'stroke-width': 0.6, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }],
    ['circle', { cx: 16.2, cy: 9.3, r: 1, fill: C.ink, class: 'wm-k' }],
    ['circle', { cx: 15.9, cy: 9, r: 0.32, fill: C.shine, class: 'wm-k' }],
    ['path', { d: 'M12.2 12.6c-.3 2.4-.4 5-.4 7.6', stroke: C.c4, 'stroke-opacity': 0.5, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: HAT, fill: C.c1, stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: TRIM, fill: C.c4, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['circle', { cx: 20.7, cy: 4.3, r: 1.25, fill: C.c4, stroke: C.ink, 'stroke-width': 0.5, class: 'wm-a' }],
    ['path', { d: sparkle(3.6, 3.4, 1.3), fill: C.accent, stroke: C.ink, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
