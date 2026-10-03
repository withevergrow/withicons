// PASTEL redraw chunk 4 of 5 — hand-composed Pastel icons for the names assigned to chunk 4.
// Each entry: 'icon-name': (icon, p) => layers. See forge/styles/PASTEL-GUIDE.md (API, kit, rules).
// Exemplars in _pastel-render.mjs win over entries here. Only this chunk's owner edits this file.

// ---- local helpers ---------------------------------------------------------------
// app window with a docked panel: sky window body, lavender panel clipped to one side
const win = p => p.rr(2.5, 3.5, 21.5, 20.5, 3.25)
const panel = (p, side, at) => {
  const r = { l: [0, 0, at, 24], r: [at, 0, 24, 24], b: [0, at, 24, 24], t: [0, 0, 24, at] }[side]
  return p.clip(win(p), p.rect(...r))
}
// the panel family as a frame: inner wells, P.r = the content well, P.p = the docked panel well
const P = {
  r: (p, s) => ({ b: p.rr(4.6, 5.6, 19.4, 13.1, 1.5), r: p.rr(4.6, 5.6, 13.6, 18.4, 1.5), l: p.rr(10.4, 5.6, 19.4, 18.4, 1.5) })[s],
  p: (p, s) => ({ b: p.rr(4.6, 14.9, 19.4, 18.4, 1.5), r: p.rr(15.4, 5.6, 19.4, 18.4, 1.5), l: p.rr(4.6, 5.6, 8.6, 18.4, 1.5) })[s],
}
// a phone handset (upright, earpiece top-left, mouthpiece bottom-right) as one soft shape
const handset = (p, k = 1, dx = 0, dy = 0) => p.move(p.scale(p.path(
  'M5.2 2.6 C6.1 2.1 7.2 2.3 7.8 3.1 L9.9 6.2 C10.5 7.1 10.3 8.3 9.5 9 L8.4 9.9 C9.3 12.1 11.6 14.5 14 15.6 L14.9 14.5 C15.6 13.7 16.8 13.5 17.7 14.1 L20.8 16.2 C21.6 16.8 21.8 17.9 21.3 18.8 L20.4 20.2 C19.5 21.5 17.9 22 16.4 21.5 C10.4 19.6 4.4 13.6 2.5 7.6 C2 6.1 2.5 4.5 3.8 3.6 Z'), k, 2, 2), dx, dy)
// rounded box outline (a frame) as one band
const frame = (p, x0, y0, x1, y1, r, w) => p.cut(p.rr(x0, y0, x1, y1, r), p.rr(x0 + w, y0 + w, x1 - w, y1 - w, Math.max(0.5, r - w)))
// shield silhouette
const shieldD = 'M12 2.25 C14.6 3.6 17.4 4.4 20 4.6 C20.4 4.65 20.75 5 20.75 5.4 V11 C20.75 16.1 17.1 19.8 12.6 21.6 C12.2 21.75 11.8 21.75 11.4 21.6 C6.9 19.8 3.25 16.1 3.25 11 V5.4 C3.25 5 3.6 4.65 4 4.6 C6.6 4.4 9.4 3.6 12 2.25 Z'
const shield = p => p.path(shieldD)
// the house phone handset (the skeleton's own outline), fattened to a soft field
const HSD = 'M3 5 A2 2 0 0 1 5 3 H8 A1.5 1.5 0 0 1 9.5 4.5 V6 C9.5 7.25 8.5 7.25 8.5 8.5 A7 7 0 0 0 15.5 15.5 C16.75 15.5 16.75 14.5 18 14.5 H19.5 A1.5 1.5 0 0 1 21 16 V19 A2 2 0 0 1 19 21 A16 16 0 0 1 3 5 Z'
const hs = p => p.unite(p.path(HSD), p.stroke(HSD, 2))
// a plane drawn nose-up on the centre line, then turned deg, scaled k and moved
const plane = (p, deg, k, dx, dy) => {
  const T = s => p.move(p.scale(p.rot(s, deg, 12, 12), k, 12, 12), dx, dy)
  const body = p.path('M12 0.75 C14 0.75 14.6 3 14.6 5 V16.5 L13.6 21.25 C13.3 22.75 10.7 22.75 10.4 21.25 L9.4 16.5 V5 C9.4 3 10 0.75 12 0.75 Z')
  const wing = p.poly([[12, 5.75], [22.5, 13], [22.5, 15.75], [12, 13.75], [1.5, 15.75], [1.5, 13]], [0.6, 1.4, 1.1, 0.6, 1.1, 1.4])
  const tail = p.poly([[12, 15.75], [17.5, 19.6], [17.5, 21.75], [12, 20.6], [6.5, 21.75], [6.5, 19.6]], [0.6, 1, 0.8, 0.6, 0.8, 1])
  return [
    ['sky@K', T(body)],
    ['lavender@A', T(p.cut(p.join(wing, tail), body))],
    ['paper.flat', T(p.pill(10.9, 2.9, 13.1, 6.6))],
  ]
}

export const R = {
  // butter notepad, lavender spiral rings (A), ink text lines
  'notepad-text': (icon, p) => [
    ['butter@K', p.rr(4.25, 4.25, 19.75, 21.75, 3)],
    ['ink', p.lines(8, [16, 16, 13], [11, 14.5, 18])],
    ['lavender.flat@A', p.pill(6.9, 2, 9.1, 7.25), p.pill(10.9, 2, 13.1, 7.25), p.pill(14.9, 2, 17.1, 7.25)],
  ],
  // peach cube, butter lid face, lavender tape across the lid, ink seam
  package: (icon, p) => [
    ['peach', p.poly([[3.25, 7], [12, 2.4], [20.75, 7], [20.75, 16.9], [12, 21.6], [3.25, 16.9]], [2, 2, 2, 2, 2, 2])],
    ['butter', p.poly([[3.6, 7.1], [12, 2.75], [20.4, 7.1], [12, 11.7]], [1.6, 1.6, 1.6, 1.2])],
    ['lavender.flat@A', p.poly([[6.9, 5.1], [9.1, 3.95], [17.3, 8.4], [15.1, 9.55]], 0.9)],
    ['ink', p.seg2(12, 13.75, 12, 19.5, 1.6)],
  ],
  // peach open box: butter flaps (A) folded outwards behind, the dark inside as a well
  'package-open': (icon, p) => {
    const body = p.poly([[3.25, 9.6], [12, 5.4], [20.75, 9.6], [20.75, 17], [12, 21.6], [3.25, 17]], [2, 1.5, 2, 2, 2, 2])
    return [
      ['peach@K', body],
      ['butter@A', p.cut(p.join(p.poly([[3.5, 9.75], [12, 5.75], [9.25, 2], [1.5, 5.75]], [1.4, 1, 1.4, 1.4]), p.poly([[20.5, 9.75], [12, 5.75], [14.75, 2], [22.5, 5.75]], [1.4, 1, 1.4, 1.4])), body)],
      ['peach.well', p.poly([[5.25, 9.6], [12, 6.5], [18.75, 9.6], [12, 12.9]], [1.3, 1.3, 1.3, 1.3])],
      ['ink', p.seg2(12, 15.25, 12, 19.5, 1.6)],
    ]
  },
  // drawn upright (bristles down), turned 45deg: lavender handle, butter ferrule, blush bristles
  paintbrush: (icon, p) => {
    const R = s => p.scale(p.rot(s, 45, 12, 12), 1.08, 12, 12)
    return [
      ['lavender@K', R(p.seg2(12, 0.75, 12, 9.75, 2.75))],
      ['blush@A', R(p.path('M8.6 13.25 H15.4 V15.25 C15.4 18.4 13.6 20.9 12 22.75 C10.4 20.9 8.6 18.4 8.6 15.25 Z'))],
      ['butter', R(p.rr(8.75, 9.25, 15.25, 13.75, 1.25))],
      ['ink', R(p.seg2(10.75, 11.5, 13.25, 11.5, 1.2))],
    ]
  },
  // peach palette with a thumb hole and a bite, three paint dabs
  palette: (icon, p) => [
    ['peach', p.cut(p.unite(p.circle(11.5, 11.75, 9.6), p.ellipse(13.5, 13.5, 8, 7.5)), p.circle(19, 18.25, 3.4))],
    ['cut', p.circle(9.75, 17, 1.75)],
    ['blush.flat', p.circle(7.6, 10.25, 2)],
    ['sky.flat', p.circle(11.5, 6.6, 2)],
    ['mint.flat', p.circle(16, 9, 2)],
  ],
  // butter island, peach trunk, mint fronds
  'palm-tree': (icon, p) => [
    ['peach@K', p.stroke('M12.4 9 C12.9 12.5 13.1 15.8 11.6 19.5', 2.75)],
    ['butter', p.ehalf(12.5, 21.75, 8.5, 3.6, 'n')],
    ['mint@A', p.stroke('M12.25 8.5 C9 6 5 6.5 2.75 10.25', 3), p.stroke('M12.25 8.5 C15.5 6 19.5 6.5 21.75 10.25', 3),
      p.stroke('M12 8.25 C10.5 4.75 7.5 3 4.5 3.5', 2.75), p.stroke('M12.5 8.25 C14 4.75 17 3 20 3.5', 2.75)],
  ],
  'panel-bottom': (icon, p) => [['lavender@K', win(p)], ['sky.well', P.r(p, 'b')], ['lavender.well@A', P.p(p, 'b')]],
  'panel-right': (icon, p) => [['lavender@K', win(p)], ['sky.well', P.r(p, 'r')], ['lavender.well@A', P.p(p, 'r')]],
  'panel-left-close': (icon, p) => [
    ['lavender@K', win(p)], ['sky.well', P.r(p, 'l')], ['lavender.well@A', P.p(p, 'l')],
    ['ink@A', p.chevron(15.25, 12, 180, 3.25, 1.9)],
  ],
  'panel-left-open': (icon, p) => [
    ['lavender@K', win(p)], ['sky.well', P.r(p, 'l')], ['lavender.well@A', P.p(p, 'l')],
    ['ink@A', p.chevron(14.25, 12, 0, 3.25, 1.9)],
  ],
  // sky sign with an ink P
  parking: (icon, p) => [
    ['sky', p.rr(3, 3, 21, 21, 3.5)],
    ['ink', p.stroke('M9.6 17.25 V7.25 H13 A3.15 3.15 0 0 1 13 13.55 H9.6', 2.5)],
  ],
  // butter cone with a peach mouth and ink stripes, confetti bursting (A)
  'party-popper': (icon, p) => [
    ['butter@K', p.poly([[2.75, 21.25], [7.25, 9.25], [14.75, 16.75]], [1.4, 1.6, 1.6])],
    ['ink', p.clip(p.join(p.seg2(4.6, 12.6, 11.4, 19.4, 1.5), p.seg2(5.9, 9, 15, 18.1, 1.5)), p.poly([[2.75, 21.25], [7.25, 9.25], [14.75, 16.75]], 1))],
    ['butter.flat', p.rot(p.ellipse(11, 13, 5.6, 1.9), 45, 11, 13)],
    ['blush.flat@A', p.stroke('M13 9.5 C13.5 6.5 15.75 6.25 15.5 3.25', 1.9), p.stroke('M9.25 7.25 C8.5 5.5 10 4.25 9 2.25', 1.9)],
    ['mint.flat@A', p.stroke('M14.75 11.25 C17 9.5 18.75 11.75 21.25 10', 1.9)],
  ],
  // blush booklet, butter globe with ink meridians, ink name line
  passport: (icon, p) => [
    ['blush', p.rr(4.5, 2.25, 19.5, 21.75, 2.75)],
    ['butter', p.circle(12, 10, 4.1)],
    ['ink', p.seg2(8.4, 10, 15.6, 10, 1.2), p.stroke('M12 6.1 C9.9 8 9.9 12 12 13.9 C14.1 12 14.1 8 12 6.1 Z', 1.2)],
    ['ink', p.seg2(9, 17.5, 15, 17.5, 1.6)],
  ],
  // handset with a blush bounce-back arrow
  'phone-missed': (icon, p) => [
    ['sky', hs(p)],
    ['cut', p.bar([[13.5, 7.5], [13.5, 3.5], [17.5, 3.5]], 2.2 + 2.4), p.bar([[13.5, 3.5], [17.5, 7.5], [21.5, 3.5]], 2.2 + 2.4)],
    ['blush.flat@S', p.bar([[13.5, 7.5], [13.5, 3.5], [17.5, 3.5]], 2.2), p.bar([[13.5, 3.5], [17.5, 7.5], [21.5, 3.5]], 2.2)],
  ],
  // handset with a blush slash and its moat
  'phone-off': (icon, p) => [
    ['sky', hs(p)],
    ...p.slashLayers('blush', [20.75, 3.25], [3.25, 20.75], 2.6),
  ],
  // lavender clipboard with a butter clip (A), a peach sheet laid on top
  paste: (icon, p) => [
    ['lavender', p.rr(3, 4.25, 17, 18.75, 2.75)],
    ['cut', p.rr(8.6, 8.1, 22.9, 23.4, 3.6)],
    ['butter@A', p.rr(7, 2, 13, 6.75, 1.5)],
    ['peach', p.rr(10.25, 9.75, 21.25, 21.75, 2.75)],
    ['ink', p.lines(13.25, [18.25, 16.25], [14, 17.5])],
  ],
  // drawn upright, turned 45deg: butter barrel, blush eraser, lavender ferrule, peach wood tip, ink lead
  pencil: (icon, p) => {
    const R = s => p.scale(p.rot(s, 45, 12, 12), 1.1, 12, 12)
    return [
      ['butter@K', R(p.rr(9, 5, 15, 16.25, [0, 0, 0, 0]))],
      ['paper', R(p.poly([[9, 16], [15, 16], [12, 22.25]], [0.9, 0.9, 1]))],
      ['ink', R(p.poly([[10.85, 19.9], [13.15, 19.9], [12, 22.25]], [0.9, 0.9, 0.9]))],
      ['blush@A', R(p.rr(9, 0.75, 15, 4.25, [2.5, 2.5, 0, 0]))],
      ['lavender.flat', R(p.rr(8.75, 3.75, 15.25, 6, 0.9))],
      ['ink', R(p.seg2(12, 8, 12, 14.25, 1.2))],
    ]
  },
  // blush pig with a peach snout, ink eye and slot, a butter coin dropping in (A)
  'piggy-bank': (icon, p) => [
    ['blush', p.unite(p.ellipse(10.75, 13.5, 8, 6.25), p.poly([[12.5, 8.4], [15.4, 4.1], [17.25, 9.4]], [1, 1, 1]),
      p.rr(5.5, 16.5, 8.5, 21.75, 1.4), p.rr(12.75, 16.5, 15.75, 21.75, 1.4))],
    ['peach.flat', p.rr(17.25, 10.75, 21.75, 16, 2)],
    ['ink', p.circle(14.75, 11.5, 1.05), p.seg2(7.75, 9.9, 11.25, 9.9, 1.6), p.circle(19.6, 13.4, 0.75)],
    ['butter@A', p.circle(9.5, 4.25, 2.6)],
  ],
  // butter cheese slice, peach crust (A), blush pepperoni
  pizza: (icon, p) => [
    ['butter', p.path('M3 21 L9 3 A13.5 13.5 0 0 1 21 15 Z')],
    ['peach@A', p.stroke('M8.6 3.4 A13.2 13.2 0 0 1 20.6 15.4', 3.6)],
    ['blush.flat', p.circle(10.75, 10.25, 1.8), p.circle(13, 15.6, 1.65), p.circle(7.6, 16.6, 1.4)],
  ],
  // mint disc with an ink plus
  'plus-circle': (icon, p) => [
    ['mint', p.circle(12, 12, 9.75)],
    ['ink', p.glyph('plus', 12, 12, 4.25, 2.1)],
  ],
  // lavender power ring, mint switch bar (A)
  power: (icon, p) => [
    ['lavender', p.arc(12, 12.75, 8.25, -52, 232, 3)],
    ['mint@A', p.seg2(12, 2.75, 12, 11, 3)],
  ],
  // lavender body, butter paper tray (A) behind, ink slot, a paper print coming out (A)
  printer: (icon, p) => [
    ['lavender@K', p.rr(2.25, 7.75, 21.75, 17.75, 3)],
    ['butter@A', p.cut(p.rr(6.5, 2.25, 17.5, 10, 1.6), p.rr(2.25, 7.75, 21.75, 17.75, 3))],
    ['mint.flat', p.circle(18.25, 10.9, 1.05)],
    ['lavender.well', p.rr(5.75, 13, 18.25, 15.25, 1.1)],
    ['paper@A', p.rr(7, 14, 17, 21.75, [0.6, 0.6, 1.6, 1.6])],
    ['ink@A', p.lines(9.5, [14.5, 12.75], [17.25, 19.5], 1.35)],
  ],
  // blush, butter and mint bands under two little sky clouds
  rainbow: (icon, p) => [
    ['blush', p.band(12, 18.25, 10, 7.4, 180, 360)],
    ['butter', p.band(12, 18.25, 7.4, 4.9, 180, 360)],
    ['mint', p.band(12, 18.25, 4.9, 2.6, 180, 360)],
    ['sky@A', p.cloud(4.25, 18.25, 0.4), p.cloud(19.75, 18.25, 0.4)],
  ],
  // sky fridge: two doors split by a gap, ink handles, a butter magnet
  refrigerator: (icon, p) => [
    ['sky', p.rr(5, 2.25, 19, 8.85, [3, 3, 1, 1]), p.rr(5, 10.15, 19, 21.75, [1, 1, 3, 3])],
    ['ink@A', p.seg2(8.5, 5, 8.5, 7, 1.7), p.seg2(8.5, 12.5, 8.5, 16.25, 1.7)],
    ['butter.flat', p.circle(15, 14, 1.4)],
  ],
  // peach rabbit with blush inner ears, ink eyes and nose
  rabbit: (icon, p) => [
    ['peach', p.path('M8.5 11.5 C5.25 13.75 5.25 18 7.5 19.75 C8.75 20.75 10.25 21 12 21 C13.75 21 15.25 20.75 16.5 19.75 C18.75 18 18.75 13.75 15.5 11.5 C17.75 8 18.25 4.5 17.5 3 C16.25 1.25 13.25 4.5 12.5 10 C12.25 10 11.75 10 11.5 10 C10.75 4.5 7.75 1.25 6.5 3 C5.75 4.5 6.25 8 8.5 11.5 Z')],
    ['blush.flat@A', p.rot(p.ellipse(8.6, 6.4, 0.95, 2.9), -16, 8.6, 6.4), p.rot(p.ellipse(15.4, 6.4, 0.95, 2.9), 16, 15.4, 6.4)],
    ['ink', p.circle(9.75, 15, 1.05), p.circle(14.25, 15, 1.05)],
    ['blush.flat', p.poly([[10.9, 17.2], [13.1, 17.2], [12, 18.6]], 0.9)],
  ],
  // mint leaves and a blush tomato peeking over a peach bowl
  salad: (icon, p) => {
    const bowl = p.path('M2.25 11.75 H21.75 A9.75 9.25 0 0 1 2.25 11.75 Z')
    return [
      ['peach@K', bowl],
      ['mint@A', p.cut(p.join(p.lens(3.75, 2.25, 12.25, 12.25, 3.4), p.lens(21, 4.25, 10.75, 12.25, 2.6)), bowl)],
      ['blush@A', p.cut(p.circle(17.25, 8.75, 2.75), bowl)],
    ]
  },
  // lavender floppy, sky shutter (A), paper label with ink lines
  save: (icon, p) => [
    ['lavender', p.poly([[3, 3], [16, 3], [21, 8], [21, 21], [3, 21]], [2.75, 1.5, 2.75, 2.75, 2.75])],
    ['sky@A', p.rr(7.25, 2.4, 15.25, 8.5, [0.5, 0.5, 1.6, 1.6])],
    ['ink@A', p.rr(12, 3.75, 13.6, 7, 0.6)],
    ['paper', p.rr(6.25, 12.75, 17.75, 21.5, [1.6, 1.6, 0.5, 0.5])],
    ['ink', p.lines(8.75, 15.25, [15.75, 18.5], 1.35)],
  ],
  // lavender post and beam, butter pans (A) on soft cords
  scale: (icon, p) => [
    ['lavender', p.seg2(12, 4.5, 12, 19.5, 2.5), p.pill(6.75, 19.25, 17.25, 22), p.seg2(4.25, 6.5, 19.75, 6.5, 2.5)],
    ['lavender.flat@A', p.bar([[2.6, 13.5], [5, 6.75], [7.4, 13.5]], 1.3), p.bar([[16.6, 13.5], [19, 6.75], [21.4, 13.5]], 1.3)],
    ['butter@A', p.segment(5, 12.75, 4, 0, 180), p.segment(19, 12.75, 4, 0, 180)],
    ['butter.flat', p.circle(12, 4.25, 1.9)],
  ],
  // lavender scan corners round a peach face disc with ink features
  'scan-face': (icon, p) => [
    ['lavender@K', p.bar([[3, 7.5], [3, 3], [7.5, 3]], 2.6), p.bar([[16.5, 3], [21, 3], [21, 7.5]], 2.6),
      p.bar([[21, 16.5], [21, 21], [16.5, 21]], 2.6), p.bar([[7.5, 21], [3, 21], [3, 16.5]], 2.6)],
    ['lavender.flat@A', p.circle(9.4, 9.9, 1.5), p.circle(14.6, 9.9, 1.5), p.arc(12, 12.25, 3.5, 25, 155, 2)],
  ],
  // peach school: wings and a tower, lavender gable roof, butter door well, sky windows, blush flag (A)
  school: (icon, p) => [
    ['peach@K', p.rr(2.25, 13, 21.75, 21.75, [2.25, 2.25, 2, 2]), p.rr(6.5, 10.5, 17.5, 21.75, [0, 0, 2, 2])],
    ['lavender', p.poly([[4.25, 12.75], [12, 6.25], [19.75, 12.75]], [1.3, 1.6, 1.3])],
    ['peach.well@A', p.arch(9.75, 15, 14.25, 21.85)],
    ['ink', p.rr(3.9, 15.5, 5.6, 18.25, 0.7), p.rr(18.4, 15.5, 20.1, 18.25, 0.7), p.circle(12, 10.6, 1.1)],
    ['lavender.flat', p.seg2(12, 7, 12, 1.75, 1.6)],
    ['blush.flat@A', p.poly([[12.6, 1.25], [18.5, 3.6], [12.6, 5.9]], [0.9, 1.1, 0.9])],
  ],
  // lavender blades, blush finger rings (the lower blade and ring move), butter pivot
  scissors: (icon, p) => [
    ['lavender@K', p.lens(7.25, 17.75, 17, 1.5, 2.1)],
    ['blush', p.ring(6.75, 18.6, 3.4, 1.55)],
    ['lavender@A', p.lens(16.75, 17.75, 7, 1.5, 2.1)],
    ['blush@A', p.ring(17.25, 18.6, 3.4, 1.55)],
    ['butter.flat', p.circle(12, 9.65, 1.5)],
  ],
  // butter parchment between two peach rolls, ink text
  'scroll-text': (icon, p) => [
    ['butter', p.rr(5.5, 4.75, 18.5, 19.25, 0.6)],
    ['ink', p.lines(8.75, [15.25, 12.75], [10.5, 14])],
    ['peach@A', p.pill(2.75, 2.5, 21.25, 6.75)],
    ['peach', p.pill(2.75, 17.25, 21.25, 21.5)],
  ],
  // lavender hull, butter cabin with ink portholes, blush funnel (A), sky waves (A)
  ship: (icon, p) => [
    ['sky@K', p.poly([[2, 11.75], [22, 11.75], [19.1, 17.5], [4.9, 17.5]], [1.1, 1.1, 2.2, 2.2])],
    ['lavender@A', p.rr(10, 2.5, 14, 8, [1.4, 1.4, 0, 0])],
    ['butter', p.rr(6.25, 7, 17.75, 12.25, [1.75, 1.75, 0.5, 0.5])],
    ['ink', p.circle(9.25, 9.6, 0.95), p.circle(12, 9.6, 0.95), p.circle(14.75, 9.6, 0.95)],
    ['lavender.flat@A', p.stroke('M2.5 20.5 Q4.25 19 6 20.5 T9.5 20.5 T13 20.5 T16.5 20.5 T20 20.5 T21.75 20.25', 1.9)],
  ],
  // lavender shield with a peach person on it
  'shield-user': (icon, p) => {
    const D = 'M12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.5 L12 2.5 L19.5 5.5 V12 C19.5 16.5 16.5 19.8 12 21.5 Z'
    const sh = p.unite(p.path(D), p.stroke(D, 1.75)), u = p.person(12, 4.25, 0.72)
    return [
      ['lavender', sh],
      ['peach@A', u.head, p.clip(u.body, p.path('M12 19.9 C8.4 18.5 6 15.6 6 12 V4 H18 V12 C18 15.6 15.6 18.5 12 19.9 Z'))],
    ]
  },
  'sidebar': (icon, p) => [
    ['lavender@K', win(p)], ['sky.well', P.r(p, 'l')], ['lavender.well@A', P.p(p, 'l')],
    ['ink@A', p.lines(5.9, 7.1, [8.75, 11.5, 14.25], 1.35)],
  ],
  // four rising lavender bars
  signal: (icon, p) => [
    ['lavender', p.rr(2.75, 15, 6.25, 20.75, 1.4), p.rr(7.75, 11, 11.25, 20.75, 1.4), p.rr(12.75, 7, 16.25, 20.75, 1.4), p.rr(17.75, 3, 21.25, 20.75, 1.4)],
  ],
  // peach post, butter sign pointing right, mint sign pointing left (A)
  signpost: (icon, p) => [
    ['peach', p.seg2(12, 4, 12, 20.5, 2.6), p.pill(8, 19.75, 16, 22.25)],
    ['butter', p.poly([[4.25, 2.5], [17.25, 2.5], [20.5, 5.75], [17.25, 9], [4.25, 9]], [1.6, 1, 1.2, 1, 1.6])],
    ['mint@A', p.poly([[19.75, 11.25], [6.75, 11.25], [3.5, 14.5], [6.75, 17.75], [19.75, 17.75]], [1.6, 1, 1.2, 1, 1.6])],
    ['ink', p.seg2(7.5, 5.75, 14, 5.75, 1.35)],
    ['ink@A', p.seg2(10, 14.5, 16.5, 14.5, 1.35)],
  ],
  // blush dome on a lavender base, a shine on the glass, butter light rays (S)
  siren: (icon, p) => [
    ['lavender', p.rr(3.5, 17, 20.5, 21.75, 1.9)],
    ['blush', p.path('M5.75 17.5 V13 A6.25 6.25 0 0 1 18.25 13 V17.5 Z')],
    ['shine', p.arc(12, 13, 3.4, 195, 255, 1.3)],
    ['butter.flat@S', p.seg2(12, 1.5, 12, 3.75, 2.2), p.seg2(3.5, 4.5, 5.1, 6.1, 2.2), p.seg2(20.5, 4.5, 18.9, 6.1, 2.2)],
  ],
  // the media transport family: lavender glyphs, a sky bar for skips
  play: (icon, p) => [
    ['lavender', p.poly([[4.5, 2.5], [21.5, 12], [4.5, 21.5]], [2.5, 2.5, 2.5])],
  ],
  pause: (icon, p) => [
    ['lavender', p.rr(4.75, 3.25, 10.25, 20.75, 2.25), p.rr(13.75, 3.25, 19.25, 20.75, 2.25)],
  ],
  'skip-back': (icon, p) => [
    ['lavender', p.poly([[21.25, 3.25], [6.75, 12], [21.25, 20.75]], [2.3, 2.3, 2.3])],
    ['lavender@A', p.seg2(4, 4.5, 4, 19.5, 3.5)],
  ],
  'skip-forward': (icon, p) => [
    ['lavender', p.poly([[2.75, 3.25], [17.25, 12], [2.75, 20.75]], [2.3, 2.3, 2.3])],
    ['lavender@A', p.seg2(20, 4.5, 20, 19.5, 3.5)],
  ],
  // lavender tracks, peach knobs (A)
  sliders: (icon, p) => [
    ['lavender.flat', p.seg2(3, 6, 21, 6, 2.2), p.seg2(3, 12, 21, 12, 2.2), p.seg2(3, 18, 21, 18, 2.2)],
    ['peach@A', p.pill(14, 2.75, 18, 9.25), p.pill(6, 8.75, 10, 15.25), p.pill(11, 14.75, 15, 21.25)],
  ],
  // planes: drawn nose-up (top view), then turned. sky fuselage, lavender swept wings and tail, paper cockpit
  plane: (icon, p) => plane(p, 45, 1.02, 0, 0),
  'plane-takeoff': (icon, p) => [...plane(p, 65, 0.8, 0.75, -2.5), ['lavender.flat', p.seg2(3, 21, 21, 21, 2.25)]],
  'plane-landing': (icon, p) => [...plane(p, 115, 0.8, -0.25, -2.75), ['lavender.flat', p.seg2(3, 19.75, 21, 21.25, 2.25)]],
  // lavender piece: square body, round tabs on top and right, a notch on the left
  'puzzle-piece': (icon, p) => [
    ['lavender@K', p.cut(p.unite(p.rr(3.25, 7.25, 17.25, 21.25, 2.75), p.circle(10.25, 5.25, 2.9), p.circle(19.25, 14.25, 2.9)), p.circle(3.25, 14.25, 2.4))],
  ],
  // one lavender arc with a big head (0deg east, clockwise)
  'rotate-cw': (icon, p) => [['lavender@K', p.arcArrow(12, 12.75, 8, 25, 308, { w: 3, head: 5.5 })]],
  'rotate-ccw': (icon, p) => [['lavender@K', p.flipX(p.arcArrow(12, 12.75, 8, 25, 308, { w: 3, head: 5.5 }))]],
  // peach pad, four lavender toe beans (A)
  'paw-print': (icon, p) => [
    ['peach@K', p.path('M12 11.5 C14.6 11.5 16.1 13.6 17.4 15.6 C18.6 17.4 18.9 19.1 17.9 20.3 C16.8 21.6 14.9 21.2 13.5 20.8 C12.5 20.5 11.5 20.5 10.5 20.8 C9.1 21.2 7.2 21.6 6.1 20.3 C5.1 19.1 5.4 17.4 6.6 15.6 C7.9 13.6 9.4 11.5 12 11.5 Z')],
    ['lavender@A', p.rot(p.ellipse(9.4, 5.5, 2.05, 2.6), -10, 9.4, 5.5), p.rot(p.ellipse(14.6, 5.5, 2.05, 2.6), 10, 14.6, 5.5),
      p.rot(p.ellipse(4.6, 10.75, 1.9, 2.4), -30, 4.6, 10.75), p.rot(p.ellipse(19.4, 10.75, 1.9, 2.4), 30, 19.4, 10.75)],
  ],
  // lavender shield crossed by a blush slash with its moat
  'shield-off': (icon, p) => [
    ['lavender', p.unite(p.path('M12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.5 L12 2.5 L19.5 5.5 V12 C19.5 16.5 16.5 19.8 12 21.5 Z'), p.stroke('M12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.5 L12 2.5 L19.5 5.5 V12 C19.5 16.5 16.5 19.8 12 21.5 Z', 1.75))],
    ...p.slashLayers('blush', [3.25, 3.25], [20.75, 20.75], 2.6),
  ],
}
