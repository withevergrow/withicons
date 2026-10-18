// forge/hand/anime/tennis.mjs — the redesigned tennis racket: a coral teardrop frame with a cream string bed, a short
// throat and a long, broad sky grip so it can't read as a magnifier, plus a gold ball standing clear top right.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const head = k.path('M14 14 C13.75 12 14.75 6.75 12 4 C9.6 1.6 5.9 1.4 3.6 3.6 C1.4 5.9 1.6 9.6 4 12 C6.75 14.75 12 13.75 14 14 Z')
  const bed = k.grow(head, -1.55)
  const strings = k.clip(k.join(
    k.seg(4.5, 4, 13, 12.5, 0.75), k.seg(10, 2.5, 2.5, 10, 0.75),
  ), bed)
  return compose([
    k.surf(k.seg(13.3, 13.3, 15.8, 15.8, 1.6), 'c1', { shine: 'none', ol: 0.45 }),
    k.surf(k.seg(15.6, 15.6, 19.9, 19.9, 3.1), 'accent', { shineSize: 0.6 }),
    k.ink([[[16.3, 18.1], [18.1, 16.3]]], { w: 0.7, taper: false, shift: 0 }),
    k.surf(k.cut(head, bed), 'c1', { shineSize: 0.75 }),
    k.surf(bed, 'tint', { inset: true, ol: 0, shine: 'none', shade: 0.5 }),
    k.paint(strings, 'ink', { op: 0.6 }),
    k.surf(k.circle(16.6, 7.2, 2.5), 'c3', { shine: 'dot', shineSize: 0.55, ol: 0.45 }),
    k.ink('M14.9 5.8 C16.1 6.7 16.1 7.9 15 8.9', { w: 0.55, role: 'tint', shift: 0, taper: false }),
  ], { seed: icon.name })
}
