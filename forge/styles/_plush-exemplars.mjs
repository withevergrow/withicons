// PLUSH exemplars: the art director's reference icons, one per family (PLUSH-GUIDE.md §7).
// They win over the same names in _plush-redraw-*.mjs. Redrawers: copy their construction.
// Every entry is (icon, P) => pieces, painted bottom to top. P = prim + kit + P.auto().
export const EXEMPLAR = {
  // sunflower walls, a puffy tomato roof overhanging them, a sky door with a knot knob,
  // a round cream window with a cross-stitched frame
  home: (icon, P) => [
    P.felt('c2', P.rr(5.25, 10, 18.75, 20.75, [0, 0, 2.25, 2.25]), { part: 'K' }),
    P.felt('c1', P.poly([[2.5, 10.75], [12, 3], [21.5, 10.75], [21.5, 12.25], [2.5, 12.25]], [1, 1.5, 1, 0.9, 0.9]), { part: 'K' }),
    P.felt('c3', P.rr(9.5, 14.25, 14.5, 20.75, [2.5, 2.5, 0, 0]), { part: 'A', stitchMin: 1.2, inset: 0.7 }),
    P.knot(13.1, 17.6, 0.55, 'ink', { part: 'A' }),
    P.felt('tint', P.rr(10.25, 6.6, 13.75, 10.1, 1), { part: 'K', stitch: false, out: 0.5, shade: false }),
    P.thread([[[12, 6.9], [12, 9.8]], [[10.55, 8.35], [13.45, 8.35]]], { w: 0.5, op: 0.8, part: 'K' }),
  ],
  // a tomato heart pillow, nothing added: the stitch and the puff are the whole story
  heart: (icon, P) => [P.felt('c1', P.heart(12, 12.6, 1), { part: 'K' })],
  // sunflower dome on a tomato rim, a sky ball clapper, a little tomato loop on top
  bell: (icon, P) => [
    P.tube('c1', P.arcPts(12, 4.6, 1.45, 180, 360), 1.5, { part: 'K', stitch: false, out: 0.5 }),
    P.felt('c3', P.circle(12, 19.4, 2.1), { part: 'A', stitch: false }),
    P.felt('c2', P.unite(P.rr(6, 6, 18, 17, [6, 6, 0, 0]), P.rr(5, 13, 19, 17.5, 1)), { part: 'K' }),
    P.felt('c1', P.pill(3.75, 15.5, 20.25, 18.75), { part: 'K', stitchMin: 1.2, inset: 0.75 }),
  ],
  // a cream envelope, a tomato flap, sealed with a bubblegum heart
  mail: (icon, P) => [
    P.felt('tint', P.rr(2.75, 5.25, 21.25, 19.25, 2.5), { part: 'K' }),
    P.felt('c1', P.poly([[3.5, 5.5], [20.5, 5.5], [12, 13]], 1.75), { part: 'A', stitchMin: 1.3, inset: 0.75 }),
    P.felt('accent', P.heart(12, 12.4, 0.27), { part: 'S', stitch: false, out: 0.5 }),
  ],
  // a sunflower handle tube behind a thick tomato ring, sky glass with an embroidered glint
  search: (icon, P) => [
    P.tube('c2', [[15.25, 15.25], [20, 20]], 3.25, { part: 'A' }),
    P.felt('c3', P.circle(10.25, 10.25, 5.25), { part: 'K', stitch: false, pinch: false }),
    P.felt('c1', P.ring(10.25, 10.25, 7.4, 4.85), { part: 'K', stitch: false }),
    P.thread(P.arcPts(10.25, 10.25, 2.75, 195, 255, 10), { w: 1.15, role: 'shine', op: 0.9, part: 'K' }),
  ],
  // a sky gear of round teeth, its hub a sunflower button sewn on with two holes
  settings: (icon, P) => [
    P.felt('c3', P.fillet(P.unite(P.around(P.pill(10, 2.5, 14, 8), 8), P.circle(12, 12, 7.25)), 0.6), { part: 'K' }),
    ...P.button(12, 12, 3.4, 'c2', { part: 'A' }),
  ],
  // sunflower head over sky shoulders, a button on the chest
  user: (icon, P) => [
    ...P.person(12, 2.4, 1.05, 'c2', 'c3'),
    ...P.button(12, 16.9, 1.4, 'tint', { part: 'K', holes: 'ink', n: 4 }),
  ],
  // a puffy sunflower star with a tomato button at its heart
  star: (icon, P) => [
    P.felt('c2', P.poly(P.starPts(12, 12.75, 10.5, 5.4, 5), [1.3, 0.9]), { part: 'K' }),
    ...P.button(12, 13.1, 1.75, 'c1', { part: 'K' }),
  ],
  // cream page, tomato header, sky binder loops, French-knot days, one day a bubblegum heart
  calendar: (icon, P) => [
    ...P.calendar('tint', 'c1', 'c3'),
    P.knot(7.75, 13.25, 0.75), P.knot(12, 13.25, 0.75), P.knot(16.25, 13.25, 0.75),
    P.knot(7.75, 17.25, 0.75), P.knot(12, 17.25, 0.75),
    P.felt('accent', P.heart(16.25, 17.35, 0.25), { part: 'K', stitch: false, out: 0.45 }),
  ],
  // sky body and hump, a sunflower lens ring around a sky lens, a tomato shutter button
  camera: (icon, P) => [
    P.felt('c1', P.pill(15.5, 4.25, 19, 7.75), { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c3', P.fillet(P.unite(P.rr(2.75, 7, 21.25, 20, 2.75), P.rr(7.5, 4.5, 13.5, 9, 1.5)), 0.8), { part: 'K' }),
    P.felt('c2', P.circle(12, 13.5, 4.6), { part: 'K', stitch: false }),
    P.felt('c3', P.circle(12, 13.5, 2.5), { part: 'K', stitch: false }),
    P.knot(11, 12.5, 0.7, 'shine', { part: 'K', op: 0.9 }),
  ],
  // a cream cloud cushion
  cloud: (icon, P) => [P.felt('tint', P.cloud(12, 12.5, 1), { part: 'K' })],
  // sky sheet, a cream dog-ear flap, three embroidered lines in light thread
  file: (icon, P) => [
    ...P.page('c3', 'tint'),
    P.textLines(8.25, [15.75, 15.75, 13], [11.75, 14.75, 17.75], { part: 'K' }),
  ],
  // tomato back with a tab, sunflower front pocket with a sky snap button
  folder: (icon, P) => [
    ...P.folder('c1', 'c2'),
    ...P.button(12, 14.6, 1.35, 'c3', { part: 'K' }),
  ],
  // sky shackle behind a sunflower body, a bubblegum heart patch with an embroidered keyhole
  lock: (icon, P) => [
    P.arcTube('c3', 12, 8, 4.5, 180, 360, 2.75, { part: 'A', seam: [[[7.5, 11.5], [7.5, 8], ...P.arcPts(12, 8, 4.5, 180, 360), [16.5, 8], [16.5, 11.5]]] }),
    P.tube('c3', [[7.5, 8], [7.5, 11.5]], 2.75, { part: 'A', stitch: false }),
    P.tube('c3', [[16.5, 8], [16.5, 11.5]], 2.75, { part: 'A', stitch: false }),
    P.felt('c2', P.rr(4, 10.25, 20, 21, 3), { part: 'K' }),
    P.felt('accent', P.heart(12, 15.75, 0.42), { part: 'K', stitch: false, out: 0.5 }),
    P.flat('ink', P.unite(P.circle(12, 14.6, 0.8), P.pill(11.55, 14.6, 12.45, 16.9)), { part: 'K', op: 0.9 }),
  ],
  // a quaver: tomato head, sky stem with a puffy flag
  'music-note': (icon, P) => [
    P.felt('c3', P.fillet(P.unite(P.seg(14.25, 4, 14.25, 17, 2.4), P.poly([[13.5, 3], [19.5, 6.25], [19.75, 10.5], [14, 8.5]], 1.4)), 0.8), { part: 'A', stitch: false }),
    P.felt('c1', P.rot(P.ellipse(10.75, 17.25, 4.25, 3.4), -20, 10.75, 17.25), { part: 'K' }),
  ],
  // a cream rocket body with a tomato nose and fins, a sky porthole button, a sunflower flame
  rocket: (icon, P) => {
    const r = f => P.rot(f, 45, 12, 12)
    return [
      // built upright along x = 12 from y 1.2 (nose) to 24.6 (flame tip), then tipped 45 degrees:
      // the body spans the box corner to corner like the line rocket, the flame a real 3u+ plume
      P.felt('c2', r(P.drop(12, 19.9, 2.75, 12, 24.4, 0.75)), { part: 'A', stitch: false }),
      P.felt('c1', r(P.poly([[12, 9.5], [18.3, 17.3], [17.7, 19.3], [6.3, 19.3], [5.7, 17.3]], [1, 1.3, 1, 1, 1.3])), { part: 'K', stitch: false }),
      P.felt('tint', r(P.unite(P.ellipse(12, 10.2, 4.3, 9), P.rr(7.7, 10, 16.3, 19, 1.8))), { part: 'K' }),
      P.felt('c1', r(P.clip(P.ellipse(12, 10.2, 4.3, 9), P.rect(0, 0, 24, 5.4))), { part: 'K', stitch: false, out: 0.5 }),
      P.felt('c3', r(P.circle(12, 10.3, 2.3)), { part: 'K', stitch: false, out: 0.5, shade: false }),
      P.knot(11.3, 9.6, 0.55, 'shine', { part: 'K', op: 0.85 }),
    ]
  },
  // a tomato mug with a tube handle, a bubblegum heart, two curls of cream steam
  coffee: (icon, P) => [
    P.arcTube('c1', 16.75, 14.5, 2.75, -80, 80, 2.4, { part: 'A', stitch: false }),
    P.felt('c1', P.rr(3.5, 9.75, 17.25, 21, [1.5, 1.5, 5, 5]), { part: 'K' }),
    P.felt('accent', P.heart(10.4, 15.6, 0.3), { part: 'K', stitch: false, out: 0.45 }),
    P.tube('tint', P.linesOf('M7.75 7.75 C6.25 6.5 9.25 5 7.75 3.25')[0], 1.7, { part: 'deco', stitch: false, out: 0.5 }),
    P.tube('tint', P.linesOf('M12.75 7.75 C11.25 6.5 14.25 5 12.75 3.25')[0], 1.7, { part: 'deco', stitch: false, out: 0.5 }),
  ],
  // a mint bin with two embroidered ribs, a sky lid with a tube handle
  trash: (icon, P) => [
    P.tube('c3', [[9.5, 5.25], [9.5, 3.5], [14.5, 3.5], [14.5, 5.25]], 1.6, { part: 'A', stitch: false, out: 0.5 }),
    P.felt('c4', P.poly([[5.5, 7.5], [18.5, 7.5], [17.25, 21], [6.75, 21]], 1.75), { part: 'K', stitch: false }),
    P.thread([[[9.75, 11], [10, 17.75]], [[14.25, 11], [14, 17.75]]], { w: 1.05, role: 'edge', op: 0.9, part: 'K' }),
    P.felt('c3', P.pill(3.25, 5, 20.75, 8.25), { part: 'A', stitchMin: 1.2, inset: 0.75 }),
  ],
  // a stuffed tomato arrow: the shaft with its running stitch, the head sewn on as its own piece (A)
  'arrow-right': (icon, P) => P.arrow(3.75, 12, 20.75, 12, { len: 7.5, half: 6.5, w: 3.4, r: 1.6, role: 'c1', part: 'K', split: true }),
  // one mint tube check with a seam
  check: (icon, P) => [P.tube('c4', [[4.5, 12.5], [9.5, 17.5], [19.5, 6.5]], 3.4, { part: 'K' })],
}
