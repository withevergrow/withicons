// forge/hand/brutal/avatar-teen.mjs — a neo-brutalist teen in a loud hoodie: the hood is one bright flat field ringed in
// thick ink, its opening a deeper shade of the hood so the round skin face reads as a clear cut-out (not a hollow black
// balaclava), a fringe peeking under the hood, dot eyes with catch-lights, a smile, two drawstrings and a centre zip.
// Replaces the generated drawing, which classed the hood as hair and painted it near-black, so the face sat in a dark hole.
// Roles (avatar convention): skin c1, hood c2, hood inside + fringe c3, eye catch-light tint, outline + shadow ink.
// Motion: the spec breathes / tilts the whole icon, so the figure is wm-k and the shadow wm-shadow.
const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const SKIN = 'var(--with-brutal-c1, #7B4B2C)', HOOD = 'var(--with-brutal-c2, #9B6BFF)'
const DEEP = 'var(--with-brutal-c3, #5A3FA6)', TINT = 'var(--with-brutal-tint, #C9A189)'
const S = -0.6, O = 1.25, RIM = 1.9, IN = 1.15
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
const HOODY = 'M4 21.5 C4 19.75 4.5 18.5 5.75 17.75 C4.25 16 3.5 13.75 3.5 11.75 C3.5 7 7 3.25 12 2.25 C17 3.25 20.5 7 20.5 11.75 C20.5 13.75 19.75 16 18.25 17.75 C19.5 18.5 20 19.75 20 21.5 Z'
const OPEN = ell(12, 11.5, 6.5, 6.75)
const FACE = ell(12, 12, 4.75, 5)
const FRINGE = 'M7.4 10.25 C7.9 8.25 9.75 7 12 7 C14.25 7 16.1 8.25 16.6 10.25 C15.25 10 14 9.25 13.25 8.25 C12 9.75 9.75 10.5 7.4 10.25 Z'
const SMILE = 'M10.5 14.5 C11.25 15.25 12.75 15.25 13.5 14.5'
const STRINGS = 'M10 18.75 V20.25 M14 18.75 V20.25'
const ZIP = 'M12 18.75 V21.5'

export default function render() {
  return [
    ['path', { d: sd(HOODY), fill: INK, ...LINE(RIM), class: 'wm-shadow' }],
    ['path', { d: at(HOODY), fill: HOOD, ...LINE(RIM), class: 'wm-k' }],
    ['path', { d: at(OPEN), fill: DEEP, ...LINE(IN), class: 'wm-k' }],
    ['path', { d: at(FACE), fill: SKIN, ...LINE(IN), class: 'wm-k' }],
    ['path', { d: at(FRINGE), fill: DEEP, ...LINE(IN), class: 'wm-k' }],
    ['path', { d: at(ell(10, 12, 0.85, 1.05) + ell(14, 12, 0.85, 1.05)), fill: INK, class: 'wm-k' }],
    ['path', { d: at(ell(10.25, 11.6, 0.3, 0.3) + ell(14.25, 11.6, 0.3, 0.3)), fill: TINT, class: 'wm-k' }],
    ['path', { d: at(SMILE), fill: 'none', ...LINE(IN), class: 'wm-k' }],
    ['path', { d: at(ZIP + STRINGS), fill: 'none', ...LINE(IN), class: 'wm-k' }],
  ]
}
