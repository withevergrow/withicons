// forge/hand/brutal/dna.mjs — a double helix of two fat ink-rimmed tubes, one yellow and one pink, that cross over and
// under each other with bold ink rungs across the open ends. Replaces the generated drawing, where the filled lobes
// and the rung cutouts closed up into a black hourglass blob with one pink dash.
// Roles: strands c1 / c2 cores, rim, rungs and hard shadow ink (var(--with-brutal-ink, #16130F)). Motion: the spec flips the whole icon.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)'
const S = K.SHIFT, O = K.OFF
const f = n => +n.toFixed(2)
// shift every absolute coordinate of a path (M L C H V Z)
const AR = { M: 2, L: 2, C: 6, H: 1, V: 1, Z: 0 }
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
      else v += j % 2 ? dy : dx
      out += (i ? ' ' : '') + f(v)
    }
  }
  return out
}
const at = d => sh(d, S, S), sd = d => sh(d, S + O, S + O)

const TUBE = K.TUBE, CORE = K.CORE, RUNG = 2
// skeleton space (24 grid), a touch wider than the skeleton so the lobes stay open: strand A starts top-left, strand B
// top-right; they cross at y 7.75 and 16.25
const A = 'M5.75 3.5 C5.75 8 18.25 7.5 18.25 12 C18.25 16.5 5.75 16 5.75 20.5'
const B = 'M18.25 3.5 C18.25 8 5.75 7.5 5.75 12 C5.75 16.5 18.25 16 18.25 20.5'
const B_LOW = 'M5.75 12 C5.75 16.5 18.25 16 18.25 20.5' // B passes back over A at the lower crossing
// rungs where the lobes open out at the ends; the tight middle lobe stays an open lens so the crossings read
const RUNGS = 'M8.75 4.75 H15.25 M8.75 19.25 H15.25'

const tube = (d, core, cap, cls) => [
  ['path', { d: at(d), fill: 'none', stroke: INK, 'stroke-width': TUBE, 'stroke-linecap': cap, class: cls }],
  ['path', { d: at(d), fill: 'none', stroke: core, 'stroke-width': CORE, 'stroke-linecap': 'round', class: cls }],
]

export default function render() {
  return [
    // the hard shadow: both strands in solid ink, down-right (the short rungs cast none, so the lobes stay open)
    ['path', { d: sd(A) + sd(B), fill: 'none', stroke: INK, 'stroke-width': TUBE, 'stroke-linecap': 'round', class: 'wm-shadow' }],
    // rungs first so the strands cap them
    ['path', { d: at(RUNGS), fill: 'none', stroke: INK, 'stroke-width': RUNG, 'stroke-linecap': 'round', class: 'wm-k' }],
    // B under A at the top crossing, then over it at the bottom one
    ...tube(B, C2, 'round', 'wm-k'),
    ...tube(A, C1, 'round', 'wm-k'),
    ...tube(B_LOW, C2, 'butt', 'wm-k'),
  ]
}
