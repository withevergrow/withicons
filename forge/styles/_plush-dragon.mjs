// PLUSH dragon head, hand-sewn (front view): stuffed sunflower felt antlers that branch (A), a
// tomato felt head whose wide brow narrows into a long snout, a sunflower pearl button on the
// forehead, cream fleece tufts at the cheeks, embroidered slanted brows (A) and French-knot eyes,
// a wide bulbous felt nose with two knot nostrils, sunflower felt whiskers that sweep out level and
// curl (A), a cream lip band over a sewn mouth with cream fangs (S) and a cream spiked beard.
const HEAD = 'M12 5.4 C16 5.4 18.4 7.6 18.4 10.4 C18.4 12.2 17.2 13 15.6 13.4 V19.4 C15.6 20.6 14.2 21.2 12 21.2 C9.8 21.2 8.4 20.6 8.4 19.4 V13.4 C6.8 13 5.6 12.2 5.6 10.4 C5.6 7.6 8 5.4 12 5.4 Z'
export const R = {
  'dragon-head': (icon, P) => {
    const ant = P.unite(P.bar([[9.6, 7], [7.6, 3.7], [6.2, 1.8]], 1.7), P.bar([[7.9, 4.2], [9.8, 2.4]], 1.4), P.bar([[6.9, 2.8], [4.4, 3.1]], 1.4))
    const wh = P.stroke('M8.8 15.4 C6.6 15 4.8 14.4 3.2 15.2 C2 15.8 2.4 17.5 3.7 17.1', 1.4)
    const tuft = P.unite(P.circle(5.4, 8.2, 1.7), P.circle(4.8, 10.6, 1.5))
    return [
      P.felt('c2', P.unite(ant, P.flipX(ant)), { part: 'A', stitch: false, out: 0.45 }),
      P.felt('tint', P.unite(tuft, P.flipX(tuft)), { part: 'K', stitch: false, out: 0.45 }),
      P.felt('c1', P.path(HEAD), { part: 'K' }),
      P.felt('c2', P.unite(wh, P.flipX(wh)), { part: 'A', stitch: false, out: 0.4, shade: false, hi: false }),
      P.felt('tint', P.poly([[8.6, 20.4], [15.4, 20.4], [14.6, 23], [13.4, 21.6], [12, 23.2], [10.6, 21.6], [9.4, 23]], 0.3), { part: 'K', stitch: false, out: 0.4 }),
      P.felt('c2', P.circle(12, 7.6, 1.1), { part: 'S', stitch: false, out: 0.35, shade: false }),
      P.thread([[[6.6, 8.8], [10.7, 10.5]], [[17.4, 8.8], [13.3, 10.5]]], { w: 1.1, part: 'A' }),
      P.knot(9.5, 11.9, 0.95), P.knot(14.5, 11.9, 0.95),
      P.flat('ink', P.rr(9.3, 17.4, 14.7, 20.2, 1), { part: 'K' }),
      P.flat('tint', P.unite(P.poly([[9.6, 20.2], [10.8, 20.2], [10.2, 18.5]], 0.15), P.poly([[13.2, 20.2], [14.4, 20.2], [13.8, 18.5]], 0.15)), { part: 'S' }),
      P.felt('tint', P.pill(8.6, 16.6, 15.4, 17.9), { part: 'K', stitch: false, out: 0.35 }),
      P.felt('c1', P.unite(P.circle(10.3, 15.1, 1.75), P.circle(13.7, 15.1, 1.75), P.ellipse(12, 14.9, 2.2, 1.6)), { part: 'K', stitch: false, out: 0.45 }),
      P.knot(10.5, 15.5, 0.55), P.knot(13.5, 15.5, 0.55),
    ]
  },
}
