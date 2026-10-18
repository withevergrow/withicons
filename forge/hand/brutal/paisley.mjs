// forge/hand/brutal/paisley.mjs — a paisley in neo-brutalism: a plump yellow teardrop whose tail sweeps up and hooks
// right over the top into a sharp curl, with a small pink paisley echo inside on a lighter line and wide clearance.
// Replaces the generated drawing, where the tail barely bent (a leaf or a drop) and the inner outline ran into the
// outer one at small sizes.
// Roles: body c1, inner echo c2, outline + hard shadow ink (var(--with-brutal-ink, #16130F)). Motion: shadow wm-shadow, body wm-k, inner
// echo wm-a (the spec breathes parts.A while the whole motif sways about 10 21.5).
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)'
const W = K.W, O = K.OFF, S = K.SHIFT
const f = n => +n.toFixed(2)
// shift every absolute coordinate of a path (M L C A Z)
const AR = { M: 2, L: 2, C: 6, A: 7, Z: 0 }
function sh(d, dx, dy) {
  let out = ''
  for (const [, cmd, args] of d.matchAll(/([A-Za-z])([^A-Za-z]*)/g)) {
    const n = (args.match(/-?\d*\.?\d+/g) || []).map(Number), k = AR[cmd]
    out += cmd
    for (let i = 0; i < n.length; i++) {
      const j = k ? i % k : 0
      let v = n[i]
      if (cmd === 'A') { if (j === 5) v += dx; if (j === 6) v += dy }
      else v += j % 2 ? dy : dx
      out += (i ? ' ' : '') + f(v)
    }
  }
  return out
}
const at = d => sh(d, S, S), sd = d => sh(d, S + O, S + O)

// skeleton space (24 grid): round belly bottom-left, tail rising up-right and curling over to a point
const BODY = 'M10 21.25 C5.75 21.25 3 18.25 3 14.5 C3 10.25 5.75 7.75 9.5 6.75 C12.25 6 14 5 15.25 3.5 ' +
  'C16.5 2 19.25 1.75 20.5 3.5 C21.25 4.5 21.25 5.75 20.75 6.75 C20 5.5 18.5 5 17.5 5.75 ' +
  'C16.5 6.5 17.25 9.25 17.25 12.75 C17.25 17.75 14.25 21.25 10 21.25 Z'
// the inner echo: a small teardrop leaning the same way
const ECHO = 'M10 17.75 C8.25 17.75 7 16.5 7 14.75 C7 12.75 8.5 11.5 10.25 11.25 C11.5 11 12.75 10.25 13.5 9.25 ' +
  'C14.25 10.75 14 12.25 13.75 13.75 C13.25 16.25 11.75 17.75 10 17.75 Z'

export default function render() {
  const LINE = { stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round' }
  return [
    // the hard shadow: the whole silhouette in solid ink, down-right
    ['path', { d: sd(BODY), fill: INK, ...LINE, class: 'wm-shadow' }],
    ['path', { d: at(BODY), fill: C1, ...LINE, class: 'wm-k' }],
    ['path', { d: at(ECHO), fill: C2, stroke: INK, 'stroke-width': 1.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
