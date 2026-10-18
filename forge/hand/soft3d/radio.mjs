// forge/hand/soft3d/radio.mjs — a wooden transistor radio as a real 3/4 solid: a big raised silver speaker dish on the
// left, a dark glass tuning window and a round dark tuning knob on the right, and a thick silver antenna with a ball
// tip standing on the top. The generated drawing kept a thin pale antenna and two tiny bars, so it read as a plain box.
// Built with the house soft3d object recipe (forge/styles/_soft3d-core.mjs build) from a hand-made skeleton.
import { build } from '../../styles/_soft3d-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const BODY = 'M4 9 H20 A2 2 0 0 1 22 11 V18.5 A2 2 0 0 1 20 20.5 H4 A2 2 0 0 1 2 18.5 V11 A2 2 0 0 1 4 9 Z'
// raised round parts (round dishes in the house recipe): the speaker first (c2 silver), then the knob (c3 dark)
const SPEAKER = 'M10.75 14.75 A3.25 3.25 0 1 1 4.25 14.75 A3.25 3.25 0 1 1 10.75 14.75 Z'
const KNOB = 'M17.75 17.25 A1.5 1.5 0 1 1 14.75 17.25 A1.5 1.5 0 1 1 17.75 17.25 Z'
// the antenna: a rod from the top's left half up to the right, with a ball tip
const ANTENNA = 'M6.5 9 L17.25 2.75'
const TIP = 'M19.25 2.25 A1.25 1.25 0 1 1 16.75 2.25 A1.25 1.25 0 1 1 19.25 2.25 Z'
// the tuning window: a big closed cutout -> dark inset glass
const DIAL = 'M13.75 10.75 H19.25 A0.75 0.75 0 0 1 20 11.5 V13.5 A0.75 0.75 0 0 1 19.25 14.25 H13.75 A0.75 0.75 0 0 1 13 13.5 V11.5 A0.75 0.75 0 0 1 13.75 10.75 Z'

export default function render(icon) {
  return build(skel(icon, {
    paths: [[BODY, 'K'], [SPEAKER, 'A'], [KNOB, 'A'], [ANTENNA, 'A'], [TIP, 'A']],
    fills: [BODY], cutouts: [DIAL],
  }))
}

function skel(icon, { paths, fills, cutouts }) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name: icon.name, category: icon.category, paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}
