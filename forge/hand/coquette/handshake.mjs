// forge/hand/coquette/handshake.mjs — the new handshake skeleton: two rose cuffs left and right, a blush hand from the
// left with four knuckle bumps front-left, and the right hand clasping over it with its thumb on top; replaces the
// older generated handshake.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const RIGHT = 'M18.6 9.6 C16.8 8.5 14.8 7.7 12.6 7.9 C11 8.1 9.8 8.8 8.4 10.5 C7.6 11.5 8.4 12.6 9.6 12 L11.8 10.8 L17 14.8 C17.8 15.4 18.6 15 18.9 14.4 L20 12.4 Z'

export default function render() {
  const knuckles = [[8.6, 13.7], [10.1, 15.1], [11.7, 16.3], [13.3, 17.2]]
  return paint([[
    k.body(k.poly([[5.4, 10.4], [8.4, 9.6], [13.6, 12.6], [15.6, 16.2], [13.8, 18.6], [9.8, 18.2], [6.4, 15.6], [4.6, 13.8]], 1)),
    k.ink('M13.4 13.2 L16.2 15.4 M12.8 15 L14.8 16.6', 0.7, { plate: 'K' }),
    k.body(k.path(RIGHT), { plate: 'A' }),
    knuckles.map(([x, y]) => k.body(k.seg(x + 0.75, y - 0.95, x - 0.55, y + 0.65, 2), { plate: 'K', ow: 0.5 })),
    k.rose(k.poly([[1.1, 13.4], [4.4, 7.5], [6.9, 9], [3.6, 14.9]], 0.5)),
    k.rose(k.poly([[22.9, 13.4], [19.6, 7.5], [17.1, 9], [20.4, 14.9]], 0.5)),
  ]].flat(Infinity).filter(Boolean))
}
