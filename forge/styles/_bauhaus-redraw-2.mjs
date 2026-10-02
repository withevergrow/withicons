// BAUHAUS redraws, chunk 2: a… (run 8: individually redrawn against BAUHAUS-GUIDE.md)
// Run 9 arrows: one rounded-triangle head (an isosceles triangle, every corner the same
// radius, a straight back edge square to the shaft) and a round-capped ink shaft that
// ends well inside the head, so there is no butt seam and no flat slab behind the head.
const RAD = Math.PI / 180
// head: rounded tip landing exactly on (tx, ty), pointing along deg; len = tip to back
// edge, half = half the back edge, r = the one corner radius
export function rhead(p, tx, ty, deg, len = 7.5, half = 6.25, r = 1.6) {
  const ux = Math.cos(deg * RAD), uy = Math.sin(deg * RAD), nx = -uy, ny = ux
  const a = Math.atan2(half, len), push = r / Math.sin(a) - r // vertex ahead of the round apex
  const V = [tx + ux * push, ty + uy * push], b = [tx - ux * len, ty - uy * len]
  const k = (len + push) / len // keep the flanks straight through the pushed vertex
  return p.poly([V, [b[0] + nx * half * k, b[1] + ny * half * k], [b[0] - nx * half * k, b[1] - ny * half * k]], r)
}
// straight arrow from the shaft's round tail (x0, y0) to the head's tip (x1, y1)
function rarrow(p, x0, y0, x1, y1, { len = 7.5, half = 6.25, r = 1.6, w = 2.5, shaft = 'ink', tip = 'c1' } = {}) {
  const deg = Math.atan2(y1 - y0, x1 - x0) / RAD, ux = Math.cos(deg * RAD), uy = Math.sin(deg * RAD)
  const into = len - 2.5 // the shaft's round cap stops 2.5u behind the tip, deep inside the head
  return [[shaft, p.seg2(x0, y0, x1 - ux * into, y1 - uy * into, w)], [tip, rhead(p, x1, y1, deg, len, half, r)]]
}
const AX = { len: 8, half: 5.75 }
const AD = { len: 7.5, half: 5.25 }

export const R = {
  // a split disc (blue | red) with the cream figure printed across the seam: open arms,
  // a short torso, two legs in one bent bar
  accessibility: ({ splitDisc, circle, seg2, bar }) => [
    ...splitDisc(12, 12, 9.75, 'c1', 'c3', 'v'),
    ['tint', circle(12, 6.5, 1.75), seg2(6.75, 9.75, 17.25, 9.75, 2.25), seg2(12, 9.75, 12, 13.75, 2.25), bar([[8.75, 18.25], [12, 13.75], [15.25, 18.25]], 2.25)],
  ],
  // the red pulse, carried in and out on ink baseline stubs that sink into its ends
  activity: ({ bar, seg2 }) => [
    ['ink', seg2(2.75, 12, 6, 12, 2.5), seg2(18, 12, 21.25, 12, 2.5)],
    ['c1', bar([[6, 12], [9.25, 4.25], [14.75, 19.75], [18, 12]], 2.5)],
  ],
  // blue book, three index tabs (red, yellow, red) peeking out of its edge, a person on it
  'address-book': ({ rr, pill, circle, half, clip }) => {
    const b = rr(3, 2.5, 18.5, 21.5, 3)
    return [
      ['c1', pill(15.5, 5, 21, 8), pill(15.5, 16, 21, 19)],
      ['c2', pill(15.5, 10.5, 21, 13.5)],
      ['c3', b],
      ['c2', circle(10.75, 9, 3)],
      ['c1', clip(half(10.75, 19.5, 5, 'n'), b)],
    ]
  },
  // red bezel with a cream dial and ink hands; two yellow dome bells (soft-cornered half
  // discs) tucked behind the shoulders so only their round crowns show; short ink legs
  'alarm-clock': p => {
    const bell = (x, y, deg) => p.rot(p.soften(p.half(x, y, 4, 'n'), 1.5, { tmax: 3 }), deg, x, y)
    return [
      ['c2', bell(6.25, 6.5, -45), bell(17.75, 6.5, 45)],
      ['ink', p.seg2(7.25, 17.75, 5.25, 20.75, 2.5), p.seg2(16.75, 17.75, 18.75, 20.75, 2.5)],
      ['c1', p.circle(12, 12.75, 8)],
      ['tint', p.circle(12, 12.75, 5.5)],
      ['ink', p.bar([[12, 9.25], [12, 12.75], [14.5, 14.5]], 2)],
    ]
  },
  // pure red disc, cream exclamation
  'alert-circle': ({ circle, glyph }) => [
    ['c1', circle(12, 12, 9.75)],
    ['tint', glyph('bang', 12, 11.25, 4.5, 2.5)],
  ],
  // a soft warning triangle split down its axis (yellow | red), ink exclamation on the seam
  'alert-triangle': ({ poly, glyph, split }) => [
    ...split(poly([[12, 2.75], [22, 20.75], [2, 20.75]], [2.25, 2.25, 2.25]), 'c1', 'c2', 12, 12, 90),
    ['ink', glyph('bang', 12, 13.5, 4, 2.5)],
  ],
  // text alignment: two ink rules, the short lines in red and blue
  'align-center': ({ seg2 }) => [
    ['ink', seg2(3.25, 4.5, 20.75, 4.5, 2.5), seg2(3.25, 14.5, 20.75, 14.5, 2.5)],
    ['c1', seg2(7, 9.5, 17, 9.5, 2.5)],
    ['c3', seg2(7, 19.5, 17, 19.5, 2.5)],
  ],
  'align-justify': ({ seg2 }) => [
    ['ink', seg2(3.25, 4.5, 20.75, 4.5, 2.5), seg2(3.25, 14.5, 20.75, 14.5, 2.5)],
    ['c1', seg2(3.25, 9.5, 20.75, 9.5, 2.5)],
    ['c3', seg2(3.25, 19.5, 20.75, 19.5, 2.5)],
  ],
  'align-left': ({ seg2 }) => [
    ['ink', seg2(3.25, 4.5, 20.75, 4.5, 2.5), seg2(3.25, 14.5, 20.75, 14.5, 2.5)],
    ['c1', seg2(3.25, 9.5, 14.25, 9.5, 2.5)],
    ['c3', seg2(3.25, 19.5, 14.25, 19.5, 2.5)],
  ],
  'align-right': ({ seg2 }) => [
    ['ink', seg2(3.25, 4.5, 20.75, 4.5, 2.5), seg2(3.25, 14.5, 20.75, 14.5, 2.5)],
    ['c1', seg2(9.75, 9.5, 20.75, 9.5, 2.5)],
    ['c3', seg2(9.75, 19.5, 20.75, 19.5, 2.5)],
  ],
  // red box with a cream cross, blue cab with a rounded nose and a yellow quarter
  // windscreen, ink wheels cleared from the body by a moat
  ambulance: ({ rr, quarter, clip, circle, glyph }) => {
    const cab = rr(13, 8, 22, 17.5, [0, 5.5, 2, 0])
    return [
      ['c3', cab],
      ['c2', clip(quarter(14.75, 13, 5, 'ne'), cab)],
      ['c1', rr(2, 4.5, 14.75, 17.5, [2.5, 2.5, 0, 2])],
      ['tint', glyph('plus', 8.25, 10.75, 3, 2.25)],
      ['cut', circle(6.75, 18.5, 3.25), circle(17.25, 18.5, 3.25)],
      ['ink', circle(6.75, 18.5, 2.25), circle(17.25, 18.5, 2.25)],
    ]
  },
  // ink shank and stock, a red ring at the top; the crown is one circle's lower arc, red
  // left and blue right, each end lifting into a rounded-triangle barb that rides the arc's
  // tangent. The shank's round foot overlaps the arc and hides the colour seam.
  anchor: p => {
    const cx = 12, cy = 11.5, r = 8.25, at = a => [cx + r * Math.cos(a * RAD), cy + r * Math.sin(a * RAD)]
    const barb = (a, dir) => { // tip just beyond the arc end, along the travel tangent
      const t = (a + dir * 90), [x, y] = at(a)
      return rhead(p, x + Math.cos(t * RAD) * 3, y + Math.sin(t * RAD) * 3, t + dir * 8, 6, 4, 1.25)
    }
    return [
      ['c1', p.ring(12, 4.5, 2.75, 1.25)],
      ['c1', p.arcEnds(cx, cy, r, 90, 158, 2.5, 'flat', 'round'), barb(158, 1)],
      ['c3', p.arcEnds(cx, cy, r, 22, 90, 2.5, 'round', 'flat'), barb(22, -1)],
      ['ink', p.seg2(12, 7.75, 12, 19.75, 2.5), p.seg2(8, 10.5, 16, 10.5, 2.25)],
    ]
  },
  angry: ({ circle, seg2, arc }) => [
    ['c1', circle(12, 12, 9.75)],
    ['ink', seg2(6.75, 7.75, 10.25, 9.5, 2), seg2(17.25, 7.75, 13.75, 9.5, 2), circle(9, 12.5, 1.35), circle(15, 12.5, 1.35), arc(12, 19.5, 3.5, 215, 325, 2)],
  ],
  // blue window, red title band clipped to it, three cream dots, a yellow quarter rising
  // from the lower-left corner
  'app-window': ({ rr, rect, circle, clip, cornerQuarter }) => {
    const b = rr(2, 3.5, 22, 20.5, 3)
    return [
      ['c3', b],
      ['c1', clip(rect(0, 0, 24, 8.75), b)],
      ['c2', cornerQuarter(b, 2, 20.5, 8.5, 'ne')],
      ['tint', circle(5.75, 6.25, 1.2), circle(9.25, 6.25, 1.2), circle(12.75, 6.25, 1.2)],
    ]
  },
  // one apple body (two lobes united) split red | yellow, green leaf, ink stem, cream shine
  apple: ({ circle, lens, seg2, unite, split, stroke }) => [
    ['accent', lens(12.75, 6.25, 18.75, 2.75, 1.75)],
    ['ink', stroke('M11.5 3.25 C12.25 4.75 12.25 6.5 12 8.5', 2)],
    ...split(unite(circle(9, 14, 6.25), circle(15, 14, 6.25)), 'c2', 'c1', 12, 12, 90),
    ['tint', lens(5.75, 14.5, 8, 10.25, 0.85)],
  ],
  // blue box, red lid pill, yellow half-disc pull hanging from the lid
  archive: ({ rr, pill, half }) => [
    ['c3', rr(4, 8, 20, 20.5, [0, 0, 3, 3])],
    ['c1', pill(2.5, 3.5, 21.5, 9)],
    ['c2', half(12, 9, 3.75, 's')],
  ],
  'arrow-down': p => rarrow(p, 12, 3.5, 12, 20.75, AX),
  'arrow-down-left': p => rarrow(p, 18.5, 5.5, 5.25, 18.75, AD),
  'arrow-down-right': p => rarrow(p, 5.5, 5.5, 18.75, 18.75, AD),
  'arrow-left': p => rarrow(p, 20.5, 12, 3.25, 12, AX),
}
