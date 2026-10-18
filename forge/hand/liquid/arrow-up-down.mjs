// forge/hand/liquid/arrow-up-down.mjs — the two-way arrow as liquid glass with a shaft that holds its own: the generated
// clear 2.6u tube faded to a near-white sliver between the violet heads on light grounds, so the shaft is drawn as a
// rod of denser blue glass with a firmer ink hairline, and the heads stay coloured c2 glass (wm-a, for
// the pulse). Same model and paint as the generator (_liquid-core.mjs); only the pieces and the tint density change.
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
  const name = (icon && icon.name) || 'arrow-up-down'
  const nodes = build(synth(name, [
    ['M12 4.5 V19.5', 'K'],
    ['M6.5 8.5 L12 3 L17.5 8.5', 'A'],
    ['M6.5 15.5 L12 21 L17.5 15.5', 'A'],
  ]))
  return deepen(nodes, name, [0.42, 0.62, 0.86], 0.5)
}
