// forge/hand/brutal/avatar-frog.mjs — a cute frog face: a wide green body with two round eye bumps on top, each holding a
// white eye with an ink pupil and catch-light, a wide ink smile, two nostril dots and rosy cheeks, in 1.9 ink with one hard
// offset shadow. Replaces the generated drawing, which merged bumps, eyes and mouth into a black head with a yellow blob.
// Roles: body + bumps c1 (green fallback), cheeks c2, eye whites shine, pupils + outline + shadow ink.
// Motion: the spec squashes and bounces the whole figure from 12 20.5, so it is wm-k and the shadow wm-shadow.
const INK = 'var(--with-brutal-ink, #16130F)'
const BODY = 'var(--with-brutal-c1, #3DDC97)', CHEEK = 'var(--with-brutal-c2, #FF6BA8)', WHITE = 'var(--with-brutal-shine, #FFFDF5)'
const S = -0.6, O = 1.25, RIM = 1.9, IN = 1.15
const f = n => +n.toFixed(2)
const ell = (cx, cy, rx, ry, d = 0) => {
  const x = cx + S + d, y = cy + S + d
  return `M${f(x - rx)} ${f(y)}A${rx} ${ry} 0 1 1 ${f(x + rx)} ${f(y)}A${rx} ${ry} 0 1 1 ${f(x - rx)} ${f(y)}Z`
}
const LINE = w => ({ stroke: INK, 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })
const sm = d => `M${f(8.2 + S + d)} ${f(15.3 + S + d)}C${f(9.6 + S + d)} ${f(18 + S + d)} ${f(14.4 + S + d)} ${f(18 + S + d)} ${f(15.8 + S + d)} ${f(15.3 + S + d)}`

// a thin light halo under the whole drawing (the shine role) so the dark ink keeps its edge on dark backgrounds
const SHINE_HALO = 'var(--with-brutal-shine, #FFFDF5)'
const halo = nodes => nodes
  .filter(([, a]) => a.class === 'wm-shadow' || (a.stroke === INK && a['stroke-width'] >= 1.7))
  .map(([t, a]) => [t, { ...a, fill: a.fill === 'none' ? 'none' : SHINE_HALO, stroke: SHINE_HALO, 'stroke-width': +((a['stroke-width'] || 0) + 1.8).toFixed(2), class: 'wm-shadow' }])

export default function render() {
  const nodes = [
    ['path', { d: ell(12, 15, 8.5, 5.4, O), fill: INK, ...LINE(RIM), class: 'wm-shadow' }],
    ['path', { d: ell(7.4, 7.6, 3.4, 3.4, O), fill: INK, ...LINE(RIM), class: 'wm-shadow' }],
    ['path', { d: ell(16.6, 7.6, 3.4, 3.4, O), fill: INK, ...LINE(RIM), class: 'wm-shadow' }],
    ['path', { d: ell(12, 15, 8.5, 5.4), fill: BODY, ...LINE(RIM), class: 'wm-k' }],
    ['path', { d: ell(7.4, 7.6, 3.4, 3.4), fill: BODY, ...LINE(RIM), class: 'wm-k' }],
    ['path', { d: ell(16.6, 7.6, 3.4, 3.4), fill: BODY, ...LINE(RIM), class: 'wm-k' }],
    ['path', { d: ell(7.4, 7.6, 1.6, 1.6) + ell(16.6, 7.6, 1.6, 1.6), fill: WHITE, ...LINE(IN), class: 'wm-k' }],
    ['path', { d: ell(7.7, 7.8, 0.75, 0.75) + ell(16.3, 7.8, 0.75, 0.75), fill: INK, class: 'wm-k' }],
    ['path', { d: ell(5.1, 15.2, 1.05, 0.8) + ell(18.9, 15.2, 1.05, 0.8), fill: CHEEK, class: 'wm-k' }],
    ['path', { d: ell(11, 12.3, 0.4, 0.4) + ell(13, 12.3, 0.4, 0.4), fill: INK, ...LINE(0.4), class: 'wm-k' }],
    ['path', { d: sm(0), fill: 'none', ...LINE(IN + 0.2), class: 'wm-k' }],
  ]
  return [...halo(nodes), ...nodes]
}
