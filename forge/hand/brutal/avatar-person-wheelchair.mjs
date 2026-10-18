// forge/hand/brutal/avatar-person-wheelchair.mjs — a seated person in a manual wheelchair, built from separate fat ink
// tubes with coloured cores (head, torso + thigh + shin, big wheel, footrest, pink caster) so every part reads on its own
// with a thin ink rim and a small hard offset shadow. Replaces the generated drawing, where the heavy outline and shadow
// fused wheel, torso and head into one black blob.
// Roles: skin c1, hair c2, clothing c4, wheel core tint, caster accent, outline + shadow ink.
// Motion: the spec breathes the whole icon, so the figure is wm-k and the shadow wm-shadow.
const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const SKIN = 'var(--with-brutal-c1, #F7D7BE)', HAIR = 'var(--with-brutal-c2, #714B35)'
const CLOTH = 'var(--with-brutal-c4, #4D7CFE)', TINT = 'var(--with-brutal-tint, #FFF0E4)', CAST = 'var(--with-brutal-accent, #FF6BA8)'
const S = -0.6, O = 1.25, IN = 1.4
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
const CORE = (c, w) => ({ stroke: c, 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', fill: 'none' })

const HEADP = ell(11, 4, 2.4, 2.4)
const HAIRP = 'M8.7 4.1 C8.8 2.4 9.8 1.6 11.1 1.6 C12.5 1.6 13.4 2.5 13.3 4.1 C12.2 3.3 10.3 3.3 8.7 4.1 Z'
const BODY = 'M11 7.6 V12.5 H14.5 L18.6 16.6'
const WHEEL = ell(9, 16.6, 4.6, 4.6)
const FOOT = 'M13.3 19.6 H16.8'
const CASTER = ell(19.4, 19.6, 1.6, 1.6)

export default function render() {
  return [
    ['path', { d: sd(WHEEL), ...LINE(3.2), fill: 'none', class: 'wm-shadow' }],
    ['path', { d: sd(BODY), ...LINE(3.6), fill: 'none', class: 'wm-shadow' }],
    ['path', { d: sd(HEADP), fill: INK, ...LINE(IN), class: 'wm-shadow' }],
    ['path', { d: at(WHEEL), ...LINE(3.2), fill: 'none', class: 'wm-k' }],
    ['path', { d: at(WHEEL), ...CORE(TINT, 1.2), class: 'wm-k' }],
    ['path', { d: at(FOOT), ...LINE(2.2), fill: 'none', class: 'wm-k' }],
    ['path', { d: at(CASTER), fill: CAST, ...LINE(IN), class: 'wm-k' }],
    ['path', { d: at(BODY), ...LINE(3.6), fill: 'none', class: 'wm-k' }],
    ['path', { d: at(BODY), ...CORE(CLOTH, 2), class: 'wm-k' }],
    ['path', { d: at(HEADP), fill: SKIN, ...LINE(IN), class: 'wm-k' }],
    ['path', { d: at(HAIRP), fill: HAIR, class: 'wm-k' }],
  ]
}
