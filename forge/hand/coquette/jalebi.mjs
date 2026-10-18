// forge/hand/coquette/jalebi.mjs: the jalebi as a fried coil: one fat rope of blush satin wound in a spiral from the centre out
// (the gaps between the turns show), a ribbon-red heart at the heart of it and a gold twinkle; it replaces a
// plain disc with no coil.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

function spiral(cx, cy, r0, r1, turns, a0) {
  const pts = [], n = 120
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = (a0 + t * turns * 360) * Math.PI / 180, r = r0 + (r1 - r0) * t
    pts.push([+(cx + r * Math.cos(a)).toFixed(2), +(cy + r * Math.sin(a)).toFixed(2)])
  }
  return pts
}

export default function render() {
  return paint([
    k.body(k.tube(spiral(12, 12.2, 0.4, 8.3, 2.25, -90), 2.5), { plate: 'K', ow: 0.5 }),
    k.heart(12, 12.4, 3, 0, { plate: 'K' }),
    k.sparkle(20.4, 3.8, 1.7),
  ].flat(Infinity))
}
