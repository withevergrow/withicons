// PASTEL render — art-directed exemplars first, then the hand redraws (_pastel-redraw-1..5.mjs),
// then the automatic composer for everything else (Live icons, any future icon).
//
// A redraw is   (icon, p) => layers   where p is the frozen vocabulary (prim + kit, see
// PASTEL-GUIDE.md §4) and layers are [[key, shape...], ...] (see _pastel-compose.mjs).
// Anything that throws or draws nothing falls back to the automatic composer.
import * as Prim from './_pastel-prim.mjs'
import * as Kit from './_pastel-kit.mjs'
import { compose } from './_pastel-compose.mjs'
import { REDRAW } from './_pastel-redraws.mjs'
import { auto } from './_pastel-auto.mjs'
import { LIVE } from './_pastel-live.mjs'

export const P = Object.freeze({ ...Prim, ...Kit })

// The 20 exemplars of PASTEL-GUIDE.md §7, one per family. Owned by the art director: an entry
// here wins over the same name in _pastel-redraw-*.mjs.
export const EXEMPLAR = {
  // broad peach walls under a lavender gable roof that overhangs them, a butter arched door (A)
  // on the left and a sky window set into the wall on the right
  home: (icon, p) => [
    ['peach', p.rr(4, 10.5, 20, 21.25, [0, 0, 3, 3])],
    ['lavender', p.poly([[1.75, 12.25], [12, 2.75], [22.25, 12.25]], [1.5, 2.25, 1.5])],
    ['butter.well@A', p.arch(6.75, 14.25, 11.25, 21.25)],
    ['sky.well', p.rr(13.5, 14, 17.5, 17.75, 1.25)],
  ],
  // one full blush heart, a butter sparkle above its right lobe
  heart: (icon, p) => [
    ['blush', p.heart(12, 12.75, 1.02)],
    ['butter@deco', p.sparkle(20.25, 3.75, 2.6)],
  ],
  // butter dome on a flared rim, a small knob, peach clapper (A)
  bell: (icon, p) => [
    ['peach@A', p.circle(12, 19, 2.6)],
    ['butter', p.path('M5.5 16.25 V11.25 A6.5 6.5 0 0 1 18.5 11.25 V16.25 L20 17.25 A0.9 0.9 0 0 1 19.5 18.75 H4.5 A0.9 0.9 0 0 1 4 17.25 Z'), p.circle(12, 4, 1.6)],
  ],
  // sky envelope, a paper flap folding to the centre (A), a small blush seal
  mail: (icon, p) => [
    ['sky', p.rr(2, 4.5, 22, 19.5, 3)],
    ['paper@A', p.poly([[3, 5.6], [21, 5.6], [12, 13.25]], [1.6, 1.6, 2.2])],
    ['blush@A', p.circle(12, 12.25, 1.75)],
  ],
  // lavender lens ring, a sky glass with its glint, peach handle (A)
  search: (icon, p) => [
    ['peach@A', p.seg2(15.75, 15.75, 20.25, 20.25, 3.5)],
    ['lavender', p.ring(10.5, 10.5, 8.25, 5)],
    ['sky.well', p.circle(10.5, 10.5, 5)],
    ['shine', p.arc(10.5, 10.5, 3.2, 200, 250, 1.1)],
  ],
  // lavender gear, butter hub (A) with a see-through axle
  settings: (icon, p) => [
    ['lavender', p.gear(12, 12, 10.25, 7.25, 8, 4.25)],
    ['butter@A', p.circle(12, 12, 3.75)],
    ['cut', p.circle(12, 12, 1.5)],
  ],
  // peach head over tall lavender shoulders
  user: (icon, p) => [
    ['lavender', p.rr(3.75, 13, 20.25, 21.5, [7, 7, 2.5, 2.5])],
    ['peach', p.circle(12, 6.75, 4.25)],
  ],
  // one butter star, generously rounded
  star: (icon, p) => [
    ['butter', p.star5(12, 12.75, 10.75, 5.1, 1.1)],
  ],
  // lavender page, blush header band, butter binder rings (A), ink day dots, a butter "today"
  calendar: (icon, p) => {
    const c = p.calendar(3, 4.5, 21, 21.25, 10)
    return [
      ['lavender', c.body],
      ['blush', c.head],
      ['butter@A', c.rings],
      ['ink', p.circle(7.75, 14, 1.15), p.circle(12, 14, 1.15), p.circle(7.75, 17.75, 1.15), p.circle(12, 17.75, 1.15)],
      ['butter.flat', p.rr(14.75, 12.5, 18, 15.75, 1.25)],
    ]
  },
  // lavender body with a raised top, a sky lens (A) in a paper bezel, a butter flash
  camera: (icon, p) => [
    ['lavender', p.unite(p.rr(2, 7, 22, 20.5, 3.25), p.rr(8, 4, 16, 9, 1.75))],
    ['paper@A', p.circle(12, 13.75, 5)],
    ['sky.well@A', p.circle(12, 13.75, 3.25)],
    ['butter.flat', p.circle(18.4, 10, 1.1)],
  ],
  // one sky cloud
  cloud: (icon, p) => [
    ['sky', p.cloud(12, 13.25, 1.05)],
  ],
  // sky sheet, paper fold (A), two ink text lines
  file: (icon, p) => {
    const f = p.page(4.5, 2.25, 19.5, 21.75, 5.75, 2.75)
    return [
      ['sky', f.sheet],
      ['paper@A', f.fold],
      ['ink', p.lines(8.25, [15.75, 13], [13.5, 17.25])],
    ]
  },
  // peach back with its tab, butter front flap
  folder: (icon, p) => {
    const f = p.folder(2.25, 4, 21.75, 20.25, 7.5)
    return [['peach', f.back], ['butter', f.front]]
  },
  // peach shackle (A), lavender body, ink keyhole
  lock: (icon, p) => [
    ['peach@A', p.arc(12, 8, 4.5, 180, 360, 2.75), p.seg2(7.5, 8, 7.5, 12, 2.75), p.seg2(16.5, 8, 16.5, 12, 2.75)],
    ['lavender', p.rr(3.75, 10.5, 20.25, 21.5, 3.25)],
    ['ink@A', p.circle(12, 15.25, 1.6), p.pill(11.15, 15.25, 12.85, 18.5)],
  ],
  // blush note head, lavender stem and flag
  'music-note': (icon, p) => [
    ['lavender', p.unite(p.seg2(11.25, 17.5, 11.25, 3.5, 2.5), p.stroke('M11.5 3.25 C12.5 6.25 18 6.5 18 11.25', 2.5))],
    ['blush', p.rot(p.ellipse(8, 17.75, 4, 3.25), -18, 8, 17.75)],
  ],
  // lavender body with a sky nose and fins, a sky porthole in a paper bezel, butter flame (A);
  // drawn upright, then turned to fly to the top-right
  rocket: (icon, p) => {
    const R = s => p.scale(p.rot(s, 45, 12, 12), 1.07, 12, 12)
    const body = p.path('M12 1.25 C15.75 3.4 16.75 7.25 16.75 10.75 V16 A1.75 1.75 0 0 1 15 17.75 H9 A1.75 1.75 0 0 1 7.25 16 V10.75 C7.25 7.25 8.25 3.4 12 1.25 Z')
    return [
      ['butter@A', R(p.drop(12, 18.75, 2.4, 12, 23.25, 1))],
      ['sky', R(p.poly([[8.25, 10.5], [4.5, 13.75], [4.5, 17.5], [8.25, 16]], [1, 1.2, 1.2, 1])), R(p.poly([[15.75, 10.5], [15.75, 16], [19.5, 17.5], [19.5, 13.75]], [1, 1, 1.2, 1.2]))],
      ['lavender', R(body)],
      ['sky.flat', R(p.clip(body, p.rect(4, 0, 20, 4.75)))],
      ['paper', R(p.circle(12, 9.25, 2.85))],
      ['sky.well', R(p.circle(12, 9.25, 1.8))],
    ]
  },
  // peach cup with a butter coffee surface, lavender handle (A), soft lavender steam (A)
  coffee: (icon, p) => [
    ['lavender@A', p.arc(17, 14.75, 2.85, -90, 90, 2.5)],
    ['peach', p.rr(3, 10, 17.5, 21, [1.75, 1.75, 5, 5])],
    ['butter.flat', p.pill(4.5, 10.75, 16, 12.75)],
    ['lavender.flat@A', p.steam(8, 7.75, 5, 1.85), p.steam(12.5, 7.75, 5, 1.85)],
  ],
  // mint can with ink ribs, sky lid and handle (A)
  trash: (icon, p) => [
    ['mint', p.poly([[4.75, 7.5], [19.25, 7.5], [17.9, 19.4], [6.1, 19.4]], [1, 1, 2.25, 2.25]), p.rr(5.75, 16.5, 18.25, 21.25, [0, 0, 2.5, 2.5])],
    ['ink', p.seg2(10, 11, 10, 17.5, 1.6), p.seg2(14, 11, 14, 17.5, 1.6)],
    ['sky@A', p.rr(9, 2.5, 15, 6.5, 1.75)],
    ['cut', p.rr(10.75, 4.25, 13.25, 7, 0.9)],
    ['sky@A', p.pill(2.5, 5.25, 21.5, 8.5)],
  ],
  // one lavender arrow: shaft and soft head as one bar
  'arrow-right': (icon, p) => [
    ['lavender', p.arrow(3.5, 12, 20.25, 12, { w: 3.25, head: 7 })],
  ],
  // one mint check
  check: (icon, p) => [
    ['mint', p.check([[4.25, 12.75], [9.5, 18], [19.75, 6.5]], 3.5)],
  ],
}

export function redrawOf(icon) {
  if (!icon) return null
  if (icon.params) { const f = LIVE[icon.name] || REDRAW[icon.name]; return typeof f === 'function' ? f : null }
  const f = EXEMPLAR[icon.name] || REDRAW[icon.name]
  return typeof f === 'function' ? f : null
}

export default function render(icon) {
  const f = redrawOf(icon)
  if (f) {
    try {
      const layers = f(icon, P)
      if (Array.isArray(layers) && layers.length) {
        const nodes = compose(layers, icon)
        if (nodes.length) return nodes
      }
    } catch { /* fall back to the automatic composer */ }
  }
  return auto(icon)
}
