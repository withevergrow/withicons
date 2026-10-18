// forge/hand/brutal/avatar-older-man.mjs — a friendly older man: a bald round head with a shine on the crown, a grey tuft
// at each side, dot eyes with catch-lights, a bushy ink moustache and a blue jumper with a small collar notch, all in the
// 1.9 / 1.15 ink of the other brutal avatars with one hard offset shadow. Replaces the generated drawing, which crowned
// him with full black hair and a beard. Roles: skin c1, tufts c2, jumper c3, moustache + outline + shadow ink, eye
// catch-light tint, crown shine. Motion: the spec breathes the whole figure, so it is wm-k and the shadow wm-shadow.
const INK = 'var(--with-brutal-ink, #16130F)'
const SKIN = 'var(--with-brutal-c1, #EEBF98)', GREY = 'var(--with-brutal-c2, #C4C9D1)', SHIRT = 'var(--with-brutal-c3, #4D7CFE)'
const TINT = 'var(--with-brutal-tint, #FBE4D2)', SHINE = 'var(--with-brutal-shine, #FFFDF5)'
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

const BODY = 'M4.5 21.5 C4.5 19.25 6.25 17.5 8.5 17.5 C9.75 17.5 10.75 18.25 12 18.25 C13.25 18.25 14.25 17.5 15.5 17.5 C17.75 17.5 19.5 19.25 19.5 21.5 Z'
const HEAD = ell(12, 10, 5.5, 6)
const TUFTS = ell(5.9, 10.2, 2.1, 2.8) + ell(18.1, 10.2, 2.1, 2.8)
const MUSTACHE = 'M9.3 14.1 C10 13.2 11.4 13 12 13.7 C12.6 13 14 13.2 14.7 14.1 C13.7 14.9 12.7 14.7 12 14.5 C11.3 14.7 10.3 14.9 9.3 14.1 Z'
const SHINE_LINE = 'M9.25 6.5 C9.75 5.75 10.5 5.4 11.25 5.3'
const COLLAR = 'M10.5 18.25 L12 20 L13.5 18.25'

// a thin light halo under the whole drawing (the shine role) so the dark ink keeps its edge on dark backgrounds
const SHINE_HALO = 'var(--with-brutal-shine, #FFFDF5)'
const halo = nodes => nodes
  .filter(([, a]) => a.class === 'wm-shadow' || (a.stroke === INK && a['stroke-width'] >= 1.7))
  .map(([t, a]) => [t, { ...a, fill: a.fill === 'none' ? 'none' : SHINE_HALO, stroke: SHINE_HALO, 'stroke-width': +((a['stroke-width'] || 0) + 1.8).toFixed(2), class: 'wm-shadow' }])

export default function render() {
  const nodes = [
    ['path', { d: sd(BODY), fill: INK, ...LINE(RIM), class: 'wm-shadow' }],
    ['path', { d: sd(HEAD), fill: INK, ...LINE(RIM), class: 'wm-shadow' }],
    ['path', { d: at(BODY), fill: SHIRT, ...LINE(RIM), class: 'wm-k' }],
    ['path', { d: at(COLLAR), fill: 'none', ...LINE(IN), class: 'wm-k' }],
    ['path', { d: at(TUFTS), fill: GREY, ...LINE(IN), class: 'wm-k' }],
    ['path', { d: at(HEAD), fill: SKIN, ...LINE(RIM), class: 'wm-k' }],
    ['path', { d: at(SHINE_LINE), fill: 'none', stroke: SHINE, 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: at(ell(9.6, 10.3, 0.85, 1.05) + ell(14.4, 10.3, 0.85, 1.05)), fill: INK, class: 'wm-k' }],
    ['path', { d: at(ell(9.85, 9.9, 0.3, 0.3) + ell(14.65, 9.9, 0.3, 0.3)), fill: TINT, class: 'wm-k' }],
    ['path', { d: at(MUSTACHE), fill: INK, ...LINE(0.6), class: 'wm-k' }],
  ]
  return [...halo(nodes), ...nodes]
}
