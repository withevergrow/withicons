// forge/hand/anime/thumbs-down.mjs - the line design in anime: a sky cuff on the left, a flat cream fist block with the
// thumb hanging down from its lower left, a crease on the thumb and a lit shoulder.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const hand = k.path('M6.6 3.4 H17.2 C18.4 3.4 19.3 4.2 19.5 5.3 L20.9 12.5 C21.2 14 20.1 15.3 18.6 15.3 H14.8 L15.1 18.9 C15.2 20.7 13.5 21.8 12 21.1 C10.9 20.6 10.3 19.8 9.9 18.9 L6.6 13.6 Z')
  const ops = [
    k.surf(hand, 'tint', { shine: 'none', shade: 1.2 }),
    k.shine(k.lens(10.4, 5.2, 17.6, 6.6, 0.5)),
    k.surf(k.rr(2.4, 3, 7.6, 14.2, 1.5), 'c1', { part: 'a', shineSize: 0.6 }),
  ]
  return compose(ops, { seed: icon.name })
}
