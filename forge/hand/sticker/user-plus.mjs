// forge/hand/sticker/user-plus.mjs — a die-cut person-plus sticker: a plain round head over rounded shoulders in
// grape, the sky plus badge at the upper right and two sparkles; replaces the generated drawing, whose face-like
// glints, scattered hearts and stars made it cluttered at small size.
const f = v => +v.toFixed(2)
const INK = 'var(--with-sticker-ink, #1D1530)'
const EDGE = 'var(--with-sticker-edge, #FFFFFF)'
const SHINE = 'var(--with-sticker-shine, #FFFFFF)'
const SHADOW = 'var(--with-sticker-shadow, #1D1530)'

// translate an absolute path (M L H V C Q A Z)
function shift(d, dx, dy) {
  return d.replace(/([MLHVCQAZ])([^MLHVCQAZ]*)/g, (_, c, a) => {
    const n = a.trim() ? a.trim().split(/[\s,]+/).map(Number) : []
    const o = []
    if (c === 'H') n.forEach(v => o.push(f(v + dx)))
    else if (c === 'V') n.forEach(v => o.push(f(v + dy)))
    else if (c === 'A') for (let i = 0; i < n.length; i += 7) o.push(n[i], n[i + 1], n[i + 2], n[i + 3], n[i + 4], f(n[i + 5] + dx), f(n[i + 6] + dy))
    else for (let i = 0; i < n.length; i += 2) o.push(f(n[i] + dx), f(n[i + 1] + dy))
    return c + o.join(' ')
  })
}
const spark = (cx, cy, r) => `M${f(cx)} ${f(cy - r)}Q${f(cx + r * 0.2)} ${f(cy - r * 0.2)} ${f(cx + r)} ${f(cy)}Q${f(cx + r * 0.2)} ${f(cy + r * 0.2)} ${f(cx)} ${f(cy + r)}Q${f(cx - r * 0.2)} ${f(cy + r * 0.2)} ${f(cx - r)} ${f(cy)}Q${f(cx - r * 0.2)} ${f(cy - r * 0.2)} ${f(cx)} ${f(cy - r)}Z`


const HEAD = 'M13.3 8.1 A3.5 3.5 0 1 1 6.3 8.1 A3.5 3.5 0 1 1 13.3 8.1 Z'
const SH_FILL = 'M4 19.6 V18.2 A4.2 4.2 0 0 1 8.2 14 H11.4 A4.2 4.2 0 0 1 15.6 18.2 V19.6 Z'
const SH_LINE = 'M4 19.6 V18.2 A4.2 4.2 0 0 1 8.2 14 H11.4 A4.2 4.2 0 0 1 15.6 18.2 V19.6'
const PLUS = 'M18.6 6.4 V10.8 M16.4 8.6 H20.8'
const BODY = 'var(--with-sticker-grape, #A98BFF)'

export default function render() {
  const cut = (dx, dy) => shift(HEAD + SH_FILL, dx, dy)
  const plus = (dx, dy) => shift(PLUS, dx, dy)
  return [
    ['path', { d: cut(0.5, 0.8), fill: SHADOW, stroke: SHADOW, 'stroke-width': 4.4, opacity: 0.22, class: 'wm-shadow' }],
    ['path', { d: plus(0.5, 0.8), stroke: SHADOW, 'stroke-width': 5.6, opacity: 0.22, class: 'wm-shadow' }],
    ['path', { d: cut(0, 0), fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 5.04, opacity: 0.3 }],
    ['path', { d: cut(0, 0), fill: EDGE, stroke: EDGE, 'stroke-width': 4.4 }],
    ['path', { d: HEAD, fill: BODY }],
    ['path', { d: SH_FILL, fill: BODY }],
    ['path', { d: HEAD + SH_LINE, stroke: INK, 'stroke-width': 1.5 }],
    ['path', { d: 'M8.6 6.9 Q9 5.8 10.1 5.4', stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.92, class: 'wm-shine' }],
    ['path', { d: 'M6.3 17.4 Q6.5 16.4 7.5 16', stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.92, class: 'wm-shine' }],
    // the plus badge: paper rim, ink tube, sky core
    ['path', { d: PLUS, stroke: EDGE, 'stroke-width': 5.6, 'stroke-opacity': 1, class: 'wm-s' }],
    ['path', { d: PLUS, stroke: INK, 'stroke-width': 3.6, class: 'wm-s' }],
    ['path', { d: PLUS, stroke: 'var(--with-sticker-sky, #5BC6FF)', 'stroke-width': 2.1, class: 'wm-s' }],
    ['path', { d: spark(20.8, 20.6, 1.6), fill: 'var(--with-sticker-bubblegum, #FF6FB5)', class: 'wm-deco' }],
    ['path', { d: spark(2.2, 4.8, 1.1), fill: 'var(--with-sticker-lemon, #FFD43B)', class: 'wm-deco' }],
  ]
}
