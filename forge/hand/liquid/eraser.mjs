// forge/hand/liquid/eraser.mjs: the line eraser's tilted rounded block in glass, split across its length into a clear blue
// sleeve and a solid pink glass tip (wm-a), resting on a pink glass rule. The block is the full line-icon size (17 x 9u on
// the 45-degree diagonal) so it reads as one confident tool at 16px; the glass tints are denser than the generator's so the
// pink/blue split holds on white. Same model and paint as the generator (_liquid-core.mjs build); only the geometry is drawn.
import { build } from '../../styles/_liquid-core.mjs'

const r3 = v => Math.round(v * 1000) / 1000
function skeleton(name, parts) {
  return {
    name, paths: [], cutouts: [],
    lines: parts.map((p, i) => ({ pts: p.pts, closed: true, plate: p.plate || 'K', pathId: 'p' + i })),
    fills: parts.map(p => ({ subs: [{ pts: p.pts, closed: true }], set: [p.pts] })),
  }
}

// the block lies on the 45 degree diagonal: u runs from the tip (bottom-left) to the back (top-right), v across it
const S = Math.SQRT1_2, C = [12, 11.2], L = 17, W = 9
const pt = (u, v) => [r3(C[0] + (u + v) * S), r3(C[1] + (v - u) * S)]
// a u/v box shrunk by the plate's outline stroke (K 1.3, A 1.15), so the drawn piece fills the box exactly
const box = (u0, u1, v0, v1, e) => [pt(u0 + e, v0 + e), pt(u1 - e, v0 + e), pt(u1 - e, v1 - e), pt(u0 + e, v1 - e)]

export default function render(icon) {
  const name = (icon && icon.name) || 'eraser'
  const tip = pt(-L / 2, W / 2) // the block's lowest corner: the rule starts under it
  const y = r3(tip[1])
  const out = build(skeleton(name, [
    // sleeve: 11.4u of clear glass
    { pts: box(-L / 2 + 5.6, L / 2, -W / 2, W / 2, 1.3) },
    // rubber tip: 5u of coloured glass, a 0.6u seam from the sleeve
    { pts: box(-L / 2, -L / 2 + 5, -W / 2, W / 2, 1.15), plate: 'A' },
    // the rule it clears
    { pts: [[r3(tip[0] + 3.4), y - 0.01], [20.6, y - 0.01], [20.6, y + 0.01], [r3(tip[0] + 3.4), y + 0.01]], plate: 'A' },
  ]))
  if (!out) return null
  const defs = out[0] && out[0][0] === 'defs' ? out[0][2] : []
  const edit = (suffix, f) => { const g = defs.find(d => d[1].id.endsWith('-' + suffix)); if (g) g[2] = g[2].map(f) }
  // denser clear glass; the coloured glass is pink (c4)
  edit(0, (s, i) => ['stop', { ...s[1], 'stop-opacity': [0.22, 0.42, 0.68][i] }])
  edit(1, (s, i) => ['stop', { offset: s[1].offset, 'stop-color': 'var(--with-liquid-c4, #FF7EC1)', 'stop-opacity': i === 0 ? 0.62 : 0.95 }])
  return out
}
