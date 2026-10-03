// GOTHIC exemplars: the art director's reference icons, one per family (GOTHIC-GUIDE.md §7).
// An entry here wins over the same name in _gothic-redraw-*.mjs. Signature: (icon, g) => parts.
// Light comes from the upper-left; keep geometry inside x 2..21.5, y 2..21.5 (the cast
// shadow falls 0.45 right, 0.75 down).

export const EXEMPLAR = {
  // a chapel front: ashlar gable, copper roof, rose window, pointed door glowing, fleur finial
  home: (icon, g) => {
    const walls = g.poly([[12, 4.2], [19.5, 10.6], [19.5, 21], [4.5, 21], [4.5, 10.6]])
    return [
      g.stone(walls, { ashlar: { h: 2.2, w: 3.4, y0: 10.5, y1: 21 } }),
      g.gilt(g.stroke([[2.6, 11.6], [12, 3.6], [21.4, 11.6]], 2.1)),
      ...g.rose(12, 10.4, 2.5, 'c2', { n: 6, frame: 0.8 }),
      g.stone(g.lancet(8.6, 13.6, 15.4, 21, 1), { thin: true }),
      g.recess(g.lancet(9.9, 15, 14.1, 21, 1), { plate: 'A', glow: 'c3', glowOp: 0.7 }),
      g.finial(12, 3.3, 0.75, { plate: 'deco' }),
    ]
  },
  // a heart of ruby glass, leaded like a rose window round a gold quatrefoil
  heart: (icon, g) => {
    const H = g.path('M12 20.6 C12 20.6 3 15.3 3 9 C3 6.2 5.1 4 7.9 4 C9.7 4 11.1 5 12 6.6 C12.9 5 14.3 4 16.1 4 C18.9 4 21 6.2 21 9 C21 15.3 12 20.6 12 20.6 Z')
    return g.pane(H, 'c1', { frame: 1.8, tracery: 'rose', glass: { n: 10, at: { c: [12, 11], r: 4.2 }, medal: 'c3' } })
  },
  // a bronze bell hung in a pointed belfry arch against the night sky
  bell: (icon, g) => {
    const arch = g.lancet(3, 2.2, 21, 21.2, 0.9)
    const bell = g.union(g.path('M7 16.6 C7 13 7.4 7.6 12 7.6 C16.6 7.6 17 13 17 16.6 L18.4 18.2 H5.6 Z'), g.circle(12, 7.4, 1.3))
    return [
      ...g.ground(g.pane(arch, 'c2', { frame: 1.6, tracery: 'none', glass: { dark: 0.45, glow: 0.1 } })),
      g.iron(g.seg(12, 4.6, 12, 7, 0.9), { plate: 'K' }),
      g.gilt(bell),
      g.lead([[[8.6, 15.2], [15.4, 15.2]]], { role: 'shadow', w: 0.35, op: 0.45 }),
      g.gilt(g.circle(12, 19.6, 1.5), { plate: 'A' }),
    ]
  },
  // an envelope of glass, gold flap over sapphire, sealed with a ruby wax seal
  mail: (icon, g) => {
    const body = g.rr(2.5, 4.8, 21.5, 19.2, 2)
    const flap = g.poly([[3.8, 6.2], [20.2, 6.2], [12, 12.8]])
    return [
      g.stone(g.rim(body, 1.5)),
      g.glass(g.shrink(body, 1.5), 'c2', { tracery: 'quarry', medallion: false }),
      g.stone(g.stroke([[3.4, 6.4], [12, 13], [20.6, 6.4]], 1.3), { thin: true, plate: 'A' }),
      g.glass(g.shrink(flap, 0.55), 'c3', { plate: 'A' }),
      g.cut(g.circle(12, 13.2, 3.5)),
      g.gilt(g.circle(12, 13.2, 2.75), { plate: 'S', glint: false }),
      g.glass(g.foil(12, 13.2, 2.1, 4, -90), 'c1', { plate: 'S', outline: 0.25, glow: 0.25 }),
    ]
  },
  // a magnifier whose lens is a rose window, on a gilded handle with a collar
  search: (icon, g) => [
    g.gilt(g.seg(15.4, 15.4, 20.6, 20.6, 2.6), { plate: 'A' }),
    g.iron(g.seg(15, 15, 16.3, 16.3, 3.4), { plate: 'A' }),
    ...g.rose(10, 10, 7.6, 'c2', { n: 8, frame: 1.9, medal: 'c3' }),
  ],
  // a gear as a rose window: ruby glass, twelve spokes, gilded hub
  settings: (icon, g) => {
    const gear = g.gear(12, 12, 7.4, 10, 8, 0.5)
    return [
      ...g.pane(gear, 'c1', { frame: 1.7, tracery: 'none' }),
      g.lead(Array.from({ length: 8 }, (_, k) => { const a = (k * 45 + 22.5) * Math.PI / 180; return [[12 + 3.6 * Math.cos(a), 12 + 3.6 * Math.sin(a)], [12 + 6.4 * Math.cos(a), 12 + 6.4 * Math.sin(a)]] })),
      g.gilt(g.rim(g.circle(12, 12, 3.6), 1.3), { plate: 'A' }),
      g.glass(g.circle(12, 12, 2.3), 'c3', { plate: 'A', outline: 0.3 }),
    ]
  },
  // a saint in a lancet: gold halo, sapphire robe with a pointed neckline, golden face
  user: (icon, g) => [
    g.deco(g.gilt(g.rim(g.circle(12, 7.6, 5.2), 1.0), { glint: false })),
    ...g.pane(g.circle(12, 7.6, 3.9), 'c3', { frame: 1.3, tracery: 'none' }),
    ...g.pane(g.union(g.lancet(4.2, 12.6, 19.8, 21.4, 0.75)), 'c2', { frame: 1.5, tracery: 'lancet', glass: { s: 2.4 } }),
  ],
  // a star of gold glass, each point leaded to a ruby heart
  star: (icon, g) => {
    const S = g.star(12, 12.6, 10.4, 4.6, 5)
    const spokes = Array.from({ length: 10 }, (_, k) => { const a = (-90 + 36 * k) * Math.PI / 180; return [[12 + 2 * Math.cos(a), 12.6 + 2 * Math.sin(a)], [12 + 11 * Math.cos(a), 12.6 + 11 * Math.sin(a)]] })
    return [
      ...g.pane(S, 'c3', { frame: 1.5, tracery: spokes }),
      g.glass(g.circle(12, 12.6, 2.1), 'c1', { outline: 0.4 }),
    ]
  },
  // a stone tablet: ruby header on gilded rings, six lancet lights for the days
  calendar: (icon, g) => {
    const body = g.rr(3, 4.8, 21, 21.2, 2)
    const out = [
      g.stone(body, { ashlar: { h: 2.4, w: 3, y0: 9.6, y1: 21.2 } }),
      g.glass(g.rr(4.6, 6.3, 19.4, 9.3, [1, 1, 0, 0]), 'c1', { outline: 0.4 }),
    ]
    for (const [x, y] of [[5.4, 11.2], [10.4, 11.2], [15.4, 11.2], [5.4, 15.7], [10.4, 15.7], [15.4, 15.7]])
      out.push(g.glass(g.lancet(x, y, x + 3.2, y + 4, 1.15), y < 13 ? 'c2' : 'c3', { outline: 0.4, glint: false, glow: 0.22 }))
    out.push(g.gilt(g.union(g.rr(6.6, 2.4, 8.6, 7.2, 1), g.rr(15.4, 2.4, 17.4, 7.2, 1)), { plate: 'A', thin: true }))
    return out
  },
  // a camera built like a gatehouse: crenellated top, ashlar body, rose window lens, jewel flash
  camera: (icon, g) => [
    g.stone(g.crenel(7, 3.4, 15, 8, 3, 1.5), { thin: true }),
    g.stone(g.rr(2.5, 6.6, 21.5, 20.2, 2.2), { ashlar: { h: 2.3, w: 3.2, y0: 6.6, y1: 20.2 } }),
    ...g.rose(12, 13.4, 5.2, 'c2', { n: 8, frame: 1.2, medal: 'c3' }),
    g.glass(g.circle(18.4, 9.6, 1.05), 'c1', { outline: 0.35, glint: false, plate: 'A' }),
  ],
  // a cloud of sapphire glass, its lobes leaded along their arcs
  cloud: (icon, g) => {
    const C = g.union(g.circle(8.2, 13.6, 4.4), g.circle(13.4, 10.4, 5.6), g.circle(17.6, 14.2, 3.9), g.rr(4, 13, 20.4, 18.6, 2.8))
    return [
      ...g.pane(C, 'c2', { frame: 1.6, tracery: 'quarry', glass: { medallion: false, s: 2.5 } }),
    ]
  },
  // an illuminated leaf: sapphire glass in a stone frame, gilded dog-ear, gold medallion
  file: (icon, g) => {
    const page = g.path('M6.5 2.5 H14 L19.5 8 V19.5 A2 2 0 0 1 17.5 21.5 H6.5 A2 2 0 0 1 4.5 19.5 V4.5 A2 2 0 0 1 6.5 2.5 Z')
    return [
      ...g.pane(page, 'c2', { frame: 1.5, tracery: 'quarry', glass: { at: { c: [12, 13.6], r: 4.4 } } }),
      g.gilt(g.poly([[14, 2.6], [14, 7.4], [19.4, 7.4]]), { plate: 'A' }),
    ]
  },
  // a folder: ashlar back with its tab, a gold glass front under a stone lip
  folder: (icon, g) => [
    g.stone(g.path('M4.5 3.8 H9.6 L11.6 6 H19.5 A2 2 0 0 1 21.5 8 V19.2 A2 2 0 0 1 19.5 21.2 H4.5 A2 2 0 0 1 2.5 19.2 V5.8 A2 2 0 0 1 4.5 3.8 Z'), { ashlar: { h: 2, w: 3.2, y0: 3.8, y1: 10 } }),
    ...g.pane(g.rr(2.5, 9.4, 21.5, 21.2, [1, 1, 2, 2]), 'c3', { frame: 1.4, tracery: 'quarry', plate: 'A' }),
  ],
  // an ornate lock: gilded shackle, iron case in a gilded frame with studs, quatrefoil escutcheon
  lock: (icon, g) => {
    const body = g.rr(3.8, 10.2, 20.2, 21.4, 2.2)
    return [
      g.gilt(g.stroke('M7.6 11 V7.6 A4.4 4.4 0 0 1 16.4 7.6 V11', 2.2), { plate: 'A' }),
      g.glass(body, 'c1', { tracery: 'lancet', s: 2.2, dark: 0.4 }),
      g.gilt(g.rim(body, 1.2), { glint: false }),
      g.studs([[5.6, 12], [18.4, 12], [5.6, 19.6], [18.4, 19.6]], 0.45),
      g.gilt(g.foil(12, 15.6, 3.3, 4, -90), { plate: 'K' }),
      g.recess(g.union(g.circle(12, 14.9, 0.95), g.poly([[11.3, 15.2], [12.7, 15.2], [13.1, 17.6], [10.9, 17.6]])), { plate: 'A', glow: 'c3', glowOp: 0.5, outline: 0.2 }),
    ]
  },
  // a note in an illuminated hand: gilded stem and flag, ruby cabochon head
  'music-note': (icon, g) => [
    g.gilt(g.union(g.seg(15.6, 3.6, 15.6, 16.6, 2), g.stroke('M15.6 3.6 C16.2 6.4 19.8 6.6 19.6 10.4', 2))),
    g.gilt(g.ellipse(11.4, 17.4, 4.9, 3.9)),
    g.glass(g.ellipse(11.4, 17.4, 3.7, 2.7), 'c1', { outline: 0.25, tracery: 'none', glow: 0.24 }),
  ],
  // a rocket as a pinnacle: stone spire body, rose porthole, gilded fins, ruby and gold flame
  rocket: (icon, g) => {
    const body = g.path('M12 2 C15.6 4.6 16.6 9 16.4 15.4 H7.6 C7.4 9 8.4 4.6 12 2 Z')
    return [
      g.deco(g.glass(g.path('M9.4 16.6 H14.6 C14.4 19 13.4 20.6 12 22 C10.6 20.6 9.6 19 9.4 16.6 Z'), 'c3', { outline: 0.4, glint: false })),
      g.gilt(g.union(g.path('M7.8 10.6 L4.2 14.4 V17.6 L8 15.6 Z'), g.path('M16.2 10.6 L19.8 14.4 V17.6 L16 15.6 Z')), { plate: 'A' }),
      g.stone(body, { ashlar: { h: 2.2, w: 3, y0: 2, y1: 16 } }),
      ...g.rose(12, 9.4, 2.6, 'c2', { n: 6, frame: 0.8 }),
      g.gilt(g.rr(8.6, 14.6, 15.4, 16.6, 0.8), { thin: true }),
    ]
  },
  // a cup with a quatrefoil band, gilded handle, wrought-iron steam curls
  coffee: (icon, g) => [
    g.gilt(g.ring(17.2, 14.2, 2.6, 1.7), { plate: 'A' }),
    ...g.pane(g.path('M3.6 9.6 H17.4 V16.4 A4.4 4.4 0 0 1 13 20.8 H8 A4.4 4.4 0 0 1 3.6 16.4 Z'), 'c1', { frame: 1.5, tracery: 'none' }),
    g.gilt(g.rr(4.6, 11.9, 16.4, 12.9, 0), { thin: true, glint: false, outline: 0.3 }),
    g.studs([[6.6, 15.6], [10.5, 15.6], [14.4, 15.6]], 0.6),
    g.deco(g.gilt(g.union(g.stroke('M8 8 C6.6 6.8 9.4 5.6 8 3.6', 1.2), g.stroke('M12.8 8 C11.4 6.8 14.2 5.6 12.8 3.6', 1.2)), { thin: true, outline: 0.32, glint: false })),
  ],
  // a reliquary bin: crenellated stone lid, emerald glass body in lancet lights
  trash: (icon, g) => [
    g.gilt(g.rr(9.4, 2.4, 14.6, 5.2, 1), { plate: 'A', thin: true }),
    g.stone(g.crenel(3.2, 4.4, 20.8, 7.6, 4, 1.2), { plate: 'A' }),
    ...g.pane(g.poly([[5, 8.2], [19, 8.2], [17.8, 21.4], [6.2, 21.4]]), 'c4', { frame: 1.4, tracery: [[[9.6, 7], [10, 23]], [[14.4, 7], [14, 23]]] }),
  ],
  // a gilded arrow: a shaft with a fine gilt ring, a pointed ogival head pierced by a trefoil
  'arrow-right': (icon, g) => {
    const head = g.path('M21.6 12 C18.4 10.8 15.4 8.4 13 4.8 C13.8 7.6 14 10 13.8 12 C14 14 13.8 16.4 13 19.2 C15.4 15.6 18.4 13.2 21.6 12 Z')
    return [
      g.gilt(g.seg(2.6, 12, 15.6, 12, 2.6)),
      g.gilt(g.rr(5, 10.2, 6.3, 13.8, 0.55), { thin: true, glint: false, outline: 0.32 }),
      g.gilt(head),
      g.recess(g.foil(16.6, 12, 1.4, 3, 180), { outline: 0.15, glow: 'c3' }),
    ]
  },
  // a check of emerald glass in a carved stone surround
  check: (icon, g) => {
    const C = g.stroke([[3.6, 12.6], [9.2, 18.4], [20.4, 6]], 4.4)
    return g.pane(C, 'c4', { frame: 1.3, tracery: 'none' })
  },
}
