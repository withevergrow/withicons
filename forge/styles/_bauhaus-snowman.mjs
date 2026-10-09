// BAUHAUS snowman, hand-composed: two discs split cream / blue in opposite halves (the
// classic Bauhaus split body), a red triangle hat, a yellow scarf with its hanging end,
// an orange wedge of a carrot, black dot eyes and buttons, black twig arms.
export const R = {
  snowman: ({ circle, clip, rect, poly, pill, seg2, join }) => {
    const body = circle(12, 16.75, 5.25), head = circle(12, 8.75, 3.5)
    return [
      ['ink', seg2(7.75, 14.5, 3, 10.75, 2), seg2(16.25, 14.5, 21, 10.75, 2)],
      ['tint', clip(body, rect(0, 0, 12, 24)), clip(head, rect(12, 0, 24, 24))],
      ['c3', clip(body, rect(12, 0, 24, 24)), clip(head, rect(0, 0, 12, 24))],
      ['c1', poly([[12, 0.75], [16.75, 6], [7.25, 6]], [1, 1.25, 1.25])],
      ['c2', join(pill(8, 11.25, 16, 13.5), pill(13.5, 11.75, 15.75, 16.5))],
      ['c4', poly([[11.25, 8.9], [16.75, 10.1], [11.25, 11]], [0.5, 0.4, 0.5])],
      ['ink', circle(10.6, 7.9, 0.85), circle(13.4, 7.9, 0.85), circle(10.25, 16.25, 1.1), circle(10.25, 19.5, 1.1)],
    ]
  },
}
