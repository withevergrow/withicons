// Live icon: a die showing a face from 1 to 6 (pips, no text), square or tossed at an angle.
import { rr } from './_layout.mjs'
import { dot, rotPt, f } from './_parts-misc.mjs'
import { live } from './_font.mjs'

const C = 12, OFF = 4.75          // pip grid: centre +-4.75 (pips ~1.75u ink radius: 1.25u white between, 1.5u to the wall)
const PIP = 0.75, HOLE = 1.75       // pip centreline radius (stroked to a disc) and its knock-out radius in filled styles
const FACES = {
  1: [[0, 0]],
  2: [[1, -1], [-1, 1]],
  3: [[1, -1], [0, 0], [-1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
}
const TILT = -12                  // degrees, counter-clockwise: a die caught mid-roll
const R = 3.5                     // dice corners are rounder than a container's

// rounded square 3..21 (3.5..20.5 when tossed, so the rotated corners stay inside 2..22) rotated about the centre;
// arcs keep their radius, endpoints are rotated and snapped
function body(deg) {
  if (!deg) return rr(3, 3, 21, 21, R)
  const lo = 3.5, hi = 20.5
  const P = p => rotPt(p, deg).join(' ')
  const a = `A${f(R)} ${f(R)} 0 0 1`
  return `M${P([lo + R, lo])} L${P([hi - R, lo])} ${a} ${P([hi, lo + R])} L${P([hi, hi - R])} ${a} ${P([hi - R, hi])} ` +
    `L${P([lo + R, hi])} ${a} ${P([lo, hi - R])} L${P([lo, lo + R])} ${a} ${P([lo + R, lo])} Z`
}

export default live({
  name: 'dice', title: 'Dice', category: 'objects',
  description: 'A die showing the face you choose, one to six pips, flat or tossed at an angle.',
  aliases: ['die', 'dice-face', 'roll', 'roll-dice', 'random', 'd6', 'game-die'],
  tags: ['dice', 'game', 'random', 'chance', 'board game'],
  synonyms: ['luck', 'gamble', 'casino', 'shuffle', 'randomize', 'pick random', 'tabletop', 'craps', 'one', 'six'],
  params: {
    value: { type: 'int', min: 1, max: 6, default: 5, label: 'Face (1-6)' },
    tilt: { type: 'bool', default: false, label: 'Tossed at an angle' },
  },
  examples: [{ value: 1, tilt: false }, { value: 3, tilt: false }, { value: 5, tilt: false }, { value: 6, tilt: false }, { value: 4, tilt: true }, { value: 2, tilt: true }],
  build({ value, tilt }) {
    const deg = tilt ? TILT : 0
    const d = body(deg)
    const off = deg ? OFF - 0.25 : OFF
    const pips = (FACES[value] || FACES[5]).map(([i, j]) => rotPt([C + i * off, C + j * off], deg))
    return {
      paths: [{ d, plate: 'K' }, ...pips.map(([x, y]) => ({ d: dot(x, y, PIP), plate: 'A' }))],
      fills: [d],
      cutouts: pips.map(([x, y]) => dot(x, y, HOLE)),
    }
  },
})
