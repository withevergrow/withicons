// forge/hand/brutal/bold.mjs — a heavy B: a yellow letter band held by the 2.2 ink outline, with both counters
// filled solid ink so they read as part of the letter, not as pink holes (the generated drawing coloured the
// counters c2 over an ink mass and left white slivers, so the B broke up). House recipe: 2.2 ink, flat c1, hard shadow.
const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)'
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

// outer letter: stem 6..(counter at 9), top bowl r4.65 about (12.25,8.15), bottom bowl r5.9 about (12.75,14.6),
// meeting at the waist (16.5,10.04); counters keep a 1.9 yellow band inside the ink everywhere
const OUTER = 'M7 3.5 H12.25 A4.65 4.65 0 0 1 16.5 10.04 A5.9 5.9 0 0 1 12.75 20.5 H7 A1 1 0 0 1 6 19.5 V4.5 A1 1 0 0 1 7 3.5 Z'
const COUNTERS = 'M9 6.5 H12.25 A1.65 1.65 0 0 1 12.25 9.8 H9 Z M9 11.7 H12.75 A2.9 2.9 0 0 1 12.75 17.5 H9 Z'

export default function render() {
  return [
    ['path', { d: S(OUTER), fill: INK, stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: D(OUTER), fill: C1 }],
    ['path', { d: D(COUNTERS), fill: INK, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }],
    ['path', { d: D(OUTER), fill: 'none', stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round' }],
  ]
}
