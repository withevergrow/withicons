// forge/hand/brutal/avatar-robot.mjs — a chunky neo-brutalist robot avatar: a rounded square head in thick ink, a wide
// visor with two square eyes, a mouth slot, two side ears and a top antenna with an orange ball, all over a hard offset
// ink shadow. Replaces the generated drawing, which merged everything into one black blob with a pink slot and a top knot.
// Roles: head c1, visor c2, ears c3, antenna ball accent, eyes tint (readable on any visor), outline + shadow ink.
// Motion: the spec floats the whole icon, so the figure is wm-k and the shadow wm-shadow.
const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const HEAD = 'var(--with-brutal-c1, #FFD23F)', VISOR = 'var(--with-brutal-c2, #FF6BA8)'
const EAR = 'var(--with-brutal-c3, #4D7CFE)', BALL = 'var(--with-brutal-accent, #FF8A3D)', TINT = 'var(--with-brutal-tint, #FFF0E4)'
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
const rr = (x, y, w, h, r) => `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`

const HEADP = rr(5, 8, 14, 12.5, 3.5)
const EARL = rr(3, 11.5, 3, 5, 1), EARR = rr(18, 11.5, 3, 5, 1)
const VIS = rr(7, 10.5, 10, 5, 2)
const EYES = rr(8.6, 11.9, 2, 2, 0.4) + rr(13.4, 11.9, 2, 2, 0.4)
const MOUTH = 'M9.5 18.1 H14.5'
const STEM = 'M12 8 V5.25'
const BALLP = ell(12, 3.7, 1.5, 1.5)

export default function render() {
  return [
    ['path', { d: sd(HEADP + EARL + EARR), fill: INK, ...LINE(RIM), class: 'wm-shadow' }],
    ['path', { d: sd(STEM + BALLP), fill: INK, ...LINE(RIM), class: 'wm-shadow' }],
    ['path', { d: at(STEM), fill: 'none', ...LINE(IN + 0.5), class: 'wm-a' }],
    ['path', { d: at(BALLP), fill: BALL, ...LINE(IN), class: 'wm-a' }],
    ['path', { d: at(EARL + EARR), fill: EAR, ...LINE(IN), class: 'wm-k' }],
    ['path', { d: at(HEADP), fill: HEAD, ...LINE(RIM), class: 'wm-k' }],
    ['path', { d: at(VIS), fill: VISOR, ...LINE(IN), class: 'wm-k' }],
    ['path', { d: at(EYES), fill: TINT, ...LINE(0.8), class: 'wm-k' }],
    ['path', { d: at(MOUTH), fill: 'none', ...LINE(IN + 0.2), class: 'wm-k' }],
  ]
}
