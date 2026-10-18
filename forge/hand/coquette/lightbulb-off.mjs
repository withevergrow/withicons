// forge/hand/coquette/lightbulb-off.mjs: the full unlit bulb: a round blush glass with a cold filament, a gold screw base with
// its thread lines, a ribbon-red slash across it and a small bow as the accent in the free corner; it replaces a
// bow-topped pink shape that read as a hat.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([
    k.body(k.path('M9.2 16 C9.2 14 4.8 12.4 4.8 9 A7.2 7.2 0 0 1 19.2 9 C19.2 12.4 14.8 14 14.8 16 Z')),
    k.ink('M10.4 15.6 V12.2 L12 10.2 L13.6 12.2 V15.6', 0.9),
    k.gold(k.path('M8.8 15.6 H15.2 V19.2 A2 2 0 0 1 13.2 21.2 H10.8 A2 2 0 0 1 8.8 19.2 Z'), { plate: 'K', ow: 0.5 }),
    k.ink('M9.4 17.5 H14.6 M9.8 19.4 H14.2', 0.7),
    k.satin(k.seg(3.6, 3.6, 20.4, 20.4, 1.9), { plate: 'S', ow: 0.5 }),
    k.bow(19.4, 4.6, 0.5, 14),
  ].flat(Infinity))
}
