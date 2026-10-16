// Two meshed spur gears: an eight-tooth wheel drives a six-tooth pinion. They turn in opposite directions at the
// speeds their tooth counts demand (3 : 4 turns per cycle), so the teeth stay meshed at every moment and the loop is exact.
import { circle, merge, stroke, spin } from './_kit.mjs'
import { gear } from './_creative-b.mjs'

const M = 1.45                                 // tooth module: pitch radius = M * teeth / 2
const NA = 8, NB = 6
const RA = M * NA / 2, RB = M * NB / 2, DIST = RA + RB + 0.4
const ANG = 45                                 // clock angle from the big gear to the pinion
const A = [9.05, 14.95]
const B = [A[0] + DIST * Math.sin(ANG * Math.PI / 180), A[1] - DIST * Math.cos(ANG * Math.PI / 180)]
const TOOTH = { add: 1.05, ded: 1.2, tip: 0.15, root: 0.25 }
// the big gear points a tooth at the pinion; the pinion faces it with a gap
const bigGear = gear(A[0], A[1], NA, RA, { ...TOOTH, phase: ANG })
const pinion = gear(B[0], B[1], NB, RB, { ...TOOTH, phase: ANG + 180 + 180 / NB })
const hub = (c, r) => circle(c[0], c[1], r)
const wheel = (d, c, r) => merge({ paths: [{ d, plate: 'K' }], fills: [d], cutouts: [hub(c, r)] }, stroke(hub(c, r), 'A'))

export default {
  name: 'gears', title: 'Gears', group: 'creative',
  description: 'An eight-tooth gear drives a six-tooth pinion: meshed teeth, opposite directions, a true 3 : 4 speed ratio.',
  intent: 'the machine is working on it, steadily',
  aliases: ['meshing-gears', 'gear-train', 'cogs-turning', 'machinery-loader', 'gears-spinning'],
  tags: ['loading', 'gears', 'mechanical', 'settings', 'processing'],
  synonyms: ['processing', 'working', 'building', 'configuring', 'cogs', 'machine'],
  duration: 8,
  parts: [
    // 3 turns of the big gear and 4 of the pinion per cycle: 24 teeth pass the mesh on both
    { skel: wheel(bigGear, A, 1.8), motion: { origin: A, keys: spin(), rep: 3 } },
    { skel: wheel(pinion, B, 1.1), motion: { origin: B, keys: spin({ dir: -1 }), rep: 4 } },
  ],
}
