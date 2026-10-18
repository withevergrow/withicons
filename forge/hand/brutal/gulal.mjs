// forge/hand/brutal/gulal.mjs — a bowl of gulal in neo-brutalism: a fat pink heap of powder sitting on a wide ink rim
// that overhangs a yellow bowl, with a single puff of powder lifting off. Replaces the generated drawing, where the
// heap ran into the bowl and three loose dots clumped into black specks at 16px.
// Roles: bowl c1, powder c2, outline + hard shadow ink (var(--with-brutal-ink, #16130F)). Motion: shadow wm-shadow, bowl wm-k, heap wm-a
// (the spec pulses parts.A about 12 15), puff wm-s (the spec lifts parts.S).
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)'
const W = K.W, O = K.OFF, S = K.SHIFT
const f = n => +n.toFixed(2)
// shift every absolute coordinate of a path (M L C H V A Z)
const AR = { M: 2, L: 2, C: 6, A: 7, H: 1, V: 1, Z: 0 }
function sh(d, dx, dy) {
  let out = ''
  for (const [, cmd, args] of d.matchAll(/([A-Za-z])([^A-Za-z]*)/g)) {
    const n = (args.match(/-?\d*\.?\d+/g) || []).map(Number), k = AR[cmd]
    out += cmd
    for (let i = 0; i < n.length; i++) {
      const j = k ? i % k : 0
      let v = n[i]
      if (cmd === 'H') v += dx
      else if (cmd === 'V') v += dy
      else if (cmd === 'A') { if (j === 5) v += dx; if (j === 6) v += dy }
      else v += j % 2 ? dy : dx
      out += (i ? ' ' : '') + f(v)
    }
  }
  return out
}
const at = d => sh(d, S, S), sd = d => sh(d, S + O, S + O)
const LINE = { stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }

// skeleton space (24 grid)
const HEAP = 'M4.75 12.75 C6.75 11.75 8 9.25 9.5 7.5 C10.5 6.25 11.25 5.75 12 5.75 C12.75 5.75 13.5 6.25 14.5 7.5 C16 9.25 17.25 11.75 19.25 12.75 Z'
const BOWL = 'M3.25 12.75 H20.75 C20.75 17.5 16.75 20.75 12 20.75 C7.25 20.75 3.25 17.5 3.25 12.75 Z'
const RIM = 'M2.25 12.75 H21.75'
const PUFF = 'M19.75 5.25 A1.5 1.5 0 1 1 16.75 5.25 A1.5 1.5 0 1 1 19.75 5.25 Z'

export default function render() {
  return [
    // the hard shadow: the whole silhouette in solid ink, down-right
    ['path', { d: [HEAP, BOWL, PUFF].map(sd).join(''), fill: INK, ...LINE, class: 'wm-shadow' }],
    ['path', { d: sd(RIM), fill: 'none', ...LINE, class: 'wm-shadow' }],
    // the heap of powder, then the bowl and its overhanging rim over its foot
    ['path', { d: at(HEAP), fill: C2, ...LINE, class: 'wm-a' }],
    ['path', { d: at(BOWL), fill: C1, ...LINE, class: 'wm-k' }],
    ['path', { d: at(RIM), fill: 'none', ...LINE, class: 'wm-k' }],
    // one puff of colour lifting off
    ['path', { d: at(PUFF), fill: C2, stroke: INK, 'stroke-width': 1.5, class: 'wm-s' }],
  ]
}
