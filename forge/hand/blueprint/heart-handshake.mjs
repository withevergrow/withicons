// forge/hand/blueprint/heart-handshake.mjs — the drafted heart around two clasped hands, every stroke clear of the
// others. The generated drawing broke the heart and the hand open around a control ring at the notch, ran the arm out
// through the side of the heart and let both finger strokes touch the outline, so at 16px the inside turned to mud;
// here the heart is one outline open only at its tip ring, the arm stops on the outline and the two fingers sit a full
// gap inside it.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M10.14 21.83A10 10 0 0 1 7.86 21.1M7.23 20.79L6.88 20.59M6.29 20.21A10 10 0 0 1 4.51 18.62M4.06 18.08L3.82 17.76M3.44 17.17A10 10 0 0 1 2.46 14.99M2.27 14.31L2.19 13.92M2.08 13.23A10 10 0 0 1 2.03 11.25M8.32 2.7A10 10 0 0 1 10.63 2.09M11.33 2.02L11.73 2M12.43 2.01A10 10 0 0 1 14.79 2.4M15.46 2.62L15.64 2.68M21.98 11.3A10 10 0 0 1 21.86 13.69M21.71 14.38L21.61 14.76M21.39 15.43A10 10 0 0 1 20.31 17.56M19.9 18.13L19.65 18.44M19.18 18.96A10 10 0 0 1 17.32 20.47M16.71 20.82L16.36 21M15.72 21.28A10 10 0 0 1 13.81 21.83', ...con(0.34) }],
    ['path', { d: 'M3 22.9H21M3 20.7V23.3M21 20.7V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.55L3.65 22.25M20.35 23.55L21.65 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // heart, open only at its tip ring; the two lobes end flush at the notch so no mitre spike lands on the hand
    ['path', { d: 'M10.68 19.64C8.19 17.89 3 13.68 3 8.9C3 6.2 5.1 4 7.8 4C9.6 4 11.1 5 12 6.5M12 6.5C12.9 5 14.4 4 16.2 4C18.9 4 21 6.2 21 8.9C21 13.68 15.82 17.89 13.32 19.64', 'stroke-linecap': 'butt', class: 'wm-k' }],
    // the clasp: one hand hooks down from the notch, the other arm runs to the side of the heart; two fingers below
    ['path', { d: 'M12 6.5L9 9.5A1.77 1.77 0 0 0 11.5 12L13.25 10.25A2 2 0 0 1 16 10.25L19.32 12.59M14.75 13.25L16 14.5M12 15.5L13.25 16.75', class: 'wm-a' }],
    ['path', { d: ring(12, 20.5), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
