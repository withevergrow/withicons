// BAUHAUS render — art-directed exemplars first, then the hand-composed redraws, then
// the automatic composer for the rest (live icons, any future icon).
import * as Prim from './_bauhaus-prim.mjs'
import * as Kit from './_bauhaus-kit.mjs'
const P = Object.freeze({ ...Prim, ...Kit })
import { compose } from './_bauhaus-compose.mjs'
import { REDRAW } from './_bauhaus-redraws.mjs'
import { auto, loopsD } from './_bauhaus-auto.mjs'
import * as F from './_bauhaus-field.mjs'
import { isPerson } from './_people.mjs'
import { buildPerson, personPalette } from './_bauhaus-people.mjs'

// The 20 exemplars of forge/styles/BAUHAUS-GUIDE.md, one per family. They are the
// reference every redraw is measured against, owned by the art director: an entry here
// wins over the same name in _bauhaus-redraw-*.mjs.
export const EXEMPLAR = {
  // straight arrow: ink shaft, red swept head; the shaft sinks into the head's notch
  'arrow-right': p => p.arrow(3.75, 12, 20.75, 12, { len: 7.25, half: 6.5 }),
  // two arcs of one circle, blue and red, each with its own swept head riding the curve
  refresh: p => [
    ...p.arcArrow(12, 12, 8, 190, 335, { role: 'c3', tip: 'c3', len: 6, half: 4.5, r: 1.1, rb: 1.1 }),
    ...p.arcArrow(12, 12, 8, 10, 155, { role: 'c1', tip: 'c1', len: 6, half: 4.5, r: 1.1, rb: 1.1 }),
  ],
  // one bent bar split along its axis: blue upper arm, red lower arm, seam through the tip
  'chevron-right': p => p.chevSplit(16, 12, 0, 8.5, 3.25),
  // a red disc field with the cream arrow printed on it
  'circle-arrow-right': p => [
    ...p.disc('c1'),
    ['tint', p.seg2(6.5, 12, 13.5, 12, 2.5), p.head(17.75, 12, 0, 5.25, 5)],
  ],
  // page with a quarter-disc dog-ear lifted off its corner and a red quarter rising
  file: p => p.page('c3', 'c2', 4.5, 2, 19.5, 22, 5.5, 'c1', 9),
  // back with a half-disc tab, front flap with an arched lip in a second primary
  folder: p => p.folder('c1', 'c3'),
  // blue page, red header band with a sagging arc, binder pills, a yellow quarter sun
  calendar: p => {
    const b = p.rr(3, 5, 21, 21, 3)
    return [...p.calendar('c3', 'c1'), ['c2', p.cornerQuarter(b, 21, 21, 7.5, 'nw')], ['tint', p.circle(7.75, 14, 1.25), p.circle(12, 14, 1.25), p.circle(7.75, 17.75, 1.25)]]
  },
  // two bumps and a pill base: a red front lobe peeking over the blue body
  cloud: p => p.cloud(0),
  // a soft five-point star split down the middle: yellow and red
  star: p => p.split(p.poly(p.star(12, 12.75, 10, 4.6, 5), 1.5), 'c1', 'c2', 12, 12, 90),
  // one red triangle, generously rounded: pure, nothing added
  play: p => [['c1', p.poly([[6, 3.5], [20.75, 12], [6, 20.5]], [2.75, 2.25, 2.75])]],
  // the constructed heart in red with a cream lens highlight on its left lobe
  heart: p => [['c1', p.heart().all], ['tint', p.lens(6.25, 10.75, 8.75, 6.5, 0.9)]],
  // head disc over half-disc shoulders
  user: p => p.person(12, 3, 1, 'c1', 'c3'),
  // yellow dome on a red rim, ink clapper and finial
  bell: p => [
    ['c2', p.arch(6, 5, 18, 16.5, 'n')],
    ['c1', p.pill(3.5, 15.5, 20.5, 18.5)],
    ['ink', p.circle(12, 20.75, 1.75), p.circle(12, 3.75, 1.25)],
  ],
  // red walls, blue roof, yellow arched door, cream round window
  home: p => [
    ['c1', p.rr(4.5, 10, 19.5, 21, [0, 0, 2, 2])],
    ['c3', p.poly([[2, 11.5], [12, 3], [22, 11.5]], [1.25, 1.5, 1.25])],
    ['c2', p.arch(9.5, 14, 14.5, 21)],
    ['tint', p.circle(12, 8.5, 1.5)],
  ],
  // blue envelope, yellow flap, red seal
  mail: p => [
    ['c3', p.rr(2, 4.5, 22, 19.5, 2.5)],
    ['c2', p.poly([[2.5, 5], [21.5, 5], [12, 13.5]], [1.5, 1.5, 2])],
    ['c1', p.circle(12, 12.5, 2.25)],
  ],
  // blue ring, yellow lens, red handle
  search: p => [
    ['c1', p.seg2(15.5, 15.5, 20.5, 20.5, 3.25)],
    ['c3', p.ring(10, 10, 7.5, 5)],
    ['c2', p.circle(10, 10, 5)],
  ],
  // blue gear of pill teeth, yellow hub, ink axle
  settings: p => [
    ['c3', p.around(p.pill(10, 2, 14, 8), 8), p.circle(12, 12, 7.5)],
    ['c2', p.circle(12, 12, 4)],
    ['ink', p.circle(12, 12, 1.75)],
  ],
  // ink shackle, body split yellow over red, ink keyhole
  lock: p => [
    ['ink', p.arc(12, 8, 4.5, 180, 360, 2.5), p.seg2(7.5, 8, 7.5, 11.5, 2.5), p.seg2(16.5, 8, 16.5, 11.5, 2.5)],
    ...p.halves(p.rr(4, 10.5, 20, 21.5, 3), 'c2', 'c1', 'h', 16.5),
    ['ink', p.circle(12, 15, 1.75), p.pill(11.1, 15, 12.9, 18.75)],
  ],
  // blue body, red viewfinder pill, concentric lens (ink, yellow, ink), cream flash dot
  camera: p => [
    ['c1', p.pill(8, 3.5, 16, 9)],
    ['c3', p.rr(2, 6.5, 22, 20.5, 3)],
    ['ink', p.circle(12, 13.5, 5)],
    ['c2', p.circle(12, 13.5, 3.25)],
    ['ink', p.circle(12, 13.5, 1.25)],
    ['tint', p.circle(18.75, 9.75, 1)],
  ],
  // red cup with a yellow rim band, blue handle ring, ink steam
  coffee: p => [
    ['c3', p.arc(16.5, 14.25, 2.75, -90, 90, 2.5)],
    ['c1', p.rr(3.5, 10, 17, 20.5, [1, 1, 6, 6])],
    ['c2', p.rr(3.5, 10, 17, 12.25, [1, 1, 0, 0])],
    ['ink', p.stroke('M8 7.5 C6.5 6.25 9.5 4.75 8 3', 2), p.stroke('M12.5 7.5 C11 6.25 14 4.75 12.5 3', 2)],
  ],
}

export function redrawOf(icon) {
  if (icon.params) return null
  const f = EXEMPLAR[icon.name] || REDRAW[icon.name]
  return typeof f === 'function' ? f : null
}

// people avatars (forge/styles/_people.mjs): flat skin c1, hair c2, a primary for clothing c4, black features
function person(icon) {
  const B = buildPerson(icon), C = personPalette(icon)
  const pp = role => `var(--with-bauhaus-${role}, ${C[role]})`
  const nodes = []
  const add = (Fd, fill, min) => {
    if (!Fd) return
    const d = loopsD(F.trace(Fd, 0.03, min), 2)
    if (d) nodes.push(['path', { d, fill, 'fill-rule': 'evenodd' }])
  }
  for (const f of B.fields) add(f.f, pp(f.role), 0.2)
  // features in the ink role with a fixed print-black default (stays black on skin in dark mode)
  add(B.ink, 'var(--with-bauhaus-ink, #151515)', 0.1)
  add(B.glint, pp('tint'), 0.05)
  return nodes
}

export default function render(icon) {
  if (!icon.params && isPerson(icon)) {
    try { const nodes = person(icon); if (nodes.length) return nodes } catch { /* the composer below */ }
  }
  const f = redrawOf(icon)
  if (f) {
    const nodes = compose(f(P), icon)
    if (nodes.length) return nodes
  }
  return auto(icon)
}
