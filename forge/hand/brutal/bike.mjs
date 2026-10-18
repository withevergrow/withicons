// forge/hand/brutal/bike.mjs — a bicycle with two big yellow wheels (fat ink tyre, ink hub) under a clean ink frame whose
// main triangle is filled pink, plus saddle and bars. Replaces the generated drawing, where the filled wheels, their hub
// cutouts and the frame's shadow fused into two black blobs under a black frame.
// Roles: wheels c1, frame triangle c2, tyres, frame and hard shadow ink (var(--with-brutal-ink, #16130F)). Motion: the spec moves the whole icon.
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

const WR = 3.85, HUB = 1, FW = 1.9
const WHEELS = [[6.25, 16.25], [17.75, 16.25]]
// rear hub -> seat cluster -> head tube, down to the bottom bracket, fork to the front hub, stem + bars, seat post + saddle
const FRAME = 'M6.25 16.25 L9.5 10 H14.75 M9.5 10 L12 16.25 L14.75 10 M12 16.25 H6.25 M14.75 10 L17.75 16.25 M14.75 10 L13.75 6.25 H16.25 M9.5 10 L9 7 M7.5 7 H10.5'
const TRI = 'M9.5 10 H14.75 L12 16.25 Z' // the main triangle, filled so it never closes up into an ink speck

export default function render() {
  const out = []
  // the hard shadow: wheels and frame in solid ink, down-right
  for (const [x, y] of WHEELS) out.push(['circle', { cx: f(x + S + O), cy: f(y + S + O), r: WR, fill: INK, stroke: INK, 'stroke-width': W, class: 'wm-shadow' }])
  out.push(['path', { d: sd(FRAME), fill: 'none', stroke: INK, 'stroke-width': FW, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  // yellow wheels with a fat ink tyre
  for (const [x, y] of WHEELS) out.push(['circle', { cx: f(x + S), cy: f(y + S), r: WR, fill: C1, stroke: INK, 'stroke-width': W, class: 'wm-k' }])
  // the frame over the wheels, then the hubs
  out.push(['path', { d: at(TRI), fill: C2, class: 'wm-k' }])
  out.push(['path', { d: at(FRAME), fill: 'none', stroke: INK, 'stroke-width': FW, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }])
  for (const [x, y] of WHEELS) out.push(['circle', { cx: f(x + S), cy: f(y + S), r: HUB, fill: INK, class: 'wm-k' }])
  return out
}
