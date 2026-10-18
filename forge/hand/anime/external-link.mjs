// forge/hand/anime/external-link.mjs — the common external-link: a rounded square open at the top right, with a bold
// sky arrow (plate A) leaving it diagonally past the notch.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const box = k.cut(k.rr(3, 5, 19.5, 21, 2.6), k.rr(10.8, 1, 24, 13.2, [0, 0, 0, 2.6]))
  const arrow = k.unite(
    k.seg(11.8, 12.2, 19.6, 4.4, 2.9),
    k.bar([[14.6, 3.7], [20.3, 3.7], [20.3, 9.4]], 2.9),
  )
  const ops = [
    k.surf(box, 'c2'),
    k.surf(arrow, 'c1', { part: 'a', shineSize: 0.9 }),
  ]
  return compose(ops, { seed: icon.name })
}
