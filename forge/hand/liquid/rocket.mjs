// forge/hand/liquid/rocket.mjs — the rocket as liquid glass with a body that holds its edge: the generated clear hull
// melted into light grounds and its porthole was a tiny ring, so the hull is denser blue glass with a firmer ink hairline,
// the porthole a solid round lens of coloured c2 glass in a hairline moat, and the exhaust flame stays c2 glass parted
// from the hull by the skeleton's cut. Same model and paint as the generator (_liquid-core.mjs); only the pieces and the
// tint density change.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function synth(name, paths, fills = [], cutouts = []) {
  const ps = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  return {
    name, paths: ps,
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
    cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
  }
}
// a thick hull reads better with denser tint: lift the clear-glass tint and the hairline of the K body
function deepen(nodes, name, stops, hair) {
  for (const n of nodes) {
    if (n[0] === 'defs') for (const g of n[2]) {
      if (g[1].id === `wg-liquid-${name}-0`) g[2].forEach((s, i) => { s[1]['stop-opacity'] = stops[i] })
    } else if (n[1].stroke === 'currentColor') n[1]['stroke-opacity'] = hair
  }
  return nodes
}

export default function render(icon) {
  const name = (icon && icon.name) || 'rocket'
  const hull = 'M6.5 11.5 L2.25 11.25 Q5.75 7.25 9 8 L11 6 A11.01 11.01 0 0 1 21 3 A11.01 11.01 0 0 1 18 13 L16 15 Q16.75 18.25 12.75 21.75 L12.5 17.5 Z'
  const flame = 'M7.75 12.75 C5.25 14.25 4.4 16.9 4 20 C7.1 19.6 9.75 18.75 11.25 16.25'
  const port = 'M16.6 9 A1.6 1.6 0 1 1 13.4 9 A1.6 1.6 0 1 1 16.6 9 Z'
  const nodes = build(synth(name, [
    [hull, 'K'],
    ['M16 9 A1 1 0 1 1 14 9 A1 1 0 1 1 16 9 Z', 'A'],
    [flame, 'A'],
  ], [hull, flame + ' Z', port], ['M5.9 13.1 L10.9 18.1']))
  return deepen(nodes, name, [0.3, 0.52, 0.8], 0.48)
}
