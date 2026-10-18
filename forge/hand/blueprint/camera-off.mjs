// forge/hand/blueprint/camera-off.mjs — the drafted camera with its lens ring split into two arcs that stand clear of one
// diagonal slash. The generated drawing ran the slash straight through the lens and its ring (a busy knot at the centre at
// 16px); here the ring opens exactly where the slash passes, and the slash is shorter, ending just outside the body.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M22 21.18V22.6M23.23 20.5H22.68M1.32 20.5H.77M2 22.6V21.18M22.68 6.5H23.23M22 4.4V5.82M2 5.82V4.4M.77 6.5H1.32M2 22.9H22M2 21.2V23.3M22 21.2V23.3', ...con(0.5) }],
    ['path', { d: 'M1.35 23.55L2.65 22.25M21.35 23.55L22.65 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M10.58 4H13.43M15.81 5.35L16.5 6.5H20A2 2 0 0 1 22 8.5V18.5A2 2 0 0 1 20 20.5H4A2 2 0 0 1 2 18.5V8.5A2 2 0 0 1 4 6.5H7.5L8.19 5.35', class: 'wm-k' }],
    ['path', { d: 'M11.69 10.01A3.5 3.5 0 0 1 15.49 13.81M12.31 16.99A3.5 3.5 0 0 1 8.51 13.19', class: 'wm-a' }],
    ['path', { d: 'M4 5.5L20 21.5', class: 'wm-s' }],
    ['path', { d: 'M9.8 4A.8.8 0 1 0 8.2 4A.8.8 0 1 0 9.8 4M15.8 4A.8.8 0 1 0 14.2 4A.8.8 0 1 0 15.8 4', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
