// forge/hand/blueprint/dhak.mjs — the drafted dhak: a horizontal barrel drum (open left head, bulging right end) with a
// single X of lacing and a spread three-feather plume on top. Construction is a dashed centre axis and a dimension line.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }

export default function render() {
  return [
    // dimension line under the drum
    ['path', { d: 'M3 22.5H20.5M3 21.2V23.8M20.5 21.2V23.8', ...con(0.5) }],
    ['path', { d: 'M2.35 23.15L3.65 21.85M19.85 23.15L21.15 21.85', ...tick }],
    // centre axis stubs
    ['path', { d: 'M.75 15.75H1.5M21.8 15.75H23.25', ...con(0.5) }],
    // barrel: open left head ring + body outline
    ['path', { d: 'M5 11.5H18C20.5 13.3 20.5 18.2 18 20H5M7 15.75A2 4.25 0 1 1 3 15.75A2 4.25 0 1 1 7 15.75Z', class: 'wm-k' }],
    // lacing: one X
    ['path', { d: 'M8.5 11.5L16.5 20M8.5 20L16.5 11.5', class: 'wm-k' }],
    // plume: three separate feathers fanned from the top
    ['path', { d: 'M12.5 11.5V4.25'
      + 'M11.5 11.5C9.25 10.25 7.5 8 6.5 4.25C9.5 4.75 11.5 7.5 11.5 11.5Z'
      + 'M13.5 11.5C15.75 10.25 17.5 8 18.5 4.25C15.5 4.75 13.5 7.5 13.5 11.5Z', class: 'wm-a' }],
    ['path', { d: 'M13.25 3A.75.75 0 1 1 11.75 3A.75.75 0 1 1 13.25 3Z', class: 'wm-a' }],
  ]
}
