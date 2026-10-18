// forge/hand/brutal/crystal-ball.mjs — a crystal ball on a clearly visible pink pedestal: a big yellow orb with a cream
// glint arc and a crisp ink 4-point star in the middle. The generated drawing broke the star into an irregular blob and
// buried the stand in the shadow.
// House recipe: 2.2 ink outline, flat fills, hard ink shadow down-right. Roles: orb c1, stand c2, glint shine, ink.
// Motion: star wm-s (the spec glows parts.S), orb + stand wm-k, glint wm-shine, shadow wm-shadow.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)', SHINE = 'var(--with-brutal-shine, #FFFDF5)'
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

const ORB = 'M19.25 9.75 A7.25 7.25 0 1 1 4.75 9.75 A7.25 7.25 0 1 1 19.25 9.75 Z'
const STAND = 'M8.5 15 H15.5 L18.5 21.5 H5.5 Z'
// crisp 4-point star, concave sides, centred on the orb
const STAR = 'M12 5.5 L13.2 8.55 L16.25 9.75 L13.2 10.95 L12 14 L10.8 10.95 L7.75 9.75 L10.8 8.55 Z'
const GLINT = 'M7.5 9 A4.75 4.75 0 0 1 9.75 5.75'

function draw() {
  return [
    ['path', { d: sd(STAND), fill: INK, ...LINE, class: 'wm-shadow' }],
    ['path', { d: sd(ORB), fill: INK, ...LINE, class: 'wm-shadow' }],
    ['path', { d: at(STAND), fill: C2, ...LINE, class: 'wm-k' }],
    ['path', { d: at(ORB), fill: C1, ...LINE, class: 'wm-k' }],
    ['path', { d: at(GLINT), fill: 'none', stroke: SHINE, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: at(STAR), fill: INK, stroke: INK, 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-s' }],
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
