// forge/hand/sticker/avatar-person-glasses.mjs — a die-cut person with rectangular glasses: a light face, a short brown cap that stops at the temples, clear squared lenses with eyes and glints, bridge and smile on candy shoulders inside the white paper border; replaces the generated drawing, a near-black blob where the heavy ink outline swallowed the lenses.
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
const HAIR_D = 'M6.8 9.3C6.5 5.4 8.9 3.1 12 3.1C15.1 3.1 17.5 5.4 17.2 9.3C16.6 8 15.7 7.4 14.5 7.2C13.1 7 11.7 7.3 10.3 6.7C9.2 7.2 7.7 8 6.8 9.3Z'
const LENS_L = 'M7.9 9.7L10.2 9.7Q11.2 9.7 11.2 10.7L11.2 11.9Q11.2 12.9 10.2 12.9L7.9 12.9Q6.9 12.9 6.9 11.9L6.9 10.7Q6.9 9.7 7.9 9.7Z'
const LENS_R = 'M13.8 9.7L16.1 9.7Q17.1 9.7 17.1 10.7L17.1 11.9Q17.1 12.9 16.1 12.9L13.8 12.9Q12.8 12.9 12.8 11.9L12.8 10.7Q12.8 9.7 13.8 9.7Z'
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
    ['path', { d: T(oval(7.9, 13.8, 1.1, 0.7) + oval(16.1, 13.8, 1.1, 0.7)), fill: BLUSH, 'fill-opacity': 0.4 }],
    ['path', { d: T(HAIR_D), fill: HAIR, stroke: INK, 'stroke-width': W }],
    // clear rectangular lenses (paper-white film), eyes behind them, a bridge between
    ['path', { d: T(LENS_L + LENS_R), fill: EDGE, 'fill-opacity': 0.7 }],
    ['path', { d: T(oval(9.05, 11.3, 0.6, 0.78) + oval(14.95, 11.3, 0.6, 0.78)), fill: INK }],
    ['path', { d: T(LENS_L + LENS_R), stroke: INK, 'stroke-width': W }],
    ['path', { d: T('M11.2 10.6L12.8 10.6'), stroke: INK, 'stroke-width': W }],
    ['path', { d: T('M10.4 14.4C11.3 15 12.7 15 13.6 14.4'), stroke: INK, 'stroke-width': W }],
    ['path', { d: `M${X(8.85)} ${Y(11)}h.01M${X(14.75)} ${Y(11)}h.01`, stroke: SHINE, 'stroke-width': 0.5, 'stroke-opacity': 0.95, class: 'wm-shine' }],
    ['path', { d: T('M7.9 10.3L9.1 10.3'), stroke: SHINE, 'stroke-width': 0.8, 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['path', { d: T('M10.9 4.5Q9.7 4.7 8.8 5.6'), stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.8, class: 'wm-shine' }],
    ['path', { d: 'M18.75 0.69L19.3 1.81L20.54 1.99L19.65 2.87L19.86 4.1L18.75 3.52L17.64 4.1L17.85 2.87L16.96 1.99L18.2 1.81Z', fill: 'var(--with-sticker-accent, #FFD43B)', class: 'wm-deco' }],
    ['path', { d: 'M1.79 21.05Q2.06 22 3.01 22.27Q2.06 22.54 1.79 23.49Q1.52 22.54 0.57 22.27Q1.52 22 1.79 21.05Z', fill: 'var(--with-sticker-accent, #5BC6FF)', class: 'wm-deco' }],
  ]
}
