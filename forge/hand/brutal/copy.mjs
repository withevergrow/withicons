// forge/hand/brutal/copy.mjs — two whole cards, a pink one behind and a yellow one in front, overlapping by only a
// small corner so the duplicate reads at 16px: the generated drawing overlapped them by a third and let the front card's
// moat, outline and shadow swallow the back card's outline into one black mass.
// House recipe: 2.2 ink outline, flat fills, hard ink shadow down-right. Roles: front c1, back c2, ink var(--with-brutal-ink, #16130F).
// Motion: back card wm-a (the spec nudges parts.A away from the front card), front card wm-k, shadows wm-shadow.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)'
const W = K.W, O = K.OFF, S = K.SHIFT
const f = n => +n.toFixed(2)
// shift every absolute coordinate of a path (M L H V A Z)
const AR = { M: 2, L: 2, A: 7, H: 1, V: 1, Z: 0 }
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
const LINE = { stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round' }

// skeleton space: equal cards, overlap 3.5 x 3.5
const card = (x0, y0, x1, y1, r = 2.25) =>
  `M${x0 + r} ${y0} H${x1 - r} A${r} ${r} 0 0 1 ${x1} ${y0 + r} V${y1 - r} A${r} ${r} 0 0 1 ${x1 - r} ${y1} H${x0 + r} A${r} ${r} 0 0 1 ${x0} ${y1 - r} V${y0 + r} A${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`
const BACK = card(3, 3, 13.75, 13.75)
const FRONT = card(10.25, 10.25, 21, 21)

export default function render() {
  return [
    ['path', { d: sd(BACK), fill: INK, ...LINE, class: 'wm-shadow' }],
    ['path', { d: at(BACK), fill: C2, ...LINE, class: 'wm-a' }],
    ['path', { d: sd(FRONT), fill: INK, ...LINE, class: 'wm-shadow' }],
    ['path', { d: at(FRONT), fill: C1, ...LINE, class: 'wm-k' }],
  ]
}
