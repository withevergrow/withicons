// forge/hand/coquette/hexagon.mjs — a blush pointy-top hexagon with an inset cream honeycomb cell holding a small red
// heart, and a gold twinkle; it replaces the bare lace-trimmed polygon that had no inner cell and no metaphor.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const hex = (cx, cy, r) => Array.from({ length: 6 }, (_, i) => {
  const a = (i * 60 - 90) * Math.PI / 180
  return [+(cx + r * Math.cos(a)).toFixed(2), +(cy + r * Math.sin(a)).toFixed(2)]
})

export default function render() {
  return paint([[
    k.body(k.poly(hex(12, 12.2, 9.4), 1.6)),
    k.cream(k.poly(hex(12, 12.2, 5), 0.9), { ow: 0.5 }),
    k.heart(12, 12.5, 3.6, 0, { plate: 'A' }),
    k.sparkle(20.4, 3.4, 1.5),
  ]].flat(Infinity).filter(Boolean))
}
