// An atom at work: three electrons race round the library atom's three tilted orbits, a third of a lap apart. Each
// orbit is read as a ring seen at a slant, so an electron grows and brightens on the near side and shrinks and dims
// on the far side; the nucleus beats softly twice a cycle.
import { circle, solid, icon, pulse, E } from './_kit.mjs'
import { keysOf, named, placed } from './_creative-a.mjs'

const S = 0.84, A = 10 * S, B = 4 * S, C = [12, 12]
// the library atom's three orbits (its nucleus is ours), shrunk through the motion so hand-tuned atoms shrink too
const atom = icon('atom')
const ORBITS = { ...atom, paths: atom.paths.filter(p => p.plate === 'K'), fills: [], cutouts: [] }
// an electron on the orbit tilted by phi (deg, as the icon's arcs): drawn at theta = 0, keys walk theta round
const at = (phi, th) => {
  const p = phi * Math.PI / 180
  const lx = A * Math.cos(th), ly = B * Math.sin(th)
  return [C[0] + lx * Math.cos(p) - ly * Math.sin(p), C[1] + lx * Math.sin(p) + ly * Math.cos(p)]
}
const electron = (phi, dir) => {
  const p0 = at(phi, 0)
  return {
    skel: named(solid(circle(p0[0], p0[1], 1.5), 'S'), 'wl-atom'),
    motion: {
      origin: p0,
      keys: keysOf(t => {
        const th = dir * t * Math.PI * 2, p = at(phi, th), depth = Math.sin(th) * dir
        return { x: p[0] - p0[0], y: p[1] - p0[1], s: 0.86 + 0.2 * depth, o: 0.72 + 0.28 * depth }
      }, 36),
    },
  }
}
export default {
  name: 'atom', title: 'Atom', group: 'creative',
  description: 'Three electrons race round the tilted orbits of an atom, swelling on the near side and dimming behind.',
  intent: 'science at work: computing, analysing, crunching',
  aliases: ['atom-loader', 'electron-orbit-loader', 'science-loader', 'atomic-spinner', 'nucleus-loader'],
  tags: ['loading', 'science', 'atom', 'physics', 'research'],
  synonyms: ['processing', 'computing', 'analysing', 'science', 'research', 'physics', 'react'],
  duration: 2.4,
  morph: ['atom'],
  parts: [
    { skel: ORBITS, motion: { origin: C, keys: placed([[0, { o: 0.42 }], [1, { o: 0.42 }]], { s: S }) } },
    { skel: named(solid(circle(...C, 2), 'A'), 'wl-atom'), motion: { origin: C, keys: pulse(0.85, 1.12), rep: 2 } },
    { ...electron(0, 1), motion: { ...electron(0, 1).motion, lag: 0 } },
    { ...electron(60, 1), motion: { ...electron(60, 1).motion, lag: 1 / 3 } },
    { ...electron(120, 1), motion: { ...electron(120, 1).motion, lag: 2 / 3 } },
  ],
}
