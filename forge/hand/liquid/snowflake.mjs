// forge/hand/liquid/snowflake.mjs — one bold six-armed snowflake blown as a single piece of glass: 2.5u arms with a
// V of 1.9u branches on each, round tips and a small hexagonal window at the heart, in a denser ice tint. The
// generator laid twelve c2 chevrons over three clear 2.6u axes, so tubes, moats and rims crossed in a knot and the
// pale tint all but vanished on white. Here every part is one clear K silhouette (no overlaps), the branches are
// thinner than the arms so the V notches stay open, and the clear glass carries a stronger c1 tint so the flake holds
// at 16px. Same model and paint as the generator (_liquid-core.mjs build); only the geometry is drawn here.
// Motion: the whole flake spins (wm-k).
import { circle } from '../../kernel/geom.mjs'
import { setOf, unionSets, roundStrokeSet, normalize } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const fill = set => ({ d: '', subs: set.map(r => ({ pts: r, closed: true })), set })
const C = [12, 12], ARM = 9.7, AT = 6.15, BR = 2.85, ANG = Math.PI / 3

function skeleton(name) {
  const parts = []
  for (let k = 0; k < 6; k++) {
    const a = -Math.PI / 2 + k * Math.PI / 3
    const u = [Math.cos(a), Math.sin(a)], v = [-u[1], u[0]]
    const at = s => [C[0] + u[0] * s, C[1] + u[1] * s]
    parts.push(roundStrokeSet([C, at(ARM)], 2.5))
    const P = at(AT)
    for (const sg of [1, -1]) {
      const tip = [P[0] + BR * (Math.cos(ANG) * u[0] + sg * Math.sin(ANG) * v[0]), P[1] + BR * (Math.cos(ANG) * u[1] + sg * Math.sin(ANG) * v[1])]
      parts.push(roundStrokeSet([P, tip], 1.9))
    }
  }
  parts.push(normalize(circle(...C, 2.6, 0.2)))
  const flake = unionSets(parts)
  // the hexagonal window at the heart (a cutout through the glass), corners on the arms' bisectors
  const hex = []
  for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; hex.push([C[0] + 1.15 * Math.cos(a), C[1] + 1.15 * Math.sin(a)]) }
  return {
    name, paths: [], lines: [],
    fills: [fill(flake)],
    cutouts: [{ d: '', subs: [{ pts: hex, closed: true }] }],
  }
}

export default function render(icon) {
  const out = build(skeleton((icon && icon.name) || 'snowflake'))
  // denser ice: the clear glass's c1 tint (generator 0.14 / 0.36 / 0.62) raised so the flake holds on white
  const defs = out && out[0] && out[0][0] === 'defs' ? out[0][2] : []
  const g0 = defs.find(g => /-0$/.test(g[1].id))
  if (g0) g0[2] = g0[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.28, 0.5, 0.76][i] }])
  return out
}
