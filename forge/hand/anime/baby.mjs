// forge/hand/anime/baby.mjs - a round baby head in soft natural skin with a curled hair tuft on top, big shiny eyes,
// pink cheeks, small ears and a tiny smile.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

const hex = { c1: '#FFD9B8', shadow: '#D99A7A', c3: '#9A6340', c2: '#FF9AAE', tint: '#FFFFFF', accent: '#FF8FA6' }
export default function render(icon) {
  const head = k.join(k.circle(12, 13.2, 7.6), k.circle(4.6, 13.4, 1.6), k.circle(19.4, 13.4, 1.6))
  const tuft = k.path('M12.4 6.1 C10.4 5.4 10.2 3 12.2 2.6 C13.8 2.3 15 3.4 14.4 4.4 C14 3.7 13 3.5 12.6 4.1 C12.2 4.8 12.9 5.6 13.6 5.7 Z')
  const ops = [
    k.surf(head, 'c1', { shine: 'none', tone: ['shadow', 0.45] }),
    k.surf(tuft, 'c3', { part: 'a', shine: 'none' }),
    k.paint(k.join(k.ellipse(9.1, 13, 1.25, 1.55), k.ellipse(14.9, 13, 1.25, 1.55)), 'ink'),
    k.paint(k.join(k.circle(9.5, 12.5, 0.5), k.circle(15.3, 12.5, 0.5)), 'tint', { part: 'shine' }),
    k.paint(k.join(k.ellipse(7.2, 15.6, 1.2, 0.7), k.ellipse(16.8, 15.6, 1.2, 0.7)), 'c2', { op: 0.75 }),
    k.ink([[[10.9, 16.3], [12, 17], [13.1, 16.3]]], { w: 0.7 }),
  ]
  return compose(ops, { seed: icon.name, hex })
}
