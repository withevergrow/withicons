// forge/hand/kawaii/avatar-man.mjs: short side-parted hair with a quiff, open dot eyes, small smile,
// sky shirt. Same construction as avatar-person / avatar-boy (fills first, outlines on top).
const SKIN = 'var(--with-kawaii-c1, #F9E2D0)'
const HAIR = 'var(--with-kawaii-c2, #655046)'
const SHIRT = 'var(--with-kawaii-c4, #95B9EE)'
const BLUSH = 'var(--with-kawaii-blush, #FF6F9C)'
const FACE = 'var(--with-kawaii-face, #34231E)'
const SHINE = 'var(--with-kawaii-shine, #FFFFFF)'

const HEAD = 'M6.5 10.5A5.5 6 0 1 0 17.5 10.5A5.5 6 0 1 0 6.5 10.5Z'
const HAIRD = 'M6.5 10.5C5.75 6.25 8 3.25 11.5 3C13.5 2.25 16 2.25 17 3.75C17.75 5.25 18 7.75 17.5 10.5C17.25 9.5 16.75 8.5 16 8C13.5 8 11 7.25 9.5 5.5C8.5 7 7.25 8.5 6.5 10.5Z'
const BODY = 'M4.5 21.5C4.5 19.25 6.25 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.75 18 19.5 19.25 19.5 21.5'
const disc = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`

export default function render() {
  return [
    ['path', { d: HEAD, fill: SKIN, 'fill-opacity': 0.94, stroke: 'none' }],
    ['path', { d: HAIRD, fill: HAIR, 'fill-opacity': 0.95, stroke: 'none' }],
    ['path', { d: BODY + 'Z', fill: SHIRT, 'fill-opacity': 0.82, stroke: 'none' }],
    ['path', { d: 'M7.03 12.7a1.03 .63 0 1 0 2.06 0a1.03 .63 0 1 0 -2.06 0ZM14.91 12.7a1.03 .63 0 1 0 2.06 0a1.03 .63 0 1 0 -2.06 0Z', fill: BLUSH, 'fill-opacity': 0.55, stroke: 'none' }],
    ['path', { d: 'M13 4.45L12 4.5L11.1 4.85', stroke: SHINE, 'stroke-width': 0.85, 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['path', { d: 'M6.5 10.5A5.5 6 0 0 0 17.5 10.5', 'stroke-width': 1.4, class: 'wm-k' }],
    ['path', { d: HAIRD + BODY, 'stroke-width': 1.4, class: 'wm-a' }],
    ['path', { d: disc(9.54, 11.7, 0.9) + disc(14.46, 11.7, 0.9), fill: FACE, stroke: 'none' }],
    ['path', { d: 'M11.1 13.3Q12 14.35 12.9 13.3', stroke: FACE, 'stroke-width': 0.6 }],
    ['path', { d: disc(9.84, 11.4, 0.31) + disc(14.76, 11.4, 0.31), fill: SHINE, stroke: 'none', class: 'wm-shine' }],
  ]
}
