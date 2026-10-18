// forge/hand/anime/avatar-panda.mjs - the line panda head in anime: round cream head, two round dark ears, tilted dark
// eye patches with catch-lit eyes, a small dark nose and mouth, pink cheeks.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

const hex = { c1: '#FFF8F0', c2: '#3A3560', tint: '#FFFFFF', accent: '#FF8FA6' }
export default function render(icon) {
  const ops = [
    k.surf(k.circle(6.4, 7.2, 2.5), 'c2', { shine: 'none', shade: 0.6 }),
    k.surf(k.circle(17.6, 7.2, 2.5), 'c2', { shine: 'none', shade: 0.6 }),
    k.surf(k.circle(12, 13.6, 7.6), 'c1', { shine: 'none', shade: 1.1 }),
    k.shine(k.arc(12, 13.6, 6.6, 205, 250, 0.9)),
    k.surf(k.ellipse(8.5, 12.9, 1.9, 2.6, 28), 'c2', { shine: 'none', shade: 0, ol: 0.3, cast: false }),
    k.surf(k.ellipse(15.5, 12.9, 1.9, 2.6, -28), 'c2', { shine: 'none', shade: 0, ol: 0.3, cast: false }),
    k.paint(k.join(k.circle(8.9, 12.7, 0.75), k.circle(15.1, 12.7, 0.75)), 'tint'),
    k.paint(k.join(k.circle(8.9, 12.9, 0.38), k.circle(15.1, 12.9, 0.38)), 'ink'),
    k.paint(k.join(k.ellipse(6.4, 17.2, 1.1, 0.65), k.ellipse(17.6, 17.2, 1.1, 0.65)), 'accent', { op: 0.6 }),
    k.surf(k.poly([[10.6, 15.5], [13.4, 15.5], [12, 17]], [0.6, 0.6, 0.7]), 'ink', { shine: 'none', shade: 0, ol: 0.2, cast: false }),
    k.ink([[10.6, 18.3], [12, 19], [13.4, 18.3]], { w: 0.7 }),
  ]
  return compose(ops, { seed: icon.name, hex })
}
