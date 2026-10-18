// forge/hand/blueprint/broom.mjs — the drafted broom: a diagonal handle, a ferrule band and a fanned bristle head
// with three strand lines. The generated drawing ran the handle into a keyline circle and left the bristles a thin
// triangle; here the head is a broad closed fan, the strands are long enough to survive 16px, and the only
// construction is a dimension line well clear of the art plus a control ring on the handle end.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (d, w = 0.45, o = 0.5) => ['path', { d, color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': o, class: 'wm-deco' }]

export default function render() {
  return [
    con('M23 12.5V22.5M21.7 12.5H23.3M21.7 22.5H23.3'),
    con('M22.35 12.9L23.65 11.6M22.35 23.15L23.65 21.85', 0.5, 0.75),
    // ferrule band, bristle fan, strands
    ['path', {
      d: 'M12.1 9.1L15 12L13.94 13.06L11.04 10.16ZM11.04 10.16L1.5 15.5M13.94 13.06L8.5 22.5M1.5 15.5Q5.5 19.5 8.5 22.5'
        + 'M12.3 12.2L4.2 18.2M12.1 14.4L5.9 20.4M10.4 11.5L3 15.9',
      class: 'wm-k',
    }],
    // handle
    ['path', { d: 'M19.9 4.1L13.55 10.55', class: 'wm-a' }],
    ['path', { d: 'M21.6 3A.8.8 0 1 0 20 3A.8.8 0 1 0 21.6 3', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
