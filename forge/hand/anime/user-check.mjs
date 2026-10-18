// forge/hand/anime/user-check.mjs — the common user-check: a plain round head over arched shoulders, with a
// green check badge (plate S) at the upper right, cel-shaded in the anime style.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const body = k.rr(2, 14.2, 15.4, 21.5, [6, 6, 1.2, 1.2])
  const head = k.circle(8.7, 7.6, 3.9)
  const badge = k.circle(18.5, 7.9, 4.3)
  const check = k.bar([[16.4, 8.1], [17.9, 9.6], [20.7, 6.3]], 1.5)
  const ops = [
    k.surf(body, 'c1', { shineSize: 0.9 }),
    k.surf(head, 'tint', { shineSize: 0.9 }),
    k.surf(badge, 'c4', { part: 's', shineSize: 0.7 }),
    k.paint(check, 'tint', { part: 's' }),
  ]
  return compose(ops, { seed: icon.name })
}
