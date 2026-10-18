// forge/hand/anime/cloud-off.mjs — the family cream cloud (lavender cel shadow, pale rim, soft lens shine) cut cleanly
// in two by the family coral slash inside a wide moat, so the slash never melts into the lobes and the halves still
// read as one cloud, like the redesigned skeleton.
import { compose } from '../../styles/_anime-compose.mjs'
import { k } from '../../styles/_anime-render.mjs'

export default function render(icon) {
  const sl = k.seg(3.4, 3.4, 20.6, 20.6, 2.1)
  const ops = [
    k.surf(k.cloudShape(12, 12.2, 1.02), 'tint', { shine: 'none', rim: true, shade: 0.8 }),
    k.shine(k.lens(5.6, 13.2, 7.6, 10.9, 0.45)),
    k.moat(sl, 1.0),
    k.surf(sl, 'accent', { part: 's', shine: 'none', ol: 0.4 }),
  ]
  return compose(ops, { seed: icon.name })
}
