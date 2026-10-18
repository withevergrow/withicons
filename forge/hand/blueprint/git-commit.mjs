// forge/hand/blueprint/git-commit.mjs — the drafted commit: one clean ring on a through-line. The generated drawing put
// a plus crosshair inside the node (so it read as a target or add-point) and a dashed circle round it; here the ring is
// empty, the line enters and leaves it square, and only a dimension line below keeps the drafted look.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (d, w = 0.45, o = 0.5) => ['path', { d, color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': o, class: 'wm-deco' }]

export default function render() {
  return [
    con('M2.5 19.5H21.5M2.5 18V21M21.5 18V21'),
    con('M1.85 20.15L3.15 18.85M20.85 20.15L22.15 18.85', 0.5, 0.75),
    ['path', { d: 'M2.5 11H7.5M16.5 11H21.5', class: 'wm-k' }],
    ['path', { d: 'M16.5 11A4.5 4.5 0 0 1 7.5 11A4.5 4.5 0 0 1 16.5 11Z', class: 'wm-a' }],
  ]
}
