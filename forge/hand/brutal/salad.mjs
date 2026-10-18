// forge/hand/brutal/salad.mjs — a footed salad bowl: a yellow bowl on a pink foot heaped with an orange carrot with
// ink-stroke greens on the left, a cream half egg with an orange yolk in the middle and a green ruffled lettuce leaf on
// the right, each a separate shape with its own outline. The generated drawing turned the whole heap into one black mass.
// House recipe: 2.2 ink outline, flat fills, hard ink shadow down-right. Roles: bowl c1, foot c2, leaf c4, carrot accent,
// egg shine, ink. Motion: heap wm-a (the spec pulses parts.A), bowl + foot wm-k, shadows wm-shadow.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)', C4 = 'var(--with-brutal-c4, #3DDC97)'
const ACC = 'var(--with-brutal-accent, #FF8A3D)', SHINE = 'var(--with-brutal-shine, #FFFDF5)'
const PAPER = SHINE
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
const TH = 1.6 // the heap's thinner outline, so its colours stay readable
const LINE = { stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }
const circ = (cx, cy, r) => `M${f(cx + r)} ${cy} A${r} ${r} 0 1 1 ${f(cx - r)} ${cy} A${r} ${r} 0 1 1 ${f(cx + r)} ${cy} Z`

const BOWL = 'M3 13 H21 C21 16.75 18 19.25 14.5 19.25 H9.5 C6 19.25 3 16.75 3 13 Z'
const FOOT = 'M9.5 18.5 V21 H14.5 V18.5 Z'
const CARROT = 'M3.25 7 C4.5 5.5 7.75 5.5 8.75 7 L6 13.5 Z'
const GREENS = 'M4.9 6 L3.9 3 M6.2 5.5 V2.5 M7.6 6 L8.6 3'
const EGG = 'M9.9 13.5 C9.6 8.5 10.8 4.75 12.6 4.75 C14.4 4.75 15.6 8.5 15.3 13.5 Z'
const LEAF = 'M15.5 13.5 C14.5 9.5 16.25 5.5 19 4.5 C21.25 7 21.75 10.5 20.75 13.5 Z'
const VEIN = 'M18.4 13 L19 7.5'

function draw() {
  return [
    ['path', { d: [BOWL, FOOT].map(sd).join(''), fill: INK, ...LINE, class: 'wm-shadow' }],
    ['path', { d: [CARROT, EGG, LEAF].map(sd).join(''), fill: INK, ...LINE, 'stroke-width': TH, class: 'wm-shadow' }],
    ['path', { d: at(FOOT), fill: C2, ...LINE, class: 'wm-k' }],
    ['path', { d: at(LEAF), fill: C4, ...LINE, 'stroke-width': TH, class: 'wm-a' }],
    ['path', { d: at(VEIN), fill: 'none', ...LINE, 'stroke-width': 1.3, class: 'wm-a' }],
    ['path', { d: at(GREENS), fill: 'none', ...LINE, 'stroke-width': 1.6, class: 'wm-a' }],
    ['path', { d: at(CARROT), fill: ACC, ...LINE, 'stroke-width': TH, class: 'wm-a' }],
    ['path', { d: at(EGG), fill: SHINE, ...LINE, 'stroke-width': TH, class: 'wm-a' }],
    ['path', { d: at(circ(12.6, 10.25, 1.4)), fill: ACC, class: 'wm-a' }],
    ['path', { d: at(BOWL), fill: C1, ...LINE, class: 'wm-k' }],
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
