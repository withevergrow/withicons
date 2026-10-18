// forge/hand/blueprint/phone-off.mjs — the drafted hung-up handset: the same solid handset as `phone`, cut by one
// diagonal slash into two closed, flat-ended halves with an even 2.7u gap either side (the old drawing left both halves
// as thin open curves with a loose slash, so the handset was hard to name at 16-24px). One bare slash, one dimension
// line under the handset; no construction ring behind it.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M3 23H21M3 21.7V23.3M21 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // earpiece half, closed along its cut
    ['path', { d: 'M3 5A2 2 0 0 1 5 3H8A1.5 1.5 0 0 1 9.5 4.5V6C9.5 7.25 8.5 7.25 8.5 8.5A7 7 0 0 0 9.03 11.16L5.93 14.23A16 16 0 0 1 3 5Z', class: 'wm-k' }],
    // mouthpiece half, closed along its cut
    ['path', { d: 'M12.82 14.97A7 7 0 0 0 15.5 15.5C16.75 15.5 16.75 14.5 18 14.5H19.5A1.5 1.5 0 0 1 21 16V19A2 2 0 0 1 19 21A16 16 0 0 1 9.76 18.06Z', class: 'wm-k' }],
    // the slash
    ['path', { d: 'M20.5 3.5L3.5 20.5', class: 'wm-s' }],
  ]
}
