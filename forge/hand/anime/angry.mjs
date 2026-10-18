// forge/hand/anime/angry.mjs — the new angry skeleton in anime: a full, centred coral face (no off-canvas anger mark)
// whose emotion rests on two heavy ink wedge brows slanting down to the nose, glaring catch-lit eyes set under them
// and a firm frown, so it never reads as a plain frown or a creature at 16px.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const ops = [
    k.surf(k.circle(12, 12, 9), 'accent', { shineSize: 0.9 }),
    k.surf(k.join(
      k.poly([[6.6, 7.6], [7.6, 6.3], [11, 8.2], [10, 9.8]], 0.45),
      k.poly([[17.4, 7.6], [16.4, 6.3], [13, 8.2], [14, 9.8]], 0.45),
    ), 'ink', { part: 'a', ol: 0, shine: 'none', shade: 0, cast: false, casts: false }),
    k.paint(k.join(k.ellipse(9, 13.1, 1.05, 1.35), k.ellipse(15, 13.1, 1.05, 1.35)), 'ink', { part: 'a' }),
    k.shine(k.join(k.circle(8.65, 12.55, 0.36), k.circle(14.65, 12.55, 0.36))),
    k.ink('M8.7 18.1 C10.4 16 13.6 16 15.3 18.1', { w: 1.3, part: 'a' }),
  ]
  return compose(ops, { seed: icon.name })
}
