// forge/hand/brutal/user-circle.mjs — a yellow avatar disc in a 2.2 ink ring with its hard shadow, holding one solid
// blue bust: a round head over domed shoulders that run into the ring at the bottom. Replaces the generated drawing,
// where the empty disc, the head's fat ink ring and the shoulder sliver stacked into concentric rings that read as a
// webcam or a frowning face. Roles: disc c1, person c3 (the head colour on user), ink var(--with-brutal-ink, #16130F).
// Motion: the spec floats and nods the whole icon; disc wm-k, bust wm-a.
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C3 = 'var(--with-brutal-c3, #4D7CFE)'
const W = K.W, O = K.OFF, WP = 1.8
const f = n => +n.toFixed(2)

const CX = 11.4, CY = 11.4, R = 9.25
// skeleton space -> drawing: scale to the 9.25 ring about 12 12, then up-left 0.6
const S = R / 9.5
const tx = v => f(12 + (v - 12) * S - 0.6)
const disc = (d, r = R) => `M${f(CX - r + d)} ${f(CY + d)}A${r} ${r} 0 1 1 ${f(CX + r + d)} ${f(CY + d)}` +
  `A${r} ${r} 0 1 1 ${f(CX - r + d)} ${f(CY + d)}Z`
const HR = 3.4
const HEAD = `M${f(CX - HR)} ${tx(9.4)}A${HR} ${HR} 0 1 1 ${f(CX + HR)} ${tx(9.4)}A${HR} ${HR} 0 1 1 ${f(CX - HR)} ${tx(9.4)}Z`
const BODY = `M${tx(5.25)} ${tx(18.75)}C${tx(6.25)} ${tx(17.25)} ${tx(7.5)} ${tx(16.25)} ${tx(9.5)} ${tx(16.25)}` +
  `H${tx(14.5)}C${tx(16.5)} ${tx(16.25)} ${tx(17.75)} ${tx(17.25)} ${tx(18.75)} ${tx(18.75)}A${R} ${R} 0 0 1 ${tx(5.25)} ${tx(18.75)}Z`

export default function render() {
  const pline = { stroke: INK, 'stroke-width': WP, 'stroke-linejoin': 'round' }
  return [
    ['path', { d: disc(O), fill: INK, stroke: INK, 'stroke-width': W, class: 'wm-shadow' }],
    ['path', { d: disc(0), fill: C1, class: 'wm-k' }],
    ['path', { d: HEAD + BODY, fill: C3, ...pline, class: 'wm-a' }],
    ['path', { d: disc(0), fill: 'none', stroke: INK, 'stroke-width': W, class: 'wm-k' }],
  ]
}
