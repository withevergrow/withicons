// forge/hand/brutal/cloud-sun.mjs — a yellow cloud with its hard shadow in front of an orange sun disc, with five clean
// round-capped ink rays fanned round the sun's visible side. Replaces the generated drawing, where every short ray got
// its own ink shadow and swelled into a blob, so the sun read as a paw print or a flower.
// Roles: cloud c1 (as on cloud), sun accent, outline, rays and hard shadow ink. Rays cast no shadow (as on sun-moon) so
// they stay crisp at 16px. Motion: sun + rays wm-a (the spec pulses parts.A about 10 10), cloud wm-k.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', AC = 'var(--with-brutal-accent, #FF8A3D)'
const W = K.W, O = K.OFF
const f = n => +n.toFixed(2)

const SX = 9.6, SY = 9.6, SR = 3          // sun
const R_IN = 6.2, R_OUT = 7.5             // rays
const ANG = [-90, -45, -135, 180, 135]

function sun(d) {
  const x = SX + d, y = SY + d
  return `M${f(x - SR)} ${f(y)}A${SR} ${SR} 0 1 1 ${f(x + SR)} ${f(y)}A${SR} ${SR} 0 1 1 ${f(x - SR)} ${f(y)}Z`
}
function rays() {
  return ANG.map(a => {
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180)
    return `M${f(SX + c * R_IN)} ${f(SY + s * R_IN)}L${f(SX + c * R_OUT)} ${f(SY + s * R_OUT)}`
  }).join('')
}
// the skeleton's cloud, moved up-left by 0.6 so drawing + shadow sit centred
function cloud(d) {
  const t = v => f(v - 0.6 + d)
  return `M${t(11.06)} ${t(20.5)}A3.24 3.24 0 0 1 ${t(10.48)} ${t(14.09)}A4.46 4.46 0 0 1 ${t(19.05)} ${t(14.45)}` +
    `A3.06 3.06 0 0 1 ${t(18.44)} ${t(20.5)}Z`
}

export default function render() {
  const line = { stroke: INK, 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['path', { d: sun(O), fill: INK, ...line, class: 'wm-shadow' }],
    ['path', { d: sun(0), fill: AC, ...line, class: 'wm-a' }],
    ['path', { d: rays(), fill: 'none', ...line, class: 'wm-a' }],
    ['path', { d: cloud(O), fill: INK, ...line, class: 'wm-shadow' }],
    ['path', { d: cloud(0), fill: C1, ...line, class: 'wm-k' }],
  ]
}
