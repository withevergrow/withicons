// forge/hand/sticker/avatar-man-beard.mjs — a die-cut bearded-man sticker: a larger face, a hair cap and one full
// beard that wraps the jaw with a visible smile, on candy shoulders, no floating decorations; replaces the generated
// drawing, whose thin beard band hid the mouth and fused with the hair, and whose sparkles distracted from the face.
// Slots: skin c1, hair and beard c2, shirt c4 (the avatar family's roles).
const f = v => +v.toFixed(2)
const INK = 'var(--with-sticker-ink, #1D1530)'
const EDGE = 'var(--with-sticker-edge, #FFFFFF)'
const SHINE = 'var(--with-sticker-shine, #FFFFFF)'
const SHADOW = 'var(--with-sticker-shadow, #1D1530)'
const SKIN = 'var(--with-sticker-c1, #E89E6A)'
const HAIR = 'var(--with-sticker-c2, #43291D)'
const SHIRT = 'var(--with-sticker-c4, #4FB463)'

// drawn on the 24 grid, then set at the sticker's optical size (art shrinks to leave room for the paper border)
const S = 0.84, OX = 11.75, OY = 11.8
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

const FACE = oval(12, 10.6, 5.3, 5.8)
const HAIR_D = 'M6.9 8.6C7 5.4 9.1 3.2 12 3.2C14.9 3.2 17 5.4 17.1 8.6C16.4 7.4 15.6 6.9 14.6 6.9C13.4 7 12.6 6.5 12 6C11.4 6.5 10.6 7 9.4 6.9C8.4 6.9 7.6 7.4 6.9 8.6Z'
// one full beard: from the temples round the jaw to a soft point, its top edge a moustache over the smile
const BEARD = 'M7.2 13.2C7.6 16.1 9.6 17.9 12 17.9C14.4 17.9 16.4 16.1 16.8 13.2C16 14.1 15.2 14.3 14.4 14.1C13.6 13.9 12.7 13.5 12 13.5C11.3 13.5 10.4 13.9 9.6 14.1C8.8 14.3 8 14.1 7.2 13.2Z'
const MOUTH = 'M10.25 14.6Q12 14.15 13.75 14.6Q13.15 16.35 12 16.35Q10.85 16.35 10.25 14.6Z'
const JAW = 'M7.2 13.2C7.6 16.1 9.6 17.9 12 17.9C14.4 17.9 16.4 16.1 16.8 13.2'
const SHIRT_LINE = 'M4.5 21.5C4.5 19.25 6.25 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.75 18 19.5 19.25 19.5 21.5'
const SHIRT_D = 'M4.5 21.5C4.5 19.25 6.25 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.75 18 19.5 19.25 19.5 21.5Z'
const CUT = FACE + HAIR_D + BEARD + SHIRT_D

export default function render() {
  const cut = (dx, dy) => T(CUT, dx, dy)
  return [
    // soft offset shadow, the paper hairline, the paper
    ['path', { d: cut(0.5, 0.8), fill: SHADOW, stroke: SHADOW, 'stroke-width': 4.4, opacity: 0.22, class: 'wm-shadow' }],
    ['path', { d: cut(0, 0), fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 5.04, opacity: 0.3 }],
    ['path', { d: cut(0, 0), fill: EDGE, stroke: EDGE, 'stroke-width': 4.4 }],
    // shoulders
    ['path', { d: T(SHIRT_D), fill: SHIRT }],
    ['path', { d: T(SHIRT_LINE), stroke: INK, 'stroke-width': 1.75 }],
    // face and hair
    ['path', { d: T(FACE), fill: SKIN, stroke: INK, 'stroke-width': 1.75 }],
    ['path', { d: T(HAIR_D), fill: HAIR, stroke: INK, 'stroke-width': 1.75 }],
    // eyes
    ['path', { d: T(oval(9.75, 10.4, 0.75, 0.95) + oval(14.25, 10.4, 0.75, 0.95)), fill: INK }],
    // the beard and the smile in it
    ['path', { d: T(BEARD), fill: HAIR, stroke: INK, 'stroke-width': 1 }],
    ['path', { d: T(JAW), stroke: INK, 'stroke-width': 1.75 }],
    ['path', { d: T(MOUTH), fill: SHINE, stroke: INK, 'stroke-width': 0.8 }],
    // gloss: eye glints, and a dash on the hair
    ['path', { d: `M${X(9.5)} ${Y(10)}h.01M${X(14)} ${Y(10)}h.01`, stroke: SHINE, 'stroke-width': 0.55, 'stroke-opacity': 0.95, class: 'wm-shine' }],
    ['path', { d: T('M11.4 4.6Q9.9 4.75 8.9 5.8'), stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.92, class: 'wm-shine' }],
    // face gloss and a sparkle, like the siblings
    ['path', { d: T('M8.2 9.4Q8.4 7.9 9.6 7.5'), stroke: SHINE, 'stroke-width': 0.9, 'stroke-opacity': 0.75, class: 'wm-shine' }],
    ['path', { d: T('M20 3.2Q20.25 4.75 21.8 5Q20.25 5.25 20 6.8Q19.75 5.25 18.2 5Q19.75 4.75 20 3.2Z'), fill: 'var(--with-sticker-accent, #FFC93C)', stroke: INK, 'stroke-width': 0.6, class: 'wm-deco' }],
  ]
}
