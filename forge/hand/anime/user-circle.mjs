// forge/hand/anime/user-circle.mjs — the new user-circle skeleton in anime: a clean pale-sky avatar disc holding one
// bold bust (round sky bob with a soft two-lock fringe over a cream face, sky shoulders with a sakura collar filling the
// disc's lower cap), no inner face rings, so it reads as a person in a circle at 16px.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const disc = k.circle(12, 12, 9.1)
  const inner = k.circle(12, 12, 8.5)
  const hc = 9.3
  const hair = k.unite(k.circle(12, hc, 4.4), k.rr(7.6, hc, 16.4, hc + 3.2, [0, 0, 1.6, 1.6]))
  const fringe = k.unite(
    k.clip(k.circle(12, hc, 4.4), k.rect(6, 3, 18, hc - 1.1)),
    k.ellipse(10.2, hc - 0.85, 2.3, 1.05, 16),
    k.ellipse(14.1, hc - 0.95, 1.9, 0.95, -18),
  )
  const shirt = k.clip(k.path('M3.5 22 C4.2 18.2 6.8 16.2 10 16.2 H14 C17.2 16.2 19.8 18.2 20.5 22 Z'), inner)
  const ops = [
    k.surf(disc, 'edge', { shine: 'none', shade: 0.6 }),
    k.surf(shirt, 'c1', { shine: 'none', ol: 0.4, cast: false }),
    k.surf(k.poly([[10.1, 16.3], [13.9, 16.3], [12, 19]], [0.4, 0.4, 0.6]), 'c2', { shine: 'none', ol: 0.3 }),
    k.surf(hair, 'c1', { shine: 'none', shade: 1.1 }),
    k.surf(k.circle(12, hc + 0.95, 3.6), 'tint', { shine: 'none', ol: 0.35 }),
    k.paint(k.join(k.ellipse(10.55, hc + 1.55, 0.6, 0.85), k.ellipse(13.45, hc + 1.55, 0.6, 0.85)), 'ink'),
    k.surf(fringe, 'c1', { shine: 'none', casts: true }),
    k.shine(k.clip(k.arc(12, hc, 3.5, 206, 250, 0.7), fringe)),
  ]
  return compose(ops, { seed: icon.name })
}
