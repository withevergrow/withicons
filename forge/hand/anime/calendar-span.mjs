// forge/hand/anime/calendar-span.mjs - the calendar exemplar (cream page, sakura header, two sky binder rings) with the
// line design's two rows of a dot and a long/short dash, so it reads as a date range and never as a face.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const body = k.rr(3, 5.2, 21, 21, 2.2)
  const ops = [
    k.surf(body, 'tint', { shine: 'none' }),
    k.surf(k.clip(body, k.rect(2, 4, 22, 10)), 'c2', { cast: false }),
    k.paint(k.join(k.circle(7, 13.6, 0.85), k.seg(10.6, 13.6, 17, 13.6, 1.7), k.seg(7, 17.6, 13, 17.6, 1.7), k.circle(17, 17.6, 0.85)), 'ink', { op: 0.78 }),
    k.surf(k.pill(7, 2.6, 9, 7.6), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.pill(15, 2.6, 17, 7.6), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
  ]
  return compose(ops, { seed: icon.name })
}
