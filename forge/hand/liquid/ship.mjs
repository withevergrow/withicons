// forge/hand/liquid/ship.mjs — a liquid-glass steamship: a broad hull and a cabin of deeper clear glass parted by a
// groove at the deck, a red accent glass funnel bead on top and a violet glass wave beneath. The generated ship had
// the palest hull in the family, so on white only the lilac funnel and waves held; the denser tint and firmer
// hairline keep the hull and cabin solid, and the funnel takes the accent so the steamship reads at 16px.
// Style pipeline (_liquid-core build). Motion: hull and cabin wm-k, wave wm-a, funnel wm-s (the ship rocks as one).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'ship'
const HULL = 'M2.5 12 H21.5 L19 16.75 H5 Z'
const CABIN = 'M6.5 12 V9.25 A1.5 1.5 0 0 1 8 7.75 H16 A1.5 1.5 0 0 1 17.5 9.25 V12 Z'
const FUNNEL = 'M10 6.75 V4.25 A1.25 1.25 0 0 1 11.25 3 H12.75 A1.25 1.25 0 0 1 14 4.25 V6.75 Z'
const WAVE = 'M3 20.5 Q4.75 19 6.5 20.5 T10 20.5 T13.5 20.5 T17 20.5 T20.5 20.5'

function glass(name, paths, fills = [], cutouts = []) {
  const ps = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  return {
    name, paths: ps,
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
    cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
  }
}

// lift the glass out of the white (as liquid bell): deeper clear and coloured tint, firmer hairline, fuller bead
const DEEP = { 0: [0.24, 0.48, 0.74], 1: [0.46, 0.88] }
function deepen(nodes) {
  return nodes.map(n => {
    if (n[0] === 'defs') {
      return ['defs', {}, n[2].map(g => {
        const k = +g[1].id.split('-').pop()
        if (!DEEP[k]) return g
        return [g[0], g[1], g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': DEEP[k][i] }])]
      })]
    }
    let a = n[1]
    if (a.stroke === 'currentColor' && a['stroke-opacity'] === 0.3) a = { ...a, 'stroke-opacity': 0.5, 'stroke-width': 0.28 }
    if (String(a.fill).includes('liquid-accent') && a['fill-opacity'] === 0.75) a = { ...a, 'fill-opacity': 0.92 }
    return a === n[1] ? n : [n[0], a]
  })
}

export default function render() {
  return deepen(build(glass(NAME, [[HULL, 'K'], [CABIN, 'K'], [FUNNEL, 'S'], [WAVE, 'A']], [HULL, CABIN, FUNNEL], ['M4.75 12 H19.25'])))
}
