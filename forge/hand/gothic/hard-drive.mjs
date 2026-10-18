// forge/hand/gothic/hard-drive.mjs — the drive as the skeleton's slab: a sapphire glass sloped top in a stone rim over
// an ashlar front with a glowing slot and an emerald activity jewel; the old drawing's round platter read as a speaker.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const parts = [
    g.stone(g.rr(2, 10.6, 22, 19.5, [0, 0, 2.2, 2.2])),
    ...g.pane(g.path('M2 11.2 L4 7 Q5 5 7 5 H17 Q19 5 20 7 L22 11.2 Z'), 'c2', { frame: 1.3, tracery: 'lancet', glass: { s: 2.4 } }),
    g.recess(g.rr(5.4, 14.1, 12.6, 16.1, 1), { glow: 'c3', plate: 'A' }),
    ...g.bead(18.3, 15.1, 1.35, 'c4', { plate: 'A' }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
