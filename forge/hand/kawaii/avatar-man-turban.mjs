// forge/hand/kawaii/avatar-man-turban.mjs: a warm saffron wrapped turban with crossing fold lines, a
// lighter wrap band and a rosy knot-jewel at the centre; open dot eyes, small smile, slate shirt.
const SKIN = 'var(--with-kawaii-c1, #BB9275)'
const WRAP = 'var(--with-kawaii-c2, #F4AC54)'
const SHIRT = 'var(--with-kawaii-c4, #8D97B0)'
const BAND = 'var(--with-kawaii-fill-3, #FFD23A)'
const JEWEL = 'var(--with-kawaii-fill-1, #FF4F6E)'
const BLUSH = 'var(--with-kawaii-blush, #FF6F9C)'
const FACE = 'var(--with-kawaii-face, #34231E)'
const SHINE = 'var(--with-kawaii-shine, #FFFFFF)'

const HEAD = 'M6.75 9.25A5.25 6.25 0 1 0 17.25 9.25A5.25 6.25 0 1 0 6.75 9.25Z'
const TURBAN = 'M6.75 9.25C5.25 8.25 4.75 6.5 5.25 5.25C6.25 3 9 2 12 2C15 2 17.75 3 18.75 5.25C19.25 6.5 18.75 8.25 17.25 9.25C15.75 8.5 13.75 8.25 12 7.25C10.25 8.25 8.25 8.5 6.75 9.25Z'
const BODY = 'M4.5 21.5C4.5 19.25 6.25 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.75 18 19.5 19.25 19.5 21.5'
// lighter wrap band that follows the lower edge of the turban
const BANDD = 'M5.3 6.9C8.5 6.6 10.8 5.2 12 4.1C13.2 5.2 15.5 6.6 18.7 6.9C18.9 7.6 18.2 8.5 17.25 9.25C15.75 8.5 13.75 8.25 12 7.25C10.25 8.25 8.25 8.5 6.75 9.25C5.8 8.5 5.1 7.6 5.3 6.9Z'
const FOLDS = 'M6.6 5.6C8.4 5.4 9.8 4.6 10.6 3.3M17.4 5.6C15.6 5.4 14.2 4.6 13.4 3.3'
const disc = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`

export default function render() {
  return [
    ['path', { d: HEAD, fill: SKIN, 'fill-opacity': 0.94, stroke: 'none' }],
    ['path', { d: TURBAN, fill: WRAP, 'fill-opacity': 0.9, stroke: 'none' }],
    ['path', { d: BANDD, fill: BAND, 'fill-opacity': 0.85, stroke: 'none' }],
    ['path', { d: BODY + 'Z', fill: SHIRT, 'fill-opacity': 0.82, stroke: 'none' }],
    ['path', { d: 'M7.03 12.2a1.03 .63 0 1 0 2.06 0a1.03 .63 0 1 0 -2.06 0ZM14.91 12.2a1.03 .63 0 1 0 2.06 0a1.03 .63 0 1 0 -2.06 0Z', fill: BLUSH, 'fill-opacity': 0.55, stroke: 'none' }],
    ['path', { d: 'M7.4 3.9L8.3 3.3L9.4 2.9', stroke: SHINE, 'stroke-width': 0.85, 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['path', { d: 'M6.75 9.25A5.25 6.25 0 1 0 17.25 9.25', 'stroke-width': 1.4, class: 'wm-k' }],
    ['path', { d: TURBAN + FOLDS + BODY, 'stroke-width': 1.4, class: 'wm-a' }],
    ['path', { d: disc(12, 4.9, 1.2), fill: JEWEL, 'stroke-width': 1.1, class: 'wm-s' }],
    ['path', { d: disc(9.54, 11.3, 0.9) + disc(14.46, 11.3, 0.9), fill: FACE, stroke: 'none' }],
    ['path', { d: 'M11.1 12.8Q12 13.85 12.9 12.8', stroke: FACE, 'stroke-width': 0.6 }],
    ['path', { d: disc(9.84, 11, 0.31) + disc(14.76, 11, 0.31), fill: SHINE, stroke: 'none', class: 'wm-shine' }],
  ]
}
