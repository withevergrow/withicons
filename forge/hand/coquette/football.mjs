// forge/hand/coquette/football.mjs — a blush soccer ball with a red satin centre pentagon, five rose edge patches
// cropped by the rim and fine ink seams joining them, plus a gold twinkle; it replaces the old drawing whose lone
// pentagon and spokes read as a star or a flower.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const PATCHES = 'M7.84 3.46 L9.18 4.25 L12 5 L14.82 4.25 L16.16 3.46 L12 1 Z M18.83 5.4 L18.5 6.92 L18.66 9.84 L20.24 12.29 L21.41 13.32 L23 8 Z M20.39 16.46 L18.84 16.61 L16.11 17.66 L14.27 19.93 L13.65 21.36 L19 22 Z M10.35 21.36 L9.73 19.93 L7.89 17.66 L5.16 16.61 L3.61 16.46 L5 22 Z M2.59 13.32 L3.76 12.29 L5.34 9.84 L5.5 6.92 L5.17 5.4 L1 8 Z'

export default function render() {
  const ball = k.disc(12, 12, 9.4)
  return paint([[
    k.body(ball),
    k.rose(k.inter(k.inset(ball, 0.05), k.path(PATCHES)), { plate: 'K', ow: 0.5 }),
    k.ink('M12 8.5 V5 M15.33 10.92 L18.66 9.84 M14.06 14.83 L16.11 17.66 M9.94 14.83 L7.89 17.66 M8.67 10.92 L5.34 9.84', 0.9),
    k.satin(k.poly([[12, 8.3], [15.5, 10.85], [14.17, 14.95], [9.83, 14.95], [8.5, 10.85]], 0.6), { plate: 'K' }),
    k.sparkle(20.6, 3.3, 1.5),
  ]].flat(Infinity).filter(Boolean))
}
