// forge/hand/anime/cast.mjs â€” the redesigned cast icon: a glossy sky screen with dark glass whose lower-left corner is
// carved away in a wide arc, and gold signal waves (a corner dot and two arcs, plate A) rising from that corner with
// a clear gap to the screen, so it reads as casting to a display and not an RSS badge.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const cx = 3, cy = 20
  const waves = k.join(
    k.sector(cx, cy, 2.4, 270, 360),
    k.arc(cx, cy, 5.7, 270, 360, 1.8),
    k.arc(cx, cy, 9.2, 270, 360, 1.8),
  )
  const body = k.cut(k.rr(2.4, 4, 21.6, 20, 2.4), k.circle(cx, cy, 11.4))
  const glass = k.cut(k.rr(4.4, 6, 19.6, 18, 1.2), k.circle(cx, cy, 11.4))
  const ops = [
    k.surf(body, 'c1', { shineSize: 0.8 }),
    k.surf(glass, 'ink', { inset: true, ol: 0, shine: 'glass', shade: 0 }),
    k.surf(waves, 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
  ]
  return compose(ops, { seed: icon.name })
}
