// ANIME exemplars — the art director's reference drawings, one per family.
// An entry here wins over the same name in _anime-redraw-*.mjs. Copy their construction
// for the rest of each family (forge/styles/ANIME-GUIDE.md §7).
//
// Each entry: (icon, k) => ops, bottom to top. k = prim + kit (+ cast, M, PALETTE).
export const EXEMPLAR = {
  // cream walls, a glossy sky-blue roof slab with eaves, warm gold door and gable window
  home: (icon, k) => [
    k.surf(k.rr(15.2, 4.4, 17.6, 9.5, [0.5, 0.5, 0, 0]), 'accent', { shine: 'none' }),
    k.surf(k.poly([[5.2, 21], [5.2, 10.4], [12, 4.6], [18.8, 10.4], [18.8, 21]], [1.6, 0, 0, 0, 1.6]), 'tint', { shine: 'none' }),
    k.surf(k.poly([[2.2, 11.8], [12, 3.1], [21.8, 11.8], [20.5, 13.1], [12, 5.8], [3.5, 13.1]], [0.7, 1, 0.7, 0.5, 0.4, 0.5]), 'c1'),
    k.surf(k.arch(9.6, 14.2, 14.4, 21), 'c3', { part: 'a', shine: 'none' }),
    k.ink([[13.2, 18], [13.2, 18.01]], { w: 0.9, part: 'a', taper: false, shift: 0 }),
    k.surf(k.circle(12, 10.3, 1.45), 'c3', { inset: true, shine: 'glint', shineSize: 0.75, ol: 0.45 }),
  ],

  // sakura heart with the big glossy streak, a sparkle and its mini dot
  heart: (icon, k) => [
    k.surf(k.heartShape(12, 12.6, 1.02), 'c2', { shineSize: 1.15 }),
    k.sparkle({ r: 2.2, where: [[20.6, 3.6, -1, 1], [21, 4.4, -1, 1]] }),
  ],

  // gold bell: dome, flared lip band, pink clapper swinging below, ring on top
  bell: (icon, k) => [
    k.surf(k.circle(12, 20, 1.9), 'c2', { part: 'a', shine: 'dot' }),
    k.surf(k.ring(12, 4.3, 1.5, 0.6), 'c3', { shine: 'none', ol: 0.45 }),
    k.surf(k.path('M5.9 17 C5.9 11.2 7 5.7 12 5.7 C17 5.7 18.1 11.2 18.1 17 Z'), 'c3', { shineSize: 1.1 }),
    k.surf(k.pill(4, 15.9, 20, 18.9), 'c3', { shine: 'none' }),
    k.sparkleAt(20.2, 5.2, 1.9, { mx: -1, my: 1 }),
  ],

  // a love letter: cream envelope, folded flap lines, coral heart seal
  mail: (icon, k) => [
    k.surf(k.rr(2.6, 5, 21.4, 19.2, 2), 'tint', { shine: 'none' }),
    k.ink([[3.6, 18.2], [9.6, 12.6]], { part: 'a' }),
    k.ink([[20.4, 18.2], [14.4, 12.6]], { part: 'a' }),
    k.surf(k.poly([[2.9, 5.6], [21.1, 5.6], [12, 13.4]], [0.9, 0.9, 1.4]), 'tint', { part: 'a', shine: 'none' }),
    k.surf(k.heartShape(12, 12.9, 0.24), 'accent', { part: 'a', shine: 'dot', shineSize: 0.8, ol: 0.45 }),
    k.sparkleAt(20.6, 3.1, 1.6, { mx: -1, my: 1 }),
  ],

  // brass rim, pale glass lens with the diagonal glass shine, blue grip handle
  search: (icon, k) => [
    k.surf(k.poly([[14.6, 16.6], [16.6, 14.6], [21.4, 19.4], [19.4, 21.4]], 1), 'c1', { part: 'a' }),
    k.surf(k.ring(10.2, 10.2, 7.4, 5.1), 'c3', { shine: 'streak', shineSize: 0.9 }),
    k.surf(k.circle(10.2, 10.2, 5.1), 'edge', { inset: true, ol: 0, shine: 'glass', shade: 0.6 }),
  ],

  // sky gear with a gold hub and a dark axle
  settings: (icon, k) => [
    k.surf(k.cut(k.gearShape(12, 12, 7, 8, 2.4, 3.6), k.circle(12, 12, 3.5)), 'c1'),
    k.surf(k.ring(12, 12, 3.5, 1.6), 'c3', { part: 'a', shine: 'dot', shineSize: 0.8, ol: 0.35 }),
  ],

  // an anime character bust: sky hair with a fringe and the angel-ring shine, cream face,
  // eyes with catch-lights, a sailor collar
  user: (icon, k) => {
    const fringe = k.unite(
      k.clip(k.circle(12, 10, 5.1), k.rect(5, 3, 19, 8.6)),
      k.poly([[6.9, 8], [17.1, 8], [16.7, 10.7], [15.1, 9.1], [13.8, 10.4], [12.3, 8.9], [10.6, 10.5], [9.2, 9.1], [7.4, 11]], 0.3),
    )
    return [
      k.surf(k.poly([[3.8, 21.4], [5, 17.6], [9, 15.8], [15, 15.8], [19, 17.6], [20.2, 21.4]], [1, 2.4, 1, 1, 2.4, 1]), 'tint', { shine: 'none' }),
      k.surf(k.poly([[9.4, 15.9], [14.6, 15.9], [12, 19.4]], [0.5, 0.5, 0.7]), 'c2', { shine: 'none', ol: 0.35 }),
      k.surf(k.unite(k.circle(12, 10, 5.3), k.rr(6.7, 9.5, 17.3, 15, [0, 0, 2.2, 2.2])), 'c1', { shine: 'none', shade: 1.3 }),
      k.surf(k.circle(12, 10.7, 4.2), 'tint', { shine: 'none', ol: 0.35 }),
      k.paint(k.join(k.ellipse(10.35, 12.1, 0.6, 0.88), k.ellipse(13.65, 12.1, 0.6, 0.88)), 'ink'),
      k.shine(k.join(k.circle(10.17, 11.75, 0.26), k.circle(13.47, 11.75, 0.26))),
      k.surf(fringe, 'c1', { shine: 'none', casts: true }),
      k.shine(k.clip(k.arc(12, 10, 4, 206, 256, 0.8), fringe)),
    ]
  },

  // a soft gold star with a big streak and a twin sparkle
  star: (icon, k) => [
    k.surf(k.starShape(11.6, 12.9, 9.6, 4.5, 1.1), 'c3', { shineSize: 1.1 }),
    k.sparkleAt(20.2, 4.4, 2, { mx: -1, my: 1 }),
  ],

  // cream page, sakura header, sky binder rings, day dots and one picked day
  calendar: (icon, k) => {
    const body = k.rr(3, 5.2, 21, 21, 2.2)
    return [
      k.surf(body, 'tint', { shine: 'none' }),
      k.surf(k.clip(body, k.rect(2, 4, 22, 10)), 'c2', { cast: false }),
      k.paint(k.join(k.circle(7.6, 13.6, 0.75), k.circle(12, 13.6, 0.75), k.circle(16.4, 13.6, 0.75), k.circle(7.6, 17.4, 0.75), k.circle(12, 17.4, 0.75)), 'ink', { op: 0.75 }),
      k.surf(k.circle(16.4, 17.4, 1.55), 'c1', { shine: 'dot', shineSize: 0.7, ol: 0.35 }),
      k.surf(k.pill(7, 2.6, 9, 7.6), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
      k.surf(k.pill(15, 2.6, 17, 7.6), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
    ]
  },

  // sky body with the viewfinder hump, gold flash, pink shutter, dark lens barrel and glass
  camera: (icon, k) => [
    k.surf(k.pill(4.4, 4.6, 7.8, 6.8), 'c2', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.unite(k.rr(2.4, 6.6, 21.6, 20.2, 2.4), k.poly([[8, 7], [9.4, 4.2], [14.6, 4.2], [16, 7]], [0, 0.8, 0.8, 0])), 'c1'),
    k.surf(k.rr(17.2, 8.6, 19.8, 10.4, 0.8), 'c3', { shine: 'none', ol: 0.35, shade: 0 }),
    k.surf(k.circle(12, 13.4, 4.7), 'ink', { part: 'a', shine: 'none', shade: 0 }),
    k.surf(k.circle(12, 13.4, 3), 'c1', { part: 'a', inset: true, ol: 0, shine: 'glint', shineSize: 0.9, tone: ['ink', 0.35] }),
  ],

  // a Shinkai cloud: cream white lobes with a lavender cel shadow and a pale rim light
  cloud: (icon, k) => [
    k.surf(k.cloudShape(12, 12.4, 1.02), 'tint', { shine: 'none', rim: true, shade: 0.75 }),
    k.shine(k.join(k.lens(8.6, 9.2, 11.4, 7.1, 0.55))),
  ],

  // cream page with a sky dog-ear and three brushed text lines
  file: (icon, k) => {
    const p = k.page(5, 2.6, 19.4, 21.4, 5, 2)
    return [
      k.surf(p.sheet, 'tint', { shine: 'none' }),
      k.surf(p.flap, 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
      k.ink([[[8.4, 12], [15.6, 12]], [[8.4, 15], [15.6, 15]], [[8.4, 18], [12.8, 18]]], { w: 0.8 }),
    ]
  },

  // amber folder: back with a tab, a paper peeking out, front flap casting its shadow
  folder: (icon, k) => [
    k.surf(k.unite(k.rr(2.8, 6.4, 21.2, 19.8, 2), k.rr(2.8, 4.4, 10.6, 9, [1.6, 1.6, 0, 0]), k.poly([[9, 4.4], [10.6, 4.4], [12.6, 6.9], [9, 6.9]], [0, 0.8, 0, 0])), 'c3', { shine: 'none' }),
    k.surf(k.rr(5, 7.6, 19.4, 15, 1.2), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.poly([[2.8, 10.2], [21.2, 10.2], [21.2, 19.8], [2.8, 19.8]], [1.2, 1.2, 2, 2]), 'c3', { shineSize: 0.9 }),
  ],

  // steel-blue shackle, gold body with a dark keyhole
  lock: (icon, k) => [
    k.surf(k.unite(k.arc(12, 7.6, 4.3, 180, 360, 2.4), k.seg(7.7, 7.6, 7.7, 11.8, 2.4), k.seg(16.3, 7.6, 16.3, 11.8, 2.4)), 'c1', { part: 'a', shine: 'streak', shineSize: 0.8 }),
    k.surf(k.rr(4, 11, 20, 21.2, 2.4), 'c3', { shineSize: 1.1 }),
    k.surf(k.unite(k.circle(12, 15.3, 1.55), k.poly([[11.1, 15.6], [12.9, 15.6], [13.3, 18.6], [10.7, 18.6]], 0.5)), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
  ],

  // a sakura quaver: tilted head, stem and a swinging flag in one glossy piece
  'music-note': (icon, k) => [
    k.surf(k.unite(
      k.ellipse(8.2, 17.6, 3.7, 2.9, -22),
      k.rr(10.4, 3.2, 12.6, 17.8, 1),
      k.path('M11 3.2 C12.6 6.8 18.6 6.8 18.6 12.4 C18.6 13.6 18.1 14.6 17.3 15.4 C17.6 11.2 13.6 10.6 11 9.6 Z'),
    ), 'c2', { shineSize: 0.9 }),
    k.sparkleAt(19.4, 4.2, 1.8, { mx: -1, my: 1 }),
  ],

  // white rocket body, sky porthole, coral fins and a gold flame, speed lines behind
  rocket: (icon, k) => {
    const R = s => k.rot(s, 45, 12, 12)
    return [
      k.speed(5.6, 18.4, 135, { n: 3, len: 3.4, gap: 1.7, w: 0.75 }),
      k.surf(R(k.drop(12, 18.9, 2.3, 12, 23.4)), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
      k.surf(R(k.poly([[8.4, 14.6], [6.4, 19.2], [9.4, 18.4]], 0.7)), 'accent', { shine: 'none' }),
      k.surf(R(k.poly([[15.6, 14.6], [17.6, 19.2], [14.6, 18.4]], 0.7)), 'accent', { shine: 'none' }),
      k.surf(R(k.path('M12 2.4 C15.6 4.8 16.4 9 16.4 12.6 L16 17.4 L8 17.4 L7.6 12.6 C7.6 9 8.4 4.8 12 2.4 Z')), 'tint', { shineSize: 0.9 }),
      k.surf(R(k.circle(12, 10.2, 1.9)), 'c1', { inset: true, ol: 0.45, olShift: 0.6, shine: 'glint', shineSize: 0.8 }),
      k.surf(R(k.rr(9.2, 17, 14.8, 18.8, 0.6)), 'accent', { shine: 'none', ol: 0.35 }),
    ]
  },

  // a white café mug with a sakura heart, on a sky saucer, two soft wisps of steam
  coffee: (icon, k) => [
    k.tube(['M8.6 8 C6.9 6.7 10.1 5.1 8.4 3.2', 'M12.8 8 C11.1 6.7 14.3 5.1 12.6 3.2'], 'tint', { part: 'a', w: 0.95, ol: 0.42, shade: 0 }),
    k.surf(k.ellipse(10.6, 20.3, 8.4, 1.7), 'c1', { shine: 'none', ol: 0.4 }),
    k.surf(k.ring(17.2, 14.2, 3.2, 1.6), 'tint', { part: 'a', shine: 'none', ol: 0.45 }),
    k.surf(k.path('M3.6 9.8 H17.6 V15.6 C17.6 18.4 15.3 20.2 12.6 20.2 H8.6 C5.9 20.2 3.6 18.4 3.6 15.6 Z'), 'tint', { shineSize: 0.9 }),
    k.surf(k.heartShape(10.6, 14.9, 0.2), 'c2', { shine: 'none', ol: 0, shade: 0, cast: false, casts: false }),
  ],

  // sky bin with ribs, a lid that lifts (A) and a little handle
  trash: (icon, k) => [
    k.surf(k.path('M5.2 7.6 H18.8 L17.7 19.4 C17.6 20.4 16.8 21.1 15.8 21.1 H8.2 C7.2 21.1 6.4 20.4 6.3 19.4 Z'), 'c1'),
    k.ink([[[9.6, 10.6], [9.9, 18]], [[14.4, 10.6], [14.1, 18]]], { w: 1 }),
    k.surf(k.rr(9.2, 2.8, 14.8, 5.6, [1.2, 1.2, 0, 0]), 'c1', { part: 'a', shine: 'none', ol: 0.45 }),
    k.surf(k.rr(3.2, 5, 20.8, 7.8, 1.3), 'c1', { part: 'a', shineSize: 0.8 }),
  ],

  // a bold sky arrow with a gloss streak and speed lines trailing behind
  'arrow-right': (icon, k) => [
    k.speed(5.4, 12, 180, { n: 3, len: 4.6, gap: 2.5, w: 0.6 }),
    k.surf(k.unite(k.rr(6.4, 10.3, 15, 13.7, 1.6), k.poly([[13, 4.6], [21.2, 12], [13, 19.4]], [1, 1.1, 1])), 'c1', { shineSize: 0.85 }),
  ],

  // a fat green check with a shine streak and a sparkle
  check: (icon, k) => [
    k.surf(k.stroke([[4.6, 12.6], [9.6, 17.6], [19.6, 6.6]], 3.6), 'c4', { shineSize: 0.9 }),
    k.sparkleAt(5.4, 5.6, 2, { mx: 1, my: 1 }),
  ],
}

