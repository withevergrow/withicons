// PASTEL hand-drawn snowman (forge/icons/snowman.json stays the base; this replaces only Pastel's drawing).
// Registered in _pastel-redraws.mjs like any redraw chunk: (icon, p) => layers (forge/styles/PASTEL-GUIDE.md).
// Soft sky snowballs (c1), cosy lavender earmuffs on a headband (c2), a blush scarf with a hanging end (c3),
// a peach carrot nose and peach twig arms (c4), ink dot eyes, a small smile and two ink buttons.
export const R = {
  snowman: (icon, p) => [
    ['sky', p.circle(12, 16.4, 5.4), p.circle(12, 9.4, 4)],
    ['lavender@A', p.arc(12, 9.4, 4.75, 200, 340, 1.25), p.circle(7.35, 9.9, 1.65), p.circle(16.65, 9.9, 1.65)],
    ['blush@A', p.path('M7.9 12.7Q12 14.7 16.1 12.7L16.5 14.6Q12 16.8 7.5 14.6Z'), p.poly([[13.3, 15], [15.7, 14.6], [16.4, 18.8], [14, 19.2]], 0.6)],
    ['peach.flat@A',
      p.bar([[6.9, 14.7], [3.6, 12.1], [3.3, 10.1]], 1.25), p.seg2(3.6, 12.1, 1.9, 11.8, 1.25),
      p.bar([[17.1, 14.7], [20.4, 12.1], [20.7, 10.1]], 1.25), p.seg2(20.4, 12.1, 22.1, 11.8, 1.25)],
    ['peach.flat', p.poly([[11.85, 10.45], [15.1, 11.2], [11.85, 11.8]], 0.35)],
    ['ink', p.dot(10.55, 9.6, 0.62), p.dot(13.45, 9.6, 0.62), p.arc(12, 11.3, 1.35, 30, 150, 0.6),
      p.dot(11.3, 17.2, 0.7), p.dot(11.3, 19.4, 0.7)],
  ],
}
