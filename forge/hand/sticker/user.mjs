// forge/hand/sticker/user.mjs — a die-cut person sticker: one round head over rounded shoulders in a single candy
// colour, two glints and two sparkles; replaces the generated drawing, whose shine dot-and-arc read as an eye ringed
// inside the head (a goggle) and hid the plain head-and-shoulders silhouette.
const f = v => +v.toFixed(2)
const INK = 'var(--with-sticker-ink, #1D1530)'
const EDGE = 'var(--with-sticker-edge, #FFFFFF)'
const SHINE = 'var(--with-sticker-shine, #FFFFFF)'
const SHADOW = 'var(--with-sticker-shadow, #1D1530)'
const BODY = 'var(--with-sticker-bubblegum, #FF6FB5)'

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

const HEAD = 'M15.7 8.1 A3.7 3.7 0 1 1 8.3 8.1 A3.7 3.7 0 1 1 15.7 8.1 Z'
const SH_FILL = 'M5 19.6 V18.2 A4.2 4.2 0 0 1 9.2 14 H14.8 A4.2 4.2 0 0 1 19 18.2 V19.6 Z'
const SH_LINE = 'M5 19.6 V18.2 A4.2 4.2 0 0 1 9.2 14 H14.8 A4.2 4.2 0 0 1 19 18.2 V19.6'

export default function render() {
  const cut = (dx, dy) => shift(HEAD + SH_FILL, dx, dy)
  return [
    ['path', { d: cut(0.5, 0.8), fill: SHADOW, stroke: SHADOW, 'stroke-width': 4.4, opacity: 0.22, class: 'wm-shadow' }],
    ['path', { d: cut(0, 0), fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 5.04, opacity: 0.3 }],
    ['path', { d: cut(0, 0), fill: EDGE, stroke: EDGE, 'stroke-width': 4.4 }],
    ['path', { d: HEAD, fill: BODY }],
    ['path', { d: SH_FILL, fill: BODY }],
    ['path', { d: HEAD + SH_LINE, stroke: INK, 'stroke-width': 1.5 }],
    ['path', { d: 'M9.5 6.9 Q9.9 5.8 11 5.4', stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.92, class: 'wm-shine' }],
    ['path', { d: 'M7.2 17.4 Q7.4 16.4 8.4 16', stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.92, class: 'wm-shine' }],
    ['path', { d: spark(19.6, 3.4, 1.8), fill: 'var(--with-sticker-sky, #5BC6FF)', class: 'wm-deco' }],
    ['path', { d: spark(1.9, 22, 1), fill: 'var(--with-sticker-sky, #5BC6FF)', class: 'wm-deco' }],
  ]
}
