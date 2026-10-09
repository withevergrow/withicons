// BAUHAUS dragon head, hand-composed (front view): yellow bar antlers that branch (A), a red
// head whose wide brow narrows into a long snout, an orange pearl on the forehead, cream fur
// tufts at the cheeks, black wedge brows over black dot eyes, a wide bulbous orange nose with
// two black nostrils, yellow whiskers sweeping out level and curling (A), a cream lip band over
// a black open mouth with cream fangs (S) and a cream spiked beard.
export const HEAD = 'M12 5.4 C16 5.4 18.4 7.6 18.4 10.4 C18.4 12.2 17.2 13 15.6 13.4 V19.4 C15.6 20.6 14.2 21.2 12 21.2 C9.8 21.2 8.4 20.6 8.4 19.4 V13.4 C6.8 13 5.6 12.2 5.6 10.4 C5.6 7.6 8 5.4 12 5.4 Z'
export const R = {
  'dragon-head': ({ circle, ellipse, path, poly, bar, stroke, flipX, join, rr, pill }) => {
    const antL = join(bar([[9.6, 7], [7.6, 3.7], [6.2, 1.5]], 1.6), bar([[7.9, 4.2], [9.9, 2.3]], 1.4), bar([[6.9, 2.7], [4.2, 3]], 1.4))
    const whL = stroke('M8.8 15.4 C6.6 15 4.8 14.4 3.2 15.2 C2 15.8 2.4 17.5 3.7 17.1', 1.5)
    const tuftL = join(circle(5.4, 8.2, 1.7), circle(4.8, 10.6, 1.5))
    const browL = poly([[6.4, 8.3], [10.9, 10], [10.6, 11], [6.7, 9.9]], 0.4)
    return [
      ['c2', antL, flipX(antL)],
      ['tint', tuftL, flipX(tuftL)],
      ['c1', path(HEAD)],
      ['c2', whL, flipX(whL)],
      ['tint', poly([[8.6, 20.4], [15.4, 20.4], [14.6, 23], [13.4, 21.6], [12, 23.2], [10.6, 21.6], [9.4, 23]], 0.3)],
      ['ink', browL, flipX(browL), circle(9.5, 11.8, 1), circle(14.5, 11.8, 1), rr(9.3, 17.4, 14.7, 20.2, 1)],
      ['c4', circle(12, 7.6, 1.15), join(circle(10.3, 15.1, 1.75), circle(13.7, 15.1, 1.75), ellipse(12, 14.9, 2.2, 1.6))],
      ['ink', ellipse(10.5, 15.5, 0.6, 0.5), ellipse(13.5, 15.5, 0.6, 0.5)],
      ['tint', pill(8.6, 16.7, 15.4, 17.9), poly([[9.6, 20.2], [10.8, 20.2], [10.2, 18.5]], 0.15), poly([[13.2, 20.2], [14.4, 20.2], [13.8, 18.5]], 0.15)],
    ]
  },
}
