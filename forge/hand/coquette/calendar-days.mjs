// forge/hand/coquette/calendar-days.mjs — the calendar family build (cream page, blush header, gold rings) with a
// 3 x 2 grid of plump outlined rose day tiles and one ribbon-red "today", replacing six cream pearls that read as
// hollow o's (or X marks) on the cream page and vanished at 16px.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  const page = k.rr(3, 5, 21, 21, 2.6)
  const tile = (cx, cy) => k.rr(cx - 1.45, cy - 1.3, cx + 1.45, cy + 1.3, 0.7)
  const days = k.union(tile(7.6, 13.5), tile(12, 13.5), tile(16.4, 13.5), tile(7.6, 17.7), tile(12, 17.7))
  return paint([[
    k.cream(page),
    k.body(k.inter(page, k.rect(2, 4, 22, 9.8))),
    // the day tiles swell with the spec's parts.A pulse
    k.rose(days, { plate: 'A', ow: 0.45 }),
    k.satin(tile(16.4, 17.7), { plate: 'A', ow: 0.45 }),
    k.gold(k.union(k.pill(7, 2.6, 9.2, 7.2), k.pill(14.8, 2.6, 17, 7.2)), { plate: 'K' }),
  ]].flat(Infinity).filter(Boolean))
}
