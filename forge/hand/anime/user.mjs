// forge/hand/anime/user.mjs — the common head-and-shoulders: one plain round head over arched shoulders (no hair,
// collar or heart), cel-shaded with the anime shade crescent, rim and highlight.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const body = k.rr(4, 14.2, 20, 21.5, [6.2, 6.2, 1.2, 1.2])
  const head = k.circle(12, 7.6, 4.2)
  const ops = [
    k.surf(body, 'c1', { shineSize: 0.9 }),
    k.surf(head, 'tint', { shineSize: 0.9 }),
  ]
  return compose(ops, { seed: icon.name })
}
