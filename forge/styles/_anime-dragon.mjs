// ANIME dragon head, hand-drawn (front view): gold branching antlers (A), a coral-red head with
// cel shading whose wide brow narrows into a long snout, a gold pearl on the forehead, cream fur
// tufts at the cheeks, fierce gold slanted brows (A) over big sparkly eyes, a wide bulbous nose
// with two nostrils, long gold whiskers that sweep out level and curl (A), a cream lip band over
// an open mouth with fangs (S), a cream spiked beard and a sparkle.
const HEAD = 'M12 5.4 C16 5.4 18.4 7.6 18.4 10.4 C18.4 12.2 17.2 13 15.6 13.4 V19.4 C15.6 20.6 14.2 21.2 12 21.2 C9.8 21.2 8.4 20.6 8.4 19.4 V13.4 C6.8 13 5.6 12.2 5.6 10.4 C5.6 7.6 8 5.4 12 5.4 Z'
export const R = {
  'dragon-head': (icon, k) => {
    const tuft = k.join(k.circle(5.4, 8.2, 1.6), k.circle(4.8, 10.6, 1.4))
    const brow = k.poly([[6.4, 8.3], [10.9, 10], [10.6, 11], [6.7, 9.9]], 0.4)
    const fangs = k.join(k.poly([[9.6, 20.2], [10.8, 20.2], [10.2, 18.5]], 0.15), k.poly([[13.2, 20.2], [14.4, 20.2], [13.8, 18.5]], 0.15))
    return [
      k.tube('M9.6 7 L7.6 3.7 L6.2 1.6 M7.9 4.2 L9.9 2.3 M6.9 2.7 L4.3 3', 'c3', { part: 'a', w: 1.15, ol: 0.4 }),
      k.tube('M14.4 7 L16.4 3.7 L17.8 1.6 M16.1 4.2 L14.1 2.3 M17.1 2.7 L19.7 3', 'c3', { part: 'a', w: 1.15, ol: 0.4 }),
      k.surf(k.join(tuft, k.flipX(tuft)), 'tint', { shine: 'none', ol: 0.4 }),
      k.surf(k.path(HEAD), 'accent', { shineSize: 0.6 }),
      k.tube('M8.8 15.4 C6.6 15 4.8 14.4 3.2 15.2 C2 15.8 2.4 17.5 3.7 17.1', 'c3', { part: 'a', w: 0.95, ol: 0.35 }),
      k.tube('M15.2 15.4 C17.4 15 19.2 14.4 20.8 15.2 C22 15.8 21.6 17.5 20.3 17.1', 'c3', { part: 'a', w: 0.95, ol: 0.35 }),
      k.surf(k.poly([[8.6, 20.4], [15.4, 20.4], [14.6, 23], [13.4, 21.6], [12, 23.2], [10.6, 21.6], [9.4, 23]], 0.3), 'tint', { shine: 'none', ol: 0.4 }),
      k.surf(k.circle(12, 7.6, 1.1), 'c3', { part: 's', shine: 'dot', shineSize: 0.5, ol: 0.35 }),
      k.surf(k.join(brow, k.flipX(brow)), 'c3', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
      k.paint(k.join(k.circle(9.5, 11.9, 1.05), k.circle(14.5, 11.9, 1.05)), 'ink'),
      k.shine(k.join(k.circle(9.15, 11.5, 0.38), k.circle(14.15, 11.5, 0.38))),
      k.paint(k.rr(9.3, 17.4, 14.7, 20.2, 1), 'ink'),
      k.surf(fangs, 'tint', { part: 's', shine: 'none', ol: 0, shade: 0, cast: false, casts: false }),
      k.surf(k.pill(8.6, 16.6, 15.4, 17.9), 'tint', { shine: 'none', ol: 0.35 }),
      k.surf(k.unite(k.circle(10.3, 15.1, 1.75), k.circle(13.7, 15.1, 1.75), k.ellipse(12, 14.9, 2.2, 1.6)), 'accent', { shine: 'dot', shineSize: 0.5, ol: 0.4 }),
      k.paint(k.join(k.ellipse(10.5, 15.5, 0.6, 0.5), k.ellipse(13.5, 15.5, 0.6, 0.5)), 'ink'),
      k.sparkleAt(20.8, 9.4, 1.4, { mx: -1, my: 1 }),
    ]
  },
}
