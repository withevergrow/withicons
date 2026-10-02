// BAUHAUS redraws, chunk 1: the signature set.
// Each entry composes the icon from primitives: [[role, shape...], ...] bottom to top.
// Roles: c1 red, c2 yellow, c3 blue, ink black, tint cream, c4 orange, accent green.
//
// home, heart, bell, camera, coffee, calendar, mail, search, settings, user and cloud
// belong to this chunk's signature set but are drawn by the art director as exemplars
// (EXEMPLAR in _bauhaus-render.mjs wins over any entry here), so they live there only.
export const R = {
  // a bullet body pointing north-east, split down its axis red | blue, a cream porthole,
  // a yellow half-disc of fins behind its tail and a red flame drop trailing south-west
  // in its own moat
  rocket: ({ rot, drop, half, circle, split }) => {
    const r = s => rot(s, 45, 12, 12)
    const body = split(drop(12, 12, 4.75, 12, -1, 0.9), 'c3', 'c1', 12, 12, 90).map(([k, s]) => [k, r(s)])
    return [
      ['c2', r(half(12, 13.75, 7, 's'))],
      ...body,
      ['cut', r(drop(12, 20.5, 3, 12, 26, 1.5))],
      ['c1', r(drop(12, 20.5, 2, 12, 25, 0.9))],
      ['tint', r(circle(12, 9, 1.9))],
    ]
  },
  // one quaver: red head disc, ink stem, a blue lens flag swinging off its top
  'music-note': ({ circle, seg2, lens }) => [
    ['c3', lens(10.5, 2.5, 17.5, 11.5, 3)],
    ['ink', seg2(10.5, 3.25, 10.5, 17.5, 2.5)],
    ['c1', circle(7.75, 17.75, 3.75)],
  ],
  // a soft lens leaf split along its midrib, green | yellow, an ink stem running in
  // from the corner
  leaf: ({ lens, soften, seg2, split }) => [
    ...split(soften(lens(4.5, 19.5, 20.75, 3.25, 5), 1.25), 'accent', 'c2', 12, 12, -45),
    ['ink', seg2(3, 21, 7, 17, 2.25)],
  ],
  // a yellow slice under a red round-capped crust, pepperoni in red and one ink olive
  pizza: ({ sector, arc, circle }) => [
    ['c2', sector(3.75, 20.25, 14.5, -78, -12)],
    ['c1', arc(3.75, 20.25, 15, -76.5, -13.5, 3)],
    ['c1', circle(10.25, 12.75, 1.75), circle(13.75, 16, 1.6)],
    ['ink', circle(7.25, 16, 1.1)],
  ],
  // yellow face disc between two soft triangle ears, one red one blue, upright ink eyes
  // and a red half-disc nose
  cat: ({ circle, ellipse, poly, half }) => [
    ['c1', poly([[5.5, 2.5], [12, 8], [3.5, 12]], [1.75, 1, 1])],
    ['c3', poly([[18.5, 2.5], [12, 8], [20.5, 12]], [1.75, 1, 1])],
    ['c2', circle(12, 13.75, 7.75)],
    ['ink', ellipse(8.75, 12.75, 1.3, 1.8), ellipse(15.25, 12.75, 1.3, 1.8)],
    ['c1', half(12, 15.75, 1.6, 's')],
  ],
}
