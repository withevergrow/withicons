// forge/hand/sticker/avatar-older-man.mjs — a die-cut older-man sticker: a bare skin crown with a glint, two grey
// side tufts and a grey moustache, on candy shoulders; replaces the generated
// drawing, whose heavy ink outlines on the thin tufts and moustache read as full dark hair and a beard.
// Slots: skin c1, grey hair and moustache c2, shirt c4 (the avatar family's roles).
const f = v => +v.toFixed(2)
const INK = 'var(--with-sticker-ink, #1D1530)'
const EDGE = 'var(--with-sticker-edge, #FFFFFF)'
const SHINE = 'var(--with-sticker-shine, #FFFFFF)'
const SHADOW = 'var(--with-sticker-shadow, #1D1530)'
const SKIN = 'var(--with-sticker-c1, #F9BB89)'
const GREY = 'var(--with-sticker-c2, #C4C9D1)'
const SHIRT = 'var(--with-sticker-c4, #2F4170)'

// drawn on the 24 grid, then set at the sticker's optical size (art shrinks to leave room for the paper border)
const S = 0.88, OX = 11.75, OY = 11.8
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

const FACE = oval(12, 10.2, 5.5, 6)
const TUFT_L = 'M8.1 6.4C5.2 6.4 3.4 8.6 3.5 11.2C3.6 13.4 5.2 14.6 7 14C6.6 11.4 6.9 8.4 8.1 6.4Z'
const TUFT_R = 'M15.9 6.4C18.8 6.4 20.6 8.6 20.5 11.2C20.4 13.4 18.8 14.6 17 14C17.4 11.4 17.1 8.4 15.9 6.4Z'
const MOUSTACHE = 'M8.6 13.8C8.9 12.3 10.7 12 12 13C13.3 12 15.1 12.3 15.4 13.8C14.5 14.9 13 14.7 12 14.2C11 14.7 9.5 14.9 8.6 13.8Z'
const SHIRT_LINE = 'M4.5 21.5C4.5 19.25 6.25 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.75 18 19.5 19.25 19.5 21.5'
const SHIRT_D = SHIRT_LINE + 'Z'
const CUT = FACE + TUFT_L + TUFT_R + SHIRT_D

export default function render() {
  const cut = (dx, dy) => T(CUT, dx, dy)
  return [
    ['path', { d: cut(0.5, 0.8), fill: SHADOW, stroke: SHADOW, 'stroke-width': 4.4, opacity: 0.22, class: 'wm-shadow' }],
    ['path', { d: cut(0, 0), fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 5.04, opacity: 0.3 }],
    ['path', { d: cut(0, 0), fill: EDGE, stroke: EDGE, 'stroke-width': 4.4 }],
    // shoulders
    ['path', { d: T(SHIRT_D), fill: SHIRT }],
    ['path', { d: T(SHIRT_LINE), stroke: INK, 'stroke-width': 1.6 }],
    // face, then the grey side tufts over its edge
    ['path', { d: T(FACE), fill: SKIN, stroke: INK, 'stroke-width': 1.6 }],
    ['path', { d: T(TUFT_L) + T(TUFT_R), fill: GREY, stroke: INK, 'stroke-width': 1 }],
    // eyes
    ['path', { d: T(oval(9.8, 10.2, 0.8, 1) + oval(14.2, 10.2, 0.8, 1)), fill: INK }],
    // moustache over a small smile
    ['path', { d: T(MOUSTACHE), fill: GREY, stroke: INK, 'stroke-width': 0.7 }],
    // gloss: eye glints, a glint on the bald crown, a dash on the shirt
    ['path', { d: `M${X(9.6)} ${Y(9.8)}h.01M${X(14)} ${Y(9.8)}h.01`, stroke: SHINE, 'stroke-width': 0.55, 'stroke-opacity': 0.95, class: 'wm-shine' }],
    ['path', { d: T('M9 6.3Q10.1 5.2 11.8 5'), stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.92, class: 'wm-shine' }],
    ['path', { d: T('M6.4 20.4Q6.6 19.5 7.6 19.2'), stroke: SHINE, 'stroke-width': 0.9, 'stroke-opacity': 0.7, class: 'wm-shine' }],
    ['path', { d: T('M20 3.2Q20.25 4.75 21.8 5Q20.25 5.25 20 6.8Q19.75 5.25 18.2 5Q19.75 4.75 20 3.2Z'), fill: 'var(--with-sticker-accent, #FF6FB5)', stroke: INK, 'stroke-width': 0.6, class: 'wm-deco' }],
  ]
}
