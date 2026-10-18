// forge/hand/brutal/address-book.mjs — a yellow contacts book with three ink index tabs and a solid pink bust (round
// head over domed shoulders) on the cover. Replaces the generated drawing, where the person's cutouts became a ring with a
// pink dot over a box with a pink bar, so the cover read as a frowning face.
// House recipe: 2.2 ink outline, flat fills, hard ink shadow down-right; the bust's rim is a touch lighter (1.8) so the
// small pink fields stay open at 16px. Roles: cover c1, person c2, ink var(--with-brutal-ink, #16130F).
// Motion: book wm-k, person wm-a (the spec nods parts.A about 11 12), shadow wm-shadow.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)'
const W = K.W, O = K.OFF, S = K.SHIFT, WP = 1.8
const f = n => +n.toFixed(2)
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

// skeleton space
const BOOK = 'M5.5 2.5 H16.5 A2 2 0 0 1 18.5 4.5 V19.5 A2 2 0 0 1 16.5 21.5 H5.5 A2 2 0 0 1 3.5 19.5 V4.5 A2 2 0 0 1 5.5 2.5 Z'
const TABS = 'M18.5 7 H20.5 M18.5 12 H20.5 M18.5 17 H20.5'
const HEAD = 'M11 5.1 A2.8 2.8 0 0 1 11 10.7 A2.8 2.8 0 0 1 11 5.1 Z'
const BUST = 'M6.5 18 A4.5 4.5 0 0 1 15.5 18 Z'

export default function render() {
  const line = { stroke: INK, 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const pline = { stroke: INK, 'stroke-width': WP, 'stroke-linejoin': 'round' }
  return [
    ['path', { d: sd(TABS), fill: 'none', ...line, class: 'wm-shadow' }],
    ['path', { d: sd(BOOK), fill: INK, ...line, class: 'wm-shadow' }],
    ['path', { d: at(TABS), fill: 'none', ...line, class: 'wm-k' }],
    ['path', { d: at(BOOK), fill: C1, ...line, class: 'wm-k' }],
    ['path', { d: at(HEAD) + at(BUST), fill: C2, ...pline, class: 'wm-a' }],
  ]
}
