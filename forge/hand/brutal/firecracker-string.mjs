// forge/hand/brutal/firecracker-string.mjs — three pink firecracker tubes with yellow caps hanging on short fuses from
// a sagging ink string, the middle one lower, and three ink sparks bursting below it. Replaces the generated drawing,
// where the string, fuses and tube walls fused into one dark lattice with thin yellow slots, so it read as a knot or a
// glyph rather than firecrackers. House recipe: 2.2 ink outline, flat fills, hard ink shadow down-right; the string,
// fuses and sparks are line-work and cast no shadow so they stay crisp at 16px.
// Roles: tube c2, cap c1, ink var(--with-brutal-ink, #16130F). Motion: the spec sways the whole string from 12 2; sparks wm-s (flicker).
import { K } from '../../styles/_brutal-core.mjs'

const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)'
const W = K.W, O = K.OFF, WL = 1.8, WB = 1.2 // tube rims at 1.8 (as address-book's bust) so the small fields stay open
const f = n => +n.toFixed(2)

const TUBES = [[2.25, 6.5], [12.75, 7.5]] // two bold crackers, a clear gap between them
const TW = 7, TH = 9, TR = 1.4, CAP = 3.4
function rrect(x0, y0, x1, y1, r, d) {
  x0 += d; y0 += d; x1 += d; y1 += d
  return `M${f(x0 + r)} ${f(y0)}H${f(x1 - r)}A${r} ${r} 0 0 1 ${f(x1)} ${f(y0 + r)}V${f(y1 - r)}A${r} ${r} 0 0 1 ${f(x1 - r)} ${f(y1)}` +
    `H${f(x0 + r)}A${r} ${r} 0 0 1 ${f(x0)} ${f(y1 - r)}V${f(y0 + r)}A${r} ${r} 0 0 1 ${f(x0 + r)} ${f(y0)}Z`
}
const tubes = d => TUBES.map(([x, y]) => rrect(x, y, x + TW, y + TH, TR, d)).join('')
// the cap: the tube's top down to the band line
const caps = () => TUBES.map(([x, y]) => `M${f(x)} ${f(y + CAP)}V${f(y + TR)}A${TR} ${TR} 0 0 1 ${f(x + TR)} ${y}` +
  `H${f(x + TW - TR)}A${TR} ${TR} 0 0 1 ${f(x + TW)} ${f(y + TR)}V${f(y + CAP)}Z`).join('')
const bands = () => TUBES.map(([x, y]) => `M${x} ${f(y + CAP)}H${f(x + TW)}`).join('')
// the string sags: y(t) = 2.25 + 5.5 t (1 - t)
const STRING = 'M1.75 2.25Q11.4 7.75 21 2.25'
const sy = x => { const t = (x - 1.75) / 19.25; return 2.25 + 5.5 * t * (1 - t) }
const FUSES = TUBES.map(([x, y]) => { const cx = x + TW / 2; return `M${f(cx)} ${f(sy(cx))}V${y}` }).join('')
const SPARKS = 'M5.75 18.75V21.75M2.75 18.25L1.5 20.5M8.75 18.25L10 20.5M16.25 19.75V22.25M13.5 19.25L12.5 21.25M19 19.25L20 21.25'

export default function render() {
  const line = { stroke: INK, 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const thin = { fill: 'none', stroke: INK, 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['path', { d: STRING + FUSES, ...thin, class: 'wm-k' }],
    ['path', { d: tubes(O), fill: INK, ...line, 'stroke-width': WL, class: 'wm-shadow' }],
    ['path', { d: tubes(0), fill: C2, class: 'wm-k' }],
    ['path', { d: caps(), fill: C1, class: 'wm-k' }],
    ['path', { d: bands(), ...thin, 'stroke-width': WB, class: 'wm-k' }],
    ['path', { d: tubes(0), fill: 'none', ...line, 'stroke-width': WL, class: 'wm-k' }],
    ['path', { d: SPARKS, fill: 'none', ...line, class: 'wm-s' }],
  ]
}
