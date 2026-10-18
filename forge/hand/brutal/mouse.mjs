// forge/hand/brutal/mouse.mjs — a tall yellow mouse whose top is split into two buttons (the left one pressed pink)
// by an ink seam, with a fat ink scroll wheel on the seam: the generated drawing split a fat capsule yellow over blue
// with no button seam, so it read as a bean or a pill. House recipe: 2.2 ink outline, flat fills, hard ink shadow.
const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)'
const C2 = 'var(--with-brutal-c2, #FF6BA8)'
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

const BODY = 'M12 2.5 A6 6 0 0 1 18 8.5 V15.5 A6 6 0 0 1 6 15.5 V8.5 A6 6 0 0 1 12 2.5 Z'
const LEFT = 'M12 2.5 A6 6 0 0 0 6 8.5 V10.25 H12 Z'
const SEAMS = 'M6 10.25 H18 M12 2.5 V10.25'
const WHEEL = 'M12 4.25 A1.7 1.7 0 0 1 13.7 5.95 V7.3 A1.7 1.7 0 0 1 10.3 7.3 V5.95 A1.7 1.7 0 0 1 12 4.25 Z'

export default function render() {
  const line = { fill: 'none', stroke: INK, 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['path', { d: S(BODY), fill: INK, stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: D(BODY), fill: C1 }],
    ['path', { d: D(LEFT), fill: C2 }],
    ['path', { d: D(SEAMS), ...line, 'stroke-width': 1.9 }],
    ['path', { d: D(BODY), ...line }],
    ['path', { d: D(WHEEL), fill: INK, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }],
  ]
}
