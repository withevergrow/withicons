// forge/hand/sticker/avatar-man.mjs — a die-cut man: a visible face, the common short side-parted cut that stops at the temples (not a long dark hood), eyes, smile and blush on candy shoulders inside the white paper border; replaces the generated drawing, whose heavy ink outline fused hair, face and shoulders into one dark shape.
// Slots: skin c1, hair c2, shirt c4 (the avatar family's roles). Drawn on the 24 grid, set at the sticker's optical size.
const f = v => +v.toFixed(2)
const INK = 'var(--with-sticker-ink, #1D1530)'
const EDGE = 'var(--with-sticker-edge, #FFFFFF)'
const SHINE = 'var(--with-sticker-shine, #FFFFFF)'
const SHADOW = 'var(--with-sticker-shadow, #1D1530)'
const BLUSH = 'var(--with-sticker-bubblegum, #FF6FB5)'
const S = 0.92, OX = 11.75, OY = 11.8
const X = v => f(OX + (v - 12) * S), Y = v => f(OY + (v - 12) * S)
function T(d, dx = 0, dy = 0) {
  return d.replace(/([MLCQ])([^MLCQZ]*)/g, (_, c, args) => {
    const n = args.trim().split(/[\s,]+/).map(Number)
    const out = []
    for (let i = 0; i < n.length; i += 2) out.push(f(X(n[i]) + dx) + ' ' + f(Y(n[i + 1]) + dy))
    return c + out.join(' ')
  })
}
const oval = (cx, cy, rx, ry) => `M${cx - rx} ${cy}C${cx - rx} ${cy - ry * 0.552} ${cx - rx * 0.552} ${cy - ry} ${cx} ${cy - ry}C${cx + rx * 0.552} ${cy - ry} ${cx + rx} ${cy - ry * 0.552} ${cx + rx} ${cy}C${cx + rx} ${cy + ry * 0.552} ${cx + rx * 0.552} ${cy + ry} ${cx} ${cy + ry}C${cx - rx * 0.552} ${cy + ry} ${cx - rx} ${cy + ry * 0.552} ${cx - rx} ${cy}Z`
const W = 1.05   // outline weight: lighter than the 1.5 of objects, so a small head keeps its face

const FACE = oval(12, 10.6, 5.4, 5.9)
const SHIRT_LINE = 'M4.5 21.5C4.5 19.25 6.25 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.75 18 19.5 19.25 19.5 21.5'
const SHIRT_D = SHIRT_LINE + 'Z'

const SKIN = 'var(--with-sticker-c1, #F6D2B6)'
const HAIR = 'var(--with-sticker-c2, #6A3F22)'
const SHIRT = 'var(--with-sticker-c4, #3F7FE0)'
// short side-parted cut: a cap that ends at the temples, a part on the left and the fringe swept to the right
const HAIR_D = 'M6.8 9.1C6.6 5.4 8.9 3.1 12 3.1C15.1 3.1 17.4 5.4 17.2 9.1C16.7 7.6 15.8 6.8 14.6 6.8C12.4 6.9 10.3 6.3 9.3 4.7C8.9 6.6 7.9 8 6.8 9.1Z'
const CUT_D = FACE + HAIR_D + SHIRT_D

export default function render() {
  const cut = (dx, dy) => T(CUT_D, dx, dy)
  const paper = [
    // soft offset shadow, the paper hairline, the paper
    ['path', { d: cut(0.5, 0.8), fill: SHADOW, stroke: SHADOW, 'stroke-width': 4.4, opacity: 0.22, class: 'wm-shadow' }],
    ['path', { d: cut(0, 0), fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 5.04, opacity: 0.3 }],
    ['path', { d: cut(0, 0), fill: EDGE, stroke: EDGE, 'stroke-width': 4.4 }],
  ]
  return [
    ...paper,
    ['path', { d: T(SHIRT_D), fill: SHIRT }],
    ['path', { d: T(SHIRT_LINE), stroke: INK, 'stroke-width': W }],
    ['path', { d: T('M6.6 20.6Q7 19.5 8 19.1'), stroke: SHINE, 'stroke-width': 0.9, 'stroke-opacity': 0.7, class: 'wm-shine' }],
    ['path', { d: T(FACE), fill: SKIN, stroke: INK, 'stroke-width': W }],
    ['path', { d: T(oval(7.9, 12.6, 1.1, 0.7) + oval(16.1, 12.6, 1.1, 0.7)), fill: BLUSH, 'fill-opacity': 0.4 }],
    ['path', { d: T(HAIR_D), fill: HAIR, stroke: INK, 'stroke-width': W }],
    // eyes with glints, a plain smile
    ['path', { d: T(oval(9.8, 10.9, 0.78, 0.98) + oval(14.2, 10.9, 0.78, 0.98)), fill: INK }],
    ['path', { d: T('M10.2 13.7C11.1 14.6 12.9 14.6 13.8 13.7'), stroke: INK, 'stroke-width': W }],
    ['path', { d: `M${X(9.55)} ${Y(10.55)}h.01M${X(13.95)} ${Y(10.55)}h.01`, stroke: SHINE, 'stroke-width': 0.55, 'stroke-opacity': 0.95, class: 'wm-shine' }],
    // hair and face gloss
    ['path', { d: T('M11.2 4.5Q9.9 4.7 9 5.6'), stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.8, class: 'wm-shine' }],
    ['path', { d: T('M7.9 12.2Q7.5 11.3 7.7 10.3'), stroke: SHINE, 'stroke-width': 0.9, 'stroke-opacity': 0.6, class: 'wm-shine' }],
    ['path', { d: 'M20.03 4.14C19.43 3.63 18.33 2.95 18.33 2.1C18.33 0.91 19.69 0.74 20.03 1.67C20.37 0.74 21.73 0.91 21.73 2.1C21.73 2.95 20.63 3.63 20.03 4.14Z', fill: 'var(--with-sticker-accent, #FF6FB5)', class: 'wm-deco' }],
    ['path', { d: 'M1.79 21.05Q2.06 22 3.01 22.27Q2.06 22.54 1.79 23.49Q1.52 22.54 0.57 22.27Q1.52 22 1.79 21.05Z', fill: 'var(--with-sticker-accent, #FF6FB5)', class: 'wm-deco' }],
  ]
}
