// forge/hand/sticker/avatar-older-woman.mjs — a die-cut older woman: a visible face, silver hair swept back into a top bun, round clear glasses with eyes and glints, a gentle smile and a cardigan inside the white paper border; replaces the generated drawing, a near-black face where the heavy outline swallowed the features.
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
const HAIR = 'var(--with-sticker-c2, #C9C9CD)'
const SHIRT = 'var(--with-sticker-c4, #A78BE8)'
const BUN = oval(12, 3.5, 1.9, 1.7)
const HAIR_D = 'M6.9 10.2C6.5 6.3 8.8 4.2 12 4.2C15.2 4.2 17.5 6.3 17.1 10.2C16.8 8.6 15.4 7.7 13.8 7.7C13 7.7 12.4 7.5 12 7.2C11.6 7.5 11 7.7 10.2 7.7C8.6 7.7 7.2 8.6 6.9 10.2Z'
const CUT_D = FACE + BUN + HAIR_D + SHIRT_D
const GL = oval(9.6, 11.2, 1.85, 1.85)
const GR = oval(14.4, 11.2, 1.85, 1.85)

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
    // the bun sits behind the cap, the face in front of it
    ['path', { d: T(BUN), fill: HAIR, stroke: INK, 'stroke-width': W }],
    ['path', { d: T(FACE), fill: SKIN, stroke: INK, 'stroke-width': W }],
    ['path', { d: T(oval(7.9, 13.9, 1.1, 0.7) + oval(16.1, 13.9, 1.1, 0.7)), fill: BLUSH, 'fill-opacity': 0.4 }],
    ['path', { d: T(HAIR_D), fill: HAIR, stroke: INK, 'stroke-width': W }],
    // round clear glasses with the eyes behind them
    ['path', { d: T(GL + GR), fill: EDGE, 'fill-opacity': 0.7 }],
    ['path', { d: T(oval(9.6, 11.35, 0.58, 0.72) + oval(14.4, 11.35, 0.58, 0.72)), fill: INK }],
    ['path', { d: T(GL + GR), stroke: INK, 'stroke-width': W }],
    ['path', { d: T('M11.4 10.8Q12 10.4 12.6 10.8'), stroke: INK, 'stroke-width': W }],
    ['path', { d: T('M10.6 14.7C11.4 15.3 12.6 15.3 13.4 14.7'), stroke: INK, 'stroke-width': W }],
    ['path', { d: `M${X(9.4)} ${Y(11.1)}h.01M${X(14.2)} ${Y(11.1)}h.01`, stroke: SHINE, 'stroke-width': 0.5, 'stroke-opacity': 0.95, class: 'wm-shine' }],
    ['path', { d: T('M8.4 10.2Q8.7 9.6 9.3 9.4'), stroke: SHINE, 'stroke-width': 0.8, 'stroke-opacity': 0.9, class: 'wm-shine' }],
    ['path', { d: T('M10.2 5.3Q9 5.6 8.3 6.7'), stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.8, class: 'wm-shine' }],
    ['path', { d: 'M18.11 0.58Q18.48 2.06 19.96 2.43Q18.48 2.8 18.11 4.28Q17.74 2.8 16.26 2.43Q17.74 2.06 18.11 0.58Z', fill: 'var(--with-sticker-accent, #FF6FB5)', class: 'wm-deco' }],
    ['path', { d: 'M1.79 21.05Q2.06 22 3.01 22.27Q2.06 22.54 1.79 23.49Q1.52 22.54 0.57 22.27Q1.52 22 1.79 21.05Z', fill: 'var(--with-sticker-accent, #FF6FB5)', class: 'wm-deco' }],
  ]
}
