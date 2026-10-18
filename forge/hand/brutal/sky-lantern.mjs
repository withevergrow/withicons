// forge/hand/brutal/sky-lantern.mjs — an akash kandil in neo-brutalism: a hexagonal lantern with a glowing yellow middle
// band between two big pink paper caps, split by two bold ink frame bars, hanging from a small ink ring on a short cord,
// with one central tassel (bead knot near the end) and two shorter cords hanging straight down.
// Replaces the generated drawing (rib cutouts filled into a black squid shape) and the earlier hand drawing, whose
// splayed tassels read as lander legs and whose stub hook did not say "hanging".
// Roles: glow c1, caps c2, outline, frame, cords and hard shadow ink (var(--with-brutal-ink, #16130F)). Motion: the spec sways the whole
// icon from the ring (12 2); the tassels are wm-a (parts.A sway about 12 14).
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)'
const W = K.W, S = K.SHIFT, O = K.OFF
const f = n => +n.toFixed(2)
const AR = { M: 2, L: 2, H: 1, V: 1, Z: 0 }
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
const LINE = { stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }

// skeleton space (24 grid)
const BODY = 'M12 4.5 L18.5 8.5 V14 L12 18 L5.5 14 V8.5 Z'
const TOP = 'M12 4.5 L18.5 8.5 V9.5 H5.5 V8.5 Z'
const BOT = 'M5.5 13 H18.5 V14 L12 18 L5.5 14 Z'
const BARS = 'M5.5 9.5 H18.5 M5.5 13 H18.5'
const CORD = 'M12 3.5 V4.5'
const RING = [12, 2.5, 1]
// straight-down cords: one central tassel from the apex, two shorter side cords from the lower cap
const TASSELS = 'M12 18 V21.75 M8.5 16 V19.75 M15.5 16 V19.75'
const BEAD = [12, 20, 1.1]
const TW = 1.6

export default function render() {
  return [
    // the hard shadow: the lantern in solid ink, down-right (ring, cords and tassels cast none, so they never double up)
    ['path', { d: sd(BODY), fill: INK, ...LINE, class: 'wm-shadow' }],
    // tassels hang straight down behind the lantern, with a bead knot on the central one
    ['path', { d: at(TASSELS), fill: 'none', stroke: INK, 'stroke-width': TW, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['circle', { cx: f(BEAD[0] + S), cy: f(BEAD[1] + S), r: BEAD[2], fill: INK, class: 'wm-a' }],
    // hanging ring on a short cord
    ['path', { d: at(CORD), fill: 'none', stroke: INK, 'stroke-width': TW, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['circle', { cx: f(RING[0] + S), cy: f(RING[1] + S), r: RING[2], fill: 'none', stroke: INK, 'stroke-width': 1.4, class: 'wm-k' }],
    // glowing body, paper caps, frame bars, rim
    ['path', { d: at(BODY), fill: C1, class: 'wm-k' }],
    ['path', { d: at(TOP) + at(BOT), fill: C2, class: 'wm-k' }],
    ['path', { d: at(BARS), fill: 'none', stroke: INK, 'stroke-width': 1.8, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: at(BODY), fill: 'none', ...LINE, class: 'wm-k' }],
  ]
}
