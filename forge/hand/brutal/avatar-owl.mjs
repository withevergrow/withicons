// forge/hand/brutal/avatar-owl.mjs — an owl face: a yellow head with two ear tufts, two big cream eye discs ringed in
// ink with round ink pupils, and a small orange beak between them. The generated drawing filled the eyes with ink so the
// face read as a black mask.
// House recipe: 2.2 ink outline, flat fills, hard ink shadow down-right. Roles: head c1, eyes shine, beak accent, ink.
// Motion: eyes wm-a (the spec blinks the face), head wm-k, shadow wm-shadow.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', ACC = 'var(--with-brutal-accent, #FF8A3D)', SHINE = 'var(--with-brutal-shine, #FFFDF5)'
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
const LINE = { stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }
const circ = (cx, cy, r) => `M${f(cx + r)} ${cy} A${r} ${r} 0 1 1 ${f(cx - r)} ${cy} A${r} ${r} 0 1 1 ${f(cx + r)} ${cy} Z`

const HEAD = 'M5.25 7.75 L4.75 3.75 L8.5 5.5 C9.5 5.25 10.75 5 12 5 C13.25 5 14.5 5.25 15.5 5.5 L19.25 3.75 L18.75 7.75 C19.75 9.25 20.25 11 20.25 12.75 C20.25 17.5 16.75 21 12 21 C7.25 21 3.75 17.5 3.75 12.75 C3.75 11 4.25 9.25 5.25 7.75 Z'
const EYE_L = [8.5, 11.5], EYE_R = [15.5, 11.5]
const BEAK = 'M10.75 14.75 H13.25 L12 17.5 Z'

function draw() {
  return [
    ['path', { d: sd(HEAD), fill: INK, ...LINE, class: 'wm-shadow' }],
    ['path', { d: at(HEAD), fill: C1, ...LINE, class: 'wm-k' }],
    ...[EYE_L, EYE_R].map(([x, y]) => ['path', { d: at(circ(x, y, 2.45)), fill: SHINE, ...LINE, 'stroke-width': 1.6, class: 'wm-a' }]),
    ...[EYE_L, EYE_R].map(([x, y]) => ['path', { d: at(circ(x + 0.2, y + 0.1, 0.95)), fill: INK, class: 'wm-a' }]),
    ['path', { d: at(BEAK), fill: ACC, ...LINE, 'stroke-width': 1.3, class: 'wm-k' }],
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
