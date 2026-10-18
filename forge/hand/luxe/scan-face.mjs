// forge/hand/luxe/scan-face.mjs — four sapphire scan brackets around a gold face coin with two engraved eyes and an engraved smile (the generated coin was blank).
// Built with the Luxe recipe (_luxe-core build).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_luxe-core.mjs'

const G = {
  note: "four sapphire scan brackets around a gold face coin with two engraved eyes and an engraved smile (the generated coin was blank)",
  paths: [
    {
      d: "M3 7.5 V5 A2 2 0 0 1 5 3 H7.5",
      plate: "K"
    },
    {
      d: "M16.5 3 H19 A2 2 0 0 1 21 5 V7.5",
      plate: "K"
    },
    {
      d: "M21 16.5 V19 A2 2 0 0 1 19 21 H16.5",
      plate: "K"
    },
    {
      d: "M7.5 21 H5 A2 2 0 0 1 3 19 V16.5",
      plate: "K"
    },
    {
      d: "M18.25 12 A6.25 6.25 0 1 1 5.75 12 A6.25 6.25 0 1 1 18.25 12 Z",
      plate: "A"
    }
  ],
  fills: [
    "M18.25 12 A6.25 6.25 0 1 1 5.75 12 A6.25 6.25 0 1 1 18.25 12 Z"
  ],
  cutouts: [
    "M10.25 10 A0.9 1.4 0 1 1 8.45 10 A0.9 1.4 0 1 1 10.25 10 Z",
    "M15.55 10 A0.9 1.4 0 1 1 13.75 10 A0.9 1.4 0 1 1 15.55 10 Z",
    "M9 14 A3.5 3.2 0 0 0 15 14"
  ]
}

function prep(name) {
  const paths = G.paths.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = G.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(x => x.pts)) } })
  const cutouts = G.cutouts.map(d => ({ d, subs: parsePath(d) }))
  const lines = paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id })))
  return { name, paths, fills, cutouts, lines }
}

export default function render(icon) {
  return build(prep(icon.name))
}
