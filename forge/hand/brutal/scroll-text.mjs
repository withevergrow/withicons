// forge/hand/brutal/scroll-text.mjs — a yellow parchment sheet between two coloured roller capsules, each held by
// the 2.2 ink outline, with two ink text lines on the sheet (the generated drawing turned the thin rollers into solid
// ink bars that merged with the shadow, so the scroll was one dark mass). Text lines are wm-a (they float).
const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)'
const C3 = 'var(--with-brutal-c3, #4D7CFE)'
const W = 2.2, SHIFT = -0.6, OFF = 1.25
const r2 = n => Math.round(n * 100) / 100
// bake a translation into an absolute path (M L H V A Z)
function mv(d, dx, dy) {
  const ar = { M: 2, L: 2, H: 1, V: 1, A: 7, Z: 0 }
  let cmd = '', i = 0
  return d.replace(/[MLHVAZ]|-?\d*\.?\d+/g, t => {
    if (/[A-Z]/.test(t)) { cmd = t; i = 0; return t }
    const n = +t, k = i++ % ar[cmd]
    if (cmd === 'H') return r2(n + dx)
    if (cmd === 'V') return r2(n + dy)
    if (cmd === 'A') return k === 5 ? r2(n + dx) : k === 6 ? r2(n + dy) : t
    return r2(n + (k === 0 ? dx : dy))
  })
}
const D = d => mv(d, SHIFT, SHIFT)
const S = d => mv(d, SHIFT + OFF, SHIFT + OFF)

const SHEET = 'M6 4.5 H18 V19.5 H6 Z'
const ROLLS = 'M5.25 2.5 H18.75 A2 2 0 0 1 18.75 6.5 H5.25 A2 2 0 0 1 5.25 2.5 Z M5.25 17.5 H18.75 A2 2 0 0 1 18.75 21.5 H5.25 A2 2 0 0 1 5.25 17.5 Z'
const TEXT = 'M9.25 10 H14.75 M9.25 14 H12.75'

export default function render() {
  const line = { fill: 'none', stroke: INK, 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['path', { d: S(SHEET + ' ' + ROLLS), fill: INK, stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: D(SHEET), ...line, fill: C1 }],
    ['path', { d: D(ROLLS), ...line, fill: C3 }],
    ['path', { d: D(TEXT), ...line, class: 'wm-a' }],
  ]
}
