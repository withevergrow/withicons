// forge/hand/lunar/avatar-koala.mjs — a koala on cream rice paper with a crimson outline (like the other avatars):
// two big round ears with red inner ears, a round head, two dot eyes and a big oval nose; the generated drawing was
// a cream blob with swirl ornaments.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const ell = (cx, cy, rx, ry) => `M${r2(cx - rx)} ${r2(cy)}a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(2 * rx)} 0a${r2(rx)} ${r2(ry)} 0 1 0 ${r2(-2 * rx)} 0z`

export default function render() {
  const ink = { stroke: C.c2, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }
  return [
    ['path', { d: ell(5.9, 8.9, 3.6, 3.6) + ell(18.1, 8.9, 3.6, 3.6), fill: C.tint, ...ink, class: 'wm-k' }],
    ['path', { d: ell(12, 14, 6.9, 6.9), fill: C.tint, ...ink, class: 'wm-k' }],
    ['path', { d: ell(5.7, 9, 1.5, 1.8) + ell(18.3, 9, 1.5, 1.8), fill: C.c1, class: 'wm-a' }],
    ['path', { d: ell(9.4, 12.4, 0.95, 0.95) + ell(14.6, 12.4, 0.95, 0.95), fill: C.c2, class: 'wm-a' }],
    ['path', { d: ell(12, 16, 1.75, 2.25), fill: C.c2, class: 'wm-a' }],
    ['path', { d: ell(11.4, 15.1, 0.5, 0.45), fill: C.tint, class: 'wm-shine' }],
  ]
}
