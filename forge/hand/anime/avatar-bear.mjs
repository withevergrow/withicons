// forge/hand/anime/avatar-bear.mjs - the line bear head in anime: round tan head, two round ears with pink inners, a cream
// muzzle with a dark nose and smile, two catch-lit eyes and small cheeks.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

const hex = { c1: '#D9A066', c2: '#FF9AAE', tint: '#FFF5EC' }
export default function render(icon) {
  const ops = [
    k.surf(k.circle(6.3, 7.5, 2.8), 'c1', { shine: 'none', shade: 0.7 }),
    k.surf(k.circle(17.7, 7.5, 2.8), 'c1', { shine: 'none', shade: 0.7 }),
    k.paint(k.join(k.circle(6.3, 7.5, 1.3), k.circle(17.7, 7.5, 1.3)), 'c2', { op: 0.85 }),
    k.surf(k.circle(12, 13.7, 7.6), 'c1', { shine: 'none', shade: 1.1 }),
    k.shine(k.arc(12, 13.7, 6.6, 205, 250, 0.9)),
    k.surf(k.ellipse(12, 16.8, 3.4, 2.6), 'tint', { shine: 'none', shade: 0.8, ol: 0.35, cast: false }),
    k.paint(k.join(k.ellipse(9.4, 12.4, 0.72, 1), k.ellipse(14.6, 12.4, 0.72, 1)), 'ink', { part: 'a' }),
    k.shine(k.join(k.circle(9.2, 12, 0.28), k.circle(14.4, 12, 0.28))),
    k.paint(k.join(k.ellipse(6.6, 15.6, 1.1, 0.65), k.ellipse(17.4, 15.6, 1.1, 0.65)), 'c2', { op: 0.6 }),
    k.surf(k.poly([[10.8, 15.2], [13.2, 15.2], [12, 16.5]], [0.6, 0.6, 0.7]), 'ink', { shine: 'none', shade: 0, ol: 0.2, cast: false }),
    k.ink([[12, 16.4], [12, 17.4]], { w: 0.6, taper: false }),
    k.ink('M10.7 17.7 C11.3 18.6 12.7 18.6 13.3 17.7', { w: 0.6 }),
  ]
  return compose(ops, { seed: icon.name, hex })
}
