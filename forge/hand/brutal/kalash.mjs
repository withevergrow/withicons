// forge/hand/brutal/kalash.mjs — a neo-brutalist kalash: a round yellow globe pot with a pink belly band, a short neck and a
// flared pink rim, a blunt orange coconut dome with a little fibre tuft sitting in the mouth, and four fat green mango
// leaves fanning out between rim and coconut. Replaces the generated drawing (bell/teapot) and the earlier hand drawing,
// whose teardrop coconut read as a diya flame and whose neckless pot read as a bowl.
// Roles: pot c1, rim + band c2, leaves c3 (green fallback), coconut accent, outline + hard shadow ink.
// Motion: shadow wm-shadow, pot wm-k, leaves + coconut wm-a (the spec sways parts.A about 12 10.5).
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)'
const LEAF = 'var(--with-brutal-c3, #3DDC97)', ACC = 'var(--with-brutal-accent, #FF8A3D)'
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

// skeleton space (24 grid)
const BODY = 'M10 14 C6.75 14.25 5.5 16 5.5 17.75 C5.5 20.25 8.25 21.5 12 21.5 C15.75 21.5 18.5 20.25 18.5 17.75 C18.5 16 17.25 14.25 14 14 Z'
const NECK = 'M9 10.5 H15 V14.5 H9 Z'
const BAND = 'M5.75 17.75 C9.75 19 14.25 19 18.25 17.75'
// flared rim: a 10 x 2.75 rounded rect (tall enough that its pink shows inside the ink outline)
const RIM = 'M8.5 8 H15.5 A1.38 1.38 0 0 1 15.5 10.75 H8.5 A1.38 1.38 0 0 1 8.5 8 Z'
// blunt coconut dome, wider at the base: 6 wide, about 5 tall above the rim
const COCO = 'M9 9 C8.75 5.75 10.25 3.5 12 3.5 C13.75 3.5 15.25 5.75 15 9 Z'
const TUFT = 'M12 3.5 V1.75 M10.75 3.75 L9.75 2.25 M13.25 3.75 L14.25 2.25'
// four fat mango leaves (lens shapes), two each side, tips fanning out and up
const LEAVES = [
  'M10.5 10 C9.5 6 5 4.5 1.75 6.75 C2.75 10.75 7.25 12.25 10.5 10 Z',
  'M11 9 C12 5 9 1.5 5 1.75 C4 5.75 7 9.25 11 9 Z',
  'M13.5 10 C16.75 12.25 21.25 10.75 22.25 6.75 C19 4.5 14.5 6 13.5 10 Z',
  'M13 9 C17 9.25 20 5.75 19 1.75 C15 1.5 12 5 13 9 Z',
]

export default function render() {
  return [
    // the hard shadow: pot, neck, rim and coconut only, so the leafy top stays light
    ['path', { d: [BODY, NECK, RIM, COCO].map(sd).join(''), fill: INK, ...LINE, class: 'wm-shadow' }],
    // mango leaves behind the coconut and rim
    ['path', { d: LEAVES.map(at).join(''), fill: LEAF, ...LINE, class: 'wm-a' }],
    // coconut dome + fibre tuft
    ['path', { d: at(TUFT), fill: 'none', stroke: INK, 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: at(COCO), fill: ACC, ...LINE, class: 'wm-a' }],
    // neck, globe body with pink band, then the flared rim in front
    ['path', { d: at(NECK), fill: C1, ...LINE, class: 'wm-k' }],
    ['path', { d: at(BODY), fill: C1, class: 'wm-k' }],
    ['path', { d: at(BAND), fill: 'none', stroke: C2, 'stroke-width': 2.25, class: 'wm-k' }],
    ['path', { d: at(BODY), fill: 'none', ...LINE, class: 'wm-k' }],
    ['path', { d: at(RIM), fill: C2, ...LINE, class: 'wm-k' }],
  ]
}
