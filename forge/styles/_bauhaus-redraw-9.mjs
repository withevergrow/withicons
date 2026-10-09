// BAUHAUS redraws, chunk 9: notepad-text … radio
// Run 9: every icon redrawn against BAUHAUS-GUIDE.md (soft corners, split bodies, kit
// arrows and vees, 2-4 colours). 'play' is an exemplar (owned by _bauhaus-render.mjs).
const PHONE = 'M3 5 A2 2 0 0 1 5 3 H8 A1.5 1.5 0 0 1 9.5 4.5 V6 C9.5 7.25 8.5 7.25 8.5 8.5 A7 7 0 0 0 15.5 15.5 C16.75 15.5 16.75 14.5 18 14.5 H19.5 A1.5 1.5 0 0 1 21 16 V19 A2 2 0 0 1 19 21 A16 16 0 0 1 3 5 Z'
// the handset: a blue body whose two ends (ear and mouth pads) print red, cut by arcs
const phone = (p, body = 'c3', pads = 'c1') => {
  const h = p.path(PHONE)
  return [[body, h], [pads, p.clip(h, p.circle(4.25, 4.25, 5.5)), p.clip(h, p.circle(19.75, 19.75, 5.5))]]
}
// a jet seen from above, nose up: swept wings and tail in one primary, the fuselage in another
const jet = (p) => ({
  wings: p.join(p.poly([[10.5, 8], [13.5, 8], [22, 14], [22, 16.25], [13.5, 13.75], [10.5, 13.75], [2, 16.25], [2, 14]], 1.25), p.poly([[10.5, 17], [13.5, 17], [17, 20.25], [17, 21.75], [12, 20.75], [7, 21.75], [7, 20.25]], 1)),
  body: p.pill(10.25, 1.75, 13.75, 21.5),
})
// a phone-family arrow: ink shaft sunk into a kit head drawn as a clean rounded triangle
// (straight back at right angles to the shaft, even corner radii), so it never reads lumpy
const RAD = Math.PI / 180
const arw = (p, x0, y0, x1, y1, { w = 2.25, len = 6, half = 4.75 } = {}) => {
  const deg = Math.atan2(y1 - y0, x1 - x0) / RAD, ux = Math.cos(deg * RAD), uy = Math.sin(deg * RAD)
  return [['ink', p.seg2(x0, y0, x1 - ux * len * 0.55, y1 - uy * len * 0.55, w)], ['c1', p.head(x1, y1, deg, len, half, 1.5, { notch: 0, rb: 1.3 })]]
}
const windowFrame = (p, role = 'c3') => [[role, p.rr(3, 3, 21, 21, 3)]]
// the side panel of a window: the frame's own left strip, so the outer corners match exactly
const leftPanel = p => p.clip(p.rr(3, 3, 21, 21, 3), p.rect(0, 0, 9.5, 24))

export const R = {
  // blue pad, red binder rings, cream text lines, the last one short and yellow
  'notepad-text': ({ rr, pill, seg2 }) => [
    ['c3', rr(4, 4.5, 20, 21.5, 3)],
    ['c1', pill(6.75, 2, 9.25, 7.5), pill(10.75, 2, 13.25, 7.5), pill(14.75, 2, 17.25, 7.5)],
    ['tint', seg2(8, 11.25, 16, 11.25, 2), seg2(8, 15, 16, 15, 2)],
    ['c2', seg2(8, 18.75, 12.25, 18.75, 2)],
  ],
  // a closed box: blue body under a red lid, a yellow tape strip ending in a round tab
  package: ({ rr, half, rect, join }) => [
    ['c3', rr(3.5, 9, 20.5, 21, [0, 0, 3, 3])],
    ['c1', rr(2, 4, 22, 9.5, 2.5)],
    ['c2', join(rect(10, 4, 14, 13.5), half(12, 13.5, 2, 's'))],
  ],
  // an open box: a blue body, its two flaps folded out from the rim like wings
  // (yellow, red), meeting flush at the middle of the rim
  'package-open': ({ poly, rr, pill }) => [
    ['c2', poly([[4, 11.5], [1.75, 5], [8.5, 3.25], [12, 11.5]], [0, 1.5, 1.5, 0])],
    ['c1', poly([[20, 11.5], [22.25, 5], [15.5, 3.25], [12, 11.5]], [0, 1.5, 1.5, 0])],
    ['c3', rr(4, 11.5, 20, 21.5, [0, 0, 3, 3])],
    ['tint', pill(9, 14.75, 15, 16.75)],
  ],
  // blue handle, yellow ferrule, red bristles drawn to a point
  paintbrush: ({ rot, rr, pill, drop }) => [
    ['c3', rot(pill(14.25, 0.25, 16.75, 13), 45, 15.5, 7.5)],
    ['c2', rot(rr(8.5, 9, 14, 13.75, 1.5), 45, 11.25, 11.25)],
    ['c1', drop(8.5, 15.5, 3.75, 2.75, 21.25, 1)],
  ],
  // yellow palette with its thumb notch, three paint wells (red, blue, ink)
  palette: ({ path, circle }) => [
    ['c2', path('M12 2.5 A9.5 9.5 0 0 1 21.5 12 C21.5 14.5 20 15.5 18 15.5 C16.5 15.5 15.5 16.5 15.5 18 C15.5 20 14.5 21.5 12 21.5 A9.5 9.5 0 0 1 12 2.5 Z')],
    ['c1', circle(8.25, 8.75, 2)],
    ['c3', circle(14.25, 7.75, 2)],
    ['ink', circle(7.75, 14.75, 2)],
  ],
  // two green fronds up, two blue fronds down, ink trunk on a yellow island
  'palm-tree': ({ path, stroke, ehalf }) => [
    ['c2', ehalf(12, 22, 7.5, 2.75, 'n')],
    ['ink', stroke('M12 7 C13 11.5 13 16 11.5 20', 2.5)],
    ['accent', path('M12 7 C10.25 1.25 3.75 1.5 2.5 9 C7.25 6.5 7.75 6.75 12 7 Z M12 7 C16.25 6.75 16.75 6.5 21.5 9 C20.25 1.5 13.75 1.25 12 7 Z')],
    ['c3', path('M12 7 C8.5 4.25 4 7.25 5.5 13 C9 10.75 10.5 9.75 12 7 Z M12 7 C13.5 9.75 15 10.75 18.5 13 C20 7.25 15.5 4.25 12 7 Z')],
  ],
  // the frame's own strip in red, a yellow half-disc grip rising off the divider
  'panel-bottom': p => [...windowFrame(p), ['c1', p.clip(p.rr(3, 3, 21, 21, 3), p.rect(0, 14.5, 24, 24))], ['c2', p.half(12, 14.5, 3.75, 'n')]],
  'panel-right': p => [...windowFrame(p), ['c1', p.clip(p.rr(3, 3, 21, 21, 3), p.rect(14.5, 0, 24, 24))], ['c2', p.half(14.5, 12, 3.75, 'w')]],
  // red side panel, cream chevron pointing the way it moves
  'panel-left-close': p => [...windowFrame(p), ['c1', leftPanel(p)], ...p.vee(p.chev(13, 12, 180, 4.25), 2.75, 'tint', 'tint')],
  'panel-left-open': p => [...windowFrame(p), ['c1', leftPanel(p)], ...p.vee(p.chev(17, 12, 0, 4.25), 2.75, 'tint', 'tint')],
  // one wire, split across its length: blue outer loop, red inner tongue
  paperclip: ({ stroke, split }) => split(stroke('M12.25 4.5 L4.25 12.5 A4.24 4.24 0 0 0 10.25 18.5 L16.25 12.5 L20.25 8.5 A2.12 2.12 0 0 0 17.25 5.5 L9.25 13.5', 2.5), 'c1', 'c3', 12.5, 11.5, 45),
  // blue sign, red corner quarter; the P: a cream stem and a solid yellow bowl
  parking: ({ rr, rect, half, join, seg2, cornerQuarter }) => {
    const b = rr(3, 3, 21, 21, 3.5)
    return [
      ['c3', b],
      ['c1', cornerQuarter(b, 21, 21, 7, 'nw')],
      ['c2', join(rect(9.5, 6.25, 12.75, 13.75), half(12.75, 10, 3.75, 'e'))],
      ['tint', seg2(9.5, 7.5, 9.5, 17.5, 3)],
    ]
  },
  // a red cone crossed by a yellow band, a blue streamer, an ink twirl, two dots
  'party-popper': ({ poly, circle, stroke, seg2, clip }) => {
    const cone = poly([[2.5, 21.5], [7.25, 9], [15, 16.75]], [1.5, 1.75, 1.75])
    return [
      ['c1', cone],
      ['c2', clip(cone, poly([[1.08, 11.6], [12.4, 22.9], [14.17, 21.15], [2.85, 9.83]], 0))],
      ['c3', seg2(15.25, 8.75, 18, 6, 2.25), stroke('M17.5 13 C18.5 11.5 20 13.5 21.5 12', 2.25)],
      ['ink', stroke('M11 6.5 C12.5 5.5 11 3.5 12.5 2.5', 2.25)],
      ['c2', circle(16.75, 2.75, 1.25)],
      ['c1', circle(21, 7.75, 1.25)],
    ]
  },
  // red cover, yellow globe (ring with an equator bar flush inside it), cream name line
  passport: ({ rr, circle, ring, rect, clip, pill }) => [
    ['c1', rr(5, 2.5, 19, 21.5, 3)],
    ['c2', ring(12, 10, 4.25, 2.25), clip(rect(7, 9, 17, 11), circle(12, 10, 4))],
    ['tint', pill(9, 16.5, 15, 18.5)],
  ],
  // blue clipboard, red clip, the yellow sheet pasted in front behind a moat
  paste: ({ rr, pill }) => [
    ['c3', rr(3, 4.5, 17, 18.5, 2.75)],
    ['c1', pill(6.75, 2.25, 13.25, 6.75)],
    ['cut', rr(9, 8.5, 22.5, 23, 3.25)],
    ['c2', rr(10.5, 10, 21, 21.5, 2.5)],
  ],
  // two full pills, red and blue
  pause: ({ pill }) => [['c1', pill(5.5, 4, 10, 20)], ['c3', pill(14, 4, 18.5, 20)]],
  // red pad, inner toes ink, outer toes blue
  'paw-print': ({ path, ellipse }) => [
    ['c1', path('M12 12.5 C14.5 12.5 15.75 14.5 17.5 16.5 C18.75 18 18 20.5 15.5 20.5 C14 20.5 13.25 19.5 12 19.5 C10.75 19.5 10 20.5 8.5 20.5 C6 20.5 5.25 18 6.5 16.5 C8.25 14.5 9.5 12.5 12 12.5 Z')],
    ['ink', ellipse(8.5, 5.5, 2, 2.5), ellipse(15.5, 5.5, 2, 2.5)],
    ['c3', ellipse(4, 11, 2, 2.5), ellipse(20, 11, 2, 2.5)],
  ],
  // a fountain-pen nib: a drop split along its slit (blue | red), cream breather hole
  // and slit, an ink cap bar across its shoulder
  'pen-tool': ({ drop, split, rot, pill, circle, seg2 }) => [
    ...split(drop(12.5, 11.5, 5.75, 3.25, 20.75, 1), 'c3', 'c1', 3.25, 20.75, -45),
    ['cut', rot(pill(11.75, 4.25, 22.75, 9.25), 45, 17.25, 6.75)],
    ['ink', rot(pill(12.75, 5.25, 21.75, 8.25), 45, 17.25, 6.75)],
    ['tint', seg2(4.75, 19.25, 9.25, 14.75, 1.25), circle(10.25, 13.75, 1.75)],
  ],
  // yellow body sharpened to a cone, ink lead, blue ferrule, red eraser
  pencil: ({ rot, rr, rect, poly, clip }) => {
    const r = s => rot(s, 45, 12, 12)
    const body = poly([[9.25, 5], [14.75, 5], [14.75, 16], [12, 22.25], [9.25, 16]], [0, 0, 0, 1, 0])
    return [
      ['c2', r(body)],
      ['ink', r(clip(body, rect(0, 19.25, 24, 24)))],
      ['c3', r(rect(9.25, 3.25, 14.75, 5))],
      ['c1', r(rr(9.25, -0.75, 14.75, 3.25, [2.75, 2.75, 0, 0]))],
    ]
  },
  percent: ({ seg2, circle }) => [['ink', seg2(18.5, 5.5, 5.5, 18.5, 2.75)], ['c1', circle(7, 7, 3.25)], ['c3', circle(17, 17, 3.25)]],
  // red head, blue torso and leading leg, ink trailing leg and arms; one bar weight
  'person-running': ({ circle, bar, seg2 }) => [
    ['c1', circle(15.25, 4.5, 2.5)],
    ['ink', bar([[11, 14.25], [8.5, 18], [4.5, 18.5]], 2.5), bar([[13.25, 9], [9.75, 9.5], [7.5, 12.25]], 2.25)],
    ['c3', seg2(13.5, 8.75, 11, 14.25, 3), bar([[11, 14.25], [14.75, 16.75], [13.25, 21]], 2.5)],
    ['ink', bar([[13.25, 9], [15.75, 12.25], [18.75, 11]], 2.25)],
  ],
  phone: p => phone(p),
  // sound waves: a yellow inner arc and an ink outer arc
  'phone-call': p => [...phone(p), ['c2', p.arc(13, 11, 4.25, 270, 360, 2.25)], ['ink', p.arc(13, 11, 8.25, 270, 360, 2.25)]],
  // the arrow family: ink shaft sunk into a red swept head
  'phone-incoming': p => [...phone(p), ...arw(p, 20.75, 3.25, 13.25, 10.75)],
  'phone-outgoing': p => [...phone(p), ...arw(p, 13.75, 10.25, 21, 3)],
  // the missed-call zig-zag: ink bounce, red head at its start pointing back
  'phone-missed': p => [...phone(p), ['ink', p.bar([[14.5, 4.5], [17.75, 7.75], [21.25, 4.25]], 2.25)], ['c1', p.head(12.5, 2.5, 225, 5.25, 4.25, 1.5, { notch: 0, rb: 1.2 })]],
  // the handset stays one form: the slash's gap leaves two whole pieces whose cut ends
  // are rounded off like caps, never sharp shards
  'phone-off': p => {
    const body = p.soften(p.cut(p.path(PHONE), p.seg2(20.75, 3.25, 3.25, 20.75, 5)), 1.4, { tmax: 2.2 })
    return [['c3', body], ['c1', p.clip(body, p.circle(4.25, 4.25, 5.5)), p.clip(body, p.circle(19.75, 19.75, 5.5))], ['ink', p.seg2(20.75, 3.25, 3.25, 20.75, 2.5)]]
  },
  // blue screen, yellow corner quarter, the red inset floating on a moat
  // the red inset sits whole inside the screen, an even blue margin around it
  'picture-in-picture': ({ rr, cornerQuarter }) => {
    const f = rr(2, 4, 22, 20, 3)
    return [['c3', f], ['c2', cornerQuarter(f, 2, 4, 7.5, 'se')], ['c1', rr(11, 10.5, 19.5, 17.5, 2)]]
  },
  // red pig in 3/4 view: ink legs, eye and nostrils, a perky red ear, a yellow oval snout, cream coin slot,
  // a yellow coin dropping in
  'piggy-bank': ({ ellipse, pill, poly, circle }) => [
    ['ink', pill(5.75, 16, 8.25, 21.5), pill(13.75, 16, 16.25, 21.5)],
    ['c1', poly([[16.6, 10.6], [20.5, 5.7], [19.9, 11.6]], 0.6)],
    ['c1', poly([[12.75, 11], [16.5, 3.25], [18.25, 11]], 1.2), ellipse(11.75, 14, 7.75, 5.75)],
    ['c2', ellipse(19.75, 13.5, 2, 2.75), circle(10, 3.75, 1.85)],
    ['tint', pill(8.25, 10, 11.75, 11.5)],
    ['ink', circle(15.75, 12, 1), circle(19.15, 13.1, 0.42), circle(20.35, 13.1, 0.42)],
  ],
  // red bowl, blue stem with the top bar, ink second stem standing flush under it
  // red D bowl, a blue stem carrying the top bar, an ink stem whose round top caps the bar
  pilcrow: ({ rr, rect, half, join, pill }) => [
    ['c1', join(rect(10, 3.5, 12.5, 12.5), half(10, 8, 4.5, 'w'))],
    ['c3', join(rect(12.25, 3.5, 17.75, 6), pill(12.25, 3.5, 14.75, 20.5))],
    ['ink', pill(16.5, 3.5, 19, 20.5)],
  ],
  // a capsule split across its waist, red and yellow, a cream glint on the red half
  pill: ({ rot, pill, split, seg2 }) => [
    ...split(rot(pill(2.5, 8, 21.5, 16), -45), 'c2', 'c1', 12, 12, 45),
    ['tint', rot(seg2(5.75, 10.5, 9, 10.5, 1.5), -45)],
  ],
  // pushpin: ink needle, blue dome plate, red head
  pin: ({ rot, half, circle, seg2 }) => {
    const r = s => rot(s, 45, 12, 12)
    return [['ink', r(seg2(12, 14, 12, 22.5, 1.75))], ['c3', r(half(12, 14.5, 5.75, 'n'))], ['c1', r(circle(12, 6.25, 4.25))]]
  },
  plane: p => {
    const j = jet(p), r = s => p.rot(s, 45, 12, 12)
    return [['c1', r(j.wings)], ['c3', r(j.body)]]
  },
  'plane-landing': p => {
    const j = jet(p), t = s => p.move(p.rot(p.scale(s, 0.8, 12, 12), 115, 12, 12), 0, -2.5)
    return [['c1', t(j.wings)], ['c3', t(j.body)], ['ink', p.pill(2, 20.25, 22, 22.25)]]
  },
  'plane-takeoff': p => {
    const j = jet(p), t = s => p.move(p.rot(p.scale(s, 0.8, 12, 12), 65, 12, 12), 0, -2.5)
    return [['c1', t(j.wings)], ['c3', t(j.body)], ['ink', p.pill(2, 20.25, 22, 22.25)]]
  },
  play: ({ poly }) => [['c1', poly([[5.5, 3.5], [20.5, 12], [5.5, 20.5]], 2.75)]],
  // ink prongs and cord, the head one U split red cap over blue cup
  plug: ({ rr, pill, half, join, seg2, halves }) => [
    ['ink', pill(7.75, 2, 10.25, 8), pill(13.75, 2, 16.25, 8), seg2(12, 16, 12, 21.75, 2.5)],
    ...halves(join(rr(4.5, 7, 19.5, 11.01, [2.5, 2.5, 0, 0]), half(12, 11, 7.5, 's')), 'c1', 'c3', 'h', 11),
  ],
  plus: p => [['c1', p.seg2(12, 4.5, 12, 19.5, 3.25)], ['c3', p.seg2(4.5, 12, 19.5, 12, 3.25)]],
  'plus-circle': p => [...p.disc('c3'), ['tint', p.glyph('plus', 12, 12, 4.5, 2.75)]],
  // two round-capped arcs (red outer, blue inner), yellow lens, ink stem
  podcast: ({ arc, circle, pill }) => [
    ['c1', arc(12, 11.5, 8.25, 135, 405, 2.5)],
    ['c3', arc(12, 11.5, 4.5, 135, 405, 2.5)],
    ['ink', pill(10.75, 14, 13.25, 21.5)],
    ['c2', circle(12, 11.5, 2)],
  ],
  'pound-sterling': ({ stroke, seg2 }) => [['ink', stroke('M17 7 C16.3 5.4 14.9 4.5 13 4.5 C10.4 4.5 8.5 6.4 8.5 9 V15.5 C8.5 17.3 7.6 18.7 6 19.5 H18', 2.75)], ['c1', seg2(5.5, 12.5, 14, 12.5, 2.5)]],
  power: ({ arc, seg2 }) => [['c3', arc(12, 12.5, 8.25, 300, 600, 2.75)], ['c1', seg2(12, 2.5, 12, 11.5, 3)]],
  // blue board on ink legs, yellow rising chart line, red pointer dot at its peak
  presentation: ({ rr, bar, seg2, circle }) => [
    ['ink', seg2(7.25, 21, 9, 15.5, 2.25), seg2(16.75, 21, 15, 15.5, 2.25)],
    ['c3', rr(2.5, 3.5, 21.5, 16, 3)],
    ['c2', bar([[6.5, 12], [10.25, 8.75], [13.5, 11], [16.5, 8.25]], 2.25)],
    ['c1', circle(17.25, 7.5, 1.75)],
  ],
  // red paper in, blue body, yellow sheet out behind a moat, ink print lines, cream lamp
  printer: ({ rr, circle, seg2 }) => [
    ['c1', rr(6.5, 2.5, 17.5, 9, 1.75)],
    ['c3', rr(2.5, 8, 21.5, 17.5, 3)],
    ['c2', rr(6.5, 13, 17.5, 21.5, 2)],
    ['tint', circle(18.25, 10.75, 1.1)],
    ['ink', seg2(9, 16.5, 15, 16.5, 1.75), seg2(9, 19, 13, 19, 1.75)],
  ],
  'puzzle-piece': ({ rr, circle, cut, join }) => [
    ['c3', cut(join(rr(3, 7, 17, 21, 2.75), circle(10, 6.25, 2.75), circle(17.75, 14, 2.75)), circle(3, 14, 2.25), circle(10, 21, 2.25))],
    ['c2', circle(10, 6.25, 2.75)],
    ['c1', circle(17.75, 14, 2.75)],
  ],
  // three soft ink finder rings, each holding a primary eye; the data as round dots
  'qr-code': ({ rr, cut, circle }) => {
    const finder = (x, y) => cut(rr(x, y, x + 7, y + 7, 2.25), rr(x + 2, y + 2, x + 5, y + 5, 1))
    return [
      ['ink', finder(3, 3), finder(14, 3), finder(3, 14)],
      ['c1', rr(5.25, 5.25, 7.75, 7.75, 0.9), circle(15.25, 15.25, 1.4)],
      ['c3', rr(16.25, 5.25, 18.75, 7.75, 0.9), circle(19.75, 19.75, 1.4)],
      ['c2', rr(5.25, 16.25, 7.75, 18.75, 0.9)],
      ['ink', circle(19.75, 15.25, 1.4), circle(15.25, 19.75, 1.4)],
    ]
  },
  quote: ({ circle, stroke }) => [
    ['c1', circle(6.75, 9, 3.75), stroke('M9.1 9 C9.1 13.5 7.75 16.25 4.5 18', 2.75)],
    ['c3', circle(17, 9, 3.75), stroke('M19.35 9 C19.35 13.5 18 16.25 14.75 18', 2.75)],
  ],
  // red lens ears, yellow head, ink eyes, red nose
  rabbit: ({ lens, circle, ellipse, poly }) => [
    ['c1', lens(8.5, 11.5, 7, 2.5, 2), lens(17, 2.5, 15.5, 11.5, 2)],
    ['c2', ellipse(12, 15.5, 6.5, 5.5)],
    ['ink', circle(9.75, 15, 1.2), circle(14.25, 15, 1.2)],
    ['c1', poly([[10.75, 17.25], [13.25, 17.25], [12, 18.75]], 0.9)],
  ],
  // red set on an ink antenna, yellow speaker with an ink hub, cream dial bars
  radio: ({ rr, seg2, circle, pill }) => [
    ['ink', seg2(7, 8.5, 17.5, 3.75, 2.25)],
    ['c1', rr(2, 8, 22, 20.5, 3)],
    ['c2', circle(8, 14.25, 3.25)],
    ['ink', circle(8, 14.25, 1.25)],
    ['tint', pill(13.5, 11.5, 18.75, 13.25), pill(13.5, 15.25, 18.75, 17)],
  ],
}
