// LUXE dragon head, hand-made (front view): a ruby enamel head whose wide brow narrows into a
// long snout (tone: the enamel's own fallbacks, still c1 / c3 vars), engraved eyes, nose and
// nostrils, a gold-bezel ruby pearl on the forehead (S), an engraved open mouth with fangs and a
// gold lip band, gold branching antlers, angry gold brows and gold whiskers that sweep out level
// and curl (A), and a gold spiked beard fringe.
const HEAD = 'M12 5.4 C16 5.4 18.4 7.6 18.4 10.4 C18.4 12.2 17.2 13 15.6 13.4 V19.4 C15.6 20.6 14.2 21.2 12 21.2 C9.8 21.2 8.4 20.6 8.4 19.4 V13.4 C6.8 13 5.6 12.2 5.6 10.4 C5.6 7.6 8 5.4 12 5.4 Z'
export const DRAGON = { tone: { c1: '#C8203F', c3: '#6A0B22' }, wa: 0.85, ws: 1.9, aFront: true, redraw: {
  paths: [
    { d: HEAD, plate: 'K' },
    { d: 'M9.6 7 L7.6 3.7 L6.2 1.6 M7.9 4.2 L9.9 2.3 M6.9 2.7 L4.3 3', plate: 'A' },
    { d: 'M14.4 7 L16.4 3.7 L17.8 1.6 M16.1 4.2 L14.1 2.3 M17.1 2.7 L19.7 3', plate: 'A' },
    { d: 'M8.4 15.4 C6.4 15 4.8 14.4 3.2 15.2 C2 15.8 2.4 17.5 3.7 17.1', plate: 'A' },
    { d: 'M15.6 15.4 C17.6 15 19.2 14.4 20.8 15.2 C22 15.8 21.6 17.5 20.3 17.1', plate: 'A' },
    { d: 'M7.1 8.5 L10.6 10.1 M16.9 8.5 L13.4 10.1', plate: 'A' },
    { d: 'M9 17.4 H15', plate: 'A' },
    { d: 'M9.2 21.2 L10.2 22.8 L11.1 21.6 L12 23 L12.9 21.6 L13.8 22.8 L14.8 21.2', plate: 'A' },
    { d: 'M12 7.6 L12 7.6', plate: 'S' },
  ],
  fills: [HEAD],
  cutouts: [
    'M10.4 12 A0.95 0.95 0 1 1 8.5 12 A0.95 0.95 0 1 1 10.4 12 Z',
    'M15.5 12 A0.95 0.95 0 1 1 13.6 12 A0.95 0.95 0 1 1 15.5 12 Z',
    'M11.2 15.2 A0.6 0.6 0 1 1 10 15.2 A0.6 0.6 0 1 1 11.2 15.2 Z',
    'M14 15.2 A0.6 0.6 0 1 1 12.8 15.2 A0.6 0.6 0 1 1 14 15.2 Z',
    'M9.6 18.4 H14.4 V19.3 Q14.4 20.1 13.8 20.1 L13.4 18.9 L13 20.1 H11 L10.6 18.9 L10.2 20.1 Q9.6 20.1 9.6 19.3 Z',
    'M10.2 13.5 C11 13.2 13 13.2 13.8 13.5',
  ] } }
