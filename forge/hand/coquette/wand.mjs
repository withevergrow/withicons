// forge/hand/coquette/wand.mjs — the skeleton's magic wand dressed: a thick blush satin stick with a ribbon-red tip,
// a little bow tied at the band and the two skeleton sparkles as plump outlined gold twinkles; the generated drawing
// swapped the wand for a heart lollipop with floating hairline twinkles, so it read as candy, not magic.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

// a plump four-point twinkle (waist q of R), corners softened
const twinkle = (cx, cy, R, q = 0.34) => {
  const pts = []
  for (let i = 0; i < 8; i++) {
    const a = (i * 45 - 90) * Math.PI / 180, l = i % 2 ? R * q : R
    pts.push([cx + l * Math.cos(a), cy + l * Math.sin(a)])
  }
  return k.poly(pts, 0.35)
}

export default function render() {
  const stick = k.seg(4.6, 19.4, 13.2, 10.8, 3.4)
  return paint([
    k.body(stick),
    k.satin(k.inter(stick, k.side(11.1, 13.9, 45)), { plate: 'K' }),
    // the sparkles twinkle with the spec's parts.A
    k.gold(twinkle(17.6, 6.2, 4.3), { plate: 'A', ow: 0.5 }),
    k.gold(twinkle(8.6, 4.8, 2.6), { plate: 'A', ow: 0.42 }),
    k.bow(10.4, 14.6, 0.48, 45, { plate: 'K' }),
  ].flat(Infinity).filter(Boolean))
}
