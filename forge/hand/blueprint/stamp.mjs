// forge/hand/blueprint/stamp.mjs — the drafted rubber stamp with a bigger knob, a wider block and a rubber pad, all
// unbroken (the generated drawing had a small knob and broke the block corners and the base bar open for four control
// rings, so at 16px it fell apart into a cap and two loose bars): an r3.25 knob on a short neck, a 19u block (10.5-15.5)
// with a 3u pad under it (15.5-18.5, a 1.75u counter that stays open at 16px) and no ink mark, so the dimension line at
// y=23 alone grounds it with 4u of clear space; the knob keeps its centre cross and the drafting stays faint.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M2.14 10.36a10 10 0 0 1 .67-2.3m.3-.63l.19-.35m.36-.6a10 10 0 0 1 1.55-1.82m.53-.46l.32-.24m.58-.4a10 10 0 0 1 1.49-.78M15.82 2.76a10 10 0 0 1 2.09 1.17m.55.43l.3.27m.5.49a10 10 0 0 1 1.42 1.92m.33.62l.17.37m.25.65a10 10 0 0 1 .44 1.73', ...con(0.34) }],
    ['path', { d: 'M22.43 10.5H23.29M21.5 8.4V9.6M2.5 9.6V8.4M.72 10.5H1.6M2.5 23H21.5M2.5 21.2V23.3M21.5 21.2V23.3', ...con(0.5) }],
    ['path', { d: 'M10.15 4.75h2.4m.7 0h.4M12 2.88v2.4m0 .7v.4', ...con(0.5) }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M20.85 23.65L22.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M4 10.5H20A1.5 1.5 0 0 1 21.5 12V15.5H2.5V12A1.5 1.5 0 0 1 4 10.5ZM4.5 15.5V18.5H19.5V15.5', class: 'wm-k' }],
    ['path', { d: 'M10.5 10.5V7.63A3.25 3.25 0 1 1 13.5 7.63V10.5', class: 'wm-a' }],
  ]
}
