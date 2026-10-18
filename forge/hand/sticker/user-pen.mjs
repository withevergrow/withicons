// forge/hand/sticker/user-pen.mjs — a die-cut person-with-pen sticker: a round head top-left, one shoulder arc
// below it and a diagonal sky pen at the bottom-right, three clear parts on one paper; replaces the generated drawing,
// whose head, shoulders and pen overlapped into a single tangled blob.
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


const HEAD = 'M11.6 7.9 A3.3 3.3 0 1 1 5 7.9 A3.3 3.3 0 1 1 11.6 7.9 Z'
const SH_FILL = 'M3.2 19.6 V18.2 A4.2 4.2 0 0 1 7.4 14 H9.8 V19.6 Z'
const SH_LINE = 'M9.8 14 H7.4 A4.2 4.2 0 0 0 3.2 18.2 V19.6'
const PEN = 'M12.8 20.9 L13.8 16.8 L17.8 12.8 A2.12 2.12 0 0 1 20.9 15.9 L16.9 19.9 Z'
const BAND = 'M13.8 16.8 L16.9 19.9'
const PEACH = 'var(--with-sticker-peach, #FF9563)'
const SKY = 'var(--with-sticker-sky, #5BC6FF)'

export default function render() {
  const cut = (dx, dy) => shift(HEAD + SH_FILL + PEN, dx, dy)
  return [
    ['path', { d: cut(0.5, 0.8), fill: SHADOW, stroke: SHADOW, 'stroke-width': 4.4, opacity: 0.22, class: 'wm-shadow' }],
    ['path', { d: cut(0, 0), fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 5.04, opacity: 0.3 }],
    ['path', { d: cut(0, 0), fill: EDGE, stroke: EDGE, 'stroke-width': 4.4 }],
    ['path', { d: HEAD, fill: PEACH }],
    ['path', { d: SH_FILL, fill: PEACH }],
    ['path', { d: HEAD + SH_LINE, stroke: INK, 'stroke-width': 1.5 }],
    ['path', { d: 'M6.6 6.6 Q7 5.5 8.1 5.1', stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.92, class: 'wm-shine' }],
    // the pen: paper rim, sky body, ink outline, a band at the tip
    ['path', { d: PEN, fill: EDGE, stroke: EDGE, 'stroke-width': 3, class: 'wm-s' }],
    ['path', { d: PEN, fill: SKY, stroke: INK, 'stroke-width': 1.5, class: 'wm-s' }],
    ['path', { d: BAND, stroke: INK, 'stroke-width': 1.5, class: 'wm-s' }],
    ['path', { d: 'M18 15.2 L16.8 16.4', stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.92, class: 'wm-shine' }],
    ['path', { d: spark(16.6, 4.2, 1.8), fill: 'var(--with-sticker-lemon, #FFD43B)', class: 'wm-deco' }],
    ['path', { d: spark(21.4, 21.6, 1.2), fill: 'var(--with-sticker-grape, #A98BFF)', class: 'wm-deco' }],
  ]
}
