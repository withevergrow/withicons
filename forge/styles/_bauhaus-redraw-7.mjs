// BAUHAUS redraws, chunk 7: gift … layout-list (run 8: every icon recomposed against
// BAUHAUS-GUIDE.md: soft corners, round-capped curves, deliberate splits)
// ('heart' is an art-director exemplar in _bauhaus-render.mjs and is kept here only as a fallback.)

// git node: a colour disc with a cream eye
const node = (p, x, y, role, r = 3.5) => [[role, p.circle(x, y, r)], ['tint', p.circle(x, y, r * 0.42)]]
// the open hand (hand-coins, hand-heart): an ink cuff, a blue palm whose fingers sweep up
// to the right as one round-capped bar
const hand = (p, role = 'c3') => [
  ['ink', p.pill(1.75, 12.75, 4.25, 22)],
  [role, p.path('M5.25 13.5 H9.75 C11.4 13.5 12.6 14.6 12.85 16 L17.4 13.35 A2.15 2.15 0 0 1 19.75 16.95 L15.1 20.55 C14.25 21.2 13.25 21.5 12.25 21.5 H5.25 Z')],
  // the thumb laid across the palm: one cream crease, round at both ends
  ['tint', p.seg2(8.25, 17.25, 12.5, 17.25, 1.25)],
]
// headphone cups: two soft pills under one ink band
const cups = (p, y0, y1) => [['c1', p.pill(2.5, y0, 8.5, y1)], ['c3', p.pill(15.5, y0, 21.5, y1)]]
// the chunky list rows of the indent pair: ink rules top and bottom, blue short rows
const indentRows = p => [
  ['ink', p.seg2(3.25, 4.5, 20.75, 4.5, 2.5), p.seg2(3.25, 19.5, 20.75, 19.5, 2.5)],
  ['c3', p.seg2(13.5, 9.75, 20.75, 9.75, 2.5), p.seg2(13.5, 14.25, 20.75, 14.25, 2.5)],
]

export const R = {
  // red box, blue lid, a yellow ribbon running flush through both, a two-petal bow
  gift: p => {
    const lid = p.rr(2.75, 7.5, 21.25, 12.25, 2), box = p.rr(4.5, 12.25, 19.5, 21, [0, 0, 3, 3])
    return [
      ['c2', p.lens(12, 7.75, 6.25, 3.75, 2.25), p.lens(17.75, 3.75, 12, 7.75, 2.25)],
      ['c1', box],
      ['c3', lid],
      ['c2', p.clip(p.rect(10.75, 0, 13.25, 24), p.unite(lid, box))],
    ]
  },
  // ink trunk and branch, blue nodes, the branch tip red
  'git-branch': p => [
    ['ink', p.seg2(6.5, 6, 6.5, 18, 2.5), p.stroke('M17.5 8 V9.5 A8 8 0 0 1 9.5 17.5', 2.5)],
    ...node(p, 6.5, 6, 'c3'), ...node(p, 6.5, 18, 'c3'), ...node(p, 17.5, 6, 'c1'),
  ],
  // one ink line through a big red commit with a cream eye
  'git-commit': p => [['ink', p.seg2(2.5, 12, 21.5, 12, 2.5)], ['c1', p.circle(12, 12, 5.25)], ['tint', p.circle(12, 12, 2.1)]],
  'git-merge': p => [
    ['ink', p.seg2(6.5, 6, 6.5, 18, 2.5), p.stroke('M6.5 8.5 C7.5 11 10.5 12 15 12', 2.5)],
    ...node(p, 6.5, 6, 'c3'), ...node(p, 6.5, 18, 'c3'), ...node(p, 17.5, 12, 'c1'),
  ],
  // the request: an ink path rising from the red node, bending left into a swept red head
  'git-pull-request': p => [
    ['ink', p.seg2(5, 6, 5, 18, 2.5), p.stroke('M19 15 V10 A4 4 0 0 0 15 6 H13.5', 2.5)],
    ['c1', p.head(9.6, 6, 180, 5.75, 4.75)],
    ...node(p, 5, 6, 'c3'), ...node(p, 5, 18, 'c3'), ...node(p, 19, 18, 'c1'),
  ],
  // blue globe, yellow meridian lens, a cream equator flush with the rim
  globe: p => {
    const g = p.circle(12, 12, 9.75)
    return [['c3', g], ['c2', p.lens(12, 2.25, 12, 21.75, 4.25)], ['tint', p.clip(p.rect(2, 10.9, 22, 13.1), g)]]
  },
  // ink mortarboard diamond over a blue crown that ends in a half ellipse; red tassel
  'graduation-cap': p => [
    ['c3', p.unite(p.rect(7, 10, 17, 15.5), p.ehalf(12, 15.5, 5, 3.5, 's'))],
    ['ink', p.poly([[12, 3.75], [22, 9], [12, 14.25], [2, 9]], 2)],
    ['c1', p.seg2(19.75, 10, 19.75, 14.5, 2), p.circle(19.75, 15.75, 1.75)],
  ],
  // a T-hammer leaning right: yellow handle, an ink head bar with a round striking face,
  // its far end the red claw split by one half-disc notch
  hammer: p => {
    const r = s => p.move(p.rot(s, 40, 12, 12), -0.5, 0.75)
    const claw = p.cut(p.rr(13, 3.25, 20, 9, [0.75, 2.5, 2.5, 0.75]), p.half(20.25, 6.125, 2, 'w'))
    return [
      ['c2', r(p.pill(10.75, 8, 13.25, 22.25))],
      ['ink', r(p.rr(3.5, 3.25, 13, 9, [2.75, 0, 0, 2.75]))],
      ['c1', r(claw)],
    ]
  },
  // the open hand holding two coins: yellow big, red small, a moat between
  'hand-coins': p => [
    ...hand(p),
    ['c2', p.circle(15.75, 6.75, 3.75)],
    ['cut', p.circle(9.75, 8.75, 4.25)],
    ['c1', p.circle(9.75, 8.75, 3.25)],
  ],
  // the open hand offering a red heart
  'hand-heart': p => [['c1', p.heart(12.75, 6.75, 0.55).all], ...hand(p)],
  // two forearms meeting on a diagonal: the blue hand reaches under, the red hand closes
  // over it (a page-coloured moat between them) with two cream finger creases
  handshake: p => {
    const blue = p.bar([[6.25, 9.5], [9.75, 9.5], [16.25, 16]], 4.5), red = p.bar([[17.75, 9.5], [14.25, 9.5], [8.25, 15.5]], 4.5)
    return [
      ['ink', p.pill(1.5, 5.25, 4, 13.75), p.pill(20, 5.25, 22.5, 13.75)],
      ['c3', blue],
      ['cut', p.bar([[16.75, 9.5], [14.25, 9.5], [8.25, 15.5]], 7)],
      ['c1', red],
    ]
  },
  // the drive bay: a yellow sloped lid on a blue slab, a cream slot and a red led
  'hard-drive': p => [
    ['c2', p.poly([[6.75, 4.25], [17.25, 4.25], [21.75, 12.75], [2.25, 12.75]], [2, 2, 0, 0])],
    ['c3', p.rr(2, 12.75, 22, 20.75, [0.5, 0.5, 3, 3])],
    ['tint', p.pill(5, 15.75, 12.5, 17.75)],
    ['c1', p.circle(18, 16.75, 1.6)],
  ],
  hash: p => [
    ['ink', p.seg2(10, 3.5, 8, 20.5, 2.75), p.seg2(16, 3.5, 14, 20.5, 2.75)],
    ['c1', p.seg2(3.75, 9, 20.25, 9, 2.75)],
    ['c3', p.seg2(3.75, 15, 20.25, 15, 2.75)],
  ],
  heading: p => [['ink', p.pill(4.5, 3.5, 7.75, 20.5), p.pill(16.25, 3.5, 19.5, 20.5)], ['c1', p.seg2(6, 12, 18, 12, 2.75)]],
  // ink band into two soft pill cups, red | blue
  headphones: p => [['ink', p.arc(12, 13.25, 8.5, 180, 360, 2.5)], ...cups(p, 12.5, 21.5)],
  // the headphones, shorter cups, an ink boom ending at a yellow mouthpiece
  headset: p => [
    ['ink', p.arc(12, 12, 8.5, 180, 360, 2.5), p.stroke('M18.5 17 V17.25 A3.25 3.25 0 0 1 15.25 20.5 H13.5', 2)],
    ...cups(p, 11, 18.75),
    ['c2', p.circle(12.25, 20.5, 1.6)],
  ],
  heart: p => [['c1', p.heart().all], ['tint', p.lens(6.25, 10.75, 8.75, 6.5, 0.9)]],
  // the heart cut by one zigzag gap: red left, blue right (no offset, so the halves stay one heart)
  'heart-crack': p => {
    const h = p.heart().all, Z = [[12, 3], [10.25, 9.5], [13.75, 13], [11.5, 16.25], [12, 23]]
    return [
      ['c1', p.clip(h, p.poly([...Z, [-10, 23], [-10, 3]], 0))],
      ['c3', p.clip(h, p.poly([...Z, [34, 23], [34, 3]], 0))],
      ['cut', p.bar([[12, 4.5], ...Z.slice(1, 4), [12, 21.5]], 1.5)],
    ]
  },
  // red heart with a cream pulse running through it
  'heart-pulse': p => [['c1', p.heart().all], ['tint', p.bar([[5, 12.5], [8, 12.5], [9.5, 9.75], [12, 15.75], [13.75, 12.5], [19, 12.5]], 1.75)]],
  'help-circle': p => [...p.disc('c3'), ['tint', p.arc(12, 9.75, 3, 180, 405, 2.5), p.seg2(12, 12.6, 12, 13.75, 2.5), p.circle(12, 17.25, 1.5)]],
  // a generous red hexagon with a yellow hexagon core
  hexagon: p => [['c1', p.poly(p.ngon(12, 12, 10, 6), 2.75)], ['c2', p.poly(p.ngon(12, 12, 4.5, 6), 1.1)]],
  // blue barrel with a round cap, ink collar flush under it, yellow chisel tip, yellow mark
  highlighter: p => {
    const r = s => p.rot(s, 45, 12, 12)
    return [
      ['c2', p.pill(2.5, 19.5, 12, 22)],
      ['c3', r(p.rr(9.5, 0.75, 14.5, 11, [2.5, 2.5, 0, 0]))],
      ['ink', r(p.rect(9.5, 11, 14.5, 13.5))],
      ['c2', r(p.poly([[10.25, 13.5], [13.75, 13.5], [12.9, 17], [11.1, 17]], [0, 0, 0.9, 0.9]))],
    ]
  },
  // the dial runs back: a blue band from the foot round the top, ending in a red kit head
  // laid on its own tangent, its base swallowing the band's end
  history: p => [
    ...p.arcArrow(12, 12, 8.5, 192, 505, { ccw: true, len: 6.5, half: 4.25, r: 1.4, rb: 1.1 }),
    ['ink', p.bar([[12, 7.5], [12, 12], [15.25, 14]], 2.25)],
  ],
  // blue wings, red arched tower with a cream cross, yellow arched door
  hospital: p => [
    ['c3', p.rr(2.5, 11, 21.5, 21, [2.75, 2.75, 1.5, 1.5])],
    ['c1', p.arch(6.5, 3, 17.5, 21)],
    ['tint', p.glyph('plus', 12, 10, 2.75, 2.25)],
    ['c2', p.arch(10, 15.5, 14, 21)],
  ],
  // red dome with a cream H, blue block on an ink base, yellow arched door, cream windows
  hotel: p => [
    ['c1', p.half(12, 10, 8.25, 'n')],
    ['c3', p.rect(3.75, 9.5, 20.25, 20.5)],
    ['ink', p.pill(2, 19.75, 22, 22.25)],
    ['c2', p.arch(9.75, 14, 14.25, 20)],
    ['tint', p.seg2(9.75, 5, 9.75, 8.25, 1.75), p.seg2(14.25, 5, 14.25, 8.25, 1.75), p.seg2(9.75, 6.6, 14.25, 6.6, 1.75), p.circle(6.75, 13.25, 1.25), p.circle(17.25, 13.25, 1.25)],
  ],
  hourglass: p => {
    // two soft triangles crossing at a pinched, rounded neck
    const top = p.poly([[6, 3.5], [18, 3.5], [12, 13]], [1, 1, 1.5]), bot = p.poly([[12, 11], [18, 20.5], [6, 20.5]], [1.5, 1, 1])
    const glass = p.unite(top, bot, p.seg2(12, 10, 12, 14, 2.25))
    return [
      ['c3', glass],
      ['c2', p.clip(glass, p.rect(0, 8.5, 24, 12.25)), p.clip(glass, p.rect(0, 15.5, 24, 24))],
      ['ink', p.pill(4.5, 1.75, 19.5, 4), p.pill(4.5, 20, 19.5, 22.25)],
    ]
  },
  // yellow cone, one big red scoop with a scalloped lip, a cream highlight
  'ice-cream': p => [
    ['c2', p.poly([[6.5, 12], [17.5, 12], [12, 22.25]], [1, 1, 1.75])],
    ['c1', p.circle(12, 8.75, 6), p.circle(7.75, 12.75, 2.1), p.circle(12, 13.5, 2.25), p.circle(16.25, 12.75, 2.1)],
    ['tint', p.lens(8.25, 9, 10.25, 4.75, 0.9)],
  ],
  'id-card': p => {
    const card = p.rr(2, 4, 22, 20, 2.75)
    return [['c3', card], ['c2', p.circle(8.5, 10, 2.5), p.clip(p.half(8.5, 20, 4.5, 'n'), card)], ['tint', p.lines(14.25, [18.5, 16.5], [10, 14], 2)]]
  },
  image: p => {
    const f = p.rr(2, 4, 22, 20, 2.75)
    return [['c3', f], ['c2', p.circle(15.75, 9.25, 2.25)], ['c1', p.clip(p.half(8.5, 20, 7.5, 'n'), f)]]
  },
  'image-plus': p => {
    const f = p.rr(2, 4, 22, 20, 2.75)
    return [['c3', f], ['c2', p.circle(12.5, 9, 1.75)], ['c1', p.clip(p.half(7.5, 20, 7, 'n'), f)], ...p.badge('plus', 'c2', 17.5, 17.5, 4.25, 'ink')]
  },
  images: p => {
    const f = p.rr(2, 8, 18, 21, 2.5)
    // the card behind: a whole rounded card, offset up-right, its visible L softened at
    // both ends where the moat round the front card cuts it
    const back = p.soften(p.cut(p.rr(6, 3, 22, 17, 2.5), p.rr(0.75, 6.75, 19.25, 22.25, 3.25)), 1.25, { tmax: 2 })
    return [['c1', back], ['c3', f], ['c2', p.circle(13.5, 12, 1.75)], ['tint', p.clip(p.half(7, 21, 5.5, 'n'), f)]]
  },
  // blue back wall, red tray whose lip dips in one half-disc slot
  inbox: p => [
    ['c3', p.rr(4, 3.5, 20, 13, [3, 3, 0, 0])],
    ['c1', p.cut(p.rr(2.5, 12, 21.5, 20.5, [1.25, 1.25, 3.25, 3.25]), p.half(12, 12, 4, 's'))],
  ],
  // the kit head, as tall as the two blue rows it points at
  'indent-decrease': p => [...indentRows(p), ['c1', p.head(3, 12, 180, 6.75, 4.25)]],
  'indent-increase': p => [...indentRows(p), ['c1', p.head(10, 12, 0, 6.75, 4.25)]],
  'indian-rupee': p => [
    ['c3', p.seg2(6, 4, 18, 4, 2.5), p.seg2(6, 8.5, 18, 8.5, 2.5)],
    ['ink', p.arc(9.5, 8.5, 4.5, 270, 450, 2.5), p.seg2(9.5, 13, 6.75, 13, 2.5), p.seg2(7, 13, 15.5, 20.5, 2.5)],
  ],
  'info-circle': p => [...p.disc('c3'), ['tint', p.circle(12, 7.5, 1.6), p.bar([[10.25, 11], [12, 11], [12, 16.75]], 2.5)]],
  italic: p => [['ink', p.seg2(15, 4, 9, 20, 2.75)], ['c1', p.seg2(11, 4, 19, 4, 2.75)], ['c3', p.seg2(5, 20, 13, 20, 2.75)]],
  kanban: p => [['c3', p.rr(3, 3, 21, 21, 3.5)], ['c2', p.pill(6.25, 6.5, 8.75, 17)], ['tint', p.pill(10.75, 6.5, 13.25, 12.5)], ['c1', p.pill(15.25, 6.5, 17.75, 14.75)]],
  // yellow bow with a red eye, ink shaft with two round-capped teeth
  key: p => [
    ['ink', p.seg2(11, 13, 20, 4, 2.75), p.seg2(18.25, 5.75, 20.75, 8.25, 2.5), p.seg2(15.25, 8.75, 17.25, 10.75, 2.5)],
    ['c2', p.circle(8, 16, 5.5)],
    ['c1', p.circle(8, 16, 2)],
  ],
  keyboard: p => [
    ['c3', p.rr(2, 4.5, 22, 19.5, 2.75)],
    ['tint', p.circle(6, 8.5, 1.15), p.circle(10, 8.5, 1.15), p.circle(14, 8.5, 1.15), p.circle(8, 12, 1.15), p.circle(12, 12, 1.15), p.circle(16, 12, 1.15)],
    ['c1', p.circle(18, 8.5, 1.15)],
    ['c2', p.pill(7.5, 14.75, 16.5, 16.5)],
  ],
  // yellow dome shade, red bulb, ink stem, blue foot
  lamp: p => [
    ['ink', p.pill(10.75, 11, 13.25, 19.5)],
    ['c3', p.soften(p.ehalf(12, 21.5, 5.75, 3.25, 'n'), 1, { tmax: 2 })],
    ['c2', p.soften(p.half(12, 12, 8, 'n'), 1.1, { tmax: 2 })],
    ['c1', p.half(12, 12, 2.25, 's')],
  ],
  landmark: p => [
    ['c1', p.half(12, 10, 6.5, 'n'), p.pill(2.5, 9, 21.5, 11.25)],
    ['c3', p.pill(5, 12.5, 7.5, 18.5), p.pill(9.25, 12.5, 11.75, 18.5), p.pill(12.25, 12.5, 14.75, 18.5), p.pill(16.5, 12.5, 19, 18.5)],
    ['ink', p.pill(2.5, 19.5, 21.5, 22), p.circle(12, 3, 1.25)],
  ],
  language: p => [
    ['c3', p.seg2(2.5, 6, 12.5, 6, 2.25), p.seg2(7.5, 3, 7.5, 6, 2.25), p.stroke('M11 6 C10.5 11 7.5 14 3 15', 2.25), p.stroke('M4.5 6 C5.5 10.75 8 13.5 11.5 14.5', 2.25)],
    ['c1', p.bar([[13.5, 21], [17.5, 11], [21.5, 21]], 2.5), p.seg2(15, 17.5, 20, 17.5, 2.25)],
  ],
  laptop: p => {
    const s = p.rr(6.5, 6.5, 17.5, 13.5, 1.25)
    return [['c3', p.rr(4, 4, 20, 16, 2.5)], ['c2', s], ['c1', p.clip(p.half(12, 13.5, 4, 'n'), s)], ['ink', p.pill(1.5, 17.75, 22.5, 20.5)]]
  },
  laugh: p => p.face('c2', [['ink', p.arc(8.75, 10.25, 1.75, 180, 360, 1.75), p.arc(15.25, 10.25, 1.75, 180, 360, 1.75), p.half(12, 13.25, 4.5, 's')], ['c1', p.clip(p.circle(12, 18.5, 2.5), p.half(12, 13.25, 4.5, 's'))]], { eyes: false }),
  layers: p => {
    const sh = p.poly([[12, 3], [21.5, 8], [12, 13], [2.5, 8]], 2.5)
    return [['c1', p.move(sh, 0, 8)], ['cut', p.move(sh, 0, 4.75)], ['c2', p.move(sh, 0, 4.25)], ['cut', p.move(sh, 0, 0.75)], ['c3', p.move(sh, 0, 0.25)]]
  },
  'layout-dashboard': p => [['c3', p.rr(3, 3, 10.25, 13, 2.25)], ['c1', p.rr(13.75, 3, 21, 7.75, 2.25)], ['c2', p.rr(13.75, 11, 21, 21, 2.25)], ['ink', p.rr(3, 16.25, 10.25, 21, 2.25)]],
  'layout-grid': p => [['c3', p.rr(3, 3, 10.25, 10.25, 2.25), p.rr(13.75, 13.75, 21, 21, 2.25)], ['c1', p.rr(13.75, 3, 21, 10.25, 2.25)], ['c2', p.rr(3, 13.75, 10.25, 21, 2.25)]],
  'layout-list': p => [['c3', p.rr(3, 3.5, 9.25, 9.75, 2.25)], ['c1', p.rr(3, 14.25, 9.25, 20.5, 2.25)], ['ink', p.seg2(13, 4.75, 21, 4.75, 2.25), p.seg2(13, 15.5, 21, 15.5, 2.25)], ['c2', p.seg2(13, 8.5, 17.5, 8.5, 2.25), p.seg2(13, 19.25, 17.5, 19.25, 2.25)]],
}
