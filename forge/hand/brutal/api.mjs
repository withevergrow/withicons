// forge/hand/brutal/api.mjs — an API connector: a tall yellow rounded block in the middle, one blue node on the left and
// two pink nodes on the right, each tied to the block by a short ink stub with a clear gap of paper between block and
// node outlines. The generated drawing let the nodes and stubs fuse into the hard shadow blob.
// House recipe: 2.2 ink outline, flat fills, hard ink shadow down-right. Roles: block c1, nodes c2 / c3, ink.
// Motion: nodes + stubs wm-a (the spec pulses parts.A), block wm-k, shadows wm-shadow.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)', C3 = 'var(--with-brutal-c3, #4D7CFE)'
const PAPER = 'var(--with-brutal-shine, #FFFDF5)'
const W = K.W, S = K.SHIFT, O = K.OFF
const f = n => +n.toFixed(2)
const AR = { M: 2, L: 2, H: 1, V: 1, A: 7, Z: 0 }
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
const circ = (cx, cy, r) => `M${f(cx + r)} ${cy} A${r} ${r} 0 1 1 ${f(cx - r)} ${cy} A${r} ${r} 0 1 1 ${f(cx + r)} ${cy} Z`

const BLOCK = 'M11.9 4.5 H12.1 A2.1 2.1 0 0 1 14.2 6.6 V17.4 A2.1 2.1 0 0 1 12.1 19.5 H11.9 A2.1 2.1 0 0 1 9.8 17.4 V6.6 A2.1 2.1 0 0 1 11.9 4.5 Z'
const R = 2.2
const sn = d => sh(d, S + K.BOFF, S + K.BOFF)
const NODES = [[3.7, 12, C3], [20.2, 7, C2], [20.2, 17, C2]]
const STUBS = 'M3.7 12 H9.9 M14.1 7 H20.2 M14.1 17 H20.2'

function draw() {
  return [
    ['path', { d: sd(BLOCK), fill: INK, ...LINE, class: 'wm-shadow' }],
    ...NODES.map(([x, y]) => ['path', { d: sn(circ(x, y, R)), fill: INK, ...LINE, 'stroke-width': 1.6, class: 'wm-shadow' }]),
    ['path', { d: at(STUBS), fill: 'none', ...LINE, 'stroke-width': 1.8, class: 'wm-a' }],
    ['path', { d: at(BLOCK), fill: C1, ...LINE, class: 'wm-k' }],
    ...NODES.map(([x, y, c]) => ['path', { d: at(circ(x, y, R)), fill: c, ...LINE, 'stroke-width': 1.6, class: 'wm-a' }]),
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
