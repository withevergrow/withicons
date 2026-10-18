// forge/hand/anime/user-x.mjs - the line design in anime: a plain round cream head with two catch-lit eyes over arched
// sky shoulders, shifted left, and a coral round X badge at the upper right.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const ops = [
    k.surf(k.path('M2.2 21.4 V19.6 C2.2 16.9 4.4 14.9 7 14.9 H10.6 C13.2 14.9 15.4 16.9 15.4 19.6 V21.4 Z'), 'c1', { shine: 'none' }),
    k.surf(k.circle(8.8, 8, 4.2), 'tint', { shine: 'none', shade: 1.1 }),
    k.paint(k.join(k.ellipse(7.3, 8.4, 0.62, 0.9), k.ellipse(10.3, 8.4, 0.62, 0.9)), 'ink'),
    k.shine(k.join(k.circle(7.12, 8.05, 0.26), k.circle(10.12, 8.05, 0.26))),
    k.paint(k.join(k.ellipse(6.1, 10.2, 0.9, 0.55), k.ellipse(11.5, 10.2, 0.9, 0.55)), 'accent', { op: 0.55 }),
    k.moat(k.circle(18, 9, 3.6), 0.75),
    k.surf(k.circle(18, 9, 3.6), 'accent', { part: 's', shine: 'none', ol: 0.4 }),
    k.ink([[[16.7, 7.7], [19.3, 10.3]], [[19.3, 7.7], [16.7, 10.3]]], { role: 'tint', w: 1.25, taper: false, shift: 0, part: 's' }),
  ]
  return compose(ops, { seed: icon.name })
}
