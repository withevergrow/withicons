// forge/hand/coquette/angry.mjs — the new skeleton's angry face: a blush face with bold wine wedge brows slanting down to
// the nose, oval eyes and a low frown, and a hair bow on its crown like smile; it replaces the old bespoke drawing whose
// thin brow lines were the only cue and blurred into frown at 16px.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([[
    k.body(k.disc(12, 12.6, 9.1)),
    k.fill(k.union(
      k.poly([[6.7, 8.2], [7.6, 6.9], [10.9, 8.9], [9.9, 10.4]], 0.45),
      k.poly([[17.3, 8.2], [16.4, 6.9], [13.1, 8.9], [14.1, 10.4]], 0.45),
      k.ellipse(9, 13.1, 1, 1.25), k.ellipse(15, 13.1, 1, 1.25),
    ), 'ink', { plate: 'A' }),
    k.ink('M8.9 18.2 Q12 15.6 15.1 18.2', 1.2),
    k.bow(17.4, 4.9, 0.6, 22),
  ]].flat(Infinity).filter(Boolean))
}
