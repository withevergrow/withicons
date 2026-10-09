// GOTHIC dragon head, hand-composed (front view): gilt branching antlers (A), a ruby glass head
// leaded down the brow whose wide brow narrows into a long snout, a gold glass pearl on the
// forehead, carved limestone fur tufts at the cheeks, iron slanted brows (A) over gold glass eyes,
// a wide bulbous ruby nose with two recessed nostrils, gilt whiskers sweeping out level and
// curling (A), a stone lip band over a dark recessed mouth with stone fangs (S) and a limestone
// spiked beard.
const HEAD = 'M12 5.4 C16 5.4 18.4 7.6 18.4 10.4 C18.4 12.2 17.2 13 15.6 13.4 V19.4 C15.6 20.6 14.2 21.2 12 21.2 C9.8 21.2 8.4 20.6 8.4 19.4 V13.4 C6.8 13 5.6 12.2 5.6 10.4 C5.6 7.6 8 5.4 12 5.4 Z'
export const R = {
  'dragon-head': (icon, g) => [
    g.gilt(g.union(g.stroke('M9.6 7 L7.6 3.7 L6.2 1.6 M7.9 4.2 L9.9 2.3 M6.9 2.7 L4.3 3', 1.4), g.stroke('M14.4 7 L16.4 3.7 L17.8 1.6 M16.1 4.2 L14.1 2.3 M17.1 2.7 L19.7 3', 1.4)), { plate: 'A', thin: true, outline: 0.3, glint: false }),
    g.stone(g.union(g.circle(5.4, 8.2, 1.6), g.circle(4.8, 10.6, 1.4), g.circle(18.6, 8.2, 1.6), g.circle(19.2, 10.6, 1.4)), { thin: true }),
    g.glass(g.path(HEAD), 'c1', { tracery: [[[12, 8.8], [12, 13.4]]], outline: 0.4, glint: false }),
    g.gilt(g.union(g.stroke('M8.8 15.4 C6.6 15 4.8 14.4 3.2 15.2 C2 15.8 2.4 17.5 3.7 17.1', 1.05), g.stroke('M15.2 15.4 C17.4 15 19.2 14.4 20.8 15.2 C22 15.8 21.6 17.5 20.3 17.1', 1.05)), { plate: 'A', thin: true, outline: 0.25, glint: false }),
    g.stone(g.poly([[8.6, 20.4], [15.4, 20.4], [14.6, 23], [13.4, 21.6], [12, 23.2], [10.6, 21.6], [9.4, 23]]), { thin: true }),
    g.glass(g.circle(12, 7.6, 1.1), 'c3', { plate: 'S', outline: 0.3, glint: false, glow: 0.5 }),
    g.iron(g.union(g.poly([[6.4, 8.3], [10.9, 10], [10.6, 11], [6.7, 9.9]]), g.poly([[17.6, 8.3], [13.1, 10], [13.4, 11], [17.3, 9.9]])), { plate: 'A' }),
    g.glass(g.union(g.circle(9.5, 11.9, 1.05), g.circle(14.5, 11.9, 1.05)), 'c3', { outline: 0.3, glint: false, glow: 0.5 }),
    g.recess(g.rr(9.3, 17.4, 14.7, 20.2, 1), { outline: 0.2 }),
    g.stone(g.union(g.poly([[9.6, 20.2], [10.8, 20.2], [10.2, 18.5]]), g.poly([[13.2, 20.2], [14.4, 20.2], [13.8, 18.5]])), { thin: true, plate: 'S' }),
    g.stone(g.rr(8.6, 16.6, 15.4, 17.9, 0.65), { thin: true }),
    g.glass(g.union(g.circle(10.3, 15.1, 1.75), g.circle(13.7, 15.1, 1.75), g.ellipse(12, 14.9, 2.2, 1.6)), 'c1', { outline: 0.4, glint: false }),
    g.recess(g.union(g.ellipse(10.5, 15.5, 0.6, 0.5), g.ellipse(13.5, 15.5, 0.6, 0.5)), { outline: 0 }),
  ],
}
