// forge/hand/brutal/firecracker.mjs — a neo-brutalist Diwali firecracker: a wide upright cylinder with an elliptical top
// cap and two slanted wrapper bands, a curling ink fuse rising from the cap to a fat four-point spark burst with two
// small sparks, every shape ringed in thick ink, the cracker with one hard ink shadow (the burst stays light, unshadowed). Replaces the generated drawing, whose narrow
// body and clutter of tiny spark dashes read as a vase or a can at 16px.
// Roles: body c1, cap + bands c2, spark accent, outline + fuse + shadow ink.
// Motion: body wm-k; fuse and sparks wm-a (the spec makes parts.A rise from 10.5 9.5).
const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)', ACC = 'var(--with-brutal-accent, #FF8A3D)'
const W = 2.2, IN = 1.25, S = -0.6, O = 1.25
const f = n => +n.toFixed(2)
const AR = { M: 2, L: 2, C: 6, Q: 4, H: 1, V: 1, A: 7, Z: 0 }
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
const ell = (cx, cy, rx, ry) => `M${cx - rx} ${cy} A${rx} ${ry} 0 1 1 ${cx + rx} ${cy} A${rx} ${ry} 0 1 1 ${cx - rx} ${cy} Z`
const LINE = w => ({ stroke: INK, 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })

// skeleton space (24 grid)
const BODY = 'M5.25 11 V19.75 A4.5 2 0 0 0 14.25 19.75 V11 Z'
const CAP = ell(9.75, 11, 4.5, 2)
const BANDS = 'M5.25 15 L14.25 12.5 V14.75 L5.25 17.25 Z M5.25 19.5 L14.25 17 V19.25 L5.25 21.75 Z'
const FUSE = 'M9.75 11 C9.75 8.25 11.25 7 13.5 7.25'
// four-point spark burst about (18 5.5): long points up/down/left/right, gently pinched sides
const BX = 18, BY = 5.5, R = 4.5, Q = 1.6
const BURST = `M${BX} ${BY - R}Q${BX + Q} ${BY - Q} ${BX + R} ${BY}Q${BX + Q} ${BY + Q} ${BX} ${BY + R}Q${BX - Q} ${BY + Q} ${BX - R} ${BY}Q${BX - Q} ${BY - Q} ${BX} ${BY - R}Z`
const SPARKS = ell(13.5, 2.25, 0.85, 0.85) + ell(22.25, 10.75, 0.75, 0.75)

export default function render() {
  return [
    ['path', { d: sd(BODY + CAP), fill: INK, ...LINE(W), class: 'wm-shadow' }],
    ['path', { d: at(BODY), fill: C1, class: 'wm-k' }],
    ['path', { d: at(BANDS), fill: C2, class: 'wm-k' }],
    ['path', { d: at(BODY), fill: 'none', ...LINE(W), class: 'wm-k' }],
    // the cap: a full-weight rim outside, a lighter border where it meets the body so its face stays big
    ['path', { d: at(CAP), fill: INK, ...LINE(W), class: 'wm-k' }],
    ['path', { d: at(CAP), fill: C2, ...LINE(IN), class: 'wm-k' }],
    ['path', { d: at(FUSE), fill: 'none', ...LINE(1.75), class: 'wm-a' }],
    ['path', { d: at(BURST), fill: ACC, ...LINE(W), class: 'wm-a' }],
    ['path', { d: at(SPARKS), fill: INK, class: 'wm-a' }],
  ]
}
