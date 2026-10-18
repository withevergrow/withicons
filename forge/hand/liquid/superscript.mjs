// forge/hand/liquid/superscript.mjs — x-squared as liquid glass that reads on white: the generated clear-glass x was a
// pale ghost beside its violet 2, so the x is denser blue glass with a firmer ink hairline and the raised 2 stays coloured
// c2 glass (wm-a, it lifts). Same model and paint as the generator (_liquid-core.mjs); only the tint density changes.
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
// thin glass seen edge-on is denser: lift the clear-glass tint and the hairline of the K body
function deepen(nodes, name, stops, hair) {
  for (const n of nodes) {
    if (n[0] === 'defs') for (const g of n[2]) {
      if (g[1].id === `wg-liquid-${name}-0`) g[2].forEach((s, i) => { s[1]['stop-opacity'] = stops[i] })
    } else if (n[1].stroke === 'currentColor' && n[1].class !== 'wm-a' && n[1].class !== 'wm-s') {
      n[1]['stroke-opacity'] = hair
    }
  }
  return nodes
}

export default function render(icon) {
  const name = (icon && icon.name) || 'superscript'
  const nodes = build(synth(name, [
    ['M3.5 9 L12.5 20', 'K'],
    ['M12.5 9 L3.5 20', 'K'],
    ['M16.5 5.75 A2.25 2.25 0 0 1 21 5.75 C21 7.25 19.75 8.25 16.5 11 H21', 'A'],
  ]))
  return deepen(nodes, name, [0.42, 0.62, 0.86], 0.5)
}
