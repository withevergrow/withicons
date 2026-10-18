// forge/hand/anime/eye-off.mjs — the redesigned eye-off: a clean cream almond eye (no lashes) with a sky iris and
// catch-lit pupil, split by a wide moat and a coral slash so the slash never melts into the lids.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const white = k.path('M2.8 12 C4.8 7.7 8.1 5.3 12 5.3 C15.9 5.3 19.2 7.7 21.2 12 C19.2 16.3 15.9 18.7 12 18.7 C8.1 18.7 4.8 16.3 2.8 12 Z')
  return compose([
    k.surf(white, 'tint', { shine: 'none' }),
    k.surf(k.clip(k.circle(12, 12, 4.3), white), 'c1', { part: 'a', shine: 'none', ol: 0.35, cast: false }),
    k.paint(k.circle(12, 12.2, 2), 'ink', { part: 'a' }),
    k.shine(k.join(k.ellipse(10.6, 10.5, 1.15, 0.95), k.circle(13.6, 13.7, 0.5))),
    k.ink(['M2.6 11.6 C4.8 7.3 8.1 5 12 5 C15.9 5 19.2 7.3 21.4 11.6'], { w: 1.3, taper: 1.6 }),
    k.moat(k.seg(3.6, 3.6, 20.4, 20.4, 1.7), 1.0),
    k.tube('M3.8 3.8 L20.2 20.2', 'accent', { part: 's', w: 1.7 }),
  ], { seed: icon.name })
}
