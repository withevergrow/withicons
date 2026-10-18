// forge/hand/brutal/dholak.mjs — a dholak lying on its side: a yellow barrel with a pink drum skin on the left and a
// blue bulging end on the right, laced with a zigzag of X ropes across the body. The generated drawing turned the
// lacing into chevrons and diamonds that lost the laced barrel.
// House recipe: 2.2 ink outline, flat fills, hard ink shadow down-right. Roles: body c1, skin c2, end cap c3, ink.
// Motion: skin wm-a (the spec beats parts.A), barrel + lacing wm-k, shadow wm-shadow.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)', C3 = 'var(--with-brutal-c3, #4D7CFE)'
const PAPER = 'var(--with-brutal-shine, #FFFDF5)'
const W = K.W, S = K.SHIFT, O = K.OFF
const f = n => +n.toFixed(2)
const AR = { M: 2, L: 2, C: 6, H: 1, V: 1, A: 7, Z: 0 }
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
      else if (cmd === 'A') { if (j === 5) v += dx; else if (j === 6) v += dy }
      else v += j % 2 ? dy : dx
      out += (i ? ' ' : '') + f(v)
    }
  }
  return out
}
const at = d => sh(d, S, S), sd = d => sh(d, S + O, S + O)
const LINE = { stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }

// barrel: flat top and bottom, belly bulging to the right, closed on the left by the skin ellipse
const BODY = 'M5 5.5 H18.5 C21.75 8.5 21.75 15.5 18.5 18.5 H5 Z'
const CAP = 'M17 5.5 H18.5 C21.75 8.5 21.75 15.5 18.5 18.5 H17 C18.5 15.5 18.5 8.5 17 5.5 Z'
const SKIN = 'M7.25 12 A2.25 6.5 0 1 1 2.75 12 A2.25 6.5 0 1 1 7.25 12 Z'
const LACE = 'M9 5.5 L12.75 18.5 L16.5 5.5 M9 18.5 L12.75 5.5 L16.5 18.5'

function draw() {
  return [
    ['path', { d: sd(BODY), fill: INK, ...LINE, class: 'wm-shadow' }],
    ['path', { d: sd(SKIN), fill: INK, ...LINE, class: 'wm-shadow' }],
    ['path', { d: at(BODY), fill: C1, ...LINE, class: 'wm-k' }],
    ['path', { d: at(CAP), fill: C3, class: 'wm-k' }],
    ['path', { d: at(LACE), fill: 'none', ...LINE, 'stroke-width': 1.45, class: 'wm-k' }],
    ['path', { d: at(BODY), fill: 'none', ...LINE, class: 'wm-k' }],
    ['path', { d: at(SKIN), fill: C2, ...LINE, class: 'wm-a' }],
  ]
}

// paper-coloured halo under the whole drawing, so the ink outline and shadow stay readable on dark backgrounds
export default function render() {
  const nodes = draw()
  const halo = nodes
    .filter(([, a]) => (a.class === 'wm-shadow' || a.fill !== 'none') && a.d && a.stroke === INK)
    .map(([t, a]) => [t, { d: a.d, fill: PAPER, stroke: PAPER, 'stroke-width': f((a['stroke-width'] || W) + 1.8), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  return [...halo, ...nodes]
}
